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

const descargarAutorizacionExcel = async (inscripcionId: string) => {
  const response = await axios.get(`${API_URL}/Documentos/autorizacion/${inscripcionId}/excel`, {
    ...getAuthHeaders(),
    responseType: 'blob',
  });

  const disposition = response.headers['content-disposition'] as string | undefined;
  const match = disposition?.match(/filename="?([^"]+)"?/i);
  const filename = match?.[1] ?? `Autorizacion_${inscripcionId}.xlsx`;
  downloadBlob(response.data, filename);
};

const descargarLicenciaExcel = async (licenciaId: string) => {
  const response = await axios.get(`${API_URL}/Documentos/licencia/${licenciaId}/excel`, {
    ...getAuthHeaders(),
    responseType: 'blob',
  });

  const disposition = response.headers['content-disposition'] as string | undefined;
  const match = disposition?.match(/filename="?([^"]+)"?/i);
  const filename = match?.[1] ?? `Licencia_${licenciaId}.xlsx`;
  downloadBlob(response.data, filename);
};

export default { descargarAutorizacionExcel, descargarLicenciaExcel };
