import React from "react";
import {Routes, Route, Link, Navigate} from "react-router-dom";

function Home(){
    return(
        <>
            <div>
                <div>
                    <div>
                        <div>
                            <Link>
                                <img
                                    src="../assets/react.svg"
                                    alt="logo"
                                    width="40px"
                                    height="40px"/>
                                <h5>SRAL</h5>
                            </Link>

                            <Link>
                                Registro Inicio
                            </Link>

                            <Link>
                                Registro Salida
                            </Link>

                            <Link>
                                Registro Visualización
                            </Link>

                            <Link>
                                Registro
                            </Link>
                            
                            <Link>
                                Gestión
                            </Link>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home;