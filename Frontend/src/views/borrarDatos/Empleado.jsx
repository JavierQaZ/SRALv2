import React, { useState } from "react";
import axios from "axios";

function Empleado() {

    const [rut, setRut] = useState("");
    const [exitoBorrarEmpleado, setExitoBorrarEmpleado] = useState("");

    const handleOnChangeRut = (e) => {
        setRut(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        
        axios.delete(`http://localhost:5000/empleados/delete`,{data:{rut_empleado:rut}})
            .then((response) => {
            setExitoBorrarEmpleado("Empleado borrado exitosamente")
            console.log("Empleado borrado exitosamente", response.data)
            })
        .catch ((error) => {
            setExitoBorrarEmpleado("Error al borrar el Empleado")
            console.error("Error al borrar el Empleado", error)
        });
    }
        const ping = exitoBorrarEmpleado ? (
            <div className='mt-3'>
                <p>
                    {exitoBorrarEmpleado}: <br/>
                    {rut}
                </p>
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
                <button type="submit" className="btn btn-warning ms-4 mt-3 text-white">
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