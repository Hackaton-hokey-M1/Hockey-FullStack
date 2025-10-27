// Types pour l'API (format snake_case)
export interface ApiTeam {
  id: number;
  name: string;
}

export interface ApiMatch {
  id: number;
  home_team_id: number;
  away_team_id: number;
  home_score: number;
  away_score: number;
  tournament_id: number;
  played_at: string;
}

// Types pour l'interface utilisateur (format camelCase)
export interface Team {
  id: string;
  name: string;
  logo?: string;
  shortName?: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  date: string;
  status: "scheduled" | "live" | "finished" | "postponed";
  tournament?: {
    id: string;
    name: string;
  };
  venue?: string;
  round?: string;
}

export interface MatchesResponse {
  matches: Match[];
  total?: number;
}
