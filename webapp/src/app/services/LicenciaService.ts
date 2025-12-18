import axios from 'axios';
import API_URL from '@/config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No se encontró el token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export type Licencia = {
  id: string;
  personaId: string;
  temporada: { id: string; nombre: string; activa: boolean };
  modalidad: { id: string; nombre: string; activa: boolean };
  categoriaBase?: { id: string; nombre: string } | null;
  numeroLicencia?: string | null;
  activa: boolean;
  fechaAlta: string;
  observaciones?: string | null;
  categoriasHabilitadas: { categoriaId: string; nombre: string; fechaAlta: string }[];
};

export type LicenciaUpsert = {
  personaId: string;
  temporadaId: string;
  modalidadId: string;
  categoriaBaseId?: string | null;
  numeroLicencia?: string | null;
  activa: boolean;
  observaciones?: string | null;
};

const getLicenciasByPersona = async (personaId: string): Promise<Licencia[]> => {
  const response = await axios.get(`${API_URL}/Licencias/persona/${personaId}`, getAuthHeaders());
  return response.data;
};

const upsertLicencia = async (data: LicenciaUpsert) => {
  const response = await axios.post(`${API_URL}/Licencias`, data, getAuthHeaders());
  return response.data;
};

const setHabilitaciones = async (licenciaId: string, categoriaIds: string[]) => {
  const response = await axios.post(
    `${API_URL}/Licencias/${licenciaId}/habilitaciones`,
    { categoriaIds },
    getAuthHeaders()
  );
  return response.data;
};

export default { getLicenciasByPersona, upsertLicencia, setHabilitaciones };


