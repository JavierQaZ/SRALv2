import React from "react";
import { Routes, Route, Link, useNavigate} from "react-router-dom";

import iconSettings from "../assets/settings.svg"
import iconLogout from "../assets/logout.svg"

import "../styles/Sidebar.css";
import "../styles/Content.css";


import RegistroInicio from "./RegistroInicio.jsx";
import RegistroSalida from "./RegistroSalida.jsx";
import VisualizacionDatos from "./VisualizacionDatos.jsx";
import Registro from "./Registro.jsx";
import Gestion from "./Gestion.jsx";
import EditarDatos from "./EditarDatos.jsx";
import BorrarDatos from "./BorrarDatos.jsx";
import Informes from "./Informes.jsx";
import Configuraciones from "./Configuraciones.jsx";

function Home(){

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        navigate('/login')
    }

    return(
        <div>
            <div className="container-fluid p-0 overflow-hidden">
                <div className="row">
                    <div className="sidebar col-auto col-sm-4 col-md-3 col-lg-3 col-xl-2 flex-column bg-grey min-vh-100 d-flex justify-content-between ">
                        <div className="d-flex flex-column m-1" id="sidebar-container">
                            <div className="row main">
                                <Link to=""className="d-inline-flex p-2 main-log" id="side-item-brand">
                                    <img
                                        src="/vite.svg"
                                        alt="logo"
                                        width="30px"
                                        height="30px"
                                    />
                                    <h5 className="main-title">SRAL</h5>
                                </Link>
                            </div>
                            <Link to="registroInicio" className="side-item">
                                Registro Inicio
                            </Link>
                            <Link to="registroSalida" className="side-item">
                                Registro Salida
                            </Link>
                            <Link to="informes" className="side-item">
                                Informes
                            </Link>
                            <Link to="visualizacionDatos" className="side-item">
                                Visualización
                            </Link>
                            <Link to="gestion" className="side-item">
                                Gestión
                            </Link>
                            <Link to="registro" className="side-item">
                                Registro
                            </Link>
                            <Link to="editarDatos" className="side-item">
                                Editar Datos
                            </Link>
                            <Link to="borrarDatos" className="side-item">
                                Borrar Datos
                            </Link>

                            <div className="mt-auto d-flex flex-row row-auto m-1 row-sm-4 row-md-3 row-lg-3 row-xl-2 justify-content-between" id="bottom-sidebar-container">
                                <Link to="configuraciones" className="bottom-side-item flex-grow-1 text-center">
                                <img
                                        src={iconSettings}
                                        alt="Ajustes"
                                        width="30px"
                                        height="30px"
                                    />
                                </Link>
                                <Link to="/login" onClick={handleLogout} className="bottom-side-item flex-grow-1 text-center">
                                <img
                                        src={iconLogout}
                                        alt="Cerrar Sesión"
                                        width="30px"
                                        height="30px"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>

                    <main className="col-auto col-sm-9 col-md-9 col-lg-9 col-xl-10 content ps-0">
                        <Routes>
                            /* añadir rutas */
                            <Route path="/registroInicio" element={<RegistroInicio/>}></Route>
                            <Route path="/registroSalida" element={<RegistroSalida/>}></Route>
                            <Route path="/visualizacionDatos" element={<VisualizacionDatos/>}></Route>
                            <Route path="/gestion" element={<Gestion/>}></Route>
                            <Route path="/informes" element={<Informes/>}></Route>
                            <Route path="/registro/*" element={<Registro/>}></Route>
                            <Route path="/editarDatos/*" element={<EditarDatos/>}></Route>
                            <Route path="/borrarDatos/*" element={<BorrarDatos/>}></Route>
                            <Route path="/configuraciones" element={<Configuraciones/>}></Route>
                        </Routes>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default Home;