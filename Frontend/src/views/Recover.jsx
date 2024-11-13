import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardFooter, CardBody, CardText} from "react-bootstrap"

function Recover(){
    return (
        <>
            <div className="flex">
            <Card className="card">
                <CardHeader className="card-header">
                    <CardTitle className="text-2xl font-bold text-center">¿Olvidó su Contraseña?</CardTitle>
                </CardHeader>
                <CardBody>
                    <CardText>Envíenos un correo a:</CardText>
                    <h4>soporte@sral.cl</h4>
                </CardBody>
                <CardFooter className="card-footer">
                    <Link to="/login" className="text-sm text-center text-blue-500 hover:underline">
                    Volver al Login
                    </Link>
                </CardFooter>
            </Card>
        </div>
        </>
    )
}

export default Recover;