import axios from 'axios';
import API_URL from '@/config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No se encontró el token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export type CompeticionCategoriaConfig = {
  categoriaId: string;
  categoriaNombre?: string;
  activa: boolean;
  inscripcionDesde?: string | null;
  inscripcionHasta?: string | null;
  cuota?: number | null;
  horarioLocalDesde?: string | null;
  horarioLocalHasta?: string | null;
};

export type CompeticionReglas = {
  puntosVictoria: number;
  puntosEmpate: number;
  puntosDerrota: number;
  ordenDesempate: string[];
};

export type GenerarCalendarioRequest = {
  categoriaId: string;
  fechaInicio: string; // yyyy-mm-dd
  diasEntreJornadas: number;
  hora: string; // HH:mm
  dobleVuelta: boolean;
};

const getCategoriasConfig = async (competicionId: string): Promise<CompeticionCategoriaConfig[]> => {
  const response = await axios.get(`${API_URL}/Competiciones/${competicionId}/categorias`, getAuthHeaders());
  return response.data;
};

const setCategoriasConfig = async (competicionId: string, items: CompeticionCategoriaConfig[]) => {
  const response = await axios.put(
    `${API_URL}/Competiciones/${competicionId}/categorias`,
    { items: items.map((x) => ({
      categoriaId: x.categoriaId,
      activa: x.activa,
      inscripcionDesde: x.inscripcionDesde ? new Date(x.inscripcionDesde).toISOString() : null,
      inscripcionHasta: x.inscripcionHasta ? new Date(x.inscripcionHasta).toISOString() : null,
      cuota: x.cuota ?? null,
      horarioLocalDesde: x.horarioLocalDesde ? new Date(x.horarioLocalDesde).toISOString() : null,
      horarioLocalHasta: x.horarioLocalHasta ? new Date(x.horarioLocalHasta).toISOString() : null,
    })) },
    getAuthHeaders()
  );
  return response.data;
};

const getReglas = async (competicionId: string): Promise<CompeticionReglas> => {
  const response = await axios.get(`${API_URL}/Competiciones/${competicionId}/reglas`, getAuthHeaders());
  return response.data;
};

const setReglas = async (competicionId: string, reglas: CompeticionReglas) => {
  const response = await axios.put(`${API_URL}/Competiciones/${competicionId}/reglas`, reglas, getAuthHeaders());
  return response.data;
};

const generarCalendario = async (competicionId: string, req: GenerarCalendarioRequest) => {
  const response = await axios.post(`${API_URL}/Competiciones/${competicionId}/generar-calendario`, req, getAuthHeaders());
  return response.data;
};

export default { getCategoriasConfig, setCategoriasConfig, getReglas, setReglas, generarCalendario };


