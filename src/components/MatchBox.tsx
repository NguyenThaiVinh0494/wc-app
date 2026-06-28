import React from 'react'
import { getMatchColor, getMatchTitle } from '../utils/helpers'

interface MatchBoxProps {
  matchId: string
  getTeamForMatch: (matchId: string, slot: number) => string
  winners: { [k: string]: number | null }
  role: 'admin' | 'guest' | null
  handleWinnerSelect: (matchId: string, teamSlot: number) => void
  baseTeams: { [k: string]: string }
  handleBaseTeamChange: (matchId: string, slot: number, value: string) => void
  handlePersistKnockoutBaseTeams: (nextBaseTeams: { [k: string]: string }) => void
}

export const MatchBox: React.FC<MatchBoxProps> = ({
  matchId,
  getTeamForMatch,
  winners,
  role,
  handleWinnerSelect,
  baseTeams,
  handleBaseTeamChange,
  handlePersistKnockoutBaseTeams
}) => {
  const t1 = getTeamForMatch(matchId, 1)
  const t2 = getTeamForMatch(matchId, 2)
  const winner = winners[matchId]
  const isR32 = parseInt(matchId.slice(1)) <= 16
  const colorClass = getMatchColor(matchId)
  const title = getMatchTitle(matchId)
  const isAdmin = role === 'admin'

  return (
    <div data-match-id={matchId} className={`w-36 rounded overflow-hidden border ${colorClass} shadow-lg text-xs transition-all duration-300 hover:scale-105`}>
      <div className="text-center font-bold text-[10px] py-1 bg-black/5 uppercase tracking-wider border-b border-inherit">{title}</div>

      <div 
        onClick={() => isAdmin && handleWinnerSelect(matchId, 1)} 
        className={`px-2 py-2 flex items-center border-b border-black/5 transition-colors ${winner === 1 ? 'bg-green-600 font-bold text-white' : 'text-slate-700'} ${winner === 2 ? 'opacity-40' : ''} ${isAdmin ? 'cursor-pointer hover:bg-black/5' : ''}`}
      >
        {isR32 && isAdmin ? (
          <input 
            value={t1} 
            onChange={(e) => handleBaseTeamChange(matchId, 1, e.target.value)} 
            onBlur={() => handlePersistKnockoutBaseTeams(baseTeams)} 
            onClick={(e) => e.stopPropagation()} 
            className="bg-transparent w-full outline-none focus:bg-black/5 px-1 rounded text-slate-800 placeholder-slate-400" 
            placeholder="Đội..." 
          />
        ) : (
          <span className="truncate w-full block">{t1 || '-'}</span>
        )}
      </div>

      <div 
        onClick={() => isAdmin && handleWinnerSelect(matchId, 2)} 
        className={`px-2 py-2 flex items-center transition-colors ${winner === 2 ? 'bg-green-600 font-bold text-white' : 'text-slate-700'} ${winner === 1 ? 'opacity-40' : ''} ${isAdmin ? 'cursor-pointer hover:bg-black/5' : ''}`}
      >
        {isR32 && isAdmin ? (
          <input 
            value={t2} 
            onChange={(e) => handleBaseTeamChange(matchId, 2, e.target.value)} 
            onBlur={() => handlePersistKnockoutBaseTeams(baseTeams)} 
            onClick={(e) => e.stopPropagation()} 
            className="bg-transparent w-full outline-none focus:bg-black/5 px-1 rounded text-slate-800 placeholder-slate-400" 
            placeholder="Đội..." 
          />
        ) : (
          <span className="truncate w-full block">{t2 || '-'}</span>
        )}
      </div>
    </div>
  )
}
