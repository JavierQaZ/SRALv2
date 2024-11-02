import React, {useState, useEffect} from "react";
import axios from "axios";
import Alert from '@mui/material/Alert'

function Empleado() {
    const [rut, setRut] = useState("")
    const [nombre, setNombre] = useState("")
    const [apellidos, setApellidos] = useState("")
    const [rol, setRol] = useState("-1")
    const [exitoEditarEmpleado, setExitoEditarEmpleado] = useState("")
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
            setExitoEditarEmpleado("Todos los campos son obligatorios")
            return;
        }

        const editarEmpleado = {
            "rut_empleado": rut,
            "nombre_empleado": nombre,
            "apellidos_empleado": apellidos,
            "codigo_rol": rol
        }

        axios.put('http://localhost:5000/empleados/edit', editarEmpleado)
            .then((response) => {
                setAlertType("success")
                setExitoEditarEmpleado("Datos editados exitosamente")
                console.log("Datos del empleado editados exitosamente", response.data)

                setRut("");
                setNombre("");
                setApellidos("");
                setRol("-1");
            })
            .catch ((error) => {
                setAlertType("error")
                setExitoEditarEmpleado("Error al editar el empleado")
                console.error("Error al editar los datos del empleado: ", error)

                setRut("");
                setNombre("");
                setApellidos("");
                setRol("-1");
            });
    }

    useEffect(() => {
        if (exitoEditarEmpleado){
            const timer = setTimeout(() => {
                setExitoEditarEmpleado(null);
                setAlertType("success");
            }, 7000);
            return () => clearTimeout(timer);
        }
    }, [exitoEditarEmpleado]);

    const ping = exitoEditarEmpleado ? (
        <div className='mt-3'>
            <Alert severity={alertType}>{exitoEditarEmpleado}</Alert>
        </div>
    ): null;

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className='d-flex flex-column'>
                    <h4>Editar Datos de Empleado</h4>
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
                <button
                    type="submit"
                    className="btn ms-4 mt-3"
                    style={{ backgroundColor: '#121113', color: '#ffffff'}}>
                    Confirmar cambios
                </button>
                <br/>
                <br/>
                {ping}
            </form>
        </>
    )
}

export default Empleado;