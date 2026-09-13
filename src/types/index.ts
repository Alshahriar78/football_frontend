export interface Team {
  id: number;
  name: string;
  logo: string;
  founded: number;
  stadium: string;
  city: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface Match {
  id: number;
  matchDate: string;
  status: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore?: number;
  awayScore?: number;
  venue: string;
  round: number;
}

export interface Player {
  id: number;
  name: string;
  position: string;
  age: number;
  team: Team;
}