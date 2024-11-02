//ELIMINAR ESTE COMENTARIO CUANDO ESTÉ RE-HECHO
//se debe re-estructurar la lógica, además de las alertas.
//Asimilarlo a VisualizacionDatos
//Coordinar con Backend

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from '@mui/material/Alert'
import "../styles/SideAlert.css"

function Gestion() {
    const [datos, setDatos] = useState({});
    const [mes, setMes] = useState("");
    const [anio, setAnio] = useState("");
    const [exitoFecha, setExitoFecha] = useState("");
    const [alertType, setAlertType] = useState("success")

    useEffect(() => {
        obtenerDatos();
    }, []);

    const obtenerDatos = () => {
        axios.get(`http://localhost:5000/kpi/gestion?mes=${mes}&anio=${anio}`)
            .then(response => {
                setDatos(response.data);
            })
            .catch(error => {
                console.error('Error recolectando datos: ', error);
            });
    };

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
        <div className='mt-3 ms-4 sidealert'>
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
                                className="btn ms-4 mt-3"
                                style={{ backgroundColor: '#121113', color: '#ffffff'}}>
                                Aceptar
                            </button>
                            {ping}
                        </div>
                    </form>
                    <hr/>
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre del KPI</th>
                                <th>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Costo Total por Mes</td>
                                <td>{datos.costo_total_por_mes}</td>
                            </tr>
                            <tr>
                                <td>Costo por Hora Trabajada</td>
                                <td>{datos.costo_por_hora_trabajada}</td>
                            </tr>
                            <tr>
                                <td>Promedio de Horas Trabajadas</td>
                                <td>{datos.promedio_horas_trabajadas}</td>
                            </tr>
                            {datos.costo_total_por_rol && datos.costo_total_por_rol.map((rol, index) => (
                                <tr key={index}>
                                    <td>Costo Total de {rol[1]}</td>
                                    <td>{rol[2]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Gestion;
