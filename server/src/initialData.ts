export interface Team {
  name: string
  played: number
  won: number
  drawn: number
  lost: number
  gf: number
  ga: number
  form: string[]
}

export interface GroupMatch {
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
  homePenalty?: number | null
  awayPenalty?: number | null
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

export const initialGroups: Team[][] = [
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

export const initialGroupMatches: GroupMatch[] = [
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

export const initialR32Teams: { [k: string]: string } = {
  m1_t1: 'Nhì Bảng A', m1_t2: 'Nhì Bảng B',
  m2_t1: 'Nhất Bảng E', m2_t2: 'Hạng 3 A/B/C/D/F',
  m3_t1: 'Nhất Bảng F', m3_t2: 'Nhì Bảng C',
  m4_t1: 'Nhất Bảng C', m4_t2: 'Nhì Bảng F',
  m5_t1: 'Nhất Bảng I', m5_t2: 'Hạng 3 C/D/F/G/H',
  m6_t1: 'Nhì Bảng E', m6_t2: 'Nhì Bảng I',
  m7_t1: 'Nhất Bảng A', m7_t2: 'Hạng 3 C/E/F/H/I',
  m8_t1: 'Nhất Bảng G', m8_t2: 'Hạng 3 A/E/H/I/J',
  
  m9_t1: 'Nhất Bảng D', m9_t2: 'Hạng 3 B/E/F/I/J',
  m10_t1: 'Nhất Bảng L', m10_t2: 'Hạng 3 E/H/I/J/K',
  m11_t1: 'Nhì Bảng K', m11_t2: 'Nhì Bảng L',
  m12_t1: 'Nhất Bảng H', m12_t2: 'Nhì Bảng J',
  m13_t1: 'Nhất Bảng B', m13_t2: 'Hạng 3 E/F/G/I/J',
  m14_t1: 'Nhất Bảng J', m14_t2: 'Nhì Bảng H',
  m15_t1: 'Nhất Bảng K', m15_t2: 'Hạng 3 D/E/I/J/L',
  m16_t1: 'Nhì Bảng D', m16_t2: 'Nhì Bảng G',
}

export const initialKnockoutMatches: GroupMatch[] = [
  { id: 'm1', dayOfWeek: 'Thứ 2', date: '29/6/2026', team1: 'South Africa', team2: 'Canada', time: '02h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '16' },
  { id: 'm2', dayOfWeek: 'Thứ 3', date: '30/6/2026', team1: 'Germany', team2: 'Paraguay', time: '03h30', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '9' },
  { id: 'm3', dayOfWeek: 'Thứ 3', date: '30/6/2026', team1: 'Netherlands', team2: 'Morocco', time: '08h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '3' },
  { id: 'm4', dayOfWeek: 'Thứ 3', date: '30/6/2026', team1: 'Brazil', team2: 'Japan', time: '00h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '5' },
  { id: 'm5', dayOfWeek: 'Thứ 4', date: '1/7/2026', team1: 'France', team2: '3rd Group C/D/F/G/H', time: '04h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '11' },
  { id: 'm6', dayOfWeek: 'Thứ 4', date: '1/7/2026', team1: 'Ivory Coast', team2: 'Norway', time: '00h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '4' },
  { id: 'm7', dayOfWeek: 'Thứ 4', date: '1/7/2026', team1: 'Mexico', team2: '3rd Group C/E/F/H/I', time: '08h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '1' },
  { id: 'm8', dayOfWeek: 'Thứ 5', date: '2/7/2026', team1: 'Belgium', team2: 'Senegal', time: '02h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '14' },
  { id: 'm9', dayOfWeek: 'Thứ 5', date: '2/7/2026', team1: 'United States', team2: 'Bosnia and Herzegovina', time: '07h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '15' },
  { id: 'm10', dayOfWeek: 'Thứ 5', date: '2/7/2026', team1: 'England', team2: 'DR Congo', time: '00h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '7' },
  { id: 'm11', dayOfWeek: 'Thứ 6', date: '3/7/2026', team1: 'Runner-up Group K', team2: 'Runner-up Group L', time: '06h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '12' },
  { id: 'm12', dayOfWeek: 'Thứ 6', date: '3/7/2026', team1: 'Winner Group H', team2: 'Runner-up Group J', time: '02h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '16' },
  { id: 'm13', dayOfWeek: 'Thứ 6', date: '3/7/2026', team1: 'Switzerland', team2: '3rd Group E/F/G/I/J', time: '10h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '13' },
  { id: 'm14', dayOfWeek: 'Thứ 7', date: '4/7/2026', team1: 'Argentina', team2: 'Cape Verde', time: '05h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '8' },
  { id: 'm15', dayOfWeek: 'Thứ 7', date: '4/7/2026', team1: 'Colombia', team2: 'Ghana', time: '08h30', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '6' },
  { id: 'm16', dayOfWeek: 'Thứ 7', date: '4/7/2026', team1: 'Australia', team2: 'Egypt', time: '01h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '4' },
  { id: 'm17', dayOfWeek: 'Chủ nhật', date: '5/7/2026', team1: 'Winner Match 74', team2: 'Winner Match 77', time: '04h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '10' },
  { id: 'm18', dayOfWeek: 'Chủ nhật', date: '5/7/2026', team1: 'Winner Match 73', team2: 'Winner Match 75', time: '00h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '5' },
  { id: 'm19', dayOfWeek: 'Thứ 2', date: '6/7/2026', team1: 'Winner Match 76', team2: 'Winner Match 78', time: '03h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '11' },
  { id: 'm20', dayOfWeek: 'Thứ 2', date: '6/7/2026', team1: 'Winner Match 79', team2: 'Winner Match 80', time: '07h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '1' },
  { id: 'm21', dayOfWeek: 'Thứ 3', date: '7/7/2026', team1: 'Winner Match 83', team2: 'Winner Match 84', time: '02h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '4' },
  { id: 'm22', dayOfWeek: 'Thứ 3', date: '7/7/2026', team1: 'Winner Match 81', team2: 'Winner Match 82', time: '07h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '14' },
  { id: 'm23', dayOfWeek: 'Thứ 3', date: '7/7/2026', team1: 'Winner Match 86', team2: 'Winner Match 88', time: '23h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '7' },
  { id: 'm24', dayOfWeek: 'Thứ 4', date: '8/7/2026', team1: 'Winner Match 85', team2: 'Winner Match 87', time: '03h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '13' },
  { id: 'm25', dayOfWeek: 'Thứ 6', date: '10/7/2026', team1: 'Winner Match 89', team2: 'Winner Match 90', time: '03h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '9' },
  { id: 'm26', dayOfWeek: 'Chủ nhật', date: '12/7/2026', team1: 'Winner Match 91', team2: 'Winner Match 92', time: '04h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '8' },
  { id: 'm27', dayOfWeek: 'Thứ 7', date: '11/7/2026', team1: 'Winner Match 93', team2: 'Winner Match 94', time: '02h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '16' },
  { id: 'm28', dayOfWeek: 'Chủ nhật', date: '12/7/2026', team1: 'Winner Match 95', team2: 'Winner Match 96', time: '08h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '6' },
  { id: 'm29', dayOfWeek: 'Thứ 4', date: '15/7/2026', team1: 'Winner Match 97', team2: 'Winner Match 98', time: '02h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '4' },
  { id: 'm30', dayOfWeek: 'Thứ 5', date: '16/7/2026', team1: 'Winner Match 99', team2: 'Winner Match 100', time: '02h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '7' },
  { id: 'm31', dayOfWeek: 'Chủ nhật', date: '19/7/2026', team1: 'Loser Match 101', team2: 'Loser Match 102', time: '04h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '8' },
  { id: 'm32', dayOfWeek: 'Thứ 2', date: '20/7/2026', team1: 'Winner Match 101', team2: 'Winner Match 102', time: '02h00', score1: null, score2: null, homeScorers: null, awayScorers: null, stadiumId: '11' },
]

