import React, {useState, useEffect} from 'react';
import axios from "axios";

function Empleado() {

    const [rut, setRut] = useState("")
    const [nombre, setNombre] = useState("")
    const [apellidos, setApellidos] = useState("")
    const [rol, setRol] = useState("-1")
    const [exitoRegistrarEmpleado, setExitoRegistrarEmpleado] = useState("")
    const [roles, setRoles] = useState([])

    useEffect(() => {
        axios.get('http://localhost:5000/rol/get')
            .then((response) => {
                setRoles(response.data)
            })
            .catch((error) => {
                console.error("Error al obtemer los roles: ", error);
            })
    }, []);

    const handleOnChangeRut = (e) => {
        console.log(e.target.value)
        setRut(e.target.value)
    }

    const handleOnChangeNombre = (e) => {
        console.log(e.target.value)
        setNombre(e.target.value)
    }
    const handleOnChangeApellidos = (e) => {
        console.log(e.target.value)
        setApellidos(e.target.value)
    }

    const handleOnChangeRol = (e) => {
        console.log(e.target.value)
        setRol(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (rut === "" || nombre === "" || apellidos === "" || rol === "-1") {
            setExitoRegistrarEmpleado("Todos los campos son obligatorios")
            return;
        }

        const nuevoEmpleado = {
            "rut_empleado": rut,
            "nombre_empleado": nombre,
            "apellidos_empleado": apellidos,
            "codigo_rol": rol
        }

        axios.post('http://localhost:5000/empleados/add', nuevoEmpleado)
            .then((response) => {
                setExitoRegistrarEmpleado("Empleado registrado exitosamente")
                console.log("Empleado registrado exitosamente", response.data)
            })
            .catch ((error) => {
                setExitoRegistrarEmpleado("Error al registrar el empleado")
                console.error("Error al registrar el empleado: ", error)
            });
    }

    const ping = exitoRegistrarEmpleado ? (
        <div className='mt-3'>
            <p>
                {exitoRegistrarEmpleado}: <br/>
                {nombre} {apellidos}
            </p>
        </div>
    ): null;

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className='d-flex flex-column'>
                    <h4>Registro de Empleados</h4>
                    <label className="form-label mt-3">
                        RUT
                        <input type="text" className="form-control"
                        value={rut}
                        onChange={handleOnChangeRut}
                        />
                    </label>

                    <label className="form-label mt-3">
                        Nombre
                        <input type="text" className="form-control"
                        value={nombre}
                        onChange={handleOnChangeNombre}
                        />
                    </label>

                    <label className="form-label mt-3">
                        Apellidos
                        <input type="text" className="form-control"
                        value={apellidos}
                        onChange={handleOnChangeApellidos}
                        />
                    </label>

                    <label className='form-label mt-3'>
                        Rol
                        <br/>
                        <select
                            className='custom-select'
                            id='inlineFormCustomSelectPref'
                            value={rol}
                            onChange={handleOnChangeRol}
                        >
                            <option value='-1'>Seleccione el Rol</option>
                            {roles.map((rol) => (
                                <option key={rol.codigo_rol} value={rol.codigo_rol}>{rol.nombre_rol}</option>
                            ))}
                        </select>
                    </label>
                </div>

                <button type="submit" className="btn btn-warning ms-4 mt-3 text-white">
                    Registrar Empleado
                </button>
                <br/>
                <br/>
                {ping}
            </form>
        </>
    )
}

export default Empleado;