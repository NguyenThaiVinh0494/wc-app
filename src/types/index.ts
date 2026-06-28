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
}

export interface GroupedMatches {
  dateKey: string
  dayOfWeek: string
  date: string
  matches: GroupMatch[]
}
