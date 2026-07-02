import React from 'react'
import { GroupMatch } from '../types'
import { LAYOUT, TEAMS_INFO } from '../constants'
import { renderFlag, getGroupedMatchesForColumn } from '../utils/helpers'
import { BracketLines } from '../components/BracketLines'
import { MatchBox } from '../components/MatchBox'

interface KnockoutPageProps {
  role: 'admin' | 'guest' | null
  knockoutTab: 'bracket' | 'results'
  setKnockoutTab: (tab: 'bracket' | 'results') => void
  handleAutoFillKnockout: () => void
  winners: { [k: string]: number | null }
  knockoutMatches: GroupMatch[]
  getTeamForMatch: (matchId: string, slot: number) => string
  setEditingMatch: (match: GroupMatch | null) => void
  handleWinnerSelect: (matchId: string, teamSlot: number) => void
  baseTeams: { [k: string]: string }
  handleBaseTeamChange: (matchId: string, slot: number, value: string) => void
  handlePersistKnockoutBaseTeams: (nextBaseTeams: { [k: string]: string }) => void
}

export const KnockoutPage: React.FC<KnockoutPageProps> = ({
  role,
  knockoutTab,
  setKnockoutTab,
  handleAutoFillKnockout,
  winners,
  knockoutMatches,
  getTeamForMatch,
  setEditingMatch,
  handleWinnerSelect,
  baseTeams,
  handleBaseTeamChange,
  handlePersistKnockoutBaseTeams
}) => {
  const renderMatchBox = (id: string) => {
    const m = knockoutMatches.find(match => match.id === id)
    return (
      <MatchBox 
        key={id} 
        matchId={id} 
        getTeamForMatch={getTeamForMatch}
        winners={winners}
        role={role}
        handleWinnerSelect={handleWinnerSelect}
        baseTeams={baseTeams}
        handleBaseTeamChange={handleBaseTeamChange}
        handlePersistKnockoutBaseTeams={handlePersistKnockoutBaseTeams}
        match={m}
      />
    )
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 animate-slide-up">
      <div className="mb-8 text-center flex flex-col items-center">
        <h1 className="text-2xl md:text-4xl font-black mb-1 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 uppercase">VÒNG KNOCKOUT</h1>
        <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mb-4">Nhấp chọn đội chiến thắng để đi tiếp</p>
        
        {/* View Selector Toggle for Knockout */}
        <div className="flex bg-[#1e1e2d] border border-gray-750 p-1 rounded-xl shadow-lg">
          <button
            onClick={() => setKnockoutTab('bracket')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all duration-200 ${
              knockoutTab === 'bracket'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🪜 SƠ ĐỒ THI ĐẤU
          </button>
          <button
            onClick={() => setKnockoutTab('results')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all duration-200 ${
              knockoutTab === 'results'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📅 KẾT QUẢ TRẬN ĐẤU
          </button>
        </div>
      </div>

      {knockoutTab === 'bracket' ? (
        /* SƠ ĐỒ THI ĐẤU (Bracket View) */
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 sticky left-0 px-1">
            <h3 className="text-xl font-bold border-l-4 border-blue-500 pl-3">SƠ ĐỒ THI ĐẤU</h3>
            {role === 'admin' && (
              <button
                onClick={handleAutoFillKnockout}
                className="mt-2 md:mt-0 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-extrabold text-xs rounded-lg shadow-lg shadow-blue-500/20 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-1.5"
              >
                🔄 CẬP NHẬT ĐỘI TỪ VÒNG BẢNG
              </button>
            )}
          </div>

          <div className="overflow-x-auto pb-8 relative">
            <div className="min-w-[1400px] flex justify-between gap-4 py-4 relative" id="bracket-container">
              <BracketLines winners={winners} />
              <div className="flex flex-col justify-around gap-2 w-36 animate-ko-slide-left">
                {LAYOUT.col1.map(renderMatchBox)}
              </div>
              <div className="flex flex-col justify-around gap-2 w-36 py-8 animate-ko-slide-left delay-200">
                {LAYOUT.col2.map(renderMatchBox)}
              </div>
              <div className="flex flex-col justify-around gap-2 w-36 py-24 animate-ko-slide-left delay-400">
                {LAYOUT.col3.map(renderMatchBox)}
              </div>
              <div className="flex flex-col justify-around gap-2 w-36 py-48 animate-ko-slide-left delay-600">
                {LAYOUT.col4.map(renderMatchBox)}
              </div>

              <div className="flex flex-col justify-center items-center gap-12 w-48 relative animate-ko-pop-center delay-800">
                <div className="flex flex-col items-center">
                  {renderMatchBox('m31')}
                </div>
                <div className="text-6xl drop-shadow-[0_0_30px_rgba(250,204,21,0.8)] animate-pulse my-4">🏆</div>
                <div className="flex flex-col items-center transform scale-110">
                  <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full"></div>
                  <div className="relative z-10">
                    {renderMatchBox('m32')}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-around gap-2 w-36 py-48 animate-ko-slide-right delay-600">
                {LAYOUT.col6.map(renderMatchBox)}
              </div>
              <div className="flex flex-col justify-around gap-2 w-36 py-24 animate-ko-slide-right delay-400">
                {LAYOUT.col7.map(renderMatchBox)}
              </div>
              <div className="flex flex-col justify-around gap-2 w-36 py-8 animate-ko-slide-right delay-200">
                {LAYOUT.col8.map(renderMatchBox)}
              </div>
              <div className="flex flex-col justify-around gap-2 w-36 animate-ko-slide-right">
                {LAYOUT.col9.map(renderMatchBox)}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* KẾT QUẢ TRẬN ĐẤU (Results View grouped by date) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
          {getGroupedMatchesForColumn(knockoutMatches).map((group, idx) => (
            <div key={group.dateKey} className={`glass-card rounded-2xl p-4 flex flex-col gap-3 animate-card-pop delay-${idx * 50}`}>
              <div className="bg-[#1e3a8a] text-[#f8e025] font-black text-center py-1.5 rounded-lg text-xs uppercase tracking-wider shadow-md border border-[#2563eb]">
                {group.dayOfWeek} - Ngày {group.date}
              </div>
              <div className="flex flex-col gap-2">
                {group.matches.map(match => {
                  const t1Name = getTeamForMatch(match.id, 1) || match.team1
                  const t2Name = getTeamForMatch(match.id, 2) || match.team2
                  
                  const t1Info = TEAMS_INFO[t1Name] || { flag: '🏳️', group: '' }
                  const t2Info = TEAMS_INFO[t2Name] || { flag: '🏳️', group: '' }
                  
                  const hasScore = match.score1 !== null && match.score2 !== null

                  return (
                    <div
                      key={match.id}
                      onClick={() => setEditingMatch({ ...match, team1: t1Name, team2: t2Name })}
                      className={`flex items-center justify-between px-3 py-1.5 rounded-full border shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.03] text-xs font-bold ${
                        match.id === 'm32' ? 'border-red-300 bg-red-50/80 text-red-950 hover:bg-red-100/95' :
                        match.id === 'm31' ? 'border-slate-300 bg-slate-100/70 text-slate-800 hover:bg-slate-200/90' :
                        parseInt(match.id.slice(1)) <= 16 ? 'border-teal-200 bg-teal-50/70 text-teal-900 hover:bg-teal-100/90' :
                        parseInt(match.id.slice(1)) <= 24 ? 'border-blue-200 bg-blue-50/70 text-blue-900 hover:bg-blue-100/90' :
                        parseInt(match.id.slice(1)) <= 28 ? 'border-fuchsia-200 bg-fuchsia-50/70 text-fuchsia-900 hover:bg-fuchsia-100/90' :
                        'border-amber-200 bg-amber-50/70 text-amber-900 hover:bg-amber-100/90'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 w-[42%] justify-end text-right">
                        <span className="truncate uppercase text-[9px] tracking-tight" title={t1Name}>
                          {t1Name}
                        </span>
                        {renderFlag(t1Name, t1Info.flag, "w-4.5 h-3 object-cover rounded shadow-sm shrink-0")}
                      </div>

                      <div className="flex flex-col items-center justify-center min-w-[3rem] h-8 rounded-full bg-white text-black font-black text-[9px] shadow-md shrink-0 mx-1 px-1.5 select-none leading-tight">
                        {hasScore ? (
                          <>
                            <span>{match.score1}-{match.score2}</span>
                            {match.homePenalty !== null && match.awayPenalty !== null ? (
                              <span className="text-[7px] text-gray-500 font-medium">({match.homePenalty}-{match.awayPenalty} p)</span>
                            ) : (
                              match.isExtraTime && (
                                <span className="text-[7px] text-amber-500 font-black uppercase">HP</span>
                              )
                            )}
                          </>
                        ) : (
                          <span>{match.time}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 w-[42%] justify-start text-left">
                        {renderFlag(t2Name, t2Info.flag, "w-4.5 h-3 object-cover rounded shadow-sm shrink-0")}
                        <span className="truncate uppercase text-[9px] tracking-tight" title={t2Name}>
                          {t2Name}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
