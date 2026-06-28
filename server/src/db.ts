import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import { 
  Team, 
  GroupMatch, 
  initialGroups, 
  initialGroupMatches, 
  initialR32Teams,
  initialKnockoutMatches
} from './initialData.js' // note the .js extension for ES modules compatibility

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DB_DIR = process.env.DATABASE_DIR || path.join(__dirname, '../data')
const DB_FILE = path.join(DB_DIR, 'db.json')

const MONGODB_URI = process.env.MONGODB_URI

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('Successfully connected to MongoDB Atlas.'))
    .catch(err => {
      console.error('MongoDB Atlas connection error, falling back to local file:', err)
    })
} else {
  console.log('MONGODB_URI environment variable not found. Running with local file database.')
}

export interface DbState {
  groups: Team[][]
  matches: GroupMatch[]
  knockout: {
    baseTeams: { [k: string]: string }
    winners: { [k: string]: number | null }
    matches: GroupMatch[]
  }
}

// Define Mongoose Schema
const DbStateSchema = new mongoose.Schema({
  _id: { type: String, default: 'default_state' },
  groups: { type: mongoose.Schema.Types.Mixed, required: true },
  matches: { type: mongoose.Schema.Types.Mixed, required: true },
  knockout: { type: mongoose.Schema.Types.Mixed, required: true }
}, { minimize: false })

const DbStateModel = mongoose.model('DbState', DbStateSchema)

export const getDefaultState = (): DbState => ({
  groups: JSON.parse(JSON.stringify(initialGroups)),
  matches: JSON.parse(JSON.stringify(initialGroupMatches)),
  knockout: {
    baseTeams: JSON.parse(JSON.stringify(initialR32Teams)),
    winners: {},
    matches: JSON.parse(JSON.stringify(initialKnockoutMatches))
  }
})

// Synchronous local file helpers for fallback
function readLocalDb(): DbState {
  try {
    if (!fs.existsSync(DB_FILE)) {
      initLocalDb()
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8')
    const db = JSON.parse(data)
    let changed = false
    if (!db.knockout) {
      db.knockout = { baseTeams: JSON.parse(JSON.stringify(initialR32Teams)), winners: {}, matches: JSON.parse(JSON.stringify(initialKnockoutMatches)) }
      changed = true
    } else if (!db.knockout.matches || db.knockout.matches.length === 0) {
      db.knockout.matches = JSON.parse(JSON.stringify(initialKnockoutMatches))
      changed = true
    }
    if (changed) {
      writeLocalDb(db)
    }
    return db
  } catch (error) {
    console.error('Error reading local database file:', error)
    return getDefaultState()
  }
}

function writeLocalDb(state: DbState): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true })
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing to local database file:', error)
  }
}

function initLocalDb(force: boolean = false): void {
  if (force || !fs.existsSync(DB_FILE)) {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true })
    }
    writeLocalDb(getDefaultState())
    console.log('Local database initialized successfully with default state.')
  }
}

// Public Async API for MongoDB + local file fallback
export async function readDb(): Promise<DbState> {
  if (!MONGODB_URI) {
    return readLocalDb()
  }

  try {
    const doc = await DbStateModel.findById('default_state').lean()
    if (!doc) {
      const defaultState = getDefaultState()
      await DbStateModel.findByIdAndUpdate('default_state', defaultState, { upsert: true, new: true })
      return defaultState
    }
    
    const db = doc as unknown as DbState
    let changed = false
    if (!db.knockout) {
      db.knockout = { baseTeams: JSON.parse(JSON.stringify(initialR32Teams)), winners: {}, matches: JSON.parse(JSON.stringify(initialKnockoutMatches)) }
      changed = true
    } else if (!db.knockout.matches || db.knockout.matches.length === 0) {
      db.knockout.matches = JSON.parse(JSON.stringify(initialKnockoutMatches))
      changed = true
    }
    
    if (changed) {
      await writeDb(db)
    }
    
    return db
  } catch (error) {
    console.error('Error reading from MongoDB Atlas, falling back to local file:', error)
    return readLocalDb()
  }
}

export async function writeDb(state: DbState): Promise<void> {
  if (!MONGODB_URI) {
    writeLocalDb(state)
    return
  }

  try {
    await DbStateModel.findByIdAndUpdate('default_state', {
      groups: state.groups,
      matches: state.matches,
      knockout: state.knockout
    }, { upsert: true })
  } catch (error) {
    console.error('Error writing to MongoDB Atlas, falling back to local file:', error)
    writeLocalDb(state)
  }
}

export async function initDb(force: boolean = false): Promise<void> {
  if (!MONGODB_URI) {
    initLocalDb(force)
    return
  }

  try {
    const doc = await DbStateModel.findById('default_state').lean()
    if (force || !doc) {
      const defaultState = getDefaultState()
      await DbStateModel.findByIdAndUpdate('default_state', {
        groups: defaultState.groups,
        matches: defaultState.matches,
        knockout: defaultState.knockout
      }, { upsert: true })
      console.log('MongoDB Atlas database initialized successfully with default state.')
    }
  } catch (error) {
    console.error('Error initializing MongoDB Atlas database, falling back to local file:', error)
    initLocalDb(force)
  }
}
