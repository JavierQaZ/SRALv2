import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from '@mui/material/Alert'
import  "../styles/SideAlert.css"

function VisualizacionDatos() {
    const [datos, setDatos] = useState([]);
    const [mes, setMes] = useState("");
    const [anio, setAnio] = useState("");
    const [exitoFecha, setExitoFecha] = useState("");
    const [showTable, setShowTable] = useState(false)
    const [alertType, setAlertType] = useState("success")

    useEffect(() => {
        obtenerKpi();
    }, []);

    const obtenerKpi = () => {
        axios.get('http://localhost:5000/empleados/kpi')
            .then(response => {
                if (response.data && response.data.datos) {
                    setDatos(response.data.datos);
                } else {
                    setDatos([]);
                    console.error('La respuesta de KPIs no es un array:', response.data);
                }
            })
            .catch(error => {
                console.error('Error recolectando KPIs: ', error);
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

        if (mes === "" || anio === "") {
            setAlertType("warning")
            setExitoFecha("Todos los campos son obligatorios");
            return;
        }

        if ( mes < 1 || mes > 12){
            setAlertType("warning")
            setExitoFecha("El mes debe ser entre 1 y 12")
        }

        axios.get(`http://localhost:5000/empleados/kpi?mes=${mes}&anio=${anio}`)
            .then((response) => {
                if (response.data && response.data.datos) {
                    setDatos(response.data.datos);
                    setAlertType("success")
                    setExitoFecha("Fecha enviada exitosamente");
                } else {
                    setDatos([]);
                    setAlertType("warning")
                    setExitoFecha("Error al obtener datos");
                    console.error('La respuesta de KPIs no es un array:', response.data);
                }
            })
            .catch((error) => {
                setAlertType("error")
                setExitoFecha("Error al enviar fecha" );
                console.log("Error al enviar fecha", error);
            });
        setShowTable(true)
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
        <div className='mt-5 m-3 sidealert'>
            <Alert severity={alertType}>
                {exitoFecha}
            </Alert>
        </div>
    ): null;

    return (
        <>
            <h4 className="bg-payne-grey content-title shadow">VISUALIZACIÓN DE DATOS</h4>
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
                    {showTable && (
                        <table border="1">
                            <thead>
                                <tr>
                                    <th>RUT</th>
                                    <th>Nombre</th>
                                    <th>Apellidos</th>
                                    <th>Rol</th>
                                    <th>Horas Trabajadas</th>
                                    <th>Salario</th>
                                    <th>Puntualidad</th>
                                    <th>Tasa de Asistencia</th>
                                    <th>Retraso</th>
                                </tr>
                            </thead>
                            <tbody>
                                {datos.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.rut_empleado}</td>
                                        <td>{item.nombre_empleado}</td>
                                        <td>{item.apellidos_empleado}</td>
                                        <td>{item.rol}</td>
                                        <td>{item.horas_trabajadas}</td>
                                        <td>{item.sueldo_total}</td>
                                        <td>{item.puntualidad_promedio}</td>
                                        <td>{item.tasa_asistencia}</td>
                                        <td>{item.indice_retraso}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
}

export default VisualizacionDatos;
