import React, {useState, useEffect} from "react";
import { Routes, Route, Link, useNavigate, Navigate, useLocation} from "react-router-dom";
import axios from 'axios'

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
    const location = useLocation();

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {

                if (error.response && error.response.status === 401) {

                    localStorage.removeItem('auth');
                    sessionStorage.removeItem('auth');

                    navigate('/login');
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('auth');
        sessionStorage.removeItem('auth');
        navigate('/login')
    }

    const [time, setTime] = useState()
    useEffect(() => {
        const formatTimeUnit = (unit) => unit.toString().padStart(2, '0');
        const updateTime = () => {
            const dateObject = new Date()
            const hour = formatTimeUnit(dateObject.getHours())
            const minute = formatTimeUnit(dateObject.getMinutes())
            const second = formatTimeUnit(dateObject.getSeconds())
            const currentTime = `${hour} : ${minute} : ${second}`
            setTime(currentTime)
        }

        const intervalId = setInterval(updateTime, 1000);
        updateTime();

        return () => clearInterval(intervalId)
    }, [])

    const today = new Date();
    const month = today.getMonth()+1;
    const year = today.getFullYear();
    const date = today. getDate();
    const currentDate = date + "/" + month + "/" + year;

    const [datos, setDatos] = useState({
        nombre_empresa: '',
        nombre_usuario: ''
    })

    const getData = async () => {
        axios.get(`http://localhost:5000/home/info_home`)
            .then((response) => {
                setDatos(response.data)
            })
        }

    useEffect(() => {
        getData()
    }, [])

    return(
        (localStorage.getItem("auth")!= undefined) ?
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
                        {location.pathname === '/home' && (
                            <div>
                                <h4 className="bg-payne-grey content-title shadow">{datos.nombre_empresa}</h4>
                                <div className="content-body">
                                    <div className="welcome">
                                        <p>¡Bienvenido/a, {datos.nombre_usuario}!</p>
                                    </div>
                                    <div className="m-4 position-absolute bottom-0 end-0 clockdate">
                                        {time} <br/>
                                        {currentDate}
                                    </div>
                                </div>
                            </div>
                        )}
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
                            <Route path="/configuraciones/*" element={<Configuraciones/>}></Route>
                        </Routes>
                    </main>
                </div>
            </div>
        </div>: <Navigate to = "/login" />
    )
}

export default Home;