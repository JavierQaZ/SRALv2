import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from '@mui/material/Alert';

function RegistroInicio() {

    const [rut, setRut] = useState("")
    const [currentDateTime, setCurrentDateTime] = useState(null);
    const [exitoRegistroInicio, setExitoRegistroInicio] = useState("")
    const [alertType, setAlertType] = useState("success")
    const [returnRUT, setReturnRUT] = useState("")
    const [returnHora, setReturnHora] = useState("")

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
            "horaIngreso_registro": currentDateTime

        }

        axios.post('http://localhost:5000/r_entrada/add', registroRutInicio)
            .then((response) => {
                setExitoRegistroInicio("Registro de Inicio exitoso")
                setAlertType("success");
                setReturnRUT(response.data.rut_empleado)
                setReturnHora(response.data.horaInicio_registro)
                setRut("")
                console.log("Registro del Inicio exitoso", response.data)
            })
            .catch ((error) => {
                setExitoRegistroInicio("Error al registrar el Inicio")
                setAlertType("error")
                setRut("")
                console.error("Error al registrar el Inicio: ", error)
            });
    }

    useEffect(() => {
        if (exitoRegistroInicio){
            const timer = setTimeout(() => {
                setExitoRegistroInicio(null);
                setAlertType("success");
            }, 7000);
            return () => clearTimeout(timer);
        }
    }, [exitoRegistroInicio]);

    const ping = exitoRegistroInicio ? (
        <div className='mt-3'>
            <Alert severity={alertType}>{exitoRegistroInicio}: <br/>
            {returnRUT} a las {returnHora}</Alert>
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

                                <button type="submit" className="btn mt-3"
                                    style={{ backgroundColor: '#121113', color: '#ffffff'}}>
                                    Registrar Entrada
                                </button>
                                {ping}
                            </div>

                            
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RegistroInicio;