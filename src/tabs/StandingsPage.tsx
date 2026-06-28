import React from 'react'
import { Team } from '../types'
import { TEAMS_INFO } from '../constants'
import { renderFlag } from '../utils/helpers'

interface StandingsPageProps {
  calculatedGroups: Team[][]
  role: 'admin' | 'guest' | null
  handleTeamStatChange: (gIdx: number, tIdx: number, field: keyof Team, val: any) => void
  handlePersistGroups: (newNames: string[][]) => void
  groupNames: string[][]
}

export const StandingsPage: React.FC<StandingsPageProps> = ({
  calculatedGroups,
  role,
  handleTeamStatChange,
  handlePersistGroups,
  groupNames
}) => {
  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 animate-slide-up">
      <div className="mb-8 text-center flex flex-col items-center">
        <h1 className="text-2xl md:text-4xl font-black mb-1 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 uppercase">BẢNG XẾP HẠNG</h1>
        <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">FIFA World Cup 2026 - 12 Bảng đấu</p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        {calculatedGroups.map((group, gIdx) => (
          <div key={gIdx} className={`glass-card rounded-lg overflow-hidden shadow-xl animate-card-pop delay-${gIdx * 50}`}>
            <div className="text-white font-bold text-lg py-3 px-4 border-b border-gray-700 bg-gray-800/80">Bảng {String.fromCharCode(65 + gIdx)}</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-300 whitespace-nowrap">
                <thead className="text-[11px] text-gray-400 border-b border-gray-700 bg-black/20">
                  <tr>
                    <th className="px-3 py-2.5 font-medium">Đội</th>
                    <th className="px-2 py-2.5 font-medium text-center" title="Số trận đã đá">ĐĐ</th>
                    <th className="px-2 py-2.5 font-medium text-center" title="Thắng">Thắng</th>
                    <th className="px-2 py-2.5 font-medium text-center" title="Hòa">H</th>
                    <th className="px-2 py-2.5 font-medium text-center" title="Thua">Thua</th>
                    <th className="px-2 py-2.5 font-medium text-center" title="Bàn Thắng">BT</th>
                    <th className="px-2 py-2.5 font-medium text-center" title="Số Bàn Thua">SBT</th>
                    <th className="px-2 py-2.5 font-medium text-center" title="Hiệu số">HS</th>
                    <th className="px-2 py-2.5 font-bold text-center text-white" title="Điểm">Đ</th>
                    <th className="px-3 py-2.5 font-medium text-center">3 trận vòng bảng</th>
                  </tr>
                </thead>
                <tbody>
                  {group.map((team, tIdx) => {
                    const gd = team.gf - team.ga
                    const pts = team.won * 3 + team.drawn
                    const teamInfo = TEAMS_INFO[team.name] || { flag: '🏳️' }

                    return (
                      <tr key={tIdx} className="border-b border-gray-800/50 last:border-0 hover:bg-white/5 transition-colors">
                        <td className="px-3 py-2 flex items-center gap-2 border-l-2 border-transparent hover:border-blue-500">
                          <span className="w-4 text-center text-gray-500 font-bold">{tIdx + 1}</span>
                          {renderFlag(team.name, teamInfo.flag, "w-5 h-3.5 object-cover rounded shadow-sm shrink-0")}
                          {role === 'admin' ? (
                            <input 
                              value={team.name} 
                              onChange={(e) => handleTeamStatChange(gIdx, tIdx, 'name', e.target.value)} 
                              onBlur={() => handlePersistGroups(groupNames)} 
                              className="bg-transparent text-white font-medium w-24 md:w-32 outline-none focus:bg-white/10 px-1 py-1 rounded" 
                            />
                          ) : (
                            <span className="text-white font-medium px-1 py-1">{team.name}</span>
                          )}
                        </td>
                        <td className="px-2 py-2 text-center text-gray-300 font-medium">{team.played}</td>
                        <td className="px-2 py-2 text-center text-gray-300 font-medium">{team.won}</td>
                        <td className="px-2 py-2 text-center text-gray-300 font-medium">{team.drawn}</td>
                        <td className="px-2 py-2 text-center text-gray-300 font-medium">{team.lost}</td>
                        <td className="px-2 py-2 text-center text-gray-300 font-medium">{team.gf}</td>
                        <td className="px-2 py-2 text-center text-gray-300 font-medium">{team.ga}</td>
                        <td className="px-2 py-2 text-center font-medium">{gd > 0 ? `+${gd}` : gd}</td>
                        <td className="px-2 py-2 text-center font-bold text-white text-base">{pts}</td>
                        <td className="px-3 py-2">
                          <div className="flex gap-1.5 justify-center items-center">
                            {team.form.map((res, fIdx) => {
                              if (res === '') return null
                              return (
                                <div key={fIdx} className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${res === 'W' ? 'bg-[#22c55e] text-white' : res === 'L' ? 'bg-[#ef4444] text-white' : 'bg-gray-500 text-white'}`}>
                                  {res}
                                </div>
                              )
                            })}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
