import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialGroups, initialGroupMatches, initialR32Teams } from './initialData.js'; // note the .js extension for ES modules compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_DIR = process.env.DATABASE_DIR || path.join(__dirname, '../data');
const DB_FILE = path.join(DB_DIR, 'db.json');
const getDefaultState = () => ({
    groups: JSON.parse(JSON.stringify(initialGroups)),
    matches: JSON.parse(JSON.stringify(initialGroupMatches)),
    knockout: {
        baseTeams: JSON.parse(JSON.stringify(initialR32Teams)),
        winners: {}
    }
});
// Read current database state
export function readDb() {
    try {
        if (!fs.existsSync(DB_FILE)) {
            initDb();
        }
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(data);
    }
    catch (error) {
        console.error('Error reading database file:', error);
        return getDefaultState();
    }
}
// Write new state to database
export function writeDb(state) {
    try {
        if (!fs.existsSync(DB_DIR)) {
            fs.mkdirSync(DB_DIR, { recursive: true });
        }
        fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
    }
    catch (error) {
        console.error('Error writing to database file:', error);
    }
}
// Initialize database with default state
export function initDb(force = false) {
    if (force || !fs.existsSync(DB_FILE)) {
        if (!fs.existsSync(DB_DIR)) {
            fs.mkdirSync(DB_DIR, { recursive: true });
        }
        writeDb(getDefaultState());
        console.log('Database initialized successfully with default state.');
    }
}
