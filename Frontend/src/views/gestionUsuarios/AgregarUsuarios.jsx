import React, { useState, useEffect} from 'react'
import axios from 'axios'
import Alert from '@mui/material/Alert'

function AgregarUsuario(){

    const [rutUsuario, setRutUsuario] = useState("")
    const [nombreUsuario, setNombreUsuario] = useState("")
    const [apellidoUsuario, setApellidoUsuario] = useState("")
    const [emailUsuario, setEmailUsuario] = useState("")
    const [pwUsuario, setPwUsuario] = useState("")
    const [pwConfirmUsuario, setPwConfirmUsuario] = useState("")
    const [exitoAgregarUsuario, setExitoAgregarUsuario] = useState("")
    const [alertType, setAlertType] = useState("success")

    const handleOnChangeRutUsuario = (e) => {
        setRutUsuario(e.target.value)
    }

    const handleOnChangeNombreUsuario = (e) => {
        setNombreUsuario(e.target.value)
    }

    const handleOnChangeApellidoUsuario = (e) => {
        setApellidoUsuario(e.target.value)
    }

    const handleOnChangeEmailUsuario = (e) => {
        setEmailUsuario(e.target.value)
    }

    const handleOnChangePwUsuario = (e) => {
        setPwUsuario(e.target.value)
    }

    const handleOnChangePwConfirmUsuario = (e) => {
        setPwConfirmUsuario(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (rutUsuario === "" || nombreUsuario === "" || apellidoUsuario === "" || emailUsuario === "" || pwUsuario === "" || pwConfirmUsuario === "" ){
            setAlertType("warning")
            setExitoAgregarUsuario("Todos los campos son obligatorios")
            return;
        }

        if (pwUsuario !== pwConfirmUsuario){
            setAlertType("warning")
            setExitoAgregarUsuario("Las contraseñas no son iguales")
            return
        }

        if (pwUsuario.length < 8){
            setAlertType("alert")
            setExitoCambiarContrasena("La contraseña debe tener al menos 8 caracteres")
            return
        }

        const nuevoUsuario = {
            //"nombre_bdd": nombre_frontend
            "rut_usuario": rutUsuario,
            "nombre_usuario": nombreUsuario,
            "apellidos_usuario": apellidoUsuario,
            "email_usuario": emailUsuario,
            "contrasena_usuario": pwUsuario,
        }

        axios.post('http://localhost:5000/usuarios/add', nuevoUsuario)
            .then((response) => {
                setAlertType("success")
                setExitoAgregarUsuario("Usuario registrado exitosamente")
                console.log("Usuario registrado exitosamente", response.data)
                setRutUsuario("")
                setNombreUsuario("")
                setApellidoUsuario("")
                setEmailUsuario("")
                setPwUsuario("")
                setPwConfirmUsuario("")
            })
            .catch ((error) => {
                setAlertType("error")
                setExitoAgregarUsuario("Error al registrar usuario")
                console.error("Error al registrar el Usuario: ", error)

                setRutUsuario("")
                setNombreUsuario("")
                setApellidoUsuario("")
                setEmailUsuario("")
                setPwUsuario("")
                setPwConfirmUsuario("")
            })
    }

    useEffect(() => {
        if (exitoAgregarUsuario){
            const timer = setTimeout(() => {
                setExitoAgregarUsuario(null);
                setAlertType("success");
            }, 7000);
            return () => clearTimeout(timer);
        }
    }, [exitoAgregarUsuario]);

    const ping = exitoAgregarUsuario ? (
        <div className='m-4 position-absolute bottom-0 end-0'>
            <Alert severity={alertType}>{exitoAgregarUsuario}</Alert>
        </div>
    ): null;

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className='d-flex justify-content-around flex-wrap'>
                    <div className='d-flex flex-column'>
                        <h4>Agregar Usuarios</h4>
                        <label className='form-label mt-3'>
                            RUT del Usuario
                            <input type="text" className='form-control'
                                value={rutUsuario}
                                onChange={handleOnChangeRutUsuario}
                            />
                        </label>

                        <label className='form-label mt-3'>
                            Nombre del Usuario
                            <input type="text" className='form-control'
                                value={nombreUsuario}
                                onChange={handleOnChangeNombreUsuario}
                            />
                        </label>

                        <label className='form-label mt-3'>
                            Apellido del Usuario
                            <input type="text" className='form-control'
                                value={apellidoUsuario}
                                onChange={handleOnChangeApellidoUsuario}
                            />
                        </label>

                        <label className='form-label mt-3'>
                            Email del Usuario
                            <input type="email" className='form-control'
                                value={emailUsuario}
                                onChange={handleOnChangeEmailUsuario}
                            />
                        </label>

                        <label className='form-label mt-3'>
                            Contraseña
                            <input type="password" className='form-control'
                                value={pwUsuario}
                                onChange={handleOnChangePwUsuario}
                            />
                        </label>

                        <label className="form-label mt-3">
                            Confirmar Contraseña
                            <input type="password" className='form-control'
                                value={pwConfirmUsuario}
                                onChange={handleOnChangePwConfirmUsuario}
                            />
                        </label>

                    <button
                        type="submit"
                        className='btn m-1 mt-3 '
                        style={{ backgroundColor: '#121113', color: '#ffffff'}}>
                        Agregar Usuario
                    </button>
                    {ping}
                    </div>
                </div>
            </form>
        </>
    )
}

export default AgregarUsuario;