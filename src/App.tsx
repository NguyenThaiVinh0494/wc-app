import React, { useState, useMemo, useEffect } from 'react'

type Team = {
  name: string
  played: number
  won: number
  drawn: number
  lost: number
  gf: number
  ga: number
  form: string[]
}

type GroupMatch = {
  id: string
  team1: string
  team2: string
  time: string
  date: string
  dayOfWeek: string
  score1: number | null
  score2: number | null
  homeScorers?: string | null
  awayScorers?: string | null
  stadiumId?: string | null
}

const createTeam = (name: string): Team => ({
  name,
  played: 0,
  won: 0,
  drawn: 0,
  lost: 0,
  gf: 0,
  ga: 0,
  form: []
})

// Corrected groups based EXACTLY on the user's infographic image
const initialGroups: Team[][] = [
  [createTeam('Mexico'), createTeam('Nam Phi'), createTeam('Hàn Quốc'), createTeam('CH Czech')], // A
  [createTeam('Canada'), createTeam('Bosnia & Herzegovina'), createTeam('Qatar'), createTeam('Thụy Sĩ')], // B
  [createTeam('Brazil'), createTeam('Morocco'), createTeam('Haiti'), createTeam('Scotland')], // C
  [createTeam('Mỹ'), createTeam('Paraguay'), createTeam('Australia'), createTeam('Thổ Nhĩ Kỳ')], // D
  [createTeam('Đức'), createTeam('Curacao'), createTeam('Bờ Biển Ngà'), createTeam('Ecuador')], // E
  [createTeam('Hà Lan'), createTeam('Nhật Bản'), createTeam('Thụy Điển'), createTeam('Tunisia')], // F
  [createTeam('Bỉ'), createTeam('Ai Cập'), createTeam('Iran'), createTeam('New Zealand')], // G
  [createTeam('Tây Ban Nha'), createTeam('Cape Verde'), createTeam('Saudi Arabia'), createTeam('Uruguay')], // H
  [createTeam('Pháp'), createTeam('Senegal'), createTeam('Iraq'), createTeam('Na Uy')], // I
  [createTeam('Argentina'), createTeam('Algeria'), createTeam('Áo'), createTeam('Jordan')], // J
  [createTeam('Bồ Đào Nha'), createTeam('CHDC Congo'), createTeam('Uzbekistan'), createTeam('Colombia')], // K
  [createTeam('Anh'), createTeam('Croatia'), createTeam('Ghana'), createTeam('Panama')], // L
]

const TEAMS_INFO: { [name: string]: { flag: string; group: string } } = {
  'Mexico': { flag: '🇲🇽', group: 'A' },
  'Nam Phi': { flag: '🇿🇦', group: 'A' },
  'Hàn Quốc': { flag: '🇰🇷', group: 'A' },
  'CH Czech': { flag: '🇨🇿', group: 'A' },
  
  'Canada': { flag: '🇨🇦', group: 'B' },
  'Bosnia & Herzegovina': { flag: '🇧🇦', group: 'B' },
  'Qatar': { flag: '🇶🇦', group: 'B' },
  'Thụy Sĩ': { flag: '🇨🇭', group: 'B' },
  
  'Brazil': { flag: '🇧🇷', group: 'C' },
  'Morocco': { flag: '🇲🇦', group: 'C' },
  'Haiti': { flag: '🇭🇹', group: 'C' },
  'Scotland': { flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'C' },
  
  'Mỹ': { flag: '🇺🇸', group: 'D' },
  'Paraguay': { flag: '🇵🇾', group: 'D' },
  'Australia': { flag: '🇦🇺', group: 'D' },
  'Thổ Nhĩ Kỳ': { flag: '🇹🇷', group: 'D' },
  
  'Đức': { flag: '🇩🇪', group: 'E' },
  'Curacao': { flag: '🇨🇼', group: 'E' },
  'Bờ Biển Ngà': { flag: '🇨🇮', group: 'E' },
  'Ecuador': { flag: '🇪🇨', group: 'E' },
  
  'Hà Lan': { flag: '🇳🇱', group: 'F' },
  'Nhật Bản': { flag: '🇯🇵', group: 'F' },
  'Thụy Điển': { flag: '🇸🇪', group: 'F' },
  'Tunisia': { flag: '🇹🇳', group: 'F' },
  
  'Bỉ': { flag: '🇧🇪', group: 'G' },
  'Ai Cập': { flag: '🇪🇬', group: 'G' },
  'Iran': { flag: '🇮🇷', group: 'G' },
  'New Zealand': { flag: '🇳🇿', group: 'G' },
  
  'Tây Ban Nha': { flag: '🇪🇸', group: 'H' },
  'Cape Verde': { flag: '🇨🇻', group: 'H' },
  'Saudi Arabia': { flag: '🇸🇦', group: 'H' },
  'Uruguay': { flag: '🇺🇾', group: 'H' },
  
  'Pháp': { flag: '🇫🇷', group: 'I' },
  'Senegal': { flag: '🇸🇳', group: 'I' },
  'Iraq': { flag: '🇮🇶', group: 'I' },
  'Na Uy': { flag: '🇳🇴', group: 'I' },
  
  'Argentina': { flag: '🇦🇷', group: 'J' },
  'Algeria': { flag: '🇩🇿', group: 'J' },
  'Áo': { flag: '🇦🇹', group: 'J' },
  'Jordan': { flag: '🇯🇴', group: 'J' },
  
  'Bồ Đào Nha': { flag: '🇵🇹', group: 'K' },
  'CHDC Congo': { flag: '🇨🇩', group: 'K' },
  'Uzbekistan': { flag: '🇺🇿', group: 'K' },
  'Colombia': { flag: '🇨🇴', group: 'K' },
  
  'Anh': { flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'L' },
  'Croatia': { flag: '🇭🇷', group: 'L' },
  'Ghana': { flag: '🇬🇭', group: 'L' },
  'Panama': { flag: '🇵🇦', group: 'L' }
}

const STADIUMS_INFO: { [id: string]: { name: string; city: string; country: string } } = {
  '1': { name: 'Sân vận động Azteca', city: 'Mexico City', country: 'Mexico' },
  '2': { name: 'Sân vận động Akron', city: 'Guadalajara', country: 'Mexico' },
  '3': { name: 'Sân vận động BBVA', city: 'Monterrey', country: 'Mexico' },
  '4': { name: 'Sân vận động AT&T', city: 'Dallas', country: 'Mỹ' },
  '5': { name: 'Sân vận động NRG', city: 'Houston', country: 'Mỹ' },
  '6': { name: 'Sân vận động Arrowhead', city: 'Kansas City', country: 'Mỹ' },
  '7': { name: 'Sân vận động Mercedes-Benz', city: 'Atlanta', country: 'Mỹ' },
  '8': { name: 'Sân vận động Hard Rock', city: 'Miami', country: 'Mỹ' },
  '9': { name: 'Sân vận động Gillette', city: 'Boston', country: 'Mỹ' },
  '10': { name: 'Sân vận động Lincoln Financial Field', city: 'Philadelphia', country: 'Mỹ' },
  '11': { name: 'Sân vận động MetLife', city: 'New York/New Jersey', country: 'Mỹ' },
  '12': { name: 'Sân vận động BMO Field', city: 'Toronto', country: 'Canada' },
  '13': { name: 'Sân vận động BC Place', city: 'Vancouver', country: 'Canada' },
  '14': { name: 'Sân vận động Lumen Field', city: 'Seattle', country: 'Mỹ' },
  '15': { name: 'Sân vận động Levi\'s', city: 'San Francisco Bay Area', country: 'Mỹ' },
  '16': { name: 'Sân vận động SoFi', city: 'Los Angeles', country: 'Mỹ' }
}

const initialR32Teams: { [k: string]: string } = {
  m1_t1: 'Nhì Bảng A', m1_t2: 'Nhì Bảng B',
  m2_t1: 'Nhất Bảng E', m2_t2: 'Hạng 3 A/B/C/D/F',
  m3_t1: 'Nhất Bảng F', m3_t2: 'Nhì Bảng C',
  m4_t1: 'Nhất Bảng C', m4_t2: 'Nhì Bảng F',
  m5_t1: 'Nhất Bảng I', m5_t2: 'Hạng 3 C/D/F/G/H',
  m6_t1: 'Nhì Bảng E', m6_t2: 'Nhì Bảng I',
  m7_t1: 'Nhất Bảng A', m7_t2: 'Hạng 3 C/E/F/H/I',
  m8_t1: 'Nhất Bảng L', m8_t2: 'Hạng 3 E/H/I/J/K',
  
  m9_t1: 'Nhất Bảng D', m9_t2: 'Hạng 3 B/E/F/I/J',
  m10_t1: 'Nhất Bảng G', m10_t2: 'Hạng 3 A/E/H/I/J',
  m11_t1: 'Nhì Bảng K', m11_t2: 'Nhì Bảng L',
  m12_t1: 'Nhất Bảng H', m12_t2: 'Nhì Bảng J',
  m13_t1: 'Nhất Bảng B', m13_t2: 'Hạng 3 E/F/G/I/J',
  m14_t1: 'Nhất Bảng J', m14_t2: 'Nhì Bảng H',
  m15_t1: 'Nhất Bảng K', m15_t2: 'Hạng 3 D/E/I/J/L',
  m16_t1: 'Nhì Bảng D', m16_t2: 'Nhì Bảng G',
}

const BRACKET_FLOW: { [k: string]: any } = {
  m17: { source1: 'm2', source2: 'm5' },
  m18: { source1: 'm1', source2: 'm3' },
  m19: { source1: 'm4', source2: 'm6' },
  m20: { source1: 'm7', source2: 'm8' },
  m21: { source1: 'm11', source2: 'm12' },
  m22: { source1: 'm9', source2: 'm10' },
  m23: { source1: 'm14', source2: 'm16' },
  m24: { source1: 'm13', source2: 'm15' },
  
  m25: { source1: 'm17', source2: 'm18' },
  m26: { source1: 'm19', source2: 'm20' },
  m27: { source1: 'm21', source2: 'm22' },
  m28: { source1: 'm23', source2: 'm24' },
  
  m29: { source1: 'm25', source2: 'm26' },
  m30: { source1: 'm27', source2: 'm28' },
  
  m31: { source1: 'm29', source2: 'm30', isLoser: true },
  m32: { source1: 'm29', source2: 'm30' }
}

const LAYOUT: { [k: string]: string[] } = {
  col1: ['m1','m2','m3','m4','m5','m6','m7','m8'],
  col2: ['m17','m18','m19','m20'],
  col3: ['m25','m26'],
  col4: ['m29'],
  col6: ['m30'],
  col7: ['m27','m28'],
  col8: ['m21','m22','m23','m24'],
  col9: ['m9','m10','m11','m12','m13','m14','m15','m16']
}

// 72 Matches transcribed directly from the user's image
const initialGroupMatches: GroupMatch[] = [
  // Column 1 (Matches 1-16)
  { id: 'gm1', dayOfWeek: 'Thứ 6', date: '12/6/2026', team1: 'Mexico', team2: 'Nam Phi', time: '2h', score1: null, score2: null },
  { id: 'gm2', dayOfWeek: 'Thứ 6', date: '12/6/2026', team1: 'Hàn Quốc', team2: 'CH Czech', time: '9h', score1: null, score2: null },
  { id: 'gm3', dayOfWeek: 'Thứ 7', date: '13/6/2026', team1: 'Canada', team2: 'Bosnia & Herzegovina', time: '2h', score1: null, score2: null },
  { id: 'gm4', dayOfWeek: 'Thứ 7', date: '13/6/2026', team1: 'Mỹ', team2: 'Paraguay', time: '8h', score1: null, score2: null },
  { id: 'gm5', dayOfWeek: 'Chủ nhật', date: '14/6/2026', team1: 'Qatar', team2: 'Thụy Sĩ', time: '2h', score1: null, score2: null },
  { id: 'gm6', dayOfWeek: 'Chủ nhật', date: '14/6/2026', team1: 'Brazil', team2: 'Morocco', time: '5h', score1: null, score2: null },
  { id: 'gm7', dayOfWeek: 'Chủ nhật', date: '14/6/2026', team1: 'Haiti', team2: 'Scotland', time: '8h', score1: null, score2: null },
  { id: 'gm8', dayOfWeek: 'Chủ nhật', date: '14/6/2026', team1: 'Australia', team2: 'Thổ Nhĩ Kỳ', time: '11h', score1: null, score2: null },
  { id: 'gm9', dayOfWeek: 'Thứ 2', date: '15/6/2026', team1: 'Đức', team2: 'Curacao', time: '0h', score1: null, score2: null },
  { id: 'gm10', dayOfWeek: 'Thứ 2', date: '15/6/2026', team1: 'Hà Lan', team2: 'Nhật Bản', time: '3h', score1: null, score2: null },
  { id: 'gm11', dayOfWeek: 'Thứ 2', date: '15/6/2026', team1: 'Bờ Biển Ngà', team2: 'Ecuador', time: '6h', score1: null, score2: null },
  { id: 'gm12', dayOfWeek: 'Thứ 2', date: '15/6/2026', team1: 'Thụy Điển', team2: 'Tunisia', time: '9h', score1: null, score2: null },
  { id: 'gm13', dayOfWeek: 'Thứ 2', date: '15/6/2026', team1: 'Tây Ban Nha', team2: 'Cape Verde', time: '23h', score1: null, score2: null },
  { id: 'gm14', dayOfWeek: 'Thứ 3', date: '16/6/2026', team1: 'Bỉ', team2: 'Ai Cập', time: '2h', score1: null, score2: null },
  { id: 'gm15', dayOfWeek: 'Thứ 3', date: '16/6/2026', team1: 'Saudi Arabia', team2: 'Uruguay', time: '5h', score1: null, score2: null },
  { id: 'gm16', dayOfWeek: 'Thứ 3', date: '16/6/2026', team1: 'Iran', team2: 'New Zealand', time: '8h', score1: null, score2: null },

  // Column 2 (Matches 17-32)
  { id: 'gm17', dayOfWeek: 'Thứ 4', date: '17/6/2026', team1: 'Pháp', team2: 'Senegal', time: '2h', score1: null, score2: null },
  { id: 'gm18', dayOfWeek: 'Thứ 4', date: '17/6/2026', team1: 'Iraq', team2: 'Na Uy', time: '5h', score1: null, score2: null },
  { id: 'gm19', dayOfWeek: 'Thứ 4', date: '17/6/2026', team1: 'Argentina', team2: 'Algeria', time: '8h', score1: null, score2: null },
  { id: 'gm20', dayOfWeek: 'Thứ 4', date: '17/6/2026', team1: 'Áo', team2: 'Jordan', time: '11h', score1: null, score2: null },
  { id: 'gm21', dayOfWeek: 'Thứ 5', date: '18/6/2026', team1: 'Bồ Đào Nha', team2: 'CHDC Congo', time: '0h', score1: null, score2: null },
  { id: 'gm22', dayOfWeek: 'Thứ 5', date: '18/6/2026', team1: 'Anh', team2: 'Croatia', time: '3h', score1: null, score2: null },
  { id: 'gm23', dayOfWeek: 'Thứ 5', date: '18/6/2026', team1: 'Ghana', team2: 'Panama', time: '6h', score1: null, score2: null },
  { id: 'gm24', dayOfWeek: 'Thứ 5', date: '18/6/2026', team1: 'Uzbekistan', team2: 'Colombia', time: '9h', score1: null, score2: null },
  { id: 'gm25', dayOfWeek: 'Thứ 5', date: '18/6/2026', team1: 'CH Czech', team2: 'Nam Phi', time: '23h', score1: null, score2: null },
  { id: 'gm26', dayOfWeek: 'Thứ 6', date: '19/6/2026', team1: 'Thụy Sĩ', team2: 'Bosnia & Herzegovina', time: '2h', score1: null, score2: null },
  { id: 'gm27', dayOfWeek: 'Thứ 6', date: '19/6/2026', team1: 'Canada', team2: 'Qatar', time: '5h', score1: null, score2: null },
  { id: 'gm28', dayOfWeek: 'Thứ 6', date: '19/6/2026', team1: 'Mexico', team2: 'Hàn Quốc', time: '8h', score1: null, score2: null },
  { id: 'gm29', dayOfWeek: 'Thứ 7', date: '20/6/2026', team1: 'Mỹ', team2: 'Australia', time: '2h', score1: null, score2: null },
  { id: 'gm30', dayOfWeek: 'Thứ 7', date: '20/6/2026', team1: 'Scotland', team2: 'Morocco', time: '5h', score1: null, score2: null },
  { id: 'gm31', dayOfWeek: 'Thứ 7', date: '20/6/2026', team1: 'Brazil', team2: 'Haiti', time: '7h30', score1: null, score2: null },
  { id: 'gm32', dayOfWeek: 'Thứ 7', date: '20/6/2026', team1: 'Thổ Nhĩ Kỳ', team2: 'Paraguay', time: '10h', score1: null, score2: null },

  // Column 3 (Matches 33-48)
  { id: 'gm33', dayOfWeek: 'Chủ nhật', date: '21/6/2026', team1: 'Hà Lan', team2: 'Thụy Điển', time: '0h', score1: null, score2: null },
  { id: 'gm34', dayOfWeek: 'Chủ nhật', date: '21/6/2026', team1: 'Đức', team2: 'Bờ Biển Ngà', time: '3h', score1: null, score2: null },
  { id: 'gm35', dayOfWeek: 'Chủ nhật', date: '21/6/2026', team1: 'Ecuador', team2: 'Curacao', time: '7h', score1: null, score2: null },
  { id: 'gm36', dayOfWeek: 'Chủ nhật', date: '21/6/2026', team1: 'Tunisia', team2: 'Nhật Bản', time: '11h', score1: null, score2: null },
  { id: 'gm37', dayOfWeek: 'Chủ nhật', date: '21/6/2026', team1: 'Tây Ban Nha', team2: 'Saudi Arabia', time: '23h', score1: null, score2: null },
  { id: 'gm38', dayOfWeek: 'Thứ 2', date: '22/6/2026', team1: 'Bỉ', team2: 'Iran', time: '2h', score1: null, score2: null },
  { id: 'gm39', dayOfWeek: 'Thứ 2', date: '22/6/2026', team1: 'Uruguay', team2: 'Cape Verde', time: '5h', score1: null, score2: null },
  { id: 'gm40', dayOfWeek: 'Thứ 2', date: '22/6/2026', team1: 'New Zealand', team2: 'Ai Cập', time: '8h', score1: null, score2: null },
  { id: 'gm41', dayOfWeek: 'Thứ 3', date: '23/6/2026', team1: 'Argentina', team2: 'Áo', time: '0h', score1: null, score2: null },
  { id: 'gm42', dayOfWeek: 'Thứ 3', date: '23/6/2026', team1: 'Pháp', team2: 'Iraq', time: '4h', score1: null, score2: null },
  { id: 'gm43', dayOfWeek: 'Thứ 3', date: '23/6/2026', team1: 'Na Uy', team2: 'Senegal', time: '7h', score1: null, score2: null },
  { id: 'gm44', dayOfWeek: 'Thứ 3', date: '23/6/2026', team1: 'Jordan', team2: 'Algeria', time: '10h', score1: null, score2: null },
  { id: 'gm45', dayOfWeek: 'Thứ 4', date: '24/6/2026', team1: 'Bồ Đào Nha', team2: 'Uzbekistan', time: '0h', score1: null, score2: null },
  { id: 'gm46', dayOfWeek: 'Thứ 4', date: '24/6/2026', team1: 'Anh', team2: 'Ghana', time: '3h', score1: null, score2: null },
  { id: 'gm47', dayOfWeek: 'Thứ 4', date: '24/6/2026', team1: 'Panama', team2: 'Croatia', time: '6h', score1: null, score2: null },
  { id: 'gm48', dayOfWeek: 'Thứ 4', date: '24/6/2026', team1: 'Colombia', team2: 'CHDC Congo', time: '9h', score1: null, score2: null },

  // Column 4 (Matches 49-60)
  { id: 'gm49', dayOfWeek: 'Thứ 5', date: '25/6/2026', team1: 'Thụy Sĩ', team2: 'Canada', time: '2h', score1: null, score2: null },
  { id: 'gm50', dayOfWeek: 'Thứ 5', date: '25/6/2026', team1: 'Qatar', team2: 'Bosnia & Herzegovina', time: '2h', score1: null, score2: null },
  { id: 'gm51', dayOfWeek: 'Thứ 5', date: '25/6/2026', team1: 'Morocco', team2: 'Haiti', time: '5h', score1: null, score2: null },
  { id: 'gm52', dayOfWeek: 'Thứ 5', date: '25/6/2026', team1: 'Scotland', team2: 'Brazil', time: '5h', score1: null, score2: null },
  { id: 'gm53', dayOfWeek: 'Thứ 5', date: '25/6/2026', team1: 'Nam Phi', team2: 'Hàn Quốc', time: '8h', score1: null, score2: null },
  { id: 'gm54', dayOfWeek: 'Thứ 5', date: '25/6/2026', team1: 'CH Czech', team2: 'Mexico', time: '8h', score1: null, score2: null },
  { id: 'gm55', dayOfWeek: 'Thứ 6', date: '26/6/2026', team1: 'Curacao', team2: 'Bờ Biển Ngà', time: '3h', score1: null, score2: null },
  { id: 'gm56', dayOfWeek: 'Thứ 6', date: '26/6/2026', team1: 'Ecuador', team2: 'Đức', time: '3h', score1: null, score2: null },
  { id: 'gm57', dayOfWeek: 'Thứ 6', date: '26/6/2026', team1: 'Tunisia', team2: 'Hà Lan', time: '6h', score1: null, score2: null },
  { id: 'gm58', dayOfWeek: 'Thứ 6', date: '26/6/2026', team1: 'Nhật Bản', team2: 'Thụy Điển', time: '6h', score1: null, score2: null },
  { id: 'gm59', dayOfWeek: 'Thứ 6', date: '26/6/2026', team1: 'Thổ Nhĩ Kỳ', team2: 'Mỹ', time: '9h', score1: null, score2: null },
  { id: 'gm60', dayOfWeek: 'Thứ 6', date: '26/6/2026', team1: 'Paraguay', team2: 'Australia', time: '9h', score1: null, score2: null },

  // Column 5 (Matches 61-72)
  { id: 'gm61', dayOfWeek: 'Thứ 7', date: '27/6/2026', team1: 'Na Uy', team2: 'Pháp', time: '2h', score1: null, score2: null },
  { id: 'gm62', dayOfWeek: 'Thứ 7', date: '27/6/2026', team1: 'Senegal', team2: 'Iraq', time: '2h', score1: null, score2: null },
  { id: 'gm63', dayOfWeek: 'Thứ 7', date: '27/6/2026', team1: 'Cape Verde', team2: 'Saudi Arabia', time: '7h', score1: null, score2: null },
  { id: 'gm64', dayOfWeek: 'Thứ 7', date: '27/6/2026', team1: 'Uruguay', team2: 'Tây Ban Nha', time: '7h', score1: null, score2: null },
  { id: 'gm65', dayOfWeek: 'Thứ 7', date: '27/6/2026', team1: 'New Zealand', team2: 'Bỉ', time: '10h', score1: null, score2: null },
  { id: 'gm66', dayOfWeek: 'Thứ 7', date: '27/6/2026', team1: 'Ai Cập', team2: 'Iran', time: '10h', score1: null, score2: null },
  { id: 'gm67', dayOfWeek: 'Chủ nhật', date: '28/6/2026', team1: 'Panama', team2: 'Anh', time: '4h', score1: null, score2: null },
  { id: 'gm68', dayOfWeek: 'Chủ nhật', date: '28/6/2026', team1: 'Croatia', team2: 'Ghana', time: '4h', score1: null, score2: null },
  { id: 'gm69', dayOfWeek: 'Chủ nhật', date: '28/6/2026', team1: 'Colombia', team2: 'Bồ Đào Nha', time: '6h30', score1: null, score2: null },
  { id: 'gm70', dayOfWeek: 'Chủ nhật', date: '28/6/2026', team1: 'CHDC Congo', team2: 'Uzbekistan', time: '6h30', score1: null, score2: null },
  { id: 'gm71', dayOfWeek: 'Chủ nhật', date: '28/6/2026', team1: 'Algeria', team2: 'Áo', time: '9h', score1: null, score2: null },
  { id: 'gm72', dayOfWeek: 'Chủ nhật', date: '28/6/2026', team1: 'Jordan', team2: 'Argentina', time: '9h', score1: null, score2: null }
]

const getGroupColor = (groupLetter: string) => {
  const colorMap: { [key: string]: { border: string; bg: string; text: string } } = {
    'A': { border: 'border-emerald-500/30 hover:border-emerald-500/60', bg: 'bg-[#064e3b]/30 hover:bg-[#064e3b]/45', text: 'text-emerald-300' },
    'B': { border: 'border-blue-500/30 hover:border-blue-500/60', bg: 'bg-[#1e3a8a]/30 hover:bg-[#1e3a8a]/45', text: 'text-blue-300' },
    'C': { border: 'border-cyan-500/30 hover:border-cyan-500/60', bg: 'bg-[#083344]/30 hover:bg-[#083344]/45', text: 'text-cyan-300' },
    'D': { border: 'border-amber-500/30 hover:border-amber-500/60', bg: 'bg-[#451a03]/30 hover:bg-[#451a03]/45', text: 'text-amber-300' },
    'E': { border: 'border-violet-500/30 hover:border-violet-500/60', bg: 'bg-[#2e1065]/30 hover:bg-[#2e1065]/45', text: 'text-violet-300' },
    'F': { border: 'border-pink-500/30 hover:border-pink-500/60', bg: 'bg-[#500724]/30 hover:bg-[#500724]/45', text: 'text-pink-300' },
    'G': { border: 'border-rose-500/30 hover:border-rose-500/60', bg: 'bg-[#4c0519]/30 hover:bg-[#4c0519]/45', text: 'text-rose-300' },
    'H': { border: 'border-sky-500/30 hover:border-sky-500/60', bg: 'bg-[#0c4a6e]/30 hover:bg-[#0c4a6e]/45', text: 'text-sky-300' },
    'I': { border: 'border-indigo-500/30 hover:border-indigo-500/60', bg: 'bg-[#311042]/30 hover:bg-[#311042]/45', text: 'text-indigo-300' },
    'J': { border: 'border-teal-500/30 hover:border-teal-500/60', bg: 'bg-[#115e59]/20 hover:bg-[#115e59]/35', text: 'text-teal-300' },
    'K': { border: 'border-lime-500/30 hover:border-lime-500/60', bg: 'bg-[#3f6212]/30 hover:bg-[#3f6212]/45', text: 'text-lime-300' },
    'L': { border: 'border-fuchsia-500/30 hover:border-fuchsia-500/60', bg: 'bg-[#701a75]/30 hover:bg-[#701a75]/45', text: 'text-fuchsia-300' }
  }
  return colorMap[groupLetter] || { border: 'border-gray-500/30 hover:border-gray-500/60', bg: 'bg-gray-800/30 hover:bg-gray-800/45', text: 'text-gray-300' }
}

interface GroupedMatches {
  dateKey: string
  dayOfWeek: string
  date: string
  matches: GroupMatch[]
}

const getGroupedMatchesForColumn = (matches: GroupMatch[]): GroupedMatches[] => {
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

const getQualifiedTeams = (groupsData: Team[][]) => {
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

// Landing Page Component
const LandingPage: React.FC<{ setActiveTab: (tab: 'landing' | 'standings' | 'fixtures' | 'knockout') => void }> = ({ setActiveTab }) => {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 flex flex-col gap-12 text-white animate-slide-up">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1e2354] via-[#12132b] to-[#251b4f] p-8 md:p-12 border border-white/10 shadow-2xl flex flex-col items-center text-center gap-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.15),transparent_60%)]"></div>
        
        <div className="relative px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-black tracking-widest uppercase animate-pulse">
          🏆 Giải đấu đang diễn ra (11/06 - 19/07/2026)
        </div>

        <h1 className="relative text-4xl md:text-6xl font-black tracking-tight leading-none text-gradient-animate drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          FIFA WORLD CUP 2026
        </h1>

        <p className="relative text-base md:text-xl font-bold tracking-widest text-yellow-400 uppercase">
          UNITED: HOA KỲ • CANADA • MEXICO
        </p>

        <p className="relative max-w-2xl text-xs md:text-sm text-gray-400 leading-relaxed font-medium">
          Lần đầu tiên trong lịch sử, ngày hội bóng đá lớn nhất hành tinh được tổ chức tại 3 quốc gia đồng chủ nhà với sự tham gia của 48 đội tuyển xuất sắc nhất, mang lại tổng cộng 104 trận cầu rực lửa.
        </p>

        {/* Host Countries Flags */}
        <div className="relative flex justify-center gap-6 md:gap-10 mt-4">
          <div className="flex flex-col items-center gap-1.5 transition-transform hover:scale-110">
            <span className="text-4xl md:text-5xl drop-shadow-lg select-none">🇺🇸</span>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Hoa Kỳ</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 transition-transform hover:scale-110">
            <span className="text-4xl md:text-5xl drop-shadow-lg select-none">🇨🇦</span>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Canada</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 transition-transform hover:scale-110">
            <span className="text-4xl md:text-5xl drop-shadow-lg select-none">🇲🇽</span>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Mexico</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Đội tuyển', val: '48', desc: '12 bảng đấu', color: 'from-teal-400 to-emerald-500' },
          { label: 'Trận đấu', val: '104', desc: 'Kịch tính từng giây', color: 'from-blue-400 to-indigo-500' },
          { label: 'Chủ nhà', val: '3', desc: 'Mỹ, Canada, Mexico', color: 'from-yellow-400 to-orange-500' },
          { label: 'Ngày hội', val: '39', desc: 'Ngày tranh tài rực lửa', color: 'from-pink-400 to-rose-500' },
        ].map((stat, idx) => (
          <div key={idx} className="glass-card rounded-2xl p-5 flex flex-col items-center text-center">
            <span className={`text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r ${stat.color}`}>{stat.val}</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider mt-1">{stat.label}</span>
            <span className="text-[10px] text-gray-400 font-medium mt-0.5">{stat.desc}</span>
          </div>
        ))}
      </div>

      {/* Quick Shortcut CTAs */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-extrabold uppercase border-l-4 border-teal-400 pl-3">Khám phá Tiện ích</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Bảng Xếp Hạng',
              desc: 'Xem thứ hạng, điểm số, hiệu số bàn thắng bại và phong độ của 48 đội bóng tại 12 bảng đấu.',
              tab: 'standings',
              icon: '📊',
              btnClass: 'bg-teal-500 hover:bg-teal-400 text-black',
              borderClass: 'border-teal-500/20 hover:border-teal-500/40'
            },
            {
              title: 'Kết Quả Thi Đấu',
              desc: 'Theo dõi chi tiết 72 trận đấu vòng bảng, ghi nhận tỉ số trực tiếp để tự động cập nhật bảng điểm.',
              tab: 'fixtures',
              icon: '⚽',
              btnClass: 'bg-green-500 hover:bg-green-400 text-black',
              borderClass: 'border-green-500/20 hover:border-green-500/40'
            },
            {
              title: 'Vòng Knockout',
              desc: 'Trải nghiệm vòng đấu loại trực tiếp kịch tính từ Vòng 1/16, Tứ kết, Bán kết đến ngôi vương vô địch.',
              tab: 'knockout',
              icon: '🏆',
              btnClass: 'bg-blue-500 hover:bg-blue-400 text-white',
              borderClass: 'border-blue-500/20 hover:border-blue-500/40'
            }
          ].map((card, idx) => (
            <div 
              key={idx} 
              className="glass-card rounded-2xl p-6 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl select-none">{card.icon}</span>
                <h3 className="font-extrabold text-base tracking-tight uppercase text-white">{card.title}</h3>
              </div>
              <p className="text-xs text-gray-400 font-medium leading-relaxed flex-1">{card.desc}</p>
              <button 
                onClick={() => setActiveTab(card.tab as any)}
                className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-md ${card.btnClass}`}
              >
                Truy cập ngay
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mascots Detail */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-extrabold uppercase border-l-4 border-yellow-400 pl-3">Linh vật chính thức (Official Mascots)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Tuần Lộc (Deer)', flag: '🇨🇦', desc: 'Đại diện cho sự nhanh nhẹn, bền bỉ kiên cường trước nghịch cảnh, mang đậm nét đặc trưng hoang dã của thiên nhiên Canada rộng lớn.', icon: '🦌', color: 'from-red-500/10 to-transparent border-red-500/20' },
            { name: 'Báo Hoa Mai (Leopard)', flag: '🇲🇽', desc: 'Đại diện cho tốc độ xé gió, sự dũng mãnh huyền thoại và di sản văn hóa Maya/Aztec đầy huyền bí, rực rỡ sắc màu của đất nước Mexico.', icon: '🐆', color: 'from-green-500/10 to-transparent border-green-500/20' },
            { name: 'Đại Bàng (Eagle)', flag: '🇺🇸', desc: 'Đại diện cho tầm nhìn cao rộng kiêu hãnh, ý chí tự do phóng khoáng và sức mạnh khát vọng dẫn đầu của tinh thần thể thao nước Mỹ.', icon: '🦅', color: 'from-blue-500/10 to-transparent border-blue-500/20' }
          ].map((m, idx) => (
            <div key={idx} className={`glass-card bg-gradient-to-b ${m.color} rounded-2xl p-6 flex flex-col items-center text-center gap-3`}>
              <span className="text-5xl animate-pulse select-none">{m.icon}</span>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm uppercase tracking-wide text-white">{m.name}</span>
                <span className="text-sm select-none">{m.flag}</span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stadiums / Host Cities */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-extrabold uppercase border-l-4 border-blue-400 pl-3">Thành phố đăng cai nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { city: 'New York/New Jersey', stadium: 'Sân vận động MetLife', capacity: '82,500 chỗ ngồi', note: 'Nơi diễn ra trận Chung Kết lịch sử', icon: '🗽' },
            { city: 'Mexico City', stadium: 'Sân vận động Azteca', capacity: '87,523 chỗ ngồi', note: 'Sân đầu tiên đăng cai 3 kỳ World Cup', icon: '🏟️' },
            { city: 'Toronto', stadium: 'Sân vận động BMO Field', capacity: '45,000 chỗ ngồi', note: 'Trọng điểm bóng đá quốc gia lá phong', icon: '🍁' }
          ].map((stadium, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-white uppercase tracking-wider">{stadium.city}</span>
                <span className="text-xl select-none">{stadium.icon}</span>
              </div>
              <div className="text-sm font-black text-yellow-400">{stadium.stadium}</div>
              <div className="text-[10px] text-gray-400 font-bold">{stadium.capacity}</div>
              <div className="text-[10px] text-teal-400 font-medium mt-1 italic">{stadium.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

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

  // Role selector component
  const RoleSelectorModal = () => {
    const [pin, setPin] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [showPinInput, setShowPinInput] = useState(false)
    const [isVerifying, setIsVerifying] = useState(false)

    const handleVerifyPin = (e: React.FormEvent) => {
      e.preventDefault()
      setErrorMsg('')
      setIsVerifying(true)
      
      fetch('/api/login-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pin })
      })
      .then(async res => {
        setIsVerifying(false)
        if (res.ok) {
          handleSelectRole('admin')
        } else {
          const data = await res.json()
          setErrorMsg(data.error || 'Sai mã PIN xác minh Admin!')
        }
      })
      .catch(err => {
        setIsVerifying(false)
        console.error(err)
        setErrorMsg('Không thể kết nối tới server!')
      })
    }

    return (
      <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[100] p-4">
        <div className="glass-card w-full max-w-md rounded-3xl p-8 border border-white/10 shadow-2xl flex flex-col gap-6 text-center text-white relative overflow-hidden animate-slide-up">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.1),transparent_60%)] pointer-events-none"></div>
          
          <div className="text-5xl select-none animate-bounce">🏆</div>
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl font-black text-gradient-animate uppercase">World Cup 2026</h2>
            <span className="text-[10px] text-yellow-400 font-extrabold uppercase tracking-widest mt-1">Hệ Thống Quản Lý & Cập Nhật Tỉ Số</span>
          </div>

          {!showPinInput ? (
            <div className="flex flex-col gap-4 mt-2 z-10">
              <p className="text-xs text-gray-400 font-medium px-4 leading-relaxed">
                Chào mừng bạn! Vui lòng chọn chế độ truy cập. Quyền truy cập sẽ được lưu trong vòng 2 tiếng.
              </p>
              
              <button
                onClick={() => handleSelectRole('guest')}
                className="w-full py-3 bg-gradient-to-r from-teal-500/20 to-blue-500/20 border border-teal-500/30 hover:border-teal-400 text-teal-300 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-lg shadow-teal-500/5 cursor-pointer"
              >
                👀 Khách xem (View-Only)
              </button>

              <button
                onClick={() => setShowPinInput(true)}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-md shadow-blue-500/20 cursor-pointer"
              >
                🔐 Administrator (Cập nhật dữ liệu)
              </button>
            </div>
          ) : (
            <form onSubmit={handleVerifyPin} className="flex flex-col gap-4 mt-2 z-10">
              <p className="text-xs text-gray-400 font-semibold">
                Nhập mã PIN Admin để truy cập quyền quản trị:
              </p>
              
              <input
                type="password"
                placeholder="Nhập mã PIN Admin..."
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full h-12 bg-black/40 border border-gray-700 rounded-xl text-center text-base font-bold text-white outline-none focus:border-blue-500 transition-colors"
                autoFocus
              />

              {errorMsg && (
                <div className="text-xs font-bold text-red-400 bg-red-950/20 border border-red-500/20 py-2 rounded-lg">
                  ❌ {errorMsg}
                </div>
              )}

              <div className="flex gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPinInput(false)
                    setErrorMsg('')
                    setPin('')
                  }}
                  className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="flex-1 py-3 bg-green-500 hover:bg-green-400 text-black rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? 'Đang xác minh...' : 'Xác nhận'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    )
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
  const [editingMatch, setEditingMatch] = useState<GroupMatch | null>(null)
  
  const [modalScore1, setModalScore1] = useState<string>('')
  const [modalScore2, setModalScore2] = useState<string>('')

  useEffect(() => {
    if (editingMatch) {
      setModalScore1(editingMatch.score1 !== null ? String(editingMatch.score1) : '')
      setModalScore2(editingMatch.score2 !== null ? String(editingMatch.score2) : '')
    }
  }, [editingMatch])

  const syncLocalStateToBackend = (
    currentGroups: string[][],
    currentMatches: GroupMatch[],
    currentBaseTeams: { [k: string]: string },
    currentWinners: { [k: string]: number | null }
  ) => {
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        groups: currentGroups,
        matches: currentMatches,
        knockout: {
          baseTeams: currentBaseTeams,
          winners: currentWinners
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
        const hasBackendScores = data.matches && data.matches.some((m: any) => m.score1 !== null || m.score2 !== null)
        const hasBackendWinners = data.knockout && data.knockout.winners && Object.keys(data.knockout.winners).length > 0
        
        const localGroupsStr = localStorage.getItem('wc2026_groupNames')
        const localMatchesStr = localStorage.getItem('wc2026_groupMatches')
        const localBaseTeamsStr = localStorage.getItem('wc2026_baseTeams')
        const localWinnersStr = localStorage.getItem('wc2026_winners')

        const isLocalEmpty = !localMatchesStr && !localWinnersStr

        if (hasBackendScores || hasBackendWinners || isLocalEmpty) {
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
          }
        } else {
          // Server is empty but LocalStorage has data (Render cold start)
          const localGroups = localGroupsStr ? JSON.parse(localGroupsStr) : groupNames
          const localMatches = localMatchesStr ? JSON.parse(localMatchesStr) : groupMatches
          const localBaseTeams = localBaseTeamsStr ? JSON.parse(localBaseTeamsStr) : baseTeams
          const localWinners = localWinnersStr ? JSON.parse(localWinnersStr) : winners
          
          console.log('Syncing local storage data back to restarted server...')
          syncLocalStateToBackend(localGroups, localMatches, localBaseTeams, localWinners)
        }
      })
      .catch(err => console.error('Error fetching state from API:', err))
  }, [])

  // Background polling from own server (every 2 minutes)
  useEffect(() => {
    const refreshState = () => {
      // Avoid overwriting state if user is editing or has text input focused
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
          }
        })
        .catch(err => console.log('Error auto-refreshing state:', err))
    }

    const intervalId = setInterval(refreshState, 120000) // 2 minutes
    return () => clearInterval(intervalId)
  }, [groupNames, groupMatches, baseTeams, winners, editingMatch])

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

          localStorage.removeItem('wc2026_groupNames')
          localStorage.removeItem('wc2026_groupMatches')
          localStorage.removeItem('wc2026_baseTeams')
          localStorage.removeItem('wc2026_winners')
          
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
            alert(`Đã cập nhật tự động thành công tỉ số của ${data.updatedCount} trận đấu từ FIFA!`)
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

  const handleSaveScore = (matchId: string, s1: number | null, s2: number | null) => {
    setGroupMatches(prev => {
      const next = prev.map(m => m.id === matchId ? { ...m, score1: s1, score2: s2 } : m)
      localStorage.setItem('wc2026_groupMatches', JSON.stringify(next))
      return next
    })
    
    fetch(`/api/matches/${matchId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score1: s1, score2: s2 })
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

  const getMatchColor = (matchId: string) => {
    const idNum = parseInt(matchId.slice(1))
    if (idNum <= 16) return 'border-teal-500 bg-teal-900/40 title-teal'
    if (idNum <= 24) return 'border-blue-500 bg-blue-900/40 title-blue'
    if (idNum <= 28) return 'border-fuchsia-500 bg-fuchsia-900/40 title-fuchsia'
    if (idNum <= 30) return 'border-yellow-500 bg-yellow-900/40 title-yellow'
    if (idNum === 31) return 'border-gray-400 bg-gray-800/60 title-gray'
    return 'border-red-500 bg-red-900/60 title-red'
  }

  const getMatchTitle = (matchId: string) => {
    const idNum = parseInt(matchId.slice(1))
    if (idNum <= 16) return 'Vòng 1/16'
    if (idNum <= 24) return 'Vòng 1/8'
    if (idNum <= 28) return 'Tứ kết'
    if (idNum <= 30) return 'Bán kết'
    if (idNum === 31) return 'Tranh Hạng 3'
    return 'Chung Kết'
  }

  const MatchBox: React.FC<{ matchId: string }> = ({ matchId }) => {
    const t1 = getTeamForMatch(matchId, 1)
    const t2 = getTeamForMatch(matchId, 2)
    const winner = winners[matchId]
    const isR32 = parseInt(matchId.slice(1)) <= 16
    const colorClass = getMatchColor(matchId)
    const title = getMatchTitle(matchId)
    const isAdmin = role === 'admin'

    return (
      <div className={`w-36 rounded overflow-hidden border ${colorClass} shadow-lg text-xs transition-all duration-300 hover:scale-105`}>
        <div className="text-center font-bold text-[10px] py-1 bg-black/30 uppercase tracking-wider text-white">{title}</div>

        <div 
          onClick={() => isAdmin && handleWinnerSelect(matchId, 1)} 
          className={`px-2 py-2 flex items-center border-b border-white/10 transition-colors ${winner === 1 ? 'bg-green-600 font-bold text-white' : 'text-gray-200'} ${winner === 2 ? 'opacity-40' : ''} ${isAdmin ? 'cursor-pointer hover:bg-white/10' : ''}`}
        >
          {isR32 && isAdmin ? (
            <input value={t1} onChange={(e) => handleBaseTeamChange(matchId, 1, e.target.value)} onBlur={() => handlePersistKnockoutBaseTeams(baseTeams)} onClick={(e) => e.stopPropagation()} className="bg-transparent w-full outline-none focus:bg-white/20 px-1 rounded" placeholder="Nhập tên đội..." />
          ) : (
            <span className="truncate w-full block">{t1 || '-'}</span>
          )}
        </div>

        <div 
          onClick={() => isAdmin && handleWinnerSelect(matchId, 2)} 
          className={`px-2 py-2 flex items-center transition-colors ${winner === 2 ? 'bg-green-600 font-bold text-white' : 'text-gray-200'} ${winner === 1 ? 'opacity-40' : ''} ${isAdmin ? 'cursor-pointer hover:bg-white/10' : ''}`}
        >
          {isR32 && isAdmin ? (
            <input value={t2} onChange={(e) => handleBaseTeamChange(matchId, 2, e.target.value)} onBlur={() => handlePersistKnockoutBaseTeams(baseTeams)} onClick={(e) => e.stopPropagation()} className="bg-transparent w-full outline-none focus:bg-white/20 px-1 rounded" placeholder="Nhập tên đội..." />
          ) : (
            <span className="truncate w-full block">{t2 || '-'}</span>
          )}
        </div>
      </div>
    )
  }

  const renderColumn = (matchesSlice: GroupMatch[], hasMascots: boolean = false) => {
    const grouped = getGroupedMatchesForColumn(matchesSlice)
    return (
      <div className="flex flex-col gap-5 min-w-[240px] flex-1">
        {grouped.map(group => (
          <div key={group.dateKey} className="flex flex-col gap-2.5">
            <div className="bg-[#137a3e] text-[#f8e025] font-black text-center py-1.5 rounded-md text-xs uppercase tracking-wider shadow-md border border-[#1b8c4a]">
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
                    className={`flex items-center justify-between px-3 py-2 rounded-full border ${colorInfo.bg} ${colorInfo.border} shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.03] text-xs font-bold text-white`}
                  >
                    <div className="flex items-center gap-1.5 w-[42%] justify-end text-right">
                      <span className="truncate uppercase text-[10px] tracking-tight" title={match.team1}>
                        {match.team1}
                      </span>
                      <span className="text-base shrink-0 select-none">{t1Info.flag}</span>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-white text-black font-black flex items-center justify-center text-[10px] shadow-md shrink-0 mx-1 select-none">
                      {hasScore ? `${match.score1}-${match.score2}` : match.time}
                    </div>

                    <div className="flex items-center gap-1.5 w-[42%] justify-start text-left">
                      <span className="text-base shrink-0 select-none">{t2Info.flag}</span>
                      <span className="truncate uppercase text-[10px] tracking-tight" title={match.team2}>
                        {match.team2}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {hasMascots && (
          <div className="bg-[#1e1e38]/50 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center gap-3 text-center shadow-lg mt-auto bg-gradient-to-br from-[#12132b] via-[#1e2354]/40 to-[#12132b]">
            <div className="text-4xl animate-bounce select-none">🦌 🐆 🦅</div>
            <div className="text-[10px] tracking-widest text-gray-400 font-bold uppercase">Mascots chính thức</div>
            <div className="text-xs text-yellow-400 font-extrabold">UNITED 2026</div>
            <div className="text-[9px] text-gray-500 font-semibold border-t border-white/5 pt-2 w-full">© FIFA WORLD CUP 2026</div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="premium-bg text-white font-sans flex min-h-screen">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#131424]/90 border-r border-white/10 backdrop-blur-md shrink-0 h-screen sticky top-0 z-10">
        {/* Sidebar Header / Logo */}
        <div 
          onClick={() => {
            setActiveTab('landing')
            setIsMobileMenuOpen(false)
          }}
          className="h-20 flex items-center gap-2.5 px-6 border-b border-white/5 cursor-pointer group"
        >
          <span className="text-2xl transition-transform group-hover:scale-110 select-none">🏆</span>
          <div className="flex flex-col">
            <span className="font-black text-sm uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400 group-hover:brightness-110">
              World Cup 2026
            </span>
            <span className="text-[8px] font-bold text-yellow-400 uppercase tracking-widest">United Tournament</span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 py-6 px-4 flex flex-col gap-1.5">
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
                    ? 'bg-gradient-to-r from-teal-500/20 to-blue-500/20 border border-teal-500/30 text-teal-300 shadow-md shadow-teal-500/5' 
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
                className={`mt-auto mx-4 mb-2 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-xs font-black tracking-wider text-left text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 border border-emerald-500/20 transition-all duration-200 shadow-md shadow-emerald-500/5 cursor-pointer ${isSyncingScores ? 'opacity-50 cursor-not-allowed' : 'animate-pulse-glow'}`}
              >
                <span className="text-base select-none">{isSyncingScores ? '⏳' : '⚡'}</span>
                <span>{isSyncingScores ? 'ĐANG CẬP NHẬT...' : 'CẬP NHẬT TỈ SỐ TỰ ĐỘNG'}</span>
              </button>

              {/* Reset button at the bottom of navigation */}
              <button
                onClick={handleResetAll}
                className="mx-4 mb-2 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-xs font-black tracking-wider text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition-all duration-200 shadow-md shadow-red-500/5 cursor-pointer animate-pulse hover:animate-none"
              >
                <span className="text-base select-none">🔄</span>
                <span>KHÔI PHỤC BAN ĐẦU</span>
              </button>
            </>
          ) : (
            <div className="mt-auto"></div>
          )}

          {/* Switch Mode button */}
          <button
            onClick={() => {
              localStorage.removeItem('wc2026_auth')
              setRole(null)
            }}
            className="mx-4 mb-4 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-xs font-black tracking-wider text-left text-blue-450 hover:text-blue-350 hover:bg-blue-500/10 border border-blue-500/20 transition-all duration-200 shadow-md cursor-pointer"
          >
            <span className="text-base select-none">🔄</span>
            <span>ĐỔI CHẾ ĐỘ TRUY CẬP</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 text-[9px] text-gray-500 font-bold text-center uppercase tracking-wider">
          © FIFA WORLD CUP 2026
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

              {/* Switch Mode button */}
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
          {activeTab === 'landing' && <LandingPage setActiveTab={setActiveTab} />}
          
          {activeTab === 'standings' && (
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 animate-slide-up">
              <div className="mb-8 text-center flex flex-col items-center">
                <h1 className="text-2xl md:text-4xl font-black mb-1 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 uppercase">BẢNG XẾP HẠNG</h1>
                <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">FIFA World Cup 2026 - 12 Bảng đấu</p>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                {calculatedGroups.map((group, gIdx) => (
                  <div key={gIdx} className="glass-card rounded-lg overflow-hidden shadow-xl">
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
                                  <span className="text-base select-none shrink-0">{teamInfo.flag}</span>
                                  {role === 'admin' ? (
                                    <input value={team.name} onChange={(e) => handleTeamStatChange(gIdx, tIdx, 'name', e.target.value)} onBlur={() => handlePersistGroups(groupNames)} className="bg-transparent text-white font-medium w-24 md:w-32 outline-none focus:bg-white/10 px-1 py-1 rounded" />
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
          )}

          {activeTab === 'fixtures' && (
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
                      <div key={groupLetter} className="glass-card rounded-2xl p-4 flex flex-col gap-3">
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
                                  <span className="text-sm shrink-0 select-none">{t1Info.flag}</span>
                                </div>
                                
                                <div className="w-10 text-center py-0.5 px-1 bg-white text-black font-black rounded text-[9px] shadow-sm shrink-0">
                                  {hasScore ? `${match.score1}-${match.score2}` : match.time}
                                </div>
                                
                                <div className="flex items-center gap-1.5 w-[42%] justify-start text-left">
                                  <span className="text-sm shrink-0 select-none">{t2Info.flag}</span>
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
                    <div key={group.dateKey} className="glass-card rounded-2xl p-4 flex flex-col gap-3">
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
                              className={`flex items-center justify-between px-3 py-1.5 rounded-full border ${colorInfo.bg} ${colorInfo.border} shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.03] text-xs font-bold text-white`}
                            >
                              <div className="flex items-center gap-1.5 w-[42%] justify-end text-right">
                                <span className="truncate uppercase text-[9px] tracking-tight" title={match.team1}>
                                  {match.team1}
                                </span>
                                <span className="text-base shrink-0 select-none">{t1Info.flag}</span>
                              </div>

                              <div className="w-8 h-8 rounded-full bg-white text-black font-black flex items-center justify-center text-[9px] shadow-md shrink-0 mx-1 select-none">
                                {hasScore ? `${match.score1}-${match.score2}` : match.time}
                              </div>

                              <div className="flex items-center gap-1.5 w-[42%] justify-start text-left">
                                <span className="text-base shrink-0 select-none">{t2Info.flag}</span>
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
                  <div className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center gap-3 text-center h-full min-h-[180px]">
                    <div className="text-4xl animate-bounce select-none">🦌 🐆 🦅</div>
                    <div className="text-[10px] tracking-widest text-gray-400 font-bold uppercase">Mascots chính thức</div>
                    <div className="text-xs text-yellow-400 font-extrabold">UNITED 2026</div>
                    <div className="text-[9px] text-gray-500 font-semibold border-t border-white/5 pt-2 w-full">© FIFA WORLD CUP 2026</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'knockout' && (
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 animate-slide-up">
              <div className="mb-8 text-center flex flex-col items-center">
                <h1 className="text-2xl md:text-4xl font-black mb-1 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 uppercase">VÒNG KNOCKOUT</h1>
                <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">Nhấp chọn đội chiến thắng để đi tiếp</p>
              </div>
              
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

              <div className="overflow-x-auto pb-8">
                <div className="min-w-[1400px] flex justify-between gap-4 py-4 relative">
                  <div className="flex flex-col justify-around gap-2 w-36">{LAYOUT.col1.map(id => <MatchBox key={id} matchId={id} />)}</div>
                  <div className="flex flex-col justify-around gap-2 w-36 py-8">{LAYOUT.col2.map(id => <MatchBox key={id} matchId={id} />)}</div>
                  <div className="flex flex-col justify-around gap-2 w-36 py-24">{LAYOUT.col3.map(id => <MatchBox key={id} matchId={id} />)}</div>
                  <div className="flex flex-col justify-around gap-2 w-36 py-48">{LAYOUT.col4.map(id => <MatchBox key={id} matchId={id} />)}</div>

                  <div className="flex flex-col justify-center items-center gap-12 w-48 relative">
                    <div className="flex flex-col items-center"><MatchBox matchId="m31" /></div>
                    <div className="text-6xl drop-shadow-[0_0_30px_rgba(250,204,21,0.8)] animate-pulse my-4">🏆</div>
                    <div className="flex flex-col items-center transform scale-110"><div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full"></div><div className="relative z-10"><MatchBox matchId="m32" /></div></div>
                  </div>

                  <div className="flex flex-col justify-around gap-2 w-36 py-48">{LAYOUT.col6.map(id => <MatchBox key={id} matchId={id} />)}</div>
                  <div className="flex flex-col justify-around gap-2 w-36 py-24">{LAYOUT.col7.map(id => <MatchBox key={id} matchId={id} />)}</div>
                  <div className="flex flex-col justify-around gap-2 w-36 py-8">{LAYOUT.col8.map(id => <MatchBox key={id} matchId={id} />)}</div>
                  <div className="flex flex-col justify-around gap-2 w-36">{LAYOUT.col9.map(id => <MatchBox key={id} matchId={id} />)}</div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modern Dialog Modal to view/input Match Scores */}
      {editingMatch && (() => {
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
                <div className="flex items-center justify-between gap-6">
                  <div className="flex flex-col items-center gap-3 w-[42%] text-center">
                    <span className="text-5xl select-none">{(TEAMS_INFO[editingMatch.team1] || { flag: '🏳️' }).flag}</span>
                    <span className="font-extrabold text-sm text-gray-200 uppercase tracking-wide truncate w-full" title={editingMatch.team1}>{editingMatch.team1}</span>
                    {isAdmin ? (
                      <input
                        type="number"
                        min="0"
                        placeholder="-"
                        value={modalScore1}
                        onChange={(e) => setModalScore1(e.target.value)}
                        className="w-16 h-14 bg-black/40 border border-gray-700 rounded-lg text-center text-2xl font-bold text-white outline-none focus:border-green-500 transition-colors"
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
                    <span className="text-5xl select-none">{(TEAMS_INFO[editingMatch.team2] || { flag: '🏳️' }).flag}</span>
                    <span className="font-extrabold text-sm text-gray-200 uppercase tracking-wide truncate w-full" title={editingMatch.team2}>{editingMatch.team2}</span>
                    {isAdmin ? (
                      <input
                        type="number"
                        min="0"
                        placeholder="-"
                        value={modalScore2}
                        onChange={(e) => setModalScore2(e.target.value)}
                        className="w-16 h-14 bg-black/40 border border-gray-700 rounded-lg text-center text-2xl font-bold text-white outline-none focus:border-green-500 transition-colors"
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

                {stadium && (
                  <div className="border-t border-white/5 pt-4 mt-2 flex flex-col gap-1 text-center">
                    <span className="text-xs uppercase font-bold text-gray-400">Sân vận động</span>
                    <span className="text-sm font-extrabold text-yellow-400">{stadium.name}</span>
                    <span className="text-xs text-gray-400 font-medium">{stadium.city}, {stadium.country}</span>
                  </div>
                )}

                <div className="flex gap-3 justify-end mt-2 border-t border-white/5 pt-5">
                  {isAdmin ? (
                    <>
                      <button
                        onClick={() => {
                          handleSaveScore(editingMatch.id, null, null)
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
                          handleSaveScore(editingMatch.id, s1, s2)
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
      })()}
      {role === null && <RoleSelectorModal />}
    </div>
  )
}
