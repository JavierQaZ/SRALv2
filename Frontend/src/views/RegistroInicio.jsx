import React, { useState } from 'react';
import axios from 'axios'

function RegistroInicio() {

    const [rut, setRut] = useState("")
    const [currentDateTime, setCurrentDateTime] = useState(null);
    const [exitoRegistroInicio, setExitoRegistroInicio] = useState("")

    const handleOnChangeRut = (e) => {
        console.log(e.target.value)
        setRut(e.target.value)
    }

    const handleCaptureTime = () => {
        const now = new Date();
        setCurrentDateTime(now.toLocaleString());
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        handleCaptureTime();
        const registroRutInicio = {
            "rut_empleado":  rut,
            "horaSalida_registro": currentDateTime

        }

        axios.post('http://localhost:5000/r_entrada/add', registroRutInicio)
            .then((response) => {
                setExitoRegistroInicio("Registro de Inicio exitoso")
                console.log("Registro del Inicio exitoso", response.data)
            })
            .catch ((error) => {
                setExitoRegistroInicio("Error al registrar el Inicio")
                console.error("Error al registrar el Inicio: ", error)
            });
    }

    const ping = exitoRegistroInicio ? (
        <div className='mt-3'>
            <p>
                {exitoRegistroInicio}: <br/>
                {rut} a las {currentDateTime}
            </p>
        </div>
    ): null;

    return (
        <>
            <h4 className="bg-payne-grey content-title shadow">REGISTRO DE INICIO</h4>
            <div className='content-body'>
                <div className='container'>
                    <div className='d-flex justify-content-around flex-wrap'>
                        <form onSubmit={handleSubmit}>
                            <div className='d-flex flex-column'>

                                <label className='form-label mt-3'>
                                    Rut del Empleado
                                    <input type="text" className='form-control'
                                    value={rut}
                                    onChange={handleOnChangeRut}
                                    />
                                </label>
                            </div>

                            <button type="submit" className="btn ms-4 mt-3"
                                style={{ backgroundColor: '#121113', color: '#ffffff'}}>
                                Registrar Entrada
                            </button>
                            <br/>
                            <br/>
                            {ping}
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RegistroInicio;