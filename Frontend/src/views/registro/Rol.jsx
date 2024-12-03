import React, { useState, useEffect } from 'react';
import axios from "axios";
import Alert from '@mui/material/Alert'

function Roles() {

    const [nombreRol, setNombreRol] = useState("")
    const [salarioRol, setSalarioRol] = useState("")
    const [exitoRegistrarRol, setExitoRegistrarRol] = useState("")
    const [alertType, setAlertType] = useState("success")

    const handleOnChangeNombreRol = (e) => {
        console.log(e.target.value)
        setNombreRol(e.target.value)
    }

    const handleOnChangeSalarioRol = (e) => {
        console.log(e.target.value)
        setSalarioRol(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (nombreRol === "" || salarioRol === ""){
            setAlertType("warning")
            setExitoRegistrarRol("Todos los campos son obligatorios")
            return;
        }

        const nuevoRol = {
            "nombre_rol": nombreRol,
            "sueldoPorHora_rol": parseFloat(salarioRol)
        }

        axios.post('http://localhost:5000/rol/add', nuevoRol)
            .then((response) => {
                setAlertType("success")
                setExitoRegistrarRol("Rol registrado exitosamente")
                console.log("Rol registrado exitosamente", response.data)

                setNombreRol("")
                setSalarioRol("")
            })
            .catch ((error) => {
                setAlertType("error")
                setExitoRegistrarRol("Error al registrar el rol")
                console.error("Error al registrar el rol: ", error)

                setNombreRol("")
                setSalarioRol("")
            });
    }

    useEffect(() => {
        if (exitoRegistrarRol){
            const timer = setTimeout(() => {
                setExitoRegistrarRol(null);
                setAlertType("success");
            }, 7000);
            return () => clearTimeout(timer);
        }
    }, [exitoRegistrarRol]);

    const ping = exitoRegistrarRol ? (
        <div className='mt-3'>
            <Alert severity={alertType}>{exitoRegistrarRol}</Alert>
        </div>
    ): null;

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h4>Registro de Rol</h4>
                <div className='d-flex flex-column'>

                    <label className='form-label mt-3'>
                        Nombre del Rol
                        <input type="text" className='form-control'
                        value={nombreRol}
                        onChange={handleOnChangeNombreRol}
                        />
                    </label>

                    <label className='form-label mt-3'>
                        Salario del Rol (por hora)
                        <input type="text" className='form-control'
                        value={salarioRol}
                        onChange={handleOnChangeSalarioRol}
                        />
                    </label>

                    <button
                        type="submit"
                        className="btn mt-3"
                        style={{ backgroundColor: '#121113', color: '#ffffff'}}>
                        Registrar Rol
                    </button>
                    {ping}
                </div>
            </form>
        </>
    )
}

export default Roles;