import React from "react";

const BloqueGestion = ({title, value}) => {

    return (
        <div className="bloque-gestion">
            <h2>{title}</h2>
            <p>{value}</p>
        </div>
    )
}

export default BloqueGestion;