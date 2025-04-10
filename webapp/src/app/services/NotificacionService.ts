import axios from 'axios';
import API_URL from '@/config';

// Obtener los encabezados de autorización
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No se encontró el token');
    }
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// Obtener todas las notificaciones
const getNotificaciones = async () => {
    try {
        const response = await axios.get(`${API_URL}/Notificaciones`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error obteniendo notificaciones:', error);
        throw error;
    }
};

// Obtener notificaciones por usuario
const getNotificacionesPorUsuario = async (usuarioId: string) => {
    try {
        const response = await axios.get(`${API_URL}/Notificaciones/usuario/${usuarioId}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error(`Error obteniendo notificaciones para el usuario ${usuarioId}:`, error);
        throw error;
    }
};

// Obtener notificación por ID
const getNotificacionById = async (id: string) => {
    try {
        const response = await axios.get(`${API_URL}/Notificaciones/${id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error(`Error obteniendo notificación con ID ${id}:`, error);
        throw error;
    }
};

const crearNotificacion = async (notificacion: any) => {
    try {
        const response = await axios.post(`${API_URL}/Notificaciones`, notificacion, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error creando notificación:', error);
        throw error;
    }
};

const actualizarNotificacion = async (id: string, notificacion: any) => {
    try {
        await axios.put(`${API_URL}/Notificaciones/${id}`, notificacion, getAuthHeaders());
    } catch (error) {
        console.error(`Error actualizando notificación con ID ${id}:`, error);
        throw error;
    }
};

const eliminarNotificacion = async (id: string) => {
    try {
        await axios.delete(`${API_URL}/Notificaciones/${id}`, getAuthHeaders());
    } catch (error) {
        console.error(`Error eliminando notificación con ID ${id}:`, error);
        throw error;
    }
};

export default {
    getNotificaciones,
    getNotificacionesPorUsuario,
    getNotificacionById,
    crearNotificacion,
    actualizarNotificacion,
    eliminarNotificacion,
};
