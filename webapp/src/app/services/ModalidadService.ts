import axios from 'axios';
import API_URL from '@/config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No se encontró el token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export type Modalidad = {
  id: string;
  nombre: string;
  activa: boolean;
};

export type ModalidadUpsert = {
  nombre: string;
  activa: boolean;
};

const getModalidades = async (): Promise<Modalidad[]> => {
  const response = await axios.get(`${API_URL}/Modalidades`, getAuthHeaders());
  return response.data;
};

const createModalidad = async (data: ModalidadUpsert) => {
  const response = await axios.post(`${API_URL}/Modalidades`, data, getAuthHeaders());
  return response.data;
};

const updateModalidad = async (id: string, data: ModalidadUpsert) => {
  const response = await axios.put(`${API_URL}/Modalidades/${id}`, data, getAuthHeaders());
  return response.data;
};

const deleteModalidad = async (id: string) => {
  const response = await axios.delete(`${API_URL}/Modalidades/${id}`, getAuthHeaders());
  return response.data;
};

export default { getModalidades, createModalidad, updateModalidad, deleteModalidad };


