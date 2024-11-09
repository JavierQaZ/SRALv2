import React, {useState, useEffect} from "react";
import axios from "axios"
import Alert from '@mui/material/Alert'
import "../styles/SideAlert.css"

function Informes(){
    const [informeSeleccionado, setInformeSeleccionado] = useState("")
    const [exitoInforme1, setExitoInforme1] = useState("")
    const [exitoInforme2, setExitoInforme2] = useState("")
    const [exitoInforme3, setExitoInforme3] = useState("")
    const [alertType1, setAlertType1] = useState("success")
    const [alertType2, setAlertType2] = useState("success")
    const [alertType3, setAlertType3] = useState("success")
    const [roles, setRoles] = useState("")

    useEffect(() => {
        axios.get('http://localhost:5000/rol/get')
            .then((response) => {
                setRoles(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener los roles: ", error);
            });
    }, []);

    //Informe 1 - Indicadores Laborales (individuales)
    const [i1Rut, setI1Rut] = useState("")
    const [i1Mes, setI1Mes] = useState("")
    const [i1Anio, setI1Anio] = useState("")

    const handleOnChangei1Rut = (e) => {
        setI1Rut(e.target.value)}

    const handleOnChangei1Mes = (e) => {
        setI1Mes(e.target.value)}

    const handleOnChangei1Anio = (e) => {
        setI1Anio(e.target.value)}

    const handleSubmit1 = (e) => {
        e.preventDefault();

        if (i1Rut === "" || i1Mes === "" || i1Anio === ""){
            setAlertType1("warning")
            setExitoInforme1("Todos los campos son obligatorios")
            return;
        }

        if ( i1Mes < 1 || i1Mes > 12 ){
            setAlertType1("warning")
            setExitoInforme1("El mes debe ser entre 1 y 12")
        }

        //axios
    }

    //Informe 2 - Costo Laboral por Rol
    const [i2Rol, setI2Rol] = useState("")
    const [i2Mes, setI2Mes] = useState("")
    const [i2Anio, setI2Anio] = useState("")

    const handleOnChangei2Rol = (e) => {
        setI2Rol(e.target.value)}

    const handleOnChangei2Mes = (e) => {
        setI2Mes(e.target.value)}

    const handleOnChangei2Anio = (e) => {
        setI2Anio(e.target.value)}

    const handleSubmit2 = (e) => {
        e.preventDefault();

        if (i2Rol === "-1" || i2Mes === "" || i2Anio === ""){
            setAlertType2("warning")
            setExitoInforme2("Todos los campos son obligatorios")
            return;
        }

        if ( i2Mes < 1 || i2Mes > 12 ){
            setAlertType2("warning")
            setExitoInforme2("El mes debe ser entre 1 y 12")
        }

        //axios
    }

    //Informe 3 - Costo Total Laboral
    const [i3Mes, setI3Mes] = useState("")
    const [i3Anio, setI3Anio] = useState("")

    const handleOnChangei3Mes = (e) => {
        setI3Mes(e.target.value)}

    const handleOnChangei3Anio = (e) => {
        setI3Anio(e.target.value)}

    const handleSubmit3 = (e) => {
        e.preventDefault();

        if (i3Mes === "" || i3Anio === ""){
            setAlertType3("warning")
            setExitoInforme3("Todos los campos son obligatorios")
            return;
        }

        if ( i3Mes < 1 || i3Mes > 12 ){
            setAlertType3("warning")
            setExitoInforme3("El mes debe ser entre 1 y 12")
        }

        //axios
    }

    const handleOnChangeNombreInforme = (e) => {
        setInformeSeleccionado(e.target.value);
    }

    useEffect(() => {
        if (exitoInforme1){
            const timer = setTimeout(() => {
                setExitoInforme1(null);
                setAlertType1("success");
            }, 7000);
            return () => clearTimeout(timer);
        }
    }, [exitoInforme1]);

    const ping1 = exitoInforme1 ? (
            <div className="">
                <Alert severity={alertType1}>
                    {exitoInforme1}
                </Alert>
            </div>
    ): null;

    useEffect(() => {
        if (exitoInforme2){
            const timer = setTimeout(() => {
                setExitoInforme2(null);
                setAlertType2("success");
            }, 7000);
            return () => clearTimeout(timer);
        }
    }, [exitoInforme2]);

    const ping2 = exitoInforme2 ? (
        <div>
            <Alert severity={alertType2}>
                {exitoInforme2}
            </Alert>
        </div>
    ): null;

    useEffect(() => {
        if (exitoInforme3){
            const timer = setTimeout(() => {
                setExitoInforme3(null);
                setAlertType3("success");
            }, 7000);
            return () => clearTimeout(timer);
        }
    }, [exitoInforme3]);

    const ping3 = exitoInforme3 ? (
        <div>
            <Alert severity={alertType3}>
                {exitoInforme3}
            </Alert>
        </div>
    ): null;

    return(
        <>
            <h4 className="bg-payne-grey content-title shadow">INFORMES</h4>
            <div className='content-body'>
                <div className='container'>
                    <form>
                        <label className="form-label mt-3">Informe</label>
                        <select
                            className="custom-select form-control"
                            id='inlineFormCustomSelectPref'
                            value={informeSeleccionado}
                            onChange={handleOnChangeNombreInforme}
                        >
                            <option value='-1'> Seleccione el Informe</option>
                            <option value="1">Indicadores Laborales (individual)</option>
                            <option value="2">Costo Laboral por Rol</option>
                            <option value="3">Costo Laboral Total</option>
                        </select>
                    </form>
                    <hr/>
                    {informeSeleccionado === '1' && (
                        <div className="d-flex align-items-center justify-content-between position-relative">
                            <form onSubmit={handleSubmit1}>
                                <label className="form-label mt-3 me-2"> RUT del Empleado
                                    <input type="text" className="form-control"
                                        value={i1Rut}
                                        onChange={handleOnChangei1Rut}
                                    >
                                    </input>
                                </label>
                                <label className="form-label mt-3 me-2"> Mes
                                    <input type="text" className="form-control"
                                        value={i1Mes}
                                        onChange={handleOnChangei1Mes}
                                        min='1'
                                        max='12'>
                                    </input>
                                </label>
                                <label className="form-label mt-3 me-2"> Año
                                    <input type="text" className="form-control"
                                        value={i1Anio}
                                        onChange={handleOnChangei1Anio}
                                    >
                                    </input>
                                </label>
                                <button
                                    type="submit"
                                    className="btn mb-1"
                                    style={{ backgroundColor: '#121113', color: '#ffffff'}}>
                                    Aceptar
                                </button>
                                <div>{ping1}</div>
                            </form>
                        </div>
                    )}
                    {informeSeleccionado === '2' && (
                        <div className="d-flex align-items-center justify-content-between">
                        <form onSubmit={handleSubmit2}>
                            <label className="form-label mt-3 me-2"> Rol
                                <select
                                className='custom-select form-control'
                                id='inlineFormCustomSelectPref'
                                value={i2Rol}
                                onChange={handleOnChangei2Rol}>
                                <option value='-1'>Seleccione el Rol</option>
                                {roles.map((rolItem) => (
                                    <option key={rolItem.codigo_rol} value={rolItem.codigo_rol}>{rolItem.nombre_rol}</option>
                                ))}
                                </select>
                            </label>
                            <label className="form-label mt-3 me-2"> Mes
                                <input type="text" className="form-control"
                                    value={i2Mes}
                                    onChange={handleOnChangei2Mes}
                                    min='1'
                                    max='12'>
                                </input>
                            </label>
                            <label className="form-label mt-3 me-2"> Año
                                <input type="text" className="form-control"
                                    value={i2Anio}
                                    onChange={handleOnChangei2Anio}
                                >
                                </input>
                            </label>
                            <button
                                type="submit"
                                className="btn mb-1"
                                style={{ backgroundColor: '#121113', color: '#ffffff'}}>
                                Aceptar
                            </button>
                            {ping2}
                        </form>
                        </div>
                    )}
                    {informeSeleccionado === '3' && (
                        <div className="d-flex align-items-center justify-content-between">
                        <form onSubmit={handleSubmit3}>
                            <label className="form-label mt-3 me-2"> Mes
                                <input type="text" className="form-control"
                                    value={i3Mes}
                                    onChange={handleOnChangei3Mes}
                                    min='1'
                                    max='12'>
                                </input>
                            </label>
                            <label className="form-label mt-3 me-2"> Año
                                <input type="text" className="form-control"
                                    value={i3Anio}
                                    onChange={handleOnChangei3Anio}
                                >
                                </input>
                            </label>
                            <button
                                type="submit"
                                className="btn mb-1"
                                style={{ backgroundColor: '#121113', color: '#ffffff'}}>
                                Aceptar
                            </button>
                            {ping3}
                        </form>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Informes;