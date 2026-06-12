import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { readDb, writeDb, initDb } from './db.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Initialize DB on startup
initDb()

// Middleware
app.use(cors())
app.use(express.json())

// API Routes

// 1. Get entire tournament state
app.get('/api/state', (req, res) => {
  try {
    const db = readDb()
    res.json(db)
  } catch (error) {
    console.error('Error fetching state:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// 2. Update a group stage match score
app.put('/api/matches/:id', (req, res) => {
  const { id } = req.params
  const { score1, score2 } = req.body

  try {
    const db = readDb()
    const matchIndex = db.matches.findIndex(m => m.id === id)

    if (matchIndex === -1) {
      return res.status(404).json({ error: `Match with ID ${id} not found` })
    }

    db.matches[matchIndex].score1 = score1 !== null ? Number(score1) : null
    db.matches[matchIndex].score2 = score2 !== null ? Number(score2) : null

    writeDb(db)
    res.json({ success: true, match: db.matches[matchIndex] })
  } catch (error) {
    console.error('Error updating match score:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// 3. Update team names in groups
app.put('/api/groups', (req, res) => {
  const { groupNames } = req.body

  if (!Array.isArray(groupNames)) {
    return res.status(400).json({ error: 'groupNames must be an array of arrays' })
  }

  try {
    const db = readDb()

    for (let g = 0; g < db.groups.length; g++) {
      if (!groupNames[g]) continue
      for (let t = 0; t < db.groups[g].length; t++) {
        if (groupNames[g][t] !== undefined) {
          db.groups[g][t].name = groupNames[g][t]
        }
      }
    }

    writeDb(db)
    res.json({ success: true, groups: db.groups })
  } catch (error) {
    console.error('Error updating groups:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// 4. Update knockout bracket state (baseTeams and/or winners)
app.put('/api/knockout', (req, res) => {
  const { baseTeams, winners } = req.body

  try {
    const db = readDb()

    if (baseTeams) {
      db.knockout.baseTeams = {
        ...db.knockout.baseTeams,
        ...baseTeams
      }
    }

    if (winners) {
      db.knockout.winners = {
        ...db.knockout.winners,
        ...winners
      }
    }

    writeDb(db)
    res.json({ success: true, knockout: db.knockout })
  } catch (error) {
    console.error('Error updating knockout:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// 5. Reset entire tournament state
app.post('/api/reset', (req, res) => {
  try {
    initDb(true)
    const db = readDb()
    res.json({ success: true, state: db })
  } catch (error) {
    console.error('Error resetting database:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
