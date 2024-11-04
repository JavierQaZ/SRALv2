import React, {useState, useEffect} from "react";
import axios from "axios";
import Alert from '@mui/material/Alert'

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
                    <div className='d-flex justify-content-around flex-wrap'>
                        <form onSubmit={handleSubmitCambioContrasena}>
                            <div className='d-flex flex-column'>
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
                            </div>

                            <button type="submit" className="btn ms-4 mt-3"
                                style={{ backgroundColor: '#121113', color: '#ffffff'}}>
                                Confirmar Cambios
                            </button>
                            <br/>
                            <br/>
                            {ping}
                        </form>
                    </div>
                </div>
            </div>
            <hr/>
        </>
    )
}

export default Configuraciones;