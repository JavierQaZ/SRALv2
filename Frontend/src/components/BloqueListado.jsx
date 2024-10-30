import React from "react";
import { Link } from "react-router-dom";

function BloqueListado({ path, children, onClick }) {
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <Link to={path} className="bloque-listado" onClick={handleClick}>
            <div>{children}</div>
        </Link>
    );
}

export default BloqueListado;