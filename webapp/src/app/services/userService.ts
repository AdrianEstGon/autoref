const userService = null;

const login = async (email, password) => {
    try {
        const response = await axios.get(`${baseUrl}/login/${email}/${password}`);
        return response.data;
    } catch (error) {
        console.error('Error en el login:', error);
        throw error;
    }
}

const checkPassword = async (email, password) => {
    try {
        const response = await axios.get(`${baseUrl}/checkPassword/${email}/${password}`);
        return response.data;
    } catch (error) {
        console.error('Error al comprobar la contraseña:', error);
        throw error;
    }
}

export default userService;