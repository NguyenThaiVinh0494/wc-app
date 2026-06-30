import React, { useState, useEffect, useMemo } from 'react'
import { Team, GroupMatch } from './types'
import { 
  initialGroups, 
  initialGroupMatches, 
  initialR32Teams, 
  initialKnockoutMatches, 
  BRACKET_FLOW 
} from './constants'
import { getQualifiedTeams } from './utils/helpers'

// Import components
import { RoleSelectorModal } from './components/RoleSelectorModal'
import { MatchModal } from './components/MatchModal'

// Import tabs
import { LandingPage } from './tabs/LandingPage'
import { StandingsPage } from './tabs/StandingsPage'
import { FixturesPage } from './tabs/FixturesPage'
import { KnockoutPage } from './tabs/KnockoutPage'

export default function App(): JSX.Element {
  const [role, setRole] = useState<'admin' | 'guest' | null>(() => {
    try {
      const saved = localStorage.getItem('wc2026_auth')
      if (saved) {
        const { roleVal, expiry } = JSON.parse(saved)
        if (Date.now() < expiry) {
          return roleVal
        }
      }
    } catch (e) {
      console.error(e)
    }
    return null
  })

  const [activeTab, setActiveTab] = useState<'landing' | 'standings' | 'fixtures' | 'knockout'>('landing')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false)
  const [fixtureView, setFixtureView] = useState<'date' | 'group'>('group')
  const [isSyncingScores, setIsSyncingScores] = useState<boolean>(false)

  const handleSelectRole = (selectedRole: 'admin' | 'guest') => {
    const authData = {
      roleVal: selectedRole,
      expiry: Date.now() + 2 * 60 * 60 * 1000 // 2 hours
    }
    localStorage.setItem('wc2026_auth', JSON.stringify(authData))
    setRole(selectedRole)
  }

  const [groupNames, setGroupNames] = useState<string[][]>(() => {
    const saved = localStorage.getItem('wc2026_groupNames')
    return saved ? JSON.parse(saved) : initialGroups.map(g => g.map(t => t.name))
  })
  const [groupMatches, setGroupMatches] = useState<GroupMatch[]>(() => {
    const saved = localStorage.getItem('wc2026_groupMatches')
    return saved ? JSON.parse(saved) : initialGroupMatches
  })
  const [baseTeams, setBaseTeams] = useState<{ [k: string]: string }>(() => {
    const saved = localStorage.getItem('wc2026_baseTeams')
    return saved ? JSON.parse(saved) : initialR32Teams
  })
  const [winners, setWinners] = useState<{ [k: string]: number | null }>(() => {
    const saved = localStorage.getItem('wc2026_winners')
    return saved ? JSON.parse(saved) : {}
  })
  const [knockoutMatches, setKnockoutMatches] = useState<GroupMatch[]>(() => {
    const saved = localStorage.getItem('wc2026_knockoutMatches')
    const baseSaved = localStorage.getItem('wc2026_baseTeams')
    
    // Auto-heal baseTeams placeholders
    if (baseSaved) {
      try {
        const parsedBase = JSON.parse(baseSaved)
        if (parsedBase.m8_t1 === 'Nhất Bảng G' || parsedBase.m8_t1 === 'Nhất Bảng L' || parsedBase.m8_t1 === 'England' || parsedBase.m8_t1 === 'Belgium') {
          localStorage.removeItem('wc2026_knockoutMatches')
          localStorage.removeItem('wc2026_baseTeams')
          localStorage.removeItem('wc2026_winners')
          return initialKnockoutMatches
        }
      } catch (e) {}
    }

    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const m8 = parsed.find((m: any) => m.id === 'm8')
        if (m8 && (m8.team1 === 'Anh' || m8.team1 === 'England' || m8.stadiumId === '7')) {
          localStorage.removeItem('wc2026_knockoutMatches')
          localStorage.removeItem('wc2026_baseTeams')
          localStorage.removeItem('wc2026_winners')
          return initialKnockoutMatches
        }
        const m1 = parsed.find((m: any) => m.id === 'm1')
        if (m1 && (m1.time === '12h' || m1.date === '28/6/2026')) {
          localStorage.removeItem('wc2026_knockoutMatches')
          return initialKnockoutMatches
        }
        return parsed
      } catch (e) {
        return initialKnockoutMatches
      }
    }
    return initialKnockoutMatches
  })
  const [knockoutTab, setKnockoutTab] = useState<'bracket' | 'results'>('bracket')
  const [editingMatch, setEditingMatch] = useState<GroupMatch | null>(null)
  
  const [modalScore1, setModalScore1] = useState<string>('')
  const [modalScore2, setModalScore2] = useState<string>('')
  const [modalPenalty1, setModalPenalty1] = useState<string>('')
  const [modalPenalty2, setModalPenalty2] = useState<string>('')

  useEffect(() => {
    if (editingMatch) {
      setModalScore1(editingMatch.score1 !== null ? String(editingMatch.score1) : '')
      setModalScore2(editingMatch.score2 !== null ? String(editingMatch.score2) : '')
      setModalPenalty1(editingMatch.homePenalty !== null && editingMatch.homePenalty !== undefined ? String(editingMatch.homePenalty) : '')
      setModalPenalty2(editingMatch.awayPenalty !== null && editingMatch.awayPenalty !== undefined ? String(editingMatch.awayPenalty) : '')
    }
  }, [editingMatch])

  const syncLocalStateToBackend = (
    currentGroups: string[][],
    currentMatches: GroupMatch[],
    currentBaseTeams: { [k: string]: string },
    currentWinners: { [k: string]: number | null },
    currentKnockoutMatches: GroupMatch[]
  ) => {
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        groups: currentGroups,
        matches: currentMatches,
        knockout: {
          baseTeams: currentBaseTeams,
          winners: currentWinners,
          matches: currentKnockoutMatches
        }
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log('Successfully synced local state to backend:', data)
    })
    .catch(err => console.error('Error syncing local state to backend:', err))
  }

  // Load data from Back-end on startup
  useEffect(() => {
    fetch('/api/state')
      .then(res => res.json())
      .then(data => {
        // Robust cold start detection: check if backend has actual user modifications beyond the default initial state
        const hasBackendKOMatches = data.knockout && data.knockout.matches && data.knockout.matches.some((m: any) => m.score1 !== null || m.score2 !== null)
        const hasBackendWinners = data.knockout && data.knockout.winners && Object.keys(data.knockout.winners).length > 0
        const hasBackendBaseTeamEdits = data.knockout && data.knockout.baseTeams && JSON.stringify(data.knockout.baseTeams) !== JSON.stringify(initialR32Teams)
        
        const hasBackendEdits = hasBackendKOMatches || hasBackendWinners || hasBackendBaseTeamEdits

        const localGroupsStr = localStorage.getItem('wc2026_groupNames')
        const localMatchesStr = localStorage.getItem('wc2026_groupMatches')
        const localBaseTeamsStr = localStorage.getItem('wc2026_baseTeams')
        const localWinnersStr = localStorage.getItem('wc2026_winners')
        const localKnockoutMatchesStr = localStorage.getItem('wc2026_knockoutMatches')

        const isLocalEmpty = !localMatchesStr && !localWinnersStr && !localKnockoutMatchesStr

        if (hasBackendEdits || isLocalEmpty) {
          if (data.groups) {
            const names = data.groups.map((g: any) => g.map((t: any) => t.name))
            setGroupNames(names)
            localStorage.setItem('wc2026_groupNames', JSON.stringify(names))
          }
          if (data.matches) {
            setGroupMatches(data.matches)
            localStorage.setItem('wc2026_groupMatches', JSON.stringify(data.matches))
          }
          if (data.knockout) {
            if (data.knockout.baseTeams) {
              setBaseTeams(data.knockout.baseTeams)
              localStorage.setItem('wc2026_baseTeams', JSON.stringify(data.knockout.baseTeams))
            }
            if (data.knockout.winners) {
              setWinners(data.knockout.winners)
              localStorage.setItem('wc2026_winners', JSON.stringify(data.knockout.winners))
            }
            if (data.knockout.matches) {
              setKnockoutMatches(data.knockout.matches)
              localStorage.setItem('wc2026_knockoutMatches', JSON.stringify(data.knockout.matches))
            }
          }
        } else {
          // Server is empty but LocalStorage has data (Render cold start)
          const localGroups = localGroupsStr ? JSON.parse(localGroupsStr) : groupNames
          const localMatches = localMatchesStr ? JSON.parse(localMatchesStr) : groupMatches
          const localBaseTeams = localBaseTeamsStr ? JSON.parse(localBaseTeamsStr) : baseTeams
          const localWinners = localWinnersStr ? JSON.parse(localWinnersStr) : winners
          const localKnockoutMatches = localKnockoutMatchesStr ? JSON.parse(localKnockoutMatchesStr) : knockoutMatches
          
          console.log('Syncing local storage data back to restarted server...')
          syncLocalStateToBackend(localGroups, localMatches, localBaseTeams, localWinners, localKnockoutMatches)
        }
      })
      .catch(err => console.error('Error fetching state from API:', err))
  }, [])

  // Background polling from own server (every 2 minutes)
  useEffect(() => {
    const refreshState = () => {
      const isInputFocused = document.activeElement?.tagName === 'INPUT'
      if (editingMatch || isInputFocused) return

      fetch('/api/state')
        .then(res => res.json())
        .then(data => {
          if (data.groups) {
            const names = data.groups.map((g: any) => g.map((t: any) => t.name))
            const currentNamesStr = JSON.stringify(groupNames)
            const nextNamesStr = JSON.stringify(names)
            if (currentNamesStr !== nextNamesStr) {
              setGroupNames(names)
              localStorage.setItem('wc2026_groupNames', nextNamesStr)
            }
          }
          if (data.matches) {
            const currentMatchesStr = JSON.stringify(groupMatches)
            const nextMatchesStr = JSON.stringify(data.matches)
            if (currentMatchesStr !== nextMatchesStr) {
              setGroupMatches(data.matches)
              localStorage.setItem('wc2026_groupMatches', nextMatchesStr)
            }
          }
          if (data.knockout) {
            if (data.knockout.baseTeams) {
              const currentBaseStr = JSON.stringify(baseTeams)
              const nextBaseStr = JSON.stringify(data.knockout.baseTeams)
              if (currentBaseStr !== nextBaseStr) {
                setBaseTeams(data.knockout.baseTeams)
                localStorage.setItem('wc2026_baseTeams', nextBaseStr)
              }
            }
            if (data.knockout.winners) {
              const currentWinnersStr = JSON.stringify(winners)
              const nextWinnersStr = JSON.stringify(data.knockout.winners)
              if (currentWinnersStr !== nextWinnersStr) {
                setWinners(data.knockout.winners)
                localStorage.setItem('wc2026_winners', nextWinnersStr)
              }
            }
            if (data.knockout.matches) {
              const currentKOMatchesStr = JSON.stringify(knockoutMatches)
              const nextKOMatchesStr = JSON.stringify(data.knockout.matches)
              if (currentKOMatchesStr !== nextKOMatchesStr) {
                setKnockoutMatches(data.knockout.matches)
                localStorage.setItem('wc2026_knockoutMatches', nextKOMatchesStr)
              }
            }
          }
        })
        .catch(err => console.log('Error auto-refreshing state:', err))
    }

    const intervalId = setInterval(refreshState, 120000) // 2 minutes
    return () => clearInterval(intervalId)
  }, [groupNames, groupMatches, baseTeams, winners, knockoutMatches, editingMatch])

  const handlePersistGroups = (newNames: string[][]) => {
    localStorage.setItem('wc2026_groupNames', JSON.stringify(newNames))
    fetch('/api/groups', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ groupNames: newNames })
    })
    .catch(err => console.error('Error saving groups:', err))
  }

  const handlePersistKnockoutBaseTeams = (nextBaseTeams: { [k: string]: string }) => {
    localStorage.setItem('wc2026_baseTeams', JSON.stringify(nextBaseTeams))
    fetch('/api/knockout', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ baseTeams: nextBaseTeams })
    })
    .catch(err => console.error('Error saving knockout base teams:', err))
  }

  const handleResetAll = () => {
    if (!window.confirm('Bạn có chắc chắn muốn khôi phục toàn bộ kết quả, tỉ số và tên đội về mặc định ban đầu không?')) return
    
    fetch('/api/reset', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.state) {
          const state = data.state
          setGroupNames(state.groups.map((g: any) => g.map((t: any) => t.name)))
          setGroupMatches(state.matches)
          setBaseTeams(state.knockout.baseTeams)
          setWinners(state.knockout.winners)
          if (state.knockout.matches) {
            setKnockoutMatches(state.knockout.matches)
          }

          localStorage.removeItem('wc2026_groupNames')
          localStorage.removeItem('wc2026_groupMatches')
          localStorage.removeItem('wc2026_baseTeams')
          localStorage.removeItem('wc2026_winners')
          localStorage.removeItem('wc2026_knockoutMatches')
          
          alert('Đã khôi phục dữ liệu về trạng thái mặc định ban đầu!')
        }
      })
      .catch(err => console.error('Error resetting tournament state:', err))
  }

  const handleSyncExternalScores = () => {
    setIsSyncingScores(true)
    fetch('/api/sync-external-scores', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        setIsSyncingScores(false)
        if (data.success) {
          if (data.updatedCount > 0) {
            setGroupMatches(data.matches)
            localStorage.setItem('wc2026_groupMatches', JSON.stringify(data.matches))
            if (data.knockout) {
              if (data.knockout.baseTeams) {
                setBaseTeams(data.knockout.baseTeams)
                localStorage.setItem('wc2026_baseTeams', JSON.stringify(data.knockout.baseTeams))
              }
              if (data.knockout.winners) {
                setWinners(data.knockout.winners)
                localStorage.setItem('wc2026_winners', JSON.stringify(data.knockout.winners))
              }
              if (data.knockout.matches) {
                setKnockoutMatches(data.knockout.matches)
                localStorage.setItem('wc2026_knockoutMatches', JSON.stringify(data.knockout.matches))
              }
            }
            alert(`Đã cập nhật tự động thành công tỉ số và các đội đi tiếp của ${data.updatedCount} trận đấu từ FIFA!`)
          } else {
            alert('Tỉ số các trận đấu hiện tại đã là mới nhất!')
          }
        } else {
          alert('Không thể cập nhật tỉ số tự động. Vui lòng thử lại sau!')
        }
      })
      .catch(err => {
        setIsSyncingScores(false)
        console.error('Error syncing external scores:', err)
        alert('Đã xảy ra lỗi kết nối với máy chủ khi cập nhật tỉ số.')
      })
  }

  const calculatedGroups = useMemo(() => {
    const baseGroups = groupNames.map((names, gIdx) => 
      names.map(name => ({
        name,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        gf: 0,
        ga: 0,
        form: [] as string[]
      }))
    )

    groupMatches.forEach(match => {
      if (match.score1 === null || match.score2 === null) return
      
      const s1 = match.score1
      const s2 = match.score2
      
      let t1G = -1, t1Idx = -1
      let t2G = -1, t2Idx = -1

      for (let g = 0; g < baseGroups.length; g++) {
        for (let t = 0; t < baseGroups[g].length; t++) {
          if (baseGroups[g][t].name.toLowerCase() === match.team1.toLowerCase()) {
            t1G = g; t1Idx = t
          }
          if (baseGroups[g][t].name.toLowerCase() === match.team2.toLowerCase()) {
            t2G = g; t2Idx = t
          }
        }
      }

      if (t1G !== -1 && t1Idx !== -1) {
        const team = baseGroups[t1G][t1Idx]
        team.played += 1
        team.gf += s1
        team.ga += s2
        if (s1 > s2) {
          team.won += 1
          team.form.push('W')
        } else if (s1 === s2) {
          team.drawn += 1
          team.form.push('D')
        } else {
          team.lost += 1
          team.form.push('L')
        }
      }

      if (t2G !== -1 && t2Idx !== -1) {
        const team = baseGroups[t2G][t2Idx]
        team.played += 1
        team.gf += s2
        team.ga += s1
        if (s2 > s1) {
          team.won += 1
          team.form.push('W')
        } else if (s2 === s1) {
          team.drawn += 1
          team.form.push('D')
        } else {
          team.lost += 1
          team.form.push('L')
        }
      }
    })

    return baseGroups.map(group => {
      const sorted = [...group].sort((a, b) => {
        const ptsA = a.won * 3 + a.drawn
        const ptsB = b.won * 3 + b.drawn
        if (ptsA !== ptsB) return ptsB - ptsA
        const gdA = a.gf - a.ga
        const gdB = b.gf - b.ga
        if (gdA !== gdB) return gdB - gdA
        return b.gf - a.gf
      })

      sorted.forEach(t => {
        while (t.form.length < 5) t.form.push('')
        if (t.form.length > 5) t.form = t.form.slice(0, 5)
      })

      return sorted
    })
  }, [groupNames, groupMatches])

  const handleTeamStatChange = (gIdx: number, tIdx: number, field: string, value: any) => {
    if (field === 'name') {
      const newNames = [...groupNames]
      newNames[gIdx][tIdx] = value
      setGroupNames(newNames)
    }
  }

  const handleBaseTeamChange = (matchId: string, slot: number, value: string) => {
    setBaseTeams(prev => {
      const next = { ...prev, [`${matchId}_t${slot}`]: value }
      return next
    })
  }

  const handleWinnerSelect = (matchId: string, teamSlot: number) => {
    setWinners(prev => {
      const nextVal = prev[matchId] === teamSlot ? null : teamSlot
      const next = { ...prev, [matchId]: nextVal }
      localStorage.setItem('wc2026_winners', JSON.stringify(next))
      
      fetch('/api/knockout', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winners: { [matchId]: nextVal } })
      })
      .catch(err => console.error('Error saving winner:', err))
      
      return next
    })
  }

  const handleSaveScore = (
    matchId: string, 
    s1: number | null, 
    s2: number | null, 
    p1: number | null = null, 
    p2: number | null = null
  ) => {
    if (matchId.startsWith('gm')) {
      setGroupMatches(prev => {
        const next = prev.map(m => m.id === matchId ? { ...m, score1: s1, score2: s2 } : m)
        localStorage.setItem('wc2026_groupMatches', JSON.stringify(next))
        return next
      })
    } else {
      setKnockoutMatches(prev => {
        const next = prev.map(m => m.id === matchId ? { ...m, score1: s1, score2: s2, homePenalty: p1, awayPenalty: p2 } : m)
        localStorage.setItem('wc2026_knockoutMatches', JSON.stringify(next))
        return next
      })
      
      if (s1 !== null && s2 !== null) {
        setWinners(prev => {
          let nextVal = prev[matchId]
          if (s1 > s2) nextVal = 1
          else if (s2 > s1) nextVal = 2
          else {
            // Went to penalties
            if (p1 !== null && p2 !== null) {
              if (p1 > p2) nextVal = 1
              else if (p2 > p1) nextVal = 2
            }
          }
          const next = { ...prev, [matchId]: nextVal }
          localStorage.setItem('wc2026_winners', JSON.stringify(next))
          return next
        })
      } else {
        setWinners(prev => {
          const next = { ...prev, [matchId]: null }
          localStorage.setItem('wc2026_winners', JSON.stringify(next))
          return next
        })
      }
    }
    
    fetch(`/api/matches/${matchId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score1: s1, score2: s2, homePenalty: p1, awayPenalty: p2 })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.knockout) {
        if (data.knockout.winners) {
          setWinners(data.knockout.winners)
          localStorage.setItem('wc2026_winners', JSON.stringify(data.knockout.winners))
        }
        if (data.knockout.matches) {
          setKnockoutMatches(data.knockout.matches)
          localStorage.setItem('wc2026_knockoutMatches', JSON.stringify(data.knockout.matches))
        }
      }
    })
    .catch(err => console.error('Error saving match score:', err))
  }

  const handleAutoFillKnockout = () => {
    const { firsts, seconds, thirds } = getQualifiedTeams(calculatedGroups)
    const newBaseTeams = { ...baseTeams }

    const placeholderMap: { [key: string]: string } = {}
    for (let i = 0; i < 12; i++) {
      const letter = String.fromCharCode(65 + i)
      placeholderMap[`Nhất Bảng ${letter}`] = firsts[i] || `Nhất Bảng ${letter}`
      placeholderMap[`Nhì Bảng ${letter}`] = seconds[i] || `Nhì Bảng ${letter}`
    }

    const thirdPlaceSlots = ['m3_t2', 'm6_t2', 'm7_t2', 'm8_t2', 'm9_t2', 'm10_t2', 'm13_t2', 'm16_t2']
    thirdPlaceSlots.forEach((slot, idx) => {
      if (thirds[idx]) {
        newBaseTeams[slot] = thirds[idx].name
      } else {
        newBaseTeams[slot] = `Hạng 3 (${idx + 1})`
      }
    })

    Object.keys(initialR32Teams).forEach(key => {
      const placeholder = initialR32Teams[key]
      if (placeholderMap[placeholder]) {
        newBaseTeams[key] = placeholderMap[placeholder]
      }
    })

    setBaseTeams(newBaseTeams)
    localStorage.setItem('wc2026_baseTeams', JSON.stringify(newBaseTeams))

    fetch('/api/knockout', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ baseTeams: newBaseTeams })
    })
    .catch(err => console.error('Error saving autofill knockout teams:', err))
  }

  const getTeamForMatch = (matchId: string, slot: number): string => {
    if (matchId.startsWith('m') && parseInt(matchId.slice(1)) <= 16) {
      return baseTeams[`${matchId}_t${slot}`] || ''
    }
    const flow = BRACKET_FLOW[matchId]
    if (!flow) return ''
    const sourceMatchId = slot === 1 ? flow.source1 : flow.source2
    const winnerVal = winners[sourceMatchId]
    if (!winnerVal) return ''
    if (flow.isLoser) {
      const loserVal = winnerVal === 1 ? 2 : 1
      return getTeamForMatch(sourceMatchId, loserVal)
    }
    return getTeamForMatch(sourceMatchId, winnerVal)
  }

  return (
    <div className="premium-bg text-slate-800 font-sans flex min-h-screen">
      {/* Sidebar - Desktop */}
      <aside className={`hidden md:flex flex-col ${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-[#131424]/90 border-r border-white/10 backdrop-blur-md shrink-0 h-screen sticky top-0 z-10 transition-all duration-300`}>
        {/* Sidebar Header / Logo */}
        <div 
          className="h-20 flex items-center justify-between px-4 border-b border-white/5"
        >
          {isSidebarCollapsed ? (
            <button 
              onClick={() => setIsSidebarCollapsed(false)}
              className="mx-auto p-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 hover:bg-teal-500/20 transition-all text-xs font-extrabold flex items-center justify-center cursor-pointer shadow-md"
              title="Mở rộng menu"
            >
              ▶
            </button>
          ) : (
            <>
              <div 
                onClick={() => {
                  setActiveTab('landing')
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center gap-2.5 px-2 cursor-pointer group"
              >
                <span className="text-2xl transition-transform group-hover:scale-110 select-none">🏆</span>
                <div className="flex flex-col">
                  <span className="font-black text-sm uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400 group-hover:brightness-110">
                    World Cup 2026
                  </span>
                  <span className="text-[8px] font-bold text-yellow-400 uppercase tracking-widest">United Tournament</span>
                </div>
              </div>
              <button 
                onClick={() => setIsSidebarCollapsed(true)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Thu gọn menu"
              >
                ◀
              </button>
            </>
          )}
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 py-6 px-4 flex flex-col gap-1.5 overflow-x-hidden">
          {[
            { id: 'standings', label: 'BẢNG XẾP HẠNG', icon: '📊' },
            { id: 'fixtures', label: 'KẾT QUẢ VÒNG BẢNG', icon: '⚽' },
            { id: 'knockout', label: 'VÒNG KNOCKOUT', icon: '🪜' }
          ].map(item => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any)
                  setIsMobileMenuOpen(false)
                }}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4 gap-3'} py-3 rounded-xl text-xs font-black tracking-wider text-left transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-teal-500/20 to-blue-500/20 border border-teal-500/30 text-teal-300 shadow-md shadow-teal-500/5' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <span className="text-base select-none">{item.icon}</span>
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </button>
            )
          })}
          
          {role === 'admin' ? (
            <>
              {/* Auto update scores button */}
              <button
                onClick={handleSyncExternalScores}
                disabled={isSyncingScores}
                className={`mt-auto flex items-center justify-center gap-2.5 ${isSidebarCollapsed ? 'w-12 h-12 p-0 mx-auto' : 'mx-4 px-4 py-3'} rounded-xl text-xs font-black tracking-wider text-left text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 border border-emerald-500/20 transition-all duration-200 shadow-md shadow-emerald-500/5 cursor-pointer ${isSyncingScores ? 'opacity-50 cursor-not-allowed' : 'animate-pulse-glow'}`}
                title={isSidebarCollapsed ? (isSyncingScores ? 'ĐANG CẬP NHẬT...' : 'CẬP NHẬT TỶ SỐ TỰ ĐỘNG') : undefined}
              >
                <span className="text-base select-none">{isSyncingScores ? '⏳' : '⚡'}</span>
                {!isSidebarCollapsed && <span>{isSyncingScores ? 'ĐANG CẬP NHẬT...' : 'CẬP NHẬT TỶ SỐ TỰ ĐỘNG'}</span>}
              </button>

              {/* Reset button at the bottom of navigation */}
              <button
                onClick={handleResetAll}
                className={`flex items-center justify-center gap-2.5 ${isSidebarCollapsed ? 'w-12 h-12 p-0 mx-auto mb-2' : 'mx-4 mb-2 px-4 py-3'} rounded-xl text-xs font-black tracking-wider text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition-all duration-200 shadow-md shadow-red-500/5 cursor-pointer animate-pulse hover:animate-none`}
                title={isSidebarCollapsed ? 'KHÔI PHỤC BAN ĐẦU' : undefined}
              >
                <span className="text-base select-none">🔄</span>
                {!isSidebarCollapsed && <span>KHÔI PHỤC BAN ĐẦU</span>}
              </button>
            </>
          ) : (
            <div className="mt-auto"></div>
          )}

          {/* Switch Mode button - Only visible to Admins */}
          {role === 'admin' && (
            <button
              onClick={() => {
                localStorage.removeItem('wc2026_auth')
                setRole(null)
              }}
              className={`flex items-center justify-center gap-2.5 ${isSidebarCollapsed ? 'w-12 h-12 p-0 mx-auto mb-4' : 'mx-4 mb-4 px-4 py-3'} rounded-xl text-xs font-black tracking-wider text-left text-blue-455 hover:text-blue-355 hover:bg-blue-500/10 border border-blue-500/20 transition-all duration-200 shadow-md cursor-pointer`}
              title={isSidebarCollapsed ? 'ĐỔI CHẾ ĐỘ TRUY CẬP' : undefined}
            >
              <span className="text-base select-none">🔑</span>
              {!isSidebarCollapsed && <span>ĐỔI CHẾ ĐỘ TRUY CẬP</span>}
            </button>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 text-[9px] text-gray-500 font-bold text-center uppercase tracking-wider">
          {isSidebarCollapsed ? '2026' : '© FIFA WORLD CUP 2026'}
        </div>
      </aside>

      {/* Mobile Sidebar overlay menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
          ></div>
          
          {/* Menu Drawer */}
          <aside className="relative flex flex-col w-64 max-w-xs bg-[#131424] h-full shadow-2xl z-10 border-r border-white/10 transition-all duration-300">
            <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
              <div 
                onClick={() => {
                  setActiveTab('landing')
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <span className="text-xl select-none">🏆</span>
                <span className="font-black text-xs uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
                  World Cup 2026
                </span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-400 hover:text-white text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <nav className="flex-1 py-4 px-4 flex flex-col gap-1.5">
              {[
                { id: 'standings', label: 'BẢNG XẾP HẠNG', icon: '📊' },
                { id: 'fixtures', label: 'KẾT QUẢ VÒNG BẢNG', icon: '⚽' },
                { id: 'knockout', label: 'VÒNG KNOCKOUT', icon: '🪜' }
              ].map(item => {
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black tracking-wider text-left transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-teal-500/20 to-blue-500/20 border border-teal-500/30 text-teal-300 shadow-md' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <span className="text-base select-none">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                )
              })}

              {role === 'admin' ? (
                <>
                  {/* Auto update scores button */}
                  <button
                    onClick={handleSyncExternalScores}
                    disabled={isSyncingScores}
                    className={`mt-auto mx-4 mb-2 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-xs font-black tracking-wider text-left text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 border border-emerald-500/20 transition-all duration-200 shadow-md cursor-pointer ${isSyncingScores ? 'opacity-50 cursor-not-allowed' : 'animate-pulse-glow'}`}
                  >
                    <span className="text-base select-none">{isSyncingScores ? '⏳' : '⚡'}</span>
                    <span>{isSyncingScores ? 'ĐANG CẬP NHẬT...' : 'CẬP NHẬT TỶ SỐ TỰ ĐỘNG'}</span>
                  </button>

                  <button
                    onClick={handleResetAll}
                    className="mx-4 mb-2 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-xs font-black tracking-wider text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition-all duration-200 shadow-md cursor-pointer"
                  >
                    <span className="text-base select-none">🔄</span>
                    <span>KHÔI PHỤC BAN ĐẦU</span>
                  </button>
                </>
              ) : (
                <div className="mt-auto"></div>
              )}

              {/* Switch Mode button - Only visible to Admins */}
              {role === 'admin' && (
                <button
                  onClick={() => {
                    localStorage.removeItem('wc2026_auth')
                    setRole(null)
                    setIsMobileMenuOpen(false)
                  }}
                  className="mx-4 mb-4 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-xs font-black tracking-wider text-left text-blue-450 hover:text-blue-350 hover:bg-blue-500/10 border border-blue-500/20 transition-all duration-200 shadow-md cursor-pointer"
                >
                  <span className="text-base select-none">🔄</span>
                  <span>ĐỔI CHẾ ĐỘ TRUY CẬP</span>
                </button>
              )}
            </nav>

            <div className="p-4 border-t border-white/5 text-[9px] text-gray-500 font-bold text-center uppercase tracking-wider">
              © FIFA WORLD CUP 2026
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Mobile Header Bar */}
        <header className="flex md:hidden items-center justify-between px-6 h-16 bg-[#131424]/90 border-b border-white/10 backdrop-blur-md sticky top-0 z-30 shrink-0">
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-xl select-none">🏆</span>
            <span className="font-black text-xs uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
              World Cup 2026
            </span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-1.5 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>

        {/* Dynamic Views Content Body */}
        <main className="flex-1 py-6">
          {activeTab === 'landing' && (
            <LandingPage setActiveTab={setActiveTab} />
          )}
          
          {activeTab === 'standings' && (
            <StandingsPage 
              calculatedGroups={calculatedGroups}
              role={role}
              handleTeamStatChange={handleTeamStatChange}
              handlePersistGroups={handlePersistGroups}
              groupNames={groupNames}
            />
          )}

          {activeTab === 'fixtures' && (
            <FixturesPage 
              groupMatches={groupMatches}
              fixtureView={fixtureView}
              setFixtureView={setFixtureView}
              setEditingMatch={setEditingMatch}
            />
          )}

          {activeTab === 'knockout' && (
            <KnockoutPage 
              role={role}
              knockoutTab={knockoutTab}
              setKnockoutTab={setKnockoutTab}
              handleAutoFillKnockout={handleAutoFillKnockout}
              winners={winners}
              knockoutMatches={knockoutMatches}
              getTeamForMatch={getTeamForMatch}
              setEditingMatch={setEditingMatch}
              handleWinnerSelect={handleWinnerSelect}
              baseTeams={baseTeams}
              handleBaseTeamChange={handleBaseTeamChange}
              handlePersistKnockoutBaseTeams={handlePersistKnockoutBaseTeams}
            />
          )}
        </main>
      </div>

      {/* Welcome / Access Role Modal */}
      {role === null && (
        <RoleSelectorModal handleSelectRole={handleSelectRole} />
      )}

      {/* Modern Dialog Modal to view/input Match Scores */}
      {editingMatch && (
        <MatchModal 
          editingMatch={editingMatch}
          setEditingMatch={setEditingMatch}
          modalScore1={modalScore1}
          setModalScore1={setModalScore1}
          modalScore2={modalScore2}
          setModalScore2={setModalScore2}
          modalPenalty1={modalPenalty1}
          setModalPenalty1={setModalPenalty1}
          modalPenalty2={modalPenalty2}
          setModalPenalty2={setModalPenalty2}
          role={role}
          handleSaveScore={handleSaveScore}
        />
      )}
    </div>
  )
}
