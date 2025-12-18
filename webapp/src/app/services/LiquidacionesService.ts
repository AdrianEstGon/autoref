import axios from 'axios';
import API_URL from '@/config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No se encontró el token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export type LiquidacionItem = {
  id?: string;
  tipo: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  km?: number | null;
  importe?: number;
};

export type Liquidacion = {
  id: string;
  fecha: string;
  tipo: string;
  estado: string;
  total: number;
  observaciones?: string | null;
  partidoId?: string | null;
  motivoRechazo?: string | null;
  items: LiquidacionItem[];
};

const getMis = async () => {
  const res = await axios.get(`${API_URL}/Liquidaciones/mis`, getAuthHeaders());
  return res.data as Liquidacion[];
};

const create = async (data: {
  partidoId?: string | null;
  tipo: number; // 0 PorPartido, 1 PorDia
  fecha: string;
  observaciones?: string | null;
  items: { tipo: number; descripcion: string; cantidad: number; precioUnitario: number; km?: number | null }[];
}) => {
  const res = await axios.post(`${API_URL}/Liquidaciones`, data, getAuthHeaders());
  return res.data;
};

const update = async (
  id: string,
  data: {
    partidoId?: string | null;
    tipo: number;
    fecha: string;
    observaciones?: string | null;
    items: { tipo: number; descripcion: string; cantidad: number; precioUnitario: number; km?: number | null }[];
  }
) => {
  const res = await axios.put(`${API_URL}/Liquidaciones/${id}`, data, getAuthHeaders());
  return res.data;
};

const enviar = async (id: string) => {
  const res = await axios.post(`${API_URL}/Liquidaciones/${id}/enviar`, {}, getAuthHeaders());
  return res.data;
};

const pendientes = async () => {
  const res = await axios.get(`${API_URL}/Liquidaciones/pendientes`, getAuthHeaders());
  return res.data as any[];
};

const resolver = async (id: string, data: { aprobar: boolean; motivoRechazo?: string | null }) => {
  const res = await axios.post(`${API_URL}/Liquidaciones/${id}/resolver`, data, getAuthHeaders());
  return res.data;
};

export default { getMis, create, update, enviar, pendientes, resolver };


