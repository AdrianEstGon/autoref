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

export type Inscripcion = {
  id: string;
  persona: {
    id: string;
    nombre: string;
    apellidos: string;
    documento: string;
    fechaNacimiento: string;
    tipo: number;
    mutuaEnviada: boolean;
    fechaEnvioMutua?: string | null;
  };
  mutuaSolicitada: boolean;
  fechaSolicitud?: string | null;
  fechaInscripcion: string;
  equipo: {
    id: string;
    nombre: string;
    club: string;
    categoria: string;
  };
  competicion: {
    id: string;
    nombre: string;
    esFederada: boolean;
  };
};

const getMisInscripciones = async (): Promise<Inscripcion[]> => {
  const response = await axios.get(`${API_URL}/Inscripciones/mis`, getAuthHeaders());
  return response.data;
};

const createInscripcion = async (data: {
  nombre: string;
  apellidos: string;
  documento: string;
  fechaNacimiento: string;
  tipo: number;
  equipoId: string;
  competicionId: string;
  mutuaSolicitada: boolean;
}) => {
  const response = await axios.post(`${API_URL}/Inscripciones`, data, getAuthHeaders());
  return response.data;
};

const updateInscripcion = async (id: string, data: { mutuaSolicitada: boolean }) => {
  const response = await axios.put(`${API_URL}/Inscripciones/${id}`, data, getAuthHeaders());
  return response.data;
};

export default { getMisInscripciones, createInscripcion, updateInscripcion };


