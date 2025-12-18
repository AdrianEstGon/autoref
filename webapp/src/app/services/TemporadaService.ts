import axios from 'axios';
import API_URL from '@/config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No se encontró el token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export type Temporada = {
  id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  activa: boolean;
};

export type TemporadaUpsert = {
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  activa: boolean;
};

const getTemporadas = async (): Promise<Temporada[]> => {
  const response = await axios.get(`${API_URL}/Temporadas`, getAuthHeaders());
  return response.data;
};

const createTemporada = async (data: TemporadaUpsert) => {
  const response = await axios.post(`${API_URL}/Temporadas`, data, getAuthHeaders());
  return response.data;
};

const updateTemporada = async (id: string, data: TemporadaUpsert) => {
  const response = await axios.put(`${API_URL}/Temporadas/${id}`, data, getAuthHeaders());
  return response.data;
};

const deleteTemporada = async (id: string) => {
  const response = await axios.delete(`${API_URL}/Temporadas/${id}`, getAuthHeaders());
  return response.data;
};

export default { getTemporadas, createTemporada, updateTemporada, deleteTemporada };


