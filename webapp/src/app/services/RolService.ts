import axios from 'axios';
import API_URL from '@/config';

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

// Obtener roles por userId
const getRolesByUserId = async (userId: string) => {
    try {
        const response = await axios.get(`${API_URL}/Roles/GetRolesByUserId/${userId}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error(`Error obteniendo roles para el usuario ${userId}:`, error);
        throw error;
    }
};

export default { getRolesByUserId };