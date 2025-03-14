import axios from 'axios';
import API_URL from '@/config';

const login = async (email: string, password: string) => {
  try {
    const data = { email, password };
    console.log('Datos que se van a enviar:', data);

    const response = await axios.post(`${API_URL}/Usuarios/login`, data);
    console.log('Respuesta del servidor:', response.data);

    if (response.data.id) {
      localStorage.setItem('userId', response.data.id.toString());
    }

    if (response.data.role) {
      
      localStorage.setItem('userRole', response.data.role);
      localStorage.setItem('token', response.data.token);
    }

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      throw new Error('Las credenciales introducidas no son correctas');
    } else {
      throw new Error('Error al iniciar sesión');
    }
  }
};

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

const getUsuarios = async () => {
  try {
    const response = await axios.get(`${API_URL}/Usuarios`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    throw error;
  }
};

const getUsuarioById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/Usuarios/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el usuario con ID ${id}:`, error);
    throw error;
  }
};

const eliminarUsuario = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/Usuarios/${id}`, getAuthHeaders());
  } catch (error) {
    console.error(`Error al eliminar el usuario con ID ${id}:`, error);
    throw error;
  }
};

const register = async (usuario: any) => {
  try {
    const response = await axios.post(`${API_URL}/Usuarios/register`, usuario, getAuthHeaders());
    console.log('Usuario registrado correctamente:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error al registrar usuario:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al registrar el usuario');
  }
};

const updateUser = async (usuario: any) => {
  try {
    const response = await axios.put(`${API_URL}/Usuarios/${usuario.id}`, usuario, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    console.error('Error al actualizar usuario:', error);
    throw new Error(error.response?.data?.message || 'No se pudo actualizar el usuario.');
  }
};

export default { login, getUsuarios, getUsuarioById, eliminarUsuario, register, updateUser };
