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

// Obtener todas las categorías
const getCategorias = async () => {
    try {
        const response = await axios.get(`${API_URL}/Categorias`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error obteniendo categorías:', error);
        throw error;
    }
};

// Obtener categoría por nombre
const getCategoriaByName = async (name: string) => {
    try {
        const response = await axios.get(`${API_URL}/Categorias/name/${name}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error(`Error obteniendo categoría con nombre ${name}:`, error);
        throw error;
    }
};

// Obtener categoría por ID
const getCategoriaById = async (id: string) => {
    try {
        const response = await axios.get(`${API_URL}/Categorias/${id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error(`Error obteniendo categoría con ID ${id}:`, error);
        throw error;
    }
};

// Crear categoría (admin/federación)
const createCategoria = async (categoria: { nombre: string; primerArbitro?: string; segundoArbitro?: string; anotador?: string; minArbitros?: number; prioridad?: number; minJugadores?: number | null; maxJugadores?: number | null; }) => {
    const response = await axios.post(`${API_URL}/Categorias`, categoria, getAuthHeaders());
    return response.data;
};

// Actualizar categoría (admin/federación)
const updateCategoria = async (id: string, categoria: any) => {
    const response = await axios.put(`${API_URL}/Categorias/${id}`, categoria, getAuthHeaders());
    return response.data;
};

// Eliminar categoría (admin/federación)
const deleteCategoria = async (id: string) => {
    const response = await axios.delete(`${API_URL}/Categorias/${id}`, getAuthHeaders());
    return response.data;
};

export default { getCategorias, getCategoriaByName, getCategoriaById, createCategoria, updateCategoria, deleteCategoria };
