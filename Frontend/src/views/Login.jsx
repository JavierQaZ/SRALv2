import React, {useState} from "react";
import {Button} from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import auth from "../context/auth.jsx"
import "../styles/Login.css";

function Login() {
    const [rut, setRut] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [exitoLogin, setExitoLogin] = useState("")

    const navigate = useNavigate();

    const handleClick = () => {
        auth.login(rut, contrasena).then((userData) => {
            try {
                if (userData.success){
                    sessionStorage.setItem("auth", userData.token);
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

    return (
        (sessionStorage.getItem("auth") != undefined)? (<Navigate to = "/home"/>): (<div className="container shadow login-container mt-4 ps-0 pe-0">
        <div className="row">
            <div className="col-md-6 order-md-1">
                <img src="/big-vite.svg"/>
            </div>
            <div className="col-md-6 d-flex flex-column gap-4 pt-5 ps-5 pe-5 order-md-2">
                <h3 className="mt-5">Sistema de Registro de Asistencia Laboral</h3>
                <div>
                    <div className="form-group">
                        <label htmlFor="username">
                            <h5>Usuario</h5>
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        placeholder="Ingresa tu Usuario aquí"
                        onChange={(e) => setRut(e.target.value)}
                        value={rut}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">
                        <h5>Contraseña</h5>
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Ingresa tu contraseña aquí"
                        onChange={(e) => setContrasena(e.target.value)}
                        value={contrasena}
                    />
                </div>
            </div>
                <div className="d-flex justify-content-between">
                    <Button
                        variant="success"
                        size="lg"
                        style={{ borderRadius: "0px" }}
                        onClick={handleClick}
                    >
                        Ingresar
                    </Button>
                    <div className = "bg-danger text-light">{exitoLogin}</div>
                </div>
            </div>
        </div>
    </div>)
    )
}
// --
export default Login;