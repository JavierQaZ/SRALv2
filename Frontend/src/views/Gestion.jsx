//ELIMINAR ESTE COMENTARIO CUANDO ESTÉ RE-HECHO
//se debe re-estructurar la lógica, además de las alertas.
//Asimilarlo a VisualizacionDatos
//Coordinar con Backend

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from '@mui/material/Alert'
import "../styles/SideAlert.css"
import BloqueGestion from '../components/BloqueGestion';
import BloqueGestionSelect from '../components/BloqueGestionSelect';

function Gestion() {
    const [datos, setDatos] = useState({});
    const [mes, setMes] = useState("");
    const [anio, setAnio] = useState("");
    const [exitoFecha, setExitoFecha] = useState("");
    const [showBloques, setShowBloques] = useState(false)
    const [alertType, setAlertType] = useState("success")

    const handleOnChangeMes = (e) => {
        setMes(e.target.value);
    };

    const handleOnChangeAnio = (e) => {
        setAnio(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (mes === "" || anio === ""){
            setAlertType("warning")
            setExitoFecha("Todos los campos son obligatorios");
            return;
        }

        if ( mes < 1 || mes > 12){
            setAlertType("warning")
            setExitoFecha("El mes debe ser entre 1 y 12")
        }

        const obtenerDatos = () => {
            axios.get(`http://localhost:5000/kpi/gestion?mes=${mes}&anio=${anio}`) //verificar
                .then(response => {
                    if (response.data && response.data.datos){
                        setDatos(response.data);
                        setAlertType("success")
                        setExitoFecha("Fecha enviada exitosamente")
                    } else {
                        setDatos([])
                        setAlertType("warning")
                        setExitoFecha("Error al obtener datos")
                    }
                })
                .catch(error => {
                    setAlertType("error")
                    setExitoFecha("Error al enviar fecha")
                    console.error('Error recolectando datos: ', error);
                });
            setShowBloques(true)
        };

        obtenerDatos();
    };

    useEffect(() => {
        if (exitoFecha){
            const timer = setTimeout(() => {
                setExitoFecha(null);
                setAlertType("success");
            }, 7000);
            return () => clearTimeout(timer);
        }
    }, [exitoFecha]);

    const ping = exitoFecha ? (
        <div className='mt-5 m-3 sidealert '>
            <Alert severity={alertType}>
                {exitoFecha}
            </Alert>
        </div>
    ): null;

    return (
        <>
            <h4 className="bg-payne-grey content-title shadow">GESTIÓN</h4>
            <div className="content-body">
                <div className="d-flex flex-column">
                    <form onSubmit={handleSubmit}>
                        <div className='d-flex justify align-items-center'>
                            <label className='form-label mt-3 me-2'>Mes
                                <input type="text" className='form-control'
                                    value={mes}
                                    onChange={handleOnChangeMes}
                                    placeholder='Ingrese el Mes (1 al 12)'
                                    min='1'
                                    max='12'>
                                </input>
                            </label>
                            <label className='form-label mt-3 me-2'>Año
                                <input type="text" className='form-control'
                                    value={anio}
                                    onChange={handleOnChangeAnio}
                                    placeholder='Ingrese año (XXXX)'>
                                </input>
                            </label>
                            <button
                                type="submit"
                                className="btn mt-5 mb-3"
                                style={{ backgroundColor: '#121113', color: '#ffffff'}}>
                                Aceptar
                            </button>
                            {ping}
                        </div>
                    </form>
                    <hr/>
                    {showBloques && (
                    <div className='gestion-container'>
                        <BloqueGestion title="Costo Total por Mes" value={datos.costo_total_por_mes}/>
                        <BloqueGestion title="Costo por Hora Trabajada" value={datos.costo_por_hora_trabajada}/>
                        <BloqueGestion title="Promedio de Horas Trabajadas" value={datos.promedio_horas_trabajadas}/>
                        <BloqueGestionSelect title="Costo Total por Rol" value={datos.costo_total_por_rol}/>
                    </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Gestion;