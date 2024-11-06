import React, {useState, useEffect} from "react";

function Informes(){
    const [nombreInforme, setNombreInforme] = useState("");

    const handleOnChangeNombreInforme = (e) => {
        setNombreInforme(e.target.value)
    }

    const handleSubmitInforme = (e) => {

    }



    return(
        <>
            <h4 className="bg-payne-grey content-title shadow">INFORMES</h4>
            <div className='content-body'>
                <div className='container'>
                    <form onSubmit={handleSubmitInforme}>
                        <label className="form-label mt-3">Informe</label>
                        <br/>
                        <select
                            className="custom-select"
                            id='inlineFormCustomSelectPref'
                            value={nombreInforme}
                            onChange={handleOnChangeNombreInforme}
                        >
                            <option value='-1'> Seleccione el Informe</option>
                        </select>
                    </form>
                    <hr/>
                    
                </div>
            </div>
        </>
    )
}

export default Informes;