import React, {useState, useEffect} from 'react';
import axios from "axios";
import Alert from '@mui/material/Alert'

function Empleado() {

    const [rut, setRut] = useState("")
    const [nombre, setNombre] = useState("")
    const [apellidos, setApellidos] = useState("")
    const [rol, setRol] = useState("-1")
    const [exitoRegistrarEmpleado, setExitoRegistrarEmpleado] = useState("")
    const [roles, setRoles] = useState([])
    const [alertType, setAlertType] = useState("success")

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
            setAlertType("warning")
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
                setAlertType("success")
                setExitoRegistrarEmpleado("Empleado registrado exitosamente")
                console.log("Empleado registrado exitosamente", response.data)

                setRut("");
                setNombre("");
                setApellidos("");
                setRol("-1");
            })
            .catch ((error) => {
                setAlertType("error")
                setExitoRegistrarEmpleado("Error al registrar el empleado")
                console.error("Error al registrar el empleado: ", error)

                setRut("");
                setNombre("");
                setApellidos("");
                setRol("-1");
            });
    }

    useEffect(() => {
        if (exitoRegistrarEmpleado){
            const timer = setTimeout(() => {
                setExitoRegistrarEmpleado(null);
                setAlertType("success");
            }, 7000);
            return () => clearTimeout(timer);
        }
    }, [exitoRegistrarEmpleado]);

    const ping = exitoRegistrarEmpleado ? (
        <div className='mt-3'>
            <Alert severity={alertType}>{exitoRegistrarEmpleado}</Alert>
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
                            className='custom-select form-control'
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

                    <button
                        type="submit"
                        className="btn mt-3"
                        style={{ backgroundColor: '#121113', color: '#ffffff'}}>
                        Registrar Empleado
                    </button>
                    {ping}
                </div>
            </form>
        </>
    )
}

export default Empleado;