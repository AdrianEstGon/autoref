import axios from 'axios';
import API_URL from '@/config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No se encontró el token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export type Competicion = {
  id: string;
  nombre: string;
  esFederada: boolean;
  activa: boolean;
};

const getCompeticiones = async (): Promise<Competicion[]> => {
  const response = await axios.get(`${API_URL}/Competiciones`, getAuthHeaders());
  return response.data;
};

const createCompeticion = async (data: { nombre: string; esFederada: boolean; activa: boolean }) => {
  const response = await axios.post(`${API_URL}/Competiciones`, data, getAuthHeaders());
  return response.data;
};

const updateCompeticion = async (
  id: string,
  data: { nombre: string; esFederada: boolean; activa: boolean }
) => {
  const response = await axios.put(`${API_URL}/Competiciones/${id}`, data, getAuthHeaders());
  return response.data;
};

const deleteCompeticion = async (id: string) => {
  const response = await axios.delete(`${API_URL}/Competiciones/${id}`, getAuthHeaders());
  return response.data;
};

export default { getCompeticiones, createCompeticion, updateCompeticion, deleteCompeticion };


