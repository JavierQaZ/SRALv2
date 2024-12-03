import React from 'react'

function AgregarUsuario(){
    return (
        <>
            <form>
                <div className='d-flex justify-content-around flex-wrap'>
                    <div className='d-flex flex-column'>
                        <h4>Agregar Usuarios</h4>
                        <label className='form-label mt-3'>
                            RUT del Usuario
                            <input type="text" className='form-control'
                            //value={}
                            //onChange={handleOnChange}
                            />
                        </label>

                        <label className='form-label mt-3'>
                            Contraseña
                            <input type="password" className='form-control'
                            //value={}
                            //onChange={handleOnChange}
                            />
                        </label>

                        <label className="form-label mt-3">
                            Confirmar Contraseña
                            <input type="password" className='form-control'
                            //value={}
                            //onChange={handleOnChange}
                            />
                        </label>

                    <button
                        type="submit"
                        className='btn m-1 mt-3 '
                        style={{ backgroundColor: '#121113', color: '#ffffff'}}>
                        Agregar Usuario
                    </button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default AgregarUsuario;