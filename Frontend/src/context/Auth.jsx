import axios from "axios";

const Auth = {
    login: async (rutUser, pwUser) => {
        try {
            const userData = {
                rut_empleado: rutUser,  // Cambia de rut_empresa a rut_empleado
                contrasena: pwUser
            };

            const resp = await axios.post("http://localhost:5000/login", userData);
            
            // Verifica si resp.data tiene la propiedad success
            if (resp.data && resp.data.success) {
                return resp.data;
            } else {
                console.log('Error en el inicio de sesión:', resp.data.error); // Usa 'error' para mostrar el mensaje de error
                return null;
            }
        } catch (error) {
            console.log('Error al intentar iniciar sesión:', error);
            return null;
        }
    }
}

export default Auth;
