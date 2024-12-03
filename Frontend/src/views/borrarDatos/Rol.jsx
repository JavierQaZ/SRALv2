import React, { useState, useEffect } from "react";
import axios from "axios";
import Alert from '@mui/material/Alert'

function Roles() {
    const [rol, setRol] = useState("-1"); // Rol a borrar
    const [roles, setRoles] = useState([]); // Roles desde el backend
    const [exitoBorrarRol, setExitoBorrarRol] = useState("");
    const [alertType, setAlertType] = useState("success")

    useEffect(() => {
        axios.get('http://localhost:5000/rol/get')
            .then((response) => {
                setRoles(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener los roles: ", error);
            });
    }, []);

    const handleOnChangeRol = (e) => {
        setRol(e.target.value); // Actualizar el estado del rol seleccionado
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (rol === "-1") {
            setAlertType("warning")
            setExitoBorrarRol("Seleccione un rol válido");
            return;
        }

        axios.delete('http://localhost:5000/rol/delete', { data: { codigo_rol: rol } })
            .then((response) => {
                setAlertType("success")
                setExitoBorrarRol("Rol borrado exitosamente");
                console.log("Rol borrado exitosamente", response.data);

                setRol("-1")

                // Actualizar la lista de roles después de borrar
                axios.get('http://localhost:5000/rol/get')
                    .then((response) => {
                        setRoles(response.data);
                    })
                    .catch((error) => {
                        console.error("Error al obtener los roles después de borrar: ", error);
                    });
            })
            .catch((error) => {
                setAlertType("error")
                setExitoBorrarRol("Error al borrar el Rol");
                console.error("Error al borrar el Rol", error);

                setRol("-1")
            });
    }

    useEffect(() => {
        if (exitoBorrarRol){
            const timer = setTimeout(() => {
                setExitoBorrarRol(null);
                setAlertType("success");
            }, 7000);
            return () => clearTimeout(timer);
        }
    }, [exitoBorrarRol]);

    const ping = exitoBorrarRol ? (
        <div className='mt-3'>
            <Alert severity={alertType}>{exitoBorrarRol}</Alert>
        </div>
    ): null;

    return(
        <>
            <form onSubmit={handleSubmit}>
                <div className='d-flex flex-column'>
                    <h4>Borrar Rol</h4>
                    <label className='form-label mt-3'>
                        Rol
                        <br/>
                        <select
                            className='custom-select form-control'
                            id='inlineFormCustomSelectPref'
                            value={rol}
                            onChange={handleOnChangeRol}
                        >
                            <option value='-1'>Seleccione el Rol</option>
                            {roles.map((rolItem) => (
                                <option key={rolItem.codigo_rol} value={rolItem.codigo_rol}>{rolItem.nombre_rol}</option>
                            ))}
                        </select>
                    </label>
                    <button
                        type="submit"
                        className="btn mt-3"
                        style={{ backgroundColor: '#121113', color: '#ffffff'}}>
                        Borrar Rol
                    </button>
                    {ping}
                </div>
            </form>
        </>
    );
}

export default Roles;
