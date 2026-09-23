import api from './api';

export interface Team {
  id: number;
  teamName: string;
  playerName: string;
  phone?: string;
  logo?: string;
  tournament?: {
    id: number;
    name: string;
  };
}

export interface CreateTeamData {
  teamName: string;
  playerName: string;
  phone?: string;
  logo?: string;
  tournamentId: number;
}

export const teamAPI = {
  getAll: async () => {
    const response = await api.get<Team[]>('/teams');
    return response.data;
  },

  getOne: async (id: number) => {
    const response = await api.get<Team>(`/teams/${id}`);
    return response.data;
  },

  create: async (data: CreateTeamData) => {
    const response = await api.post<Team>('/teams', data);
    return response.data;
  },
};