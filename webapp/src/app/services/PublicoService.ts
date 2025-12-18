import axios from 'axios';
import API_URL from '@/config';

// Endpoints públicos (sin auth)
const getCompeticiones = async () => {
  const res = await axios.get(`${API_URL}/Publico/competiciones`);
  return res.data;
};

const getCategorias = async (competicionId: string) => {
  const res = await axios.get(`${API_URL}/Publico/categorias`, { params: { competicionId } });
  return res.data;
};

const getCalendario = async (competicionId: string, categoriaId: string) => {
  const res = await axios.get(`${API_URL}/Publico/calendario`, { params: { competicionId, categoriaId } });
  return res.data;
};

const getClasificacion = async (competicionId: string, categoriaId: string) => {
  const res = await axios.get(`${API_URL}/Publico/clasificacion`, { params: { competicionId, categoriaId } });
  return res.data;
};

export default { getCompeticiones, getCategorias, getCalendario, getClasificacion };


