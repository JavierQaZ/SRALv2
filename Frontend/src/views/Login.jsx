import React, {useState} from "react";
import {Button} from "react-bootstrap";
import { Navigate, useNavigate, Link} from "react-router-dom";
import { Card, CardHeader, CardTitle, CardFooter } from "react-bootstrap";

import "../styles/Login.css";

import auth from "../context/Auth.jsx"

function Login() {
    const [rutUser, setRutUser] = useState("");
    const [pwUser, setPwUser] = useState("");
    const [exitoLogin, setExitoLogin] = useState("")

    const navigate = useNavigate();

    const handleClick = () => {
        auth.login(rutUser, pwUser).then((userData) => {
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
        (sessionStorage.getItem("auth") != undefined)? (
            <Navigate to = "/home"/>
        ) : (
        <div className="flex">
            <Card className="card">
                <CardHeader className="card-header">
                    <CardTitle className="text-2xl font-bold text-center">SRAL - Login</CardTitle>
                </CardHeader>
                <form onSubmit={handleClick} className="space-y-4">
                    <div className="space-y-2">

                        <label
                            className="label"
                            htmlFor="username">
                        Usuario</label>

                        <input
                            className="input"
                            id="username"
                            type="text"
                            placeholder="Ingrese su Usuario"
                            value={rutUser}
                            onChange={(e) => setRutUser(e.target.value)}
                            required
                        />

                    </div>
                    <br/>
                    <div className="space-y-2">
                        <label className="label" htmlFor="password">Contraseña</label>
                        <input
                            className="input"
                            id="password"
                            type="password"
                            placeholder="Ingrese su contraseña"
                            value={pwUser}
                            onChange={(e) => setPwUser(e.target.value)}
                            required
                        />
                    </div>
                    <Button className="button" onClick={handleClick}>
                        Iniciar Sesión
                    </Button>
                </form>
                <CardFooter className="card-footer">
                    <Link to="/recover" className="text-sm text-center text-blue-500 hover:underline">
                    ¿Olvidó su Contraseña?
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
    )
}

export default Login;