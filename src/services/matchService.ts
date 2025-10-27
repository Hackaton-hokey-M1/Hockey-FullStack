import axios from "axios";

import { ApiMatch, ApiTeam, Match, Team } from "@/types/match";

import { teamService } from "./teamService";

const matchApi = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Détermine le statut d'un match basé sur sa date
 */
const getMatchStatus = (
  playedAt: string
): "scheduled" | "live" | "finished" => {
  const matchDate = new Date(playedAt);
  const now = new Date();
  const diffInHours = (now.getTime() - matchDate.getTime()) / (1000 * 60 * 60);

  // Si le match est dans le futur
  if (diffInHours < 0) {
    return "scheduled";
  }
  // Si le match est en cours (moins de 3 heures depuis le début)
  if (diffInHours < 3) {
    return "live";
  }
  // Sinon le match est terminé
  return "finished";
};

/**
 * Convertit une ApiTeam en Team pour l'UI
 */
const mapApiTeamToTeam = (apiTeam: ApiTeam): Team => ({
  id: apiTeam.id.toString(),
  name: apiTeam.name,
  shortName:
    apiTeam.name.length > 15
      ? apiTeam.name.substring(0, 12) + "..."
      : undefined,
});

/**
 * Convertit un ApiMatch en Match pour l'UI
 */
const mapApiMatchToMatch = (
  apiMatch: ApiMatch,
  teams: Map<number, ApiTeam>
): Match | null => {
  const homeTeam = teams.get(apiMatch.home_team_id);
  const awayTeam = teams.get(apiMatch.away_team_id);

  if (!homeTeam || !awayTeam) {
    console.warn(`Équipes manquantes pour le match ${apiMatch.id}`);
    return null;
  }

  return {
    id: apiMatch.id.toString(),
    homeTeam: mapApiTeamToTeam(homeTeam),
    awayTeam: mapApiTeamToTeam(awayTeam),
    homeScore: apiMatch.home_score,
    awayScore: apiMatch.away_score,
    date: apiMatch.played_at,
    status: getMatchStatus(apiMatch.played_at),
    tournament: {
      id: apiMatch.tournament_id.toString(),
      name: `Tournoi ${apiMatch.tournament_id}`,
    },
  };
};

export const matchService = {
  /**
   * Récupère tous les matchs enrichis avec les données des équipes
   */
  async getAllMatches(): Promise<Match[]> {
    try {
      // Récupérer les matchs et les équipes en parallèle
      const [matchesResponse, teams] = await Promise.all([
        matchApi.get<ApiMatch[]>("/matches"),
        teamService.getAllTeams(),
      ]);

      // Créer une map des équipes pour un accès rapide
      const teamsMap = new Map<number, ApiTeam>();
      teams.forEach((team) => teamsMap.set(team.id, team));

      // Mapper les matchs API vers notre modèle UI
      const matches = matchesResponse.data
        .map((apiMatch) => mapApiMatchToMatch(apiMatch, teamsMap))
        .filter((match): match is Match => match !== null);

      // Trier par date (plus récent en premier)
      matches.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      return matches;
    } catch (error) {
      console.error("Erreur lors de la récupération des matchs:", error);
      throw error;
    }
  },

  /**
   * Récupère un match spécifique par son ID
   */
  async getMatchById(id: number): Promise<Match | null> {
    try {
      const [matchResponse, teams] = await Promise.all([
        matchApi.get<ApiMatch>(`/matches/${id}`),
        teamService.getAllTeams(),
      ]);

      const teamsMap = new Map<number, ApiTeam>();
      teams.forEach((team) => teamsMap.set(team.id, team));

      return mapApiMatchToMatch(matchResponse.data, teamsMap);
    } catch (error) {
      console.error(`Erreur lors de la récupération du match ${id}:`, error);
      throw error;
    }
  },

  /**
   * Récupère les matchs d'un tournoi
   */
  async getMatchesByTournament(tournamentId: number): Promise<Match[]> {
    try {
      const [matchesResponse, teams] = await Promise.all([
        matchApi.get<ApiMatch[]>(`/matches/tournament/${tournamentId}`),
        teamService.getAllTeams(),
      ]);

      const teamsMap = new Map<number, ApiTeam>();
      teams.forEach((team) => teamsMap.set(team.id, team));

      const matches = matchesResponse.data
        .map((apiMatch) => mapApiMatchToMatch(apiMatch, teamsMap))
        .filter((match): match is Match => match !== null);

      matches.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      return matches;
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des matchs du tournoi ${tournamentId}:`,
        error
      );
      throw error;
    }
  },
};
