import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom"
import Auth from "../context/Auth.jsx"

function Login(){

    const [rutUser, setRutUser] = useState("");
    const [pwUser, setPwUser] = useState("");
    //const [loginSuccess, setLoginSuccess] = useState("")

    const navigate = useNavigate();

    const handleClick = () => {
        Auth.login(rutUser, pwUser).then((userData) => {
            try {
                if (userData.success){
                    sessionStorage.setItem("Auth", userData.token);
                    navigate("/home")
                }
                else {
                    console.log("Usuario inválido");
                    setExitoLogin("Error al iniciar sesión");
                    navigate("/login")
                }
            }
            catch (error) {
                console.error("Error al intentar iniciar sesión: ", error)
            }
        })
    }

    return(
        <div>
            <h3> LOGIN </h3>
            <label>
                <h5>Usuario</h5>
            </label>
            <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Ingresa tu Usuario aquí"
                onChange={(e) => setRutUser(e.target.value)}
                value={rutUser}
            />

            <label>
                <h5>Contraseña</h5>
            </label>
            <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Ingresa tu contraseña aquí"
                onChange={(e) => setPwUser(e.target.value)}
                value={pwUser}
            />
            <br/>
            <button
                style={{borderRadius: 0}}
                onClick={handleClick}
            >
                Ingresar
            </button>
        </div>
    )
}

export default Login;