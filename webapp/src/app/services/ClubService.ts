import axios from "axios";
import API_URL from "@/config";

// Obtener los encabezados de autorización
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No se encontró el token");
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Obtener todos los clubes
const getClubs = async () => {
  try {
    const response = await axios.get(`${API_URL}/Clubs`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error obteniendo clubes:", error);
    throw error;
  }
};

// Listado detallado (solo federación/admin)
const getClubsDetalle = async () => {
  const response = await axios.get(`${API_URL}/Clubs/detalle`, getAuthHeaders());
  return response.data;
};

// Obtener club por ID
const getClubById = async (id: any) => {
  try {
    const response = await axios.get(`${API_URL}/Clubs/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo club con ID ${id}:`, error);
    throw error;
  }
};

const createClub = async (club: any) => {
  const response = await axios.post(`${API_URL}/Clubs`, club, getAuthHeaders());
  return response.data;
};

const updateClub = async (id: string, club: any) => {
  const response = await axios.put(`${API_URL}/Clubs/${id}`, club, getAuthHeaders());
  return response.data;
};

const deleteClub = async (id: string) => {
  const response = await axios.delete(`${API_URL}/Clubs/${id}`, getAuthHeaders());
  return response.data;
};

export default { getClubs, getClubsDetalle, getClubById, createClub, updateClub, deleteClub };
