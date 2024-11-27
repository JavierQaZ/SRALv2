import React from "react";
import { Link } from "react-router-dom";

function BloqueConfUsuarios({ path, children, onClick }) {
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <Link to={path} className="bloque-conf-usuarios" onClick={handleClick}>
            <div>{children}</div>
        </Link>
    );
}

export default BloqueConfUsuarios;