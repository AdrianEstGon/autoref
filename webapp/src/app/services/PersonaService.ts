import axios from 'axios';
import API_URL from '@/config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No se encontró el token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export type Persona = {
  id: string;
  nombre: string;
  apellidos: string;
  documento: string;
  fechaNacimiento: string;
  tipo: number;
  email?: string | null;
  telefono?: string | null;
  direccion?: string | null;
  codigoPostal?: string | null;
  provincia?: string | null;
  ciudad?: string | null;
  mutuaEnviada?: boolean;
  fechaEnvioMutua?: string | null;
};

export type PersonaUpsert = {
  documento: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  tipo: number;
  email?: string | null;
  telefono?: string | null;
  direccion?: string | null;
  codigoPostal?: string | null;
  provincia?: string | null;
  ciudad?: string | null;
};

const getPersonas = async (q?: string): Promise<Persona[]> => {
  const response = await axios.get(`${API_URL}/Personas`, {
    ...getAuthHeaders(),
    params: q ? { q } : undefined,
  });
  return response.data;
};

const getMisPersonas = async (): Promise<Persona[]> => {
  const response = await axios.get(`${API_URL}/Personas/mis`, getAuthHeaders());
  return response.data;
};

const upsertPersona = async (data: PersonaUpsert) => {
  const response = await axios.post(`${API_URL}/Personas`, data, getAuthHeaders());
  return response.data;
};

export default { getPersonas, getMisPersonas, upsertPersona };


