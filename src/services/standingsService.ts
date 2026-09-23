import api from './api';

export interface Standing {
  teamId: number;
  teamName: string;

  played: number;
  won: number;
  draw: number;
  lost: number;

  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;

  points: number;
}

export const standingsAPI = {
  getByTournament: async (
    tournamentId: number,
  ) => {
    const response =
      await api.get<Standing[]>(
        `/standings/${tournamentId}`,
      );

    return response.data;
  },
};