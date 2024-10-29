import React, { useState, useEffect } from 'react';
import axios from 'axios';

function VisualizacionDatos() {
    const [datos, setDatos] = useState([]);
    const [mes, setMes] = useState("");
    const [anio, setAnio] = useState("");
    const [exitoFecha, setExitoFecha] = useState("");

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
            setExitoFecha("Todos los campos son obligatorios");
            return;
        }

        axios.get(`http://localhost:5000/empleados/kpi?mes=${mes}&anio=${anio}`)
            .then((response) => {
                if (response.data && response.data.datos) {
                    setDatos(response.data.datos);
                    setExitoFecha("Fecha enviada");
                } else {
                    setDatos([]);
                    setExitoFecha("Error al obtener datos");
                    console.error('La respuesta de KPIs no es un array:', response.data);
                }
            })
            .catch((error) => {
                setExitoFecha("Error al enviar fecha");
                console.log("Error al enviar fecha", error);
            });
    };

    return (
        <>
            <h4 className="bg-payne-grey content-title shadow">VISUALIZACIÓN DE DATOS</h4>
            <div className="content-body">
                <div className="d-flex flex-column">
                    <form onSubmit={handleSubmit}>
                        <div className='d-flex justify'>
                            <label className='form-label mt-3'>Mes
                                <input type="text" className='form-control'
                                    value={mes}
                                    onChange={handleOnChangeMes}
                                    placeholder='Ingrese el Mes (1 al 12)'>
                                </input>
                            </label>
                            <label className='form-label mt-3'>Año
                                <input type="text" className='form-control'
                                    value={anio}
                                    onChange={handleOnChangeAnio}
                                    placeholder='Ingrese año (XXXX)'>
                                </input>
                            </label>
                            <button type="submit" className="btn btn-warning ms-4 mt-3 text-white">
                                Aceptar
                            </button>
                        </div>
                    </form>
                    <p>{exitoFecha}</p>
                    <table>
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
                </div>
            </div>
        </>
    );
}

export default VisualizacionDatos;
