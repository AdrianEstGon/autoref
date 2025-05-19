import axios from 'axios';
import API_URL from '@/config';
import { get } from 'http';

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
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Error al registrar el usuario';
    console.error('Error al registrar usuario:', message);
    throw new Error(message);
  }
};


const updateUser = async (usuario: any) => {
  try {
    const response = await axios.put(`${API_URL}/Usuarios/${usuario.id}`, usuario, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'No se pudo actualizar el usuario.';
    console.error('Error al actualizar usuario:', message);
    throw new Error(message);
  }
};

const changePassword = async ({ OldPassword, NewPassword }: { OldPassword: string; NewPassword: string }) => {
  try {
    const userId = localStorage.getItem('userId'); 
    if (!userId) {
      throw new Error("Usuario no autenticado");
    }

    const response = await axios.put(
      `${API_URL}/Usuarios/change-password`, 
      {
        OldPassword,
        NewPassword,
      },
      getAuthHeaders()
    );

    return response; // Retorna la respuesta de la API
  } catch (error: any) {
    console.error("Error al cambiar la contraseña:", error);

    // Aquí manejamos el error y lo mostramos en el frontend
    if (error.response && error.response.data.message === "La contraseña actual no es correcta") {
      throw new Error("La contraseña actual no es correcta");
    }

    throw error; // Lanza el error para que lo puedas manejar en el frontend
  }
};

const uploadProfilePicture = async (file: File) => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  if (!userId) {
    throw new Error('Usuario no autenticado');
  }

  const formData = new FormData();
  formData.append('file', file, file.name);  // 'file' es el nombre del parámetro que espera el backend

  try {
    const response = await axios.put(
      `${API_URL}/Usuarios/upload-profile-picture/${userId}`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`, // Si es necesario
          'Content-Type': 'multipart/form-data', // Esto se maneja automáticamente por FormData
        },
      }
    );
    return response.data; // Retorna la respuesta para su uso posterior
  } catch (error) {
    console.error("Error al subir la foto de perfil:", error);
    throw new Error('Error al subir la foto de perfil');
  }
};


const getProfilePicture = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/Usuarios/profile-picture/${userId}`, {
      ...getAuthHeaders(), // Usamos getAuthHeaders para obtener las cabeceras de autenticación
    });

    // Asumimos que el backend ahora devuelve la URL de la imagen de Cloudinary
    return response.data.fotoPerfil;  // La URL de la foto debería estar en 'fotoPerfil'
  } catch (error) {
    console.error('Error al obtener la foto de perfil:', error);
    throw error;
  }
};


export default { login, getUsuarios, getUsuarioById, eliminarUsuario, register, updateUser, changePassword, uploadProfilePicture, getProfilePicture };
