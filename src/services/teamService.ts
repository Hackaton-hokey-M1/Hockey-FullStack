import axios from "axios";

import { ApiTeam } from "@/types/match";

const teamApi = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const teamService = {
  /**
   * Récupère toutes les équipes
   */
  async getAllTeams(): Promise<ApiTeam[]> {
    try {
      const response = await teamApi.get<ApiTeam[]>("/teams");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des équipes:", error);
      throw error;
    }
  },

  /**
   * Récupère une équipe par son ID
   */
  async getTeamById(id: number): Promise<ApiTeam> {
    try {
      const response = await teamApi.get<ApiTeam>(`/teams/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'équipe ${id}:`, error);
      throw error;
    }
  },
};
