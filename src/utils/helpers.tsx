import React from 'react'
import { Team, GroupMatch, GroupedMatches } from '../types'

export const getFlagUrl = (teamName: string, emoji: string): string => {
  if (teamName === 'Anh') return 'https://flagcdn.com/w80/gb-eng.png';
  if (teamName === 'Scotland') return 'https://flagcdn.com/w80/gb-sct.png';
  if (emoji === '🏳️') return '';
  try {
    if (!emoji || emoji.length < 4) return '';
    const charCode1 = emoji.codePointAt(0);
    const charCode2 = emoji.codePointAt(2);
    if (charCode1 && charCode2) {
      const code1 = String.fromCharCode(charCode1 - 127397);
      const code2 = String.fromCharCode(charCode2 - 127397);
      const code = (code1 + code2).toLowerCase();
      return `https://flagcdn.com/w80/${code}.png`;
    }
  } catch (e) {
    console.error('Error parsing emoji:', emoji, e);
  }
  return '';
}

export const renderFlag = (
  teamName: string,
  emoji: string,
  className: string = "w-5 h-3.5 object-cover rounded shadow-sm inline-block"
): React.ReactNode => {
  const url = getFlagUrl(teamName, emoji);
  if (url) {
    return (
      <img 
        src={url} 
        alt={teamName}
        className={className}
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
    );
  }
  return <span className="select-none">{emoji}</span>;
}

export const getGroupColor = (groupLetter: string) => {
  const colorMap: { [key: string]: { border: string; bg: string; text: string } } = {
    'A': { border: 'border-emerald-200 hover:border-emerald-400', bg: 'bg-emerald-50/70 hover:bg-emerald-100/90', text: 'text-emerald-900' },
    'B': { border: 'border-blue-200 hover:border-blue-400', bg: 'bg-blue-50/70 hover:bg-blue-100/90', text: 'text-blue-900' },
    'C': { border: 'border-cyan-200 hover:border-cyan-400', bg: 'bg-cyan-50/70 hover:bg-cyan-100/90', text: 'text-cyan-900' },
    'D': { border: 'border-amber-200 hover:border-amber-400', bg: 'bg-amber-50/70 hover:bg-amber-100/90', text: 'text-amber-900' },
    'E': { border: 'border-violet-200 hover:border-violet-400', bg: 'bg-violet-50/70 hover:bg-violet-100/90', text: 'text-violet-900' },
    'F': { border: 'border-pink-200 hover:border-pink-400', bg: 'bg-pink-50/70 hover:bg-pink-100/90', text: 'text-pink-900' },
    'G': { border: 'border-rose-200 hover:border-rose-400', bg: 'bg-rose-50/70 hover:bg-rose-100/90', text: 'text-rose-900' },
    'H': { border: 'border-sky-200 hover:border-sky-400', bg: 'bg-sky-50/70 hover:bg-sky-100/90', text: 'text-sky-900' },
    'I': { border: 'border-indigo-200 hover:border-indigo-400', bg: 'bg-indigo-50/70 hover:bg-indigo-100/90', text: 'text-indigo-900' },
    'J': { border: 'border-teal-200 hover:border-teal-400', bg: 'bg-teal-50/70 hover:bg-teal-100/90', text: 'text-teal-900' },
    'K': { border: 'border-lime-200 hover:border-lime-400', bg: 'bg-lime-50/70 hover:bg-lime-100/90', text: 'text-lime-900' },
    'L': { border: 'border-fuchsia-200 hover:border-fuchsia-400', bg: 'bg-fuchsia-50/70 hover:bg-fuchsia-100/90', text: 'text-fuchsia-900' }
  }
  return colorMap[groupLetter] || { border: 'border-slate-200 hover:border-slate-400', bg: 'bg-slate-50 hover:bg-slate-100', text: 'text-slate-800' }
}

export const getGroupedMatchesForColumn = (matches: GroupMatch[]): GroupedMatches[] => {
  const groups: GroupedMatches[] = []
  matches.forEach(m => {
    const key = `${m.dayOfWeek} - Ngày ${m.date}`
    let group = groups.find(g => g.dateKey === key)
    if (!group) {
      group = { dateKey: key, dayOfWeek: m.dayOfWeek, date: m.date, matches: [] }
      groups.push(group)
    }
    group.matches.push(m)
  })
  return groups
}

export const getQualifiedTeams = (groupsData: Team[][]) => {
  const firsts: string[] = []
  const seconds: string[] = []
  const thirds: { name: string; pts: number; gd: number; gf: number; groupLetter: string }[] = []
  
  groupsData.forEach((group, idx) => {
    const letter = String.fromCharCode(65 + idx)
    if (group[0]) firsts.push(group[0].name)
    if (group[1]) seconds.push(group[1].name)
    if (group[2]) {
      const t = group[2]
      thirds.push({
        name: t.name,
        pts: t.won * 3 + t.drawn,
        gd: t.gf - t.ga,
        gf: t.gf,
        groupLetter: letter
      })
    }
  })
  
  thirds.sort((a, b) => {
    if (a.pts !== b.pts) return b.pts - a.pts
    if (a.gd !== b.gd) return b.gd - a.gd
    return b.gf - a.gf
  })
  
  return {
    firsts,
    seconds,
    thirds: thirds.slice(0, 8)
  }
}

export const getMatchColor = (matchId: string) => {
  const idNum = parseInt(matchId.slice(1))
  if (idNum <= 16) return 'border-teal-200 bg-teal-50/70 text-teal-900 hover:bg-teal-100/90'
  if (idNum <= 24) return 'border-blue-200 bg-blue-50/70 text-blue-900 hover:bg-blue-100/90'
  if (idNum <= 28) return 'border-fuchsia-200 bg-fuchsia-50/70 text-fuchsia-900 hover:bg-fuchsia-100/90'
  if (idNum <= 30) return 'border-amber-200 bg-amber-50/70 text-amber-900 hover:bg-amber-100/90'
  if (idNum === 31) return 'border-slate-300 bg-slate-100/70 text-slate-800 hover:bg-slate-200/90'
  return 'border-red-300 bg-red-50/80 text-red-950 hover:bg-red-100/95'
}

export const getMatchTitle = (matchId: string) => {
  const idNum = parseInt(matchId.slice(1))
  if (idNum <= 16) return 'Vòng 1/16'
  if (idNum <= 24) return 'Vòng 1/8'
  if (idNum <= 28) return 'Tứ kết'
  if (idNum <= 30) return 'Bán kết'
  if (idNum === 31) return 'Tranh Hạng 3'
  return 'Chung Kết'
}
