import axios from 'axios';
import API_URL from '@/config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No se encontró el token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export type Factura = {
  id: string;
  numero: string;
  club: { id: string; nombre: string };
  fechaEmision: string;
  fechaVencimiento: string;
  estado: string;
  baseImponible: number;
  iva: number;
  total: number;
  referenciaPago?: string | null;
};

const getFacturas = async (): Promise<Factura[]> => {
  const res = await axios.get(`${API_URL}/Facturas`, getAuthHeaders());
  return res.data;
};

const createFactura = async (data: {
  clubId: string;
  fechaEmision: string;
  fechaVencimiento: string;
  observaciones?: string | null;
  lineas: { concepto: string; cantidad: number; precioUnitario: number; ivaPorcentaje: number }[];
}) => {
  const res = await axios.post(`${API_URL}/Facturas`, data, getAuthHeaders());
  return res.data;
};

const marcarPagada = async (id: string, referenciaPago?: string | null) => {
  const res = await axios.post(`${API_URL}/Facturas/${id}/marcar-pagada`, { referenciaPago: referenciaPago || null }, getAuthHeaders());
  return res.data;
};

const abrirHtml = async (id: string) => {
  const res = await axios.get(`${API_URL}/Facturas/${id}/html`, { ...getAuthHeaders(), responseType: 'text' });
  const w = window.open('', '_blank');
  if (!w) throw new Error('No se pudo abrir la ventana');
  w.document.open();
  w.document.write(res.data);
  w.document.close();
};

export default { getFacturas, createFactura, marcarPagada, abrirHtml };


