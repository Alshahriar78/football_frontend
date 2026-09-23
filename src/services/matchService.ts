import api from './api';

export interface MatchTeam {
  id: number;
  teamName: string;
  playerName: string;
  logo?: string;
}

export interface Match {
  id: number;
  tournament: {
    id: number;
    name: string;
  };
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
  homeScore: number;
  awayScore: number;
  matchDate: string;
  venue?: string;
  round: number;
  status: string;
}

export interface CreateMatchData {
  tournamentId: number;
  homeTeamId: number;
  awayTeamId: number;
  matchDate: string;
  venue?: string;
  round: number;
}

export interface UpdateResultData {
  homeScore: number;
  awayScore: number;
}

export const matchAPI = {
  getAll: async () => {
    const response = await api.get<Match[]>('/matches');
    return response.data;
  },

  getOne: async (id: number) => {
    const response = await api.get<Match>(`/matches/${id}`);
    return response.data;
  },

  create: async (data: CreateMatchData) => {
    const response = await api.post<Match>('/matches', data);
    return response.data;
  },

  updateResult: async (id: number, data: UpdateResultData) => {
    const response = await api.patch<Match>(
      `/matches/${id}/result`,
      data,
    );

    return response.data;
  },
};