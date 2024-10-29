import React, { useState, useEffect } from "react";
import axios from "axios";

function Roles() {

    const [codigoRol, setCodigoRol] = useState("")
    const [roles, setRoles] = useState([])
    const [salarioRol, setSalarioRol] = useState("")
    const [exitoEditarRol, setExitoEditarRol] = useState("")

    useEffect(() => {
        axios.get('http://localhost:5000/rol/get')
            .then((response) => {
                setRoles(response.data)
            })
            .catch((error) => {
                console.error("Error al obtemer los roles: ", error);
            })
    }, []);

    const handleOnChangeCodigoRol = (e) => {
        console.log(e.target.value)
        setCodigoRol(e.target.value)
    }

    const handleOnChangeSalarioRol = (e) => {
        console.log(e.target.value)
        setSalarioRol(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const editarRol = {
            "codigo_rol": codigoRol,
            "sueldoPorHora_rol": parseFloat(salarioRol)
        }

        axios.put('http://localhost:5000/rol/edit', editarRol)
            .then((response) => {
                setExitoEditarRol("Rol editado exitosamente")
                console.log("Rol editado exitosamente", response.data)
            })
            .catch ((error) => {
                setExitoEditarRol("Error al editar el rol")
                console.error("Error al editar el rol: ", error)
            });
    }

    const ping = exitoEditarRol ? (
        <div className='mt-3'>
            <p>
                {exitoEditarRol}: <br/>
                {codigoRol}
            </p>
        </div>
    ): null;

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h4>Editar Rol</h4>
                <div className='d-flex flex-column'>

                <label className='form-label mt-3'>
                        Rol
                        <br/>
                        <select
                            className='custom-select'
                            id='inlineFormCustomSelectPref'
                            value={codigoRol}
                            onChange={handleOnChangeCodigoRol}
                        >
                            <option value='-1'>Seleccione el Rol</option>
                            {roles.map((rol) => (
                                <option key={rol.codigo_rol} value={rol.codigo_rol}>{rol.nombre_rol}</option>
                            ))}
                        </select>
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
                    Confirmar cambios
                </button>
                <br/>
                <br/>
                {ping}
            </form>
        </>
    )
}

export default Roles;
