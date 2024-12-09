// src/context/Auth.jsx
import axios from "axios";

// Configura el interceptor para incluir el token en todas las solicitudes
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth"); // Recupera el token
        if (token && typeof token === "string") {
            config.headers["Authorization"] = `Bearer ${token}`; // Añade el token
        }
        return config;
    },
    (error) => Promise.reject(error) // Manejo de errores
);

const Auth = {
    /**
     * Inicia sesión y guarda el token en localStorage si es exitoso.
     * @param {string} rutUser - RUT del usuario.
     * @param {string} pwUser - Contraseña del usuario.
     * @returns {object} - Objeto con los datos del usuario si el inicio de sesión es exitoso, o un mensaje de error.
     */
    login: async (rutUser, pwUser) => {
        try {
            const userData = { rut_usuario: rutUser, contrasena_usuario: pwUser };
            const response = await axios.post("http://localhost:5000/login", userData);

            if (response.data && response.data.token) {
                localStorage.setItem("auth", response.data.token); // Guarda el token
                return { success: true, data: response.data }; // Devuelve los datos
            } else {
                console.error("Error en el inicio de sesión: Token no proporcionado");
                return { success: false, message: "Token no proporcionado por el servidor" };
            }
        } catch (error) {
            console.error("Error al intentar iniciar sesión:", error);
            return {
                success: false,
                message: error.response?.data?.error || "Error al conectar con el servidor",
            };
        }
    },

    /**
     * Cierra sesión eliminando el token del localStorage.
     */
    logout: () => {
        localStorage.removeItem("auth"); // Elimina el token
        window.location.href = "/login"; // Redirige al login
    },

    /**
     * Verifica si el usuario está autenticado.
     * @returns {boolean} - Devuelve true si el token existe, false en caso contrario.
     */
    isAuthenticated: () => {
        const token = localStorage.getItem("auth");
        return !!token && typeof token === "string" && token.trim() !== ""; // Verifica que el token sea válido
    },
};

export default Auth;
