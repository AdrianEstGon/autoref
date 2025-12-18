import axios from 'axios';
import API_URL from '@/config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No se encontró el token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export type ActaSet = { local: number; visitante: number };
export type ActaIncidencia = { tipo: string; momento?: string | null; descripcion: string };

export type ActaUpsert = {
  participantesLocal: string[];
  participantesVisitante: string[];
  sets: ActaSet[];
  incidencias: ActaIncidencia[];
  observaciones?: string | null;
  resultadoLocal?: number | null;
  resultadoVisitante?: number | null;
};

export type RosterPersona = {
  personaId: string;
  nombre: string;
  apellidos: string;
  documento: string;
  tipo: string;
};

export type ActaDto = {
  partidoId: string;
  cerrado: boolean;
  fechaCierreUtc?: string | null;
  resultadoLocal?: number | null;
  resultadoVisitante?: number | null;
  partido: any;
  rosterLocal: RosterPersona[];
  rosterVisitante: RosterPersona[];
  acta: ActaUpsert;
};

const get = async (partidoId: string): Promise<ActaDto> => {
  const res = await axios.get(`${API_URL}/ActasPartido/${partidoId}`, getAuthHeaders());
  return res.data;
};

const save = async (partidoId: string, model: ActaUpsert) => {
  const res = await axios.put(`${API_URL}/ActasPartido/${partidoId}`, model, getAuthHeaders());
  return res.data;
};

const cerrar = async (partidoId: string, model: ActaUpsert) => {
  const res = await axios.post(`${API_URL}/ActasPartido/${partidoId}/cerrar`, model, getAuthHeaders());
  return res.data;
};

const informeUrl = (partidoId: string) => `${API_URL}/ActasPartido/${partidoId}/informe`;

export default { get, save, cerrar, informeUrl };


