import api from './api';

export interface Tournament {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface CreateTournamentData {
  name: string;
  startDate: string;
  endDate: string;
}

export const tournamentAPI = {
  getAll: async () => {
    const response = await api.get<Tournament[]>('/tournaments');
    return response.data;
  },

  getOne: async (id: number) => {
    const response = await api.get<Tournament>(`/tournaments/${id}`);
    return response.data;
  },

  create: async (data: CreateTournamentData) => {
    const response = await api.post<Tournament>('/tournaments', data);
    return response.data;
  },
};