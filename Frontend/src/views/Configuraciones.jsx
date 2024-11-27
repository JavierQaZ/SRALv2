import React, {useState, useEffect} from "react";
import {Routes, Route} from 'react-router-dom'
import axios from "axios";
import Alert from '@mui/material/Alert'

import BloqueConfUsuarios from "../components/BloqueConfUsuarios";

import AgregarUsuario from "./gestionUsuarios/AgregarUsuarios";
import EditarUsuarios from "./gestionUsuarios/EditarUsuarios";
import EliminarUsuarios from "./gestionUsuarios/EliminarUsuarios";

const BloqueGestUsuario = () => {
    return (
        <>
            <BloqueConfUsuarios path="agregarUsuario">Agregar Usuario</BloqueConfUsuarios>
            <hr/>
            <BloqueConfUsuarios path="editarUsuarios">Editar Usuarios</BloqueConfUsuarios>
            <hr/>
            <BloqueConfUsuarios path="eliminarUsuarios">Eliminar Usuarios</BloqueConfUsuarios>
        </>
    )
}

function Configuraciones(){
    const [usuario, setUsuario] = useState("")
    const [contrasena, setContrasena] = useState("")
    const [nuevaContrasena, setNuevaContrasena] = useState("")
    const [confirmacionContrasena, setConfirmacionContrasena] = useState("")
    const [exitoCambiarContrasena, setExitoCambiarContrasena] = useState("")
    const [alertType, setAlertType] = useState("success")
/*
    useEffect(() => {
        axios.get('http://localhost:5000/.../.../')
            .then((response) => {
                setContrasena(response.data)
            })
            .catch((error) => {
                console.error("Error al obtener los datos: ", error)
            })
    }, [])
*/
    const handleOnChangeContrasena = (e) => {
        setContrasena(e.target.value)
    }

    const handleOnChangeNuevaContrasena = (e) => {
        setNuevaContrasena(e.target.value)
    }

    const handleOnChangeConfirmacionContrasena = (e) => {
        setConfirmacionContrasena(e.target.value)
    }

    const handleSubmitCambioContrasena = (e) => {
        e.preventDefault();

        if (contrasena === "" || nuevaContrasena === "" || confirmacionContrasena === ""){
            setAlertType("warning")
            setExitoCambiarContrasena("Todos los campos son obligatorios")
        }
        if (nuevaContrasena !== confirmacionContrasena){
            setAlertType("warning")
            setExitoCambiarContrasena("La contraseña nueva y la confirmación no son iguales")
        }
        if (nuevaContrasena.length < 8){
            setAlertType("warning")
            setExitoCambiarContrasena("La contraseña debe tener al menos 8 caracteres")
        }
    }

    const cambioContrasena = {
        "": usuario,
        "": contrasena,
        "": nuevaContrasena,
        "": confirmacionContrasena
    }

    useEffect(() => {
        if (exitoCambiarContrasena){
            const timer = setTimeout(() => {
                setExitoCambiarContrasena(null);
                setAlertType("success");
            }, 7000);
            return () => clearTimeout(timer);
        }
    }, [exitoCambiarContrasena]);

    const ping = exitoCambiarContrasena ? (
        <div className='mt-3'>
            <Alert severity={alertType}>{exitoCambiarContrasena}</Alert>
        </div>
    ): null;

    return (
        <>
            <h4 className="bg-payne-grey content-title shadow">Configuraciones</h4>
            <div className='content-body'>
                <div className='container'>
                    <div className='d-flex'>
                        <div className="flex-fill d-flex flex-column align-items-center px-4">
                            <h4>Gestión de Usuarios</h4>
                            <Routes>
                                <Route path="/" element={<BloqueGestUsuario/>}></Route>
                                <Route path="/agregarUsuario" element={<AgregarUsuario/>}></Route>
                                <Route path="/editarUsuarios" element={<EditarUsuarios/>}></Route>
                                <Route path="/eliminarUsuarios" element={<EliminarUsuarios/>}></Route>
                            </Routes>
                        </div>

                        <div style={{
                            width: '1px',
                            backgroundColor: '#121113',
                            margin: '0 20px',
                            alignSelf: 'stretch'
                        }}></div>

                        <div className="flex-fill px-4">
                            <form onSubmit={handleSubmitCambioContrasena}>
                                <div className='d-flex flex-column align-items-center px-4'>
                                    <h4>Cambiar Contraseña</h4>
                                    <label className='form-label mt-3'>
                                        Rut del Usuario
                                        <input type="text"
                                            className="form-control"
                                            value={usuario}
                                            readOnly
                                            />
                                    </label>
                                    <label className='form-label mt-3'>
                                        Contraseña Actual
                                        <input type="password"
                                            className='form-control'
                                            value={contrasena}
                                            onChange={handleOnChangeContrasena}
                                        />
                                    </label>
                                    <label className='form-label mt-3'>
                                        Nueva Contraseña
                                        <input type="password"
                                            className='form-control'
                                            value={nuevaContrasena}
                                            onChange={handleOnChangeNuevaContrasena}
                                        />
                                    </label>
                                    <label className='form-label mt-3'>
                                        Confirmar Nueva Contraseña
                                        <input type="password"
                                            className='form-control'
                                            value={confirmacionContrasena}
                                            onChange={handleOnChangeConfirmacionContrasena}
                                        />
                                    </label>
                                    <br/>
                                    <button type="submit" className="btn "
                                    style={{ backgroundColor: '#121113', color: '#ffffff'}}>
                                    Confirmar Cambios
                                </button>
                                </div>
                                {ping}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Configuraciones;