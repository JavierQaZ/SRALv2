import React, { useState, useEffect } from 'react';
import axios from "axios";

function Roles() {

    const [nombreRol, setNombreRol] = useState("")
    const [salarioRol, setSalarioRol] = useState("")
    const [exitoRegistrarRol, setExitoRegistrarRol] = useState("")

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
        const nuevoRol = {
            "nombre_rol": nombreRol,
            "sueldoPorHora_rol": parseFloat(salarioRol)
        }

        axios.post('http://localhost:5000/rol/add', nuevoRol)
            .then((response) => {
                setExitoRegistrarRol("Rol registrado exitosamente")
                console.log("Rol registrado exitosamente", response.data)
            })
            .catch ((error) => {
                setExitoRegistrarRol("Error al registrar el rol")
                console.error("Error al registrar el rol: ", error)
            });
    }

    const ping = exitoRegistrarRol ? (
        <div className='mt-3'>
            <p>
                {exitoRegistrarRol}: <br/>
                {nombreRol}
            </p>
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
                </div>

                <button type="submit" className="btn btn-warning ms-4 mt-3 text-white">
                    Registrar Rol
                </button>
                <br/>
                <br/>
                {ping}
            </form>
        </>
    )
}

export default Roles;