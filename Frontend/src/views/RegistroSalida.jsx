import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from '@mui/material/Alert'

function RegistroSalida() {

    const [rut, setRut] = useState("")
    const [currentDateTime, setCurrentDateTime] = useState(null);
    const [exitoRegistroSalida, setExitoRegistroSalida] = useState("")
    const [alertType, setAlertType] = useState("success")
    const [returnRUT, setReturnRUT] = useState("")
    const [returnHora, setReturnHora] = useState("")

    const handleOnChangeRut = (e) => {
        console.log(e.target.value)
        setRut(e.target.value)
    }

    const handleCaptureData = () => {
        const now = new Date();
        const formatedHora = now.toLocaleTimeString()
        setCurrentDateTime(now.toLocaleString())
        setReturnHora(formatedHora);
        setReturnRUT(rut)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        handleCaptureData();
        const registroRutSalida = {
            "rut_empleado":  rut,
            "horaSalida_registro": currentDateTime
        }

        if (rut === ""){
            setAlertType("warning")
            setExitoRegistroInicio("No hay RUT para registrar")
            return
        }

        axios.post('http://localhost:5000/r_salida/add', registroRutSalida)
            .then((response) => {
                setExitoRegistroSalida("Registro de salida exitoso")
                setAlertType("success")
                setRut("")
                console.log("Registro de salida exitoso", response.data)
            })
            .catch ((error) => {
                setExitoRegistroSalida("Error al registrar la salida")
                setAlertType("error")
                setRut("")
                console.error("Error al registrar la salida: ", error)
        });
    }

    useEffect(() => {
        if (exitoRegistroSalida){
            const timer = setTimeout(() => {
                setExitoRegistroSalida(null);
                setAlertType("success");
            }, 7000);
            return () => clearTimeout(timer);
        }
    }, [exitoRegistroSalida]);

    const ping = exitoRegistroSalida ? (
        <div className='mt-3'>
            <Alert severity={alertType}>{exitoRegistroSalida}: <br/>
            {returnRUT} a las {returnHora}</Alert>
        </div>
    ): null;

    return (
        <>
            <h4 className="bg-payne-grey content-title shadow">REGISTRO DE SALIDA</h4>
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
                                    Registrar Salida
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

export default RegistroSalida;