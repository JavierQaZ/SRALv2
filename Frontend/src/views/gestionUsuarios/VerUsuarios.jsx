import React, { useEffect, useState } from  'react'
import axios from 'axios'

function VerUsuarios(){
    const [datos, setDatos] = useState([])

    const getData = async () => {
        axios.get(`http://localhost:5000/usuarios/get`)
            .then((response) => {
                setDatos(response.data)
            })
    }

    useEffect(() => {
        getData()
    })

    return (
        <>
            <h4>Visualización de Usuarios</h4>
            <div>
                <table border="1" className='w-100'>
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