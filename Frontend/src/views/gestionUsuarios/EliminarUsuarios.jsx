import React, { useState, useEffect } from  'react'
import axios from 'axios'
import Alert from '@mui/material/Alert';

function EliminarUsuarios(){

    const [rutUsuario, setRutUsuario] = useState("-1")
    const [rutsUsuarios, setRutsUsuarios] = useState([])
    const [exitoEliminarUsuario, setExitoEliminarUsuario] = useState("")
    const [alertType, setAlertType] = useState("success")

    useEffect(() => {
        axios.get('http://localhost:5000/usuarios/get')
            .then((response) => {
                setRutsUsuarios(response.data)
            })
    }, []);

    const handleOnChangeRutUsuario = (e) => {
        setRutUsuario(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (rutUsuario === '-1'){
            setAlertType("warning")
            setExitoEliminarUsuario("Seleccione un usuario válido")
            return
        }

        axios.delete('http://localhost:5000/usuarios/delete', { data: { rut_usuario: rutUsuario } })
            .then((response) => {
                setAlertType("success")
                setExitoEliminarUsuario("Usuario eliminado exitosamente")
                console.log("Rol borrado exitosamente", response.data)

                setRutUsuario("-1")

                axios.get('http://localhost:5000/usuarios/get')
                .then((response) => {
                    setRutsUsuarios(response.data);
                })
                .catch((error) => {
                    console.error("Error al obtener los datos después de borrar: ", error)
                })
            })
            .catch((error) => {
                setAlertType("error")
                setExitoEliminarUsuario("Error al eliminar el usuario")
                console.error("Error al eliminar el usuario: ", error)

                setRutUsuario("-1")
            })
    }

    useEffect(() => {
        if (exitoEliminarUsuario){
            const timer = setTimeout(() => {
                setExitoEliminarUsuario(null);
                setAlertType("success");
            }, 7000);
            return () => clearTimeout(timer);
        }
    }, [exitoEliminarUsuario]);

    const ping = exitoEliminarUsuario ? (
        <div className='mt-3'>
            <Alert severity={alertType}>{exitoEliminarUsuario}</Alert>
        </div>
    ): null;

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className='d-flex justify-content-around flex-wrap'>
                    <div className='d-flex flex-column'>
                        <h4>Eliminar Usuario</h4>
                        <label className='form-label mt-3'>
                            RUT del Usuario
                            <br/>
                            <select
                                className='custom-select form-control'
                                id='inlineFormCustomSelectPref'
                                value={rutUsuario}
                                onChange={handleOnChangeRutUsuario}
                                >
                                <option value='-1'>Seleccione el Usuario</option>
                                {rutsUsuarios.map((item) => (
                                    <option key={item.rut_usuario} value={item.rut_usuario}>
                                        {item.rut_usuario} - {item.nombre_usuario} {item.apellidos_usuario}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <button
                            type="submit"
                            className='btn mt-3'
                            style={{backgroundColor: '#121113', color: '#ffffff'}}
                            >
                            Eliminar Usuario
                        </button>
                        {ping}
                    </div>
                </div>
            </form>
        </>
    )
}

export default EliminarUsuarios;