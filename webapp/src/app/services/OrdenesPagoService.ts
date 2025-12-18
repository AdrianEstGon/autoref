import axios from 'axios';
import API_URL from '@/config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No se encontró el token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

const getFilenameFromDisposition = (disposition?: string | null) => {
  if (!disposition) return null;
  const match = /filename\*?=(?:UTF-8'')?\"?([^\";]+)\"?/i.exec(disposition);
  return match?.[1] || null;
};

export type OrdenPago = {
  id: string;
  estado: string;
  periodoDesde: string;
  periodoHasta: string;
  referencia?: string | null;
  total: number;
  totalLiquidaciones: number;
};

const getOrdenes = async (): Promise<OrdenPago[]> => {
  const res = await axios.get(`${API_URL}/OrdenesPago`, getAuthHeaders());
  return res.data;
};

const generar = async (data: { periodoDesde: string; periodoHasta: string; referencia?: string | null }) => {
  const res = await axios.post(`${API_URL}/OrdenesPago/generar`, data, getAuthHeaders());
  return res.data;
};

const exportSepa = async (ordenId: string) => {
  const res = await axios.get(`${API_URL}/OrdenesPago/${ordenId}/sepa`, {
    ...getAuthHeaders(),
    responseType: 'blob',
  });
  const filename =
    getFilenameFromDisposition(res.headers?.['content-disposition'] as string | undefined) || `SEPA_OrdenPago_${ordenId}.xml`;
  downloadBlob(res.data, filename);
};

export default { getOrdenes, generar, exportSepa };


