import React, { useState, useEffect } from "react";
import axios from "axios";
import Alert from '@mui/material/Alert'

function Empleado() {

    const [rut, setRut] = useState("");
    const [exitoBorrarEmpleado, setExitoBorrarEmpleado] = useState("");
    const [alertType, setAlertType] = useState("success")

    const handleOnChangeRut = (e) => {
        setRut(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (rut === "") {
            setAlertType("warning")
            setExitoBorrarEmpleado("Todos los campos son obligatorios")
            return;
        }

        axios.delete(`http://localhost:5000/empleados/delete`,{data:{rut_empleado:rut}})
            .then((response) => {
            setAlertType("success")
            setExitoBorrarEmpleado("Empleado borrado exitosamente")
            console.log("Empleado borrado exitosamente", response.data)
            })
        .catch ((error) => {
            setAlertType("error")
            setExitoBorrarEmpleado("Error al borrar el Empleado")
            console.error("Error al borrar el Empleado", error)
        });
    }
    useEffect(() => {
        if (exitoBorrarEmpleado){
            const timer = setTimeout(() => {
                setExitoBorrarEmpleado(null);
                setAlertType("success");
            }, 7000);
            return () => clearTimeout(timer);
        }
    }, [exitoBorrarEmpleado]);

    const ping = exitoBorrarEmpleado ? (
        <div className='mt-3'>
            <Alert severity={alertType}>{exitoBorrarEmpleado}</Alert>
        </div>
    ): null;

    return(
        <>
            <form onSubmit={handleSubmit}>
                <div className='d-flex flex-column'>
                    <h4>Borrar Datos de Empleado</h4>
                    <label className="form-label mt-3">
                        RUT
                        <input type="text" className="form-control"
                        value={rut}
                        onChange={handleOnChangeRut}
                        />
                    </label>
                </div>
                <button
                    type="submit"
                    className="btn ms-4 mt-3"
                    style={{ backgroundColor: '#121113', color: '#ffffff'}}>
                    Borrar Empleado
                </button>
                <br/>
                <br/>
                {ping}
            </form>
        </>
    )
}

export default Empleado;