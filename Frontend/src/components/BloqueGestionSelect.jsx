import React, { useState, useEffect } from "react";
import axios from "axios";

const BloqueGestionSelect = ({title, value}) => {

    const [roles, setRoles] = useState([])
    const [codigoRol, setCodigoRol] = useState("")
    const [costosPorRol, setCostosPorRol] = useState([])

    useEffect(() => {
        axios.get('http://localhost:5000/rol/get')
            .then((response) => {
                setRoles(response.data)
            })
            .catch((error) => {
                console.error("Error al obtemer los roles: ", error);
            })
    }, []);

    useEffect(() => {
        if (Array.isArray(value) && value.length > 0) {
            const costosPorRolObj = value.reduce((acc, item) => {
                if (Array.isArray(item) && item.length > 0 && typeof item[0] === 'object') {
                    try {
                        const keys = Object.keys(item[0])
                        if (keys.length > 0) {
                            const key = keys[0]
                            acc[key] = item[0][key]
                        }
                    } catch (error) {
                        console.error("Error processing item:", item, error);
                    }
                }
                return acc;
            }, {})
            setCostosPorRol(costosPorRolObj)
        }
    }, [value])

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
            {rolSeleccionado && codigoRol !== "-1" ? (
                <p>
                    {costosPorRol[rolSeleccionado.nombre_rol] !== undefined
                        ? costosPorRol[rolSeleccionado.nombre_rol]
                        : ' - '}
                </p>
            ):(
                <p> - </p>
            )}
        </div>
    )
}

export default BloqueGestionSelect;