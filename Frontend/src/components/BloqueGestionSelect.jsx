import React, { useState, useEffect } from "react";
import axios from "axios";

const BloqueGestionSelect = ({title, value}) => {

    const [roles, setRoles] = useState([])
    const [codigoRol, setCodigoRol] = useState("")

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
        setCodigoRol(e.target.value)
    }

    const rolSeleccionado = roles.find((rol) => rol.codigo_rol === codigoRol)

    return (
        <div className="bloque-gestion">
            <h2>{title}</h2>
            <select
                className='select'
                id='inlineFormCustomSelectPref'
                value={codigoRol}
                onChange={handleOnChangeCodigoRol}>
                <option value='-1'>Seleccione el Rol</option>
                {roles.map((rol) => (
                    <option key={rol.codigo_rol} value={rol.codigo_rol}>{rol.nombre_rol}</option>
                ))}
            </select>
            {rolSeleccionado ? (
                <p>{value}</p>
            ):(
                <p> - </p>
            )}
            
        </div>
    )
}

export default BloqueGestionSelect;