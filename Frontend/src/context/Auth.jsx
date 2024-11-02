//revisar
import axios from "axios";

const Auth = {
    login: async (rutUser, pwUser) => {
        try {
            const userData = {
                rut_empleado: rutUser,
                contrasena: pwUser
            };

            const resp = await axios.post("http://localhost:5000/login", userData)
            return resp.data;
        } catch (error) {
            console.log(error)
        }
    }
}

export default Auth;