import React from 'react'
import { GroupMatch } from '../types'
import { TEAMS_INFO } from '../constants'
import { renderFlag, getGroupColor, getGroupedMatchesForColumn } from '../utils/helpers'

interface FixturesPageProps {
  groupMatches: GroupMatch[]
  fixtureView: 'date' | 'group'
  setFixtureView: (view: 'date' | 'group') => void
  setEditingMatch: (match: GroupMatch | null) => void
}

export const FixturesPage: React.FC<FixturesPageProps> = ({
  groupMatches,
  fixtureView,
  setFixtureView,
  setEditingMatch
}) => {
  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 animate-slide-up">
      <div className="mb-8 text-center flex flex-col items-center">
        <h1 className="text-2xl md:text-4xl font-black mb-1 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500 uppercase">KẾT QUẢ THI ĐẤU VÒNG BẢNG</h1>
        <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mb-4">Nhấn vào trận đấu để cập nhật tỉ số</p>
        
        {/* View Selector Toggle */}
        <div className="flex bg-[#1e1e2d] border border-gray-750 p-1 rounded-xl shadow-lg">
          <button
            onClick={() => setFixtureView('group')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all duration-200 ${
              fixtureView === 'group'
                ? 'bg-teal-500 text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📊 THEO BẢNG ĐẤU
          </button>
          <button
            onClick={() => setFixtureView('date')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all duration-200 ${
              fixtureView === 'date'
                ? 'bg-teal-500 text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📅 THEO LỊCH THI ĐẤU
          </button>
        </div>
      </div>

      {fixtureView === 'group' ? (
        /* Group View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, gIdx) => {
            const groupLetter = String.fromCharCode(65 + gIdx)
            const matchesInGroup = groupMatches.filter(m => {
              const t1Info = TEAMS_INFO[m.team1]
              return t1Info && t1Info.group === groupLetter
            })
            return (
              <div key={groupLetter} className={`glass-card rounded-2xl p-4 flex flex-col gap-3 animate-card-pop delay-${gIdx * 50}`}>
                <div className="font-extrabold text-sm border-b border-gray-800 pb-2 text-teal-400 flex justify-between items-center tracking-wider">
                  <span>BẢNG {groupLetter}</span>
                  <span className="text-[9px] text-gray-400 font-bold bg-gray-800 px-2 py-0.5 rounded-full">6 trận đấu</span>
                </div>
                <div className="flex flex-col gap-2">
                  {matchesInGroup.map(match => {
                    const t1Info = TEAMS_INFO[match.team1] || { flag: '🏳️' }
                    const t2Info = TEAMS_INFO[match.team2] || { flag: '🏳️' }
                    const hasScore = match.score1 !== null && match.score2 !== null
                    
                    return (
                      <div 
                        key={match.id}
                        onClick={() => setEditingMatch(match)}
                        className="flex items-center justify-between px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 cursor-pointer transition-all duration-200 text-xs text-gray-200 font-bold"
                      >
                        <div className="flex items-center gap-1.5 w-[42%] justify-end text-right">
                          <span className="truncate uppercase text-[9px] tracking-tight">{match.team1}</span>
                          {renderFlag(match.team1, t1Info.flag, "w-4 h-3 object-cover rounded shadow-sm shrink-0")}
                        </div>
                        
                        <div className="w-10 text-center py-0.5 px-1 bg-white text-black font-black rounded text-[9px] shadow-sm shrink-0">
                          {hasScore ? `${match.score1}-${match.score2}` : match.time}
                        </div>
                        
                        <div className="flex items-center gap-1.5 w-[42%] justify-start text-left">
                          {renderFlag(match.team2, t2Info.flag, "w-4 h-3 object-cover rounded shadow-sm shrink-0")}
                          <span className="truncate uppercase text-[9px] tracking-tight">{match.team2}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Date View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {getGroupedMatchesForColumn(groupMatches).map((group, idx) => (
            <div key={group.dateKey} className={`glass-card rounded-2xl p-4 flex flex-col gap-3 animate-card-pop delay-${idx * 50}`}>
              <div className="bg-[#137a3e] text-[#f8e025] font-black text-center py-1.5 rounded-lg text-xs uppercase tracking-wider shadow-md border border-[#1b8c4a]">
                {group.dayOfWeek} - Ngày {group.date}
              </div>
              <div className="flex flex-col gap-2">
                {group.matches.map(match => {
                  const t1Info = TEAMS_INFO[match.team1] || { flag: '🏳️', group: 'A' }
                  const t2Info = TEAMS_INFO[match.team2] || { flag: '🏳️', group: 'A' }
                  const colorInfo = getGroupColor(t1Info.group)
                  const hasScore = match.score1 !== null && match.score2 !== null

                  return (
                    <div
                      key={match.id}
                      onClick={() => setEditingMatch(match)}
                      className={`flex items-center justify-between px-3 py-1.5 rounded-full border ${colorInfo.bg} ${colorInfo.border} shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.03] text-xs font-bold ${colorInfo.text}`}
                    >
                      <div className="flex items-center gap-1.5 w-[42%] justify-end text-right">
                        <span className="truncate uppercase text-[9px] tracking-tight" title={match.team1}>
                          {match.team1}
                        </span>
                        {renderFlag(match.team1, t1Info.flag, "w-4.5 h-3 object-cover rounded shadow-sm shrink-0")}
                      </div>

                      <div className="w-8 h-8 rounded-full bg-white text-black font-black flex items-center justify-center text-[9px] shadow-md shrink-0 mx-1 select-none">
                        {hasScore ? `${match.score1}-${match.score2}` : match.time}
                      </div>

                      <div className="flex items-center gap-1.5 w-[42%] justify-start text-left">
                        {renderFlag(match.team2, t2Info.flag, "w-4.5 h-3 object-cover rounded shadow-sm shrink-0")}
                        <span className="truncate uppercase text-[9px] tracking-tight" title={match.team2}>
                          {match.team2}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
          
          {/* Mascot footer at the end of Date View */}
          <div className={`glass-card rounded-2xl p-4 flex flex-col items-center justify-center gap-3 text-center h-full min-h-[180px] animate-card-pop delay-${getGroupedMatchesForColumn(groupMatches).length * 50}`}>
            <div className="text-4xl animate-bounce select-none">🦌 🐆 🦅</div>
            <div className="text-[10px] tracking-widest text-gray-400 font-bold uppercase">Mascots chính thức</div>
            <div className="text-xs text-yellow-400 font-extrabold">UNITED 2026</div>
            <div className="text-[9px] text-gray-500 font-semibold border-t border-white/5 pt-2 w-full">© FIFA WORLD CUP 2026</div>
          </div>
        </div>
      )}
    </div>
  )
}
