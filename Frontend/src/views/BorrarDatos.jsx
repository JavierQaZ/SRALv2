import React from "react";
import { Routes, Route } from 'react-router-dom';
import BloqueListado from "../components/BloqueListado.jsx";
import Empleado from "./borrarDatos/Empleado.jsx";
import Roles from '../views/borrarDatos/Rol.jsx';

const BloqueListados = () => {
    return (
        <>
            <BloqueListado path="empleados">Empleados</BloqueListado>
            <BloqueListado path="roles">Roles</BloqueListado>
        </>
    )
}

function BorrarDatos() {
    return(
        <>
            <>
        <h4 className="bg-payne-grey content-title shadow">BORRAR DATOS</h4>
            <div className="content-body">
                <div className="container">
                    <div className="d-flex justify-content-around flex-wrap">
                        <Routes>
                            <Route path="/" element={<BloqueListados />}></Route>
                            <Route path="/empleados" element={<Empleado/>}></Route>
                            <Route path="/roles" element={<Roles/>}></Route>
                        </Routes>
                    </div>
                </div>
            </div>
        </>
        </>
    )
}

export default BorrarDatos;