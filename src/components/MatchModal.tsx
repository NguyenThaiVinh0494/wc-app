import React from 'react'
import { GroupMatch } from '../types'
import { STADIUMS_INFO, TEAMS_INFO } from '../constants'
import { renderFlag } from '../utils/helpers'

interface MatchModalProps {
  editingMatch: GroupMatch
  setEditingMatch: (match: GroupMatch | null) => void
  modalScore1: string
  setModalScore1: (val: string) => void
  modalScore2: string
  setModalScore2: (val: string) => void
  modalPenalty1: string
  setModalPenalty1: (val: string) => void
  modalPenalty2: string
  setModalPenalty2: (val: string) => void
  modalIsExtraTime: boolean
  setModalIsExtraTime: (val: boolean) => void
  role: 'admin' | 'guest' | null
  handleSaveScore: (matchId: string, s1: number | null, s2: number | null, p1: number | null, p2: number | null, isExtraTime: boolean | null) => void
}

export const MatchModal: React.FC<MatchModalProps> = ({
  editingMatch,
  setEditingMatch,
  modalScore1,
  setModalScore1,
  modalScore2,
  setModalScore2,
  modalPenalty1,
  setModalPenalty1,
  modalPenalty2,
  setModalPenalty2,
  modalIsExtraTime,
  setModalIsExtraTime,
  role,
  handleSaveScore
}) => {
  const stadium = editingMatch.stadiumId ? STADIUMS_INFO[editingMatch.stadiumId] : null
  
  const parseScorers = (scorersStr: string | null | undefined): string[] => {
    if (!scorersStr || scorersStr === 'null') return []
    try {
      let clean = scorersStr.replace(/[{}"“‘”’[\]]/g, '')
      if (!clean.trim()) return []
      return clean.split(',').map(s => s.trim())
    } catch (e) {
      return [scorersStr]
    }
  }

  const homeScorersList = parseScorers(editingMatch.homeScorers)
  const awayScorersList = parseScorers(editingMatch.awayScorers)
  const isAdmin = role === 'admin'
  const isKnockout = !editingMatch.id.startsWith('gm')
  const isTie = isAdmin 
    ? (modalScore1 !== '' && modalScore2 !== '' && Number(modalScore1) === Number(modalScore2))
    : (editingMatch.score1 !== null && editingMatch.score2 !== null && editingMatch.score1 === editingMatch.score2)

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-[#1e1e2d] border border-gray-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden transform scale-100 transition-transform">
        <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 border-b border-gray-800 px-8 py-5 flex items-center justify-between">
          <h3 className="font-extrabold text-sm tracking-tight text-white uppercase">
            {isAdmin ? 'Cập Nhật Tỉ Số' : 'Thông Tin Trận Đấu'}
          </h3>
          <button
            onClick={() => setEditingMatch(null)}
            className="text-gray-400 hover:text-white transition-colors text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <div className="p-8 flex flex-col gap-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col items-center gap-3 w-[42%] text-center">
              {renderFlag(editingMatch.team1, (TEAMS_INFO[editingMatch.team1] || { flag: '🏳️' }).flag, "w-16 h-11 object-cover rounded-md shadow-md shrink-0")}
              <span className="font-extrabold text-sm text-gray-200 uppercase tracking-wide truncate w-full" title={editingMatch.team1}>{editingMatch.team1}</span>
              {isAdmin ? (
                <input
                  type="number"
                  min="0"
                  placeholder="-"
                  value={modalScore1}
                  onChange={(e) => setModalScore1(e.target.value)}
                  className="w-16 h-14 bg-black/40 border border-gray-750 rounded-lg text-center text-2xl font-bold text-white outline-none focus:border-green-500 transition-colors"
                />
              ) : (
                <span className="text-4xl font-black text-white mt-1">{editingMatch.score1 !== null ? editingMatch.score1 : '-'}</span>
              )}

              {homeScorersList.length > 0 && (
                <div className="text-xs text-gray-400 mt-2 font-medium bg-black/25 py-1.5 px-3 rounded-lg w-full text-center">
                  {homeScorersList.map((s, idx) => <div key={idx} className="truncate">⚽ {s}</div>)}
                </div>
              )}
            </div>

            <div className="text-gray-500 font-black text-sm uppercase self-start pt-8">VS</div>

            <div className="flex flex-col items-center gap-3 w-[42%] text-center">
              {renderFlag(editingMatch.team2, (TEAMS_INFO[editingMatch.team2] || { flag: '🏳️' }).flag, "w-16 h-11 object-cover rounded-md shadow-md shrink-0")}
              <span className="font-extrabold text-sm text-gray-200 uppercase tracking-wide truncate w-full" title={editingMatch.team2}>{editingMatch.team2}</span>
              {isAdmin ? (
                <input
                  type="number"
                  min="0"
                  placeholder="-"
                  value={modalScore2}
                  onChange={(e) => setModalScore2(e.target.value)}
                  className="w-16 h-14 bg-black/40 border border-gray-750 rounded-lg text-center text-2xl font-bold text-white outline-none focus:border-green-500 transition-colors"
                />
              ) : (
                <span className="text-4xl font-black text-white mt-1">{editingMatch.score2 !== null ? editingMatch.score2 : '-'}</span>
              )}

              {awayScorersList.length > 0 && (
                <div className="text-xs text-gray-400 mt-2 font-medium bg-black/25 py-1.5 px-3 rounded-lg w-full text-center">
                  {awayScorersList.map((s, idx) => <div key={idx} className="truncate">⚽ {s}</div>)}
                </div>
              )}
            </div>
          </div>

          {isKnockout && (isAdmin ? (modalScore1 !== '' && modalScore2 !== '') : (editingMatch.score1 !== null && editingMatch.score2 !== null)) && (
            <div className="flex flex-col items-center gap-2 border-t border-white/5 pt-4 w-full">
              {isAdmin ? (
                <label className="flex items-center gap-2 text-xs font-bold text-gray-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isTie ? true : modalIsExtraTime}
                    disabled={isTie}
                    onChange={(e) => setModalIsExtraTime(e.target.checked)}
                    className="w-4 h-4 accent-green-500 rounded border-gray-700 bg-black/40 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  Có Hiệp Phụ (AET)
                </label>
              ) : (
                (editingMatch.isExtraTime || (editingMatch.homePenalty !== null && editingMatch.awayPenalty !== null)) && (
                  <span className="text-[9px] uppercase font-black text-amber-500 tracking-widest bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20">
                    Có Hiệp Phụ (AET)
                  </span>
                )
              )}
            </div>
          )}

          {isKnockout && isTie && (
            <div className="flex flex-col items-center gap-2 border-t border-white/5 pt-4 w-full">
              <span className="text-[10px] uppercase font-extrabold text-yellow-500 tracking-widest">LUÂN LƯU (PENALTIES)</span>
              <div className="flex items-center justify-between gap-6 w-full mt-2">
                <div className="flex flex-col items-center gap-1.5 w-[42%] text-center">
                  {isAdmin ? (
                    <input
                      type="number"
                      min="0"
                      placeholder="Pen"
                      value={modalPenalty1}
                      onChange={(e) => setModalPenalty1(e.target.value)}
                      className="w-16 h-10 bg-black/40 border border-gray-750 rounded-lg text-center text-lg font-bold text-white outline-none focus:border-yellow-500 transition-colors"
                    />
                  ) : (
                    <span className="text-xl font-black text-slate-300">
                      {editingMatch.homePenalty !== null && editingMatch.homePenalty !== undefined ? `(${editingMatch.homePenalty})` : ''}
                    </span>
                  )}
                </div>
                <div className="text-gray-500 font-extrabold text-sm uppercase">-</div>
                <div className="flex flex-col items-center gap-1.5 w-[42%] text-center">
                  {isAdmin ? (
                    <input
                      type="number"
                      min="0"
                      placeholder="Pen"
                      value={modalPenalty2}
                      onChange={(e) => setModalPenalty2(e.target.value)}
                      className="w-16 h-10 bg-black/40 border border-gray-750 rounded-lg text-center text-lg font-bold text-white outline-none focus:border-yellow-500 transition-colors"
                    />
                  ) : (
                    <span className="text-xl font-black text-slate-300">
                      {editingMatch.awayPenalty !== null && editingMatch.awayPenalty !== undefined ? `(${editingMatch.awayPenalty})` : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {stadium && (
            <div className="border-t border-white/5 pt-4 mt-2 flex flex-col gap-1 text-center">
              <span className="text-xs uppercase font-bold text-gray-400">Sân vận động</span>
              <span className="text-sm font-extrabold text-amber-600">{stadium.name}</span>
              <span className="text-xs text-gray-400 font-medium">{stadium.city}, {stadium.country}</span>
            </div>
          )}

          <div className="flex gap-3 justify-end mt-2 border-t border-white/5 pt-5">
            {isAdmin ? (
              <>
                <button
                  onClick={() => {
                    handleSaveScore(editingMatch.id, null, null, null, null, null)
                    setEditingMatch(null)
                  }}
                  className="px-4 py-2.5 border border-red-500/30 bg-red-950/20 hover:bg-red-900/40 text-red-400 rounded-lg text-xs font-bold transition-all"
                >
                  Xóa Tỉ Số
                </button>
                <button
                  onClick={() => setEditingMatch(null)}
                  className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-bold transition-all"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    const s1 = modalScore1 === '' ? null : Number(modalScore1)
                    const s2 = modalScore2 === '' ? null : Number(modalScore2)
                    const p1 = modalPenalty1 === '' ? null : Number(modalPenalty1)
                    const p2 = modalPenalty2 === '' ? null : Number(modalPenalty2)
                    handleSaveScore(editingMatch.id, s1, s2, p1, p2, isTie ? true : modalIsExtraTime)
                    setEditingMatch(null)
                  }}
                  className="px-5 py-2.5 bg-green-500 hover:bg-green-400 text-black font-extrabold rounded-lg text-xs transition-all shadow-md shadow-green-500/20"
                >
                  Lưu
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditingMatch(null)}
                className="px-8 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Đóng
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
