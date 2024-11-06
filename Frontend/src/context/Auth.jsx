// src/context/Auth.jsx
import axios from "axios";

// Configura el interceptor para agregar el token automáticamente en cada solicitud
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // Recupera el token almacenado en localStorage
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`; // Añade el token en el encabezado
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const Auth = {
    login: async (rutUser, pwUser) => {
        try {
            const userData = { rut_empleado: rutUser, contrasena: pwUser };
            const response = await axios.post("http://localhost:5000/login", userData);
            
            if (response.data && response.data.token) {
                localStorage.setItem("token", response.data.token); // Guarda el token en localStorage
                return response.data;
            } else {
                console.error('Error en el inicio de sesión:', response.data.message);
                return null;
            }
        } catch (error) {
            console.error('Error al intentar iniciar sesión:', error);
            return null;
        }
    }
};

export default Auth;
