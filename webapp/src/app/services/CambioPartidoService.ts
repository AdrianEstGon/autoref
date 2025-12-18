import axios from 'axios';
import API_URL from '@/config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No se encontró el token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export type CambioPartido = {
  id: string;
  partidoId: string;
  clubSolicitanteId: string;
  clubReceptorId: string;
  fechaSolicitudUtc: string;
  estado: number;
  aceptadoPorClub?: boolean | null;
  aprobadoPorFederacion?: boolean | null;
  fechaRespuestaClubUtc?: string | null;
  fechaValidacionFederacionUtc?: string | null;
  motivo?: string | null;
  fechaOriginal: string;
  horaOriginal: string;
  lugarOriginal?: { id: string; nombre: string } | null;
  fechaPropuesta: string;
  horaPropuesta: string;
  lugarPropuesto?: { id: string; nombre: string } | null;
};

const getByPartido = async (partidoId: string): Promise<CambioPartido[]> => {
  const res = await axios.get(`${API_URL}/CambiosPartido/partido/${partidoId}`, getAuthHeaders());
  return res.data;
};

const crear = async (partidoId: string, payload: { fechaPropuesta: string; horaPropuesta: string; lugarPropuestoId: string | null; motivo?: string | null }) => {
  const res = await axios.post(
    `${API_URL}/CambiosPartido/partido/${partidoId}`,
    {
      fechaPropuesta: payload.fechaPropuesta,
      horaPropuesta: payload.horaPropuesta,
      lugarPropuestoId: payload.lugarPropuestoId,
      motivo: payload.motivo ?? null,
    },
    getAuthHeaders()
  );
  return res.data;
};

const responderClub = async (cambioId: string, aceptar: boolean) => {
  const res = await axios.post(`${API_URL}/CambiosPartido/${cambioId}/respuesta-club`, { aceptar }, getAuthHeaders());
  return res.data;
};

const pendientesValidacion = async () => {
  const res = await axios.get(`${API_URL}/CambiosPartido/pendientes-validacion`, getAuthHeaders());
  return res.data;
};

const validarFederacion = async (cambioId: string, aprobar: boolean) => {
  const res = await axios.post(`${API_URL}/CambiosPartido/${cambioId}/validacion`, { aprobar }, getAuthHeaders());
  return res.data;
};

export default { getByPartido, crear, responderClub, pendientesValidacion, validarFederacion };


