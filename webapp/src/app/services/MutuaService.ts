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

export type MutuaPendiente = {
  inscripcionId: string;
  personaId: string;
  nombre: string;
  apellidos: string;
  documento: string;
  fechaNacimiento: string;
  tipo: number;
  categoria: string;
  equipo: string;
  club: string;
  competicion: string;
  competicionFederada: boolean;
  mutuaSolicitadaPorClub: boolean;
  fechaSolicitud?: string | null;
  checkDefaultEnviar: boolean;
};

export type EnvioMutuaResumen = {
  envioId: string;
  fechaEnvioMutua: string;
  totalItems: number;
};

const getPendientes = async (): Promise<MutuaPendiente[]> => {
  const response = await axios.get(`${API_URL}/Mutua/pendientes`, getAuthHeaders());
  return response.data;
};

const enviarMutua = async (inscripcionIds: string[]) => {
  const response = await axios.post(
    `${API_URL}/Mutua/enviar`,
    { inscripcionIds },
    { ...getAuthHeaders(), responseType: 'blob' }
  );
  return response;
};

const getEnvios = async (): Promise<EnvioMutuaResumen[]> => {
  const response = await axios.get(`${API_URL}/Mutua/envios`, getAuthHeaders());
  return response.data;
};

const descargarEnvioExcel = async (envioId: string) => {
  const response = await axios.get(`${API_URL}/Mutua/envios/${envioId}/excel`, {
    ...getAuthHeaders(),
    responseType: 'blob',
  });
  return response;
};

export default { getPendientes, enviarMutua, getEnvios, descargarEnvioExcel };


