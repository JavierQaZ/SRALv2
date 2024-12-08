import React, { useState } from  'react'
import axios from 'axios'

function VerUsuarios(){
    const [datos, setDatos] = useState([])

    axios.get(`http://localhost:5000/usuarios/get`)
            .then((response) => {
                if (response.data && response.data.datos) {
                    setDatos(response.data.datos);
                } else {
                    setDatos([]);
                    console.error('Error al obtener los datos: ', response.data);
                }
            })
            .catch((error) => {
                console.log("Error al obtener los datos", error);
            });


    return (
        <>
            <h4>Visualización de Usuarios</h4>
            <div>
                <table border="1">
                    <thead>
                        <tr>
                            <th>RUT</th>
                            <th>Nombre</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datos.map((item, index) => (
                            <tr key = {index}>
                                <td>{item.rut_usuario}</td>
                                <td>{item.nombre_usuario} {item.apellidos_usuario}</td>
                                <td>{item.email_usuario}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default VerUsuarios;