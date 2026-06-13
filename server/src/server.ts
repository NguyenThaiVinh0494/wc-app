import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { readDb, writeDb, initDb } from './db.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Initialize DB on startup (configured at the bottom of the file)

// Middleware
app.use(cors())
app.use(express.json())

// API Routes

// 1. Get entire tournament state
app.get('/api/state', async (req, res) => {
  try {
    const db = await readDb()
    res.json(db)
  } catch (error) {
    console.error('Error fetching state:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// 2. Update a group stage match score
app.put('/api/matches/:id', async (req, res) => {
  const { id } = req.params
  const { score1, score2 } = req.body

  try {
    const db = await readDb()
    const matchIndex = db.matches.findIndex(m => m.id === id)

    if (matchIndex === -1) {
      return res.status(404).json({ error: `Match with ID ${id} not found` })
    }

    db.matches[matchIndex].score1 = score1 !== null ? Number(score1) : null
    db.matches[matchIndex].score2 = score2 !== null ? Number(score2) : null

    await writeDb(db)
    res.json({ success: true, match: db.matches[matchIndex] })
  } catch (error) {
    console.error('Error updating match score:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// 3. Update team names in groups
app.put('/api/groups', async (req, res) => {
  const { groupNames } = req.body

  if (!Array.isArray(groupNames)) {
    return res.status(400).json({ error: 'groupNames must be an array of arrays' })
  }

  try {
    const db = await readDb()

    for (let g = 0; g < db.groups.length; g++) {
      if (!groupNames[g]) continue
      for (let t = 0; t < db.groups[g].length; t++) {
        if (groupNames[g][t] !== undefined) {
          db.groups[g][t].name = groupNames[g][t]
        }
      }
    }

    await writeDb(db)
    res.json({ success: true, groups: db.groups })
  } catch (error) {
    console.error('Error updating groups:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// 4. Update knockout bracket state (baseTeams and/or winners)
app.put('/api/knockout', async (req, res) => {
  const { baseTeams, winners } = req.body

  try {
    const db = await readDb()

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

    await writeDb(db)
    res.json({ success: true, knockout: db.knockout })
  } catch (error) {
    console.error('Error updating knockout:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// 5. Reset entire tournament state
app.post('/api/reset', async (req, res) => {
  try {
    await initDb(true)
    const db = await readDb()
    res.json({ success: true, state: db })
  } catch (error) {
    console.error('Error resetting database:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// 6. Bulk sync tournament state from frontend (useful for restoring state on ephemeral containers)
app.post('/api/sync', async (req, res) => {
  const { groups, matches, knockout } = req.body

  try {
    const db = await readDb()

    if (groups && Array.isArray(groups)) {
      for (let g = 0; g < db.groups.length; g++) {
        if (!groups[g]) continue
        for (let t = 0; t < db.groups[g].length; t++) {
          if (typeof groups[g][t] === 'string') {
            db.groups[g][t].name = groups[g][t]
          }
        }
      }
    }

    if (matches && Array.isArray(matches)) {
      matches.forEach((m: any) => {
        const idx = db.matches.findIndex(dm => dm.id === m.id)
        if (idx !== -1) {
          db.matches[idx].score1 = m.score1 !== null ? Number(m.score1) : null
          db.matches[idx].score2 = m.score2 !== null ? Number(m.score2) : null
          if (m.homeScorers !== undefined) db.matches[idx].homeScorers = m.homeScorers
          if (m.awayScorers !== undefined) db.matches[idx].awayScorers = m.awayScorers
          if (m.stadiumId !== undefined) db.matches[idx].stadiumId = m.stadiumId
        }
      })
    }

    if (knockout) {
      if (knockout.baseTeams) {
        db.knockout.baseTeams = {
          ...db.knockout.baseTeams,
          ...knockout.baseTeams
        }
      }
      if (knockout.winners) {
        db.knockout.winners = {
          ...db.knockout.winners,
          ...knockout.winners
        }
      }
    }

    await writeDb(db)
    res.json({ success: true, state: db })
  } catch (error) {
    console.error('Error syncing database:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

const VIETNAMESE_TO_ENGLISH_TEAMS: { [key: string]: string } = {
  'Mexico': 'Mexico',
  'Nam Phi': 'South Africa',
  'Hàn Quốc': 'South Korea',
  'CH Czech': 'Czech Republic',
  'Canada': 'Canada',
  'Bosnia & Herzegovina': 'Bosnia and Herzegovina',
  'Qatar': 'Qatar',
  'Thụy Sĩ': 'Switzerland',
  'Brazil': 'Brazil',
  'Morocco': 'Morocco',
  'Haiti': 'Haiti',
  'Scotland': 'Scotland',
  'Mỹ': 'United States',
  'Paraguay': 'Paraguay',
  'Australia': 'Australia',
  'Thổ Nhĩ Kỳ': 'Turkey',
  'Đức': 'Germany',
  'Curacao': 'Curaçao',
  'Bờ Biển Ngà': 'Ivory Coast',
  'Ecuador': 'Ecuador',
  'Hà Lan': 'Netherlands',
  'Nhật Bản': 'Japan',
  'Thụy Điển': 'Sweden',
  'Tunisia': 'Tunisia',
  'Bỉ': 'Belgium',
  'Ai Cập': 'Egypt',
  'Iran': 'Iran',
  'New Zealand': 'New Zealand',
  'Tây Ban Nha': 'Spain',
  'Cape Verde': 'Cape Verde',
  'Saudi Arabia': 'Saudi Arabia',
  'Uruguay': 'Uruguay',
  'Pháp': 'France',
  'Senegal': 'Senegal',
  'Iraq': 'Iraq',
  'Na Uy': 'Norway',
  'Argentina': 'Argentina',
  'Algeria': 'Algeria',
  'Áo': 'Austria',
  'Jordan': 'Jordan',
  'Bồ Đào Nha': 'Portugal',
  'CHDC Congo': 'Democratic Republic of the Congo',
  'Uzbekistan': 'Uzbekistan',
  'Colombia': 'Colombia',
  'Anh': 'England',
  'Croatia': 'Croatia',
  'Ghana': 'Ghana',
  'Panama': 'Panama'
}

// Helper function to perform external score sync
async function performSyncExternalScores(): Promise<{ success: boolean; updatedCount: number }> {
  try {
    const db = await readDb()

    // Fetch scores from the free API
    const response = await fetch('https://worldcup26.ir/get/games')
    if (!response.ok) {
      throw new Error(`External API returned status: ${response.status}`)
    }

    const data = await response.json()
    const apiGames = data.games

    if (!apiGames || !Array.isArray(apiGames)) {
      throw new Error('Invalid data format from external API')
    }

    let updatedCount = 0

    db.matches.forEach((match) => {
      const hEng = VIETNAMESE_TO_ENGLISH_TEAMS[match.team1] || match.team1
      const aEng = VIETNAMESE_TO_ENGLISH_TEAMS[match.team2] || match.team2

      const apiG = apiGames.find((g: any) => 
        (g.home_team_name_en === hEng && g.away_team_name_en === aEng) ||
        (g.home_team_name_en === aEng && g.away_team_name_en === hEng)
      )

      if (apiG) {
        const homeScore = apiG.home_score !== null && apiG.home_score !== undefined && apiG.home_score !== 'null' ? Number(apiG.home_score) : null
        const awayScore = apiG.away_score !== null && apiG.away_score !== undefined && apiG.away_score !== 'null' ? Number(apiG.away_score) : null

        const isHomeTeam1 = apiG.home_team_name_en === hEng
        const nextScore1 = isHomeTeam1 ? homeScore : awayScore
        const nextScore2 = isHomeTeam1 ? awayScore : homeScore

        const nextHomeScorers = apiG.home_scorers && apiG.home_scorers !== 'null' ? String(apiG.home_scorers) : null
        const nextAwayScorers = apiG.away_scorers && apiG.away_scorers !== 'null' ? String(apiG.away_scorers) : null
        const nextStadiumId = apiG.stadium_id ? String(apiG.stadium_id) : null

        if (
          match.score1 !== nextScore1 || 
          match.score2 !== nextScore2 ||
          match.homeScorers !== (isHomeTeam1 ? nextHomeScorers : nextAwayScorers) ||
          match.awayScorers !== (isHomeTeam1 ? nextAwayScorers : nextHomeScorers) ||
          match.stadiumId !== nextStadiumId
        ) {
          match.score1 = nextScore1
          match.score2 = nextScore2
          match.homeScorers = isHomeTeam1 ? nextHomeScorers : nextAwayScorers
          match.awayScorers = isHomeTeam1 ? nextAwayScorers : nextHomeScorers
          match.stadiumId = nextStadiumId
          updatedCount++
        }
      }
    })

    if (updatedCount > 0) {
      await writeDb(db)
    }

    return { success: true, updatedCount }
  } catch (error) {
    console.error('Error performing external score sync:', error)
    return { success: false, updatedCount: 0 }
  }
}

// 7. Sync live scores from external API (worldcup26.ir)
app.post('/api/sync-external-scores', async (req, res) => {
  const result = await performSyncExternalScores()
  if (result.success) {
    const db = await readDb()
    res.json({ success: true, updatedCount: result.updatedCount, matches: db.matches })
  } else {
    res.status(502).json({ error: 'Failed to sync scores from external server' })
  }
})

// 8. Admin Verification Endpoint
app.post('/api/login-admin', (req, res) => {
  const { password } = req.body
  const expectedPassword = process.env.ADMIN_PASSWORD || 'admin2026'
  if (password === expectedPassword) {
    res.json({ success: true })
  } else {
    res.status(401).json({ success: false, error: 'Sai mật khẩu xác minh Admin!' })
  }
})

// Run background auto-sync every 10 minutes (600,000 ms)
const AUTO_SYNC_INTERVAL = 10 * 60 * 1000
setInterval(async () => {
  console.log('[Auto Sync] Running scheduled background score sync...')
  const result = await performSyncExternalScores()
  console.log(`[Auto Sync] Scheduled background sync finished. Success: ${result.success}, Updated count: ${result.updatedCount}`)
}, AUTO_SYNC_INTERVAL)


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const FRONTEND_BUILD_PATH = path.join(__dirname, '../../dist')

// Serve static files from the React frontend build
app.use(express.static(FRONTEND_BUILD_PATH))

// Fallback route for SPA client-side routing
app.get('*', (req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' })
  }
  res.sendFile(path.join(FRONTEND_BUILD_PATH, 'index.html'))
})

// Start server after initializing DB and run initial sync
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })

  console.log('[Startup] Database initialized. Running initial external score sync...')
  performSyncExternalScores().then(res => {
    console.log(`[Startup] Initial score sync finished. Success: ${res.success}, Updated count: ${res.updatedCount}`)
  })
})
