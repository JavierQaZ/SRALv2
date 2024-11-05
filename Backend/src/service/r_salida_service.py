from ..database.db_conección import get_connection


def add_r_salida_service(rut_empleado):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Llamar al procedimiento almacenado para agregar una hora de salida
        cursor.callproc('agregar_hora_salida', (rut_empleado,))
        
        # Commit para aplicar los cambios en la base de datos
        connection.commit()
        
        # Cerrar conexión y cursor
        cursor.close()
        connection.close()
        
    except Exception as e:
        # Manejar errores
        print("Error al agregar hora de salida:", e)
        raise e


def edit_r_salida_service(horaSalida_registro, rut_empleado):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Llamar al procedimiento almacenado para editar la hora de salida
        cursor.callproc('editar_hora_salida', (horaSalida_registro, rut_empleado))
        
        # Commit para aplicar los cambios en la base de datos
        connection.commit()
        
        # Cerrar conexión y cursor
        cursor.close()
        connection.close()
        
    except Exception as e:
        # Manejar errores
        print("Error al editar la hora de salida:", e)
        raise e

def delete_r_salida_service(horaSalida_registro, rut_empleado):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Llamar al procedimiento almacenado para eliminar un registro de salida
        cursor.callproc('eliminar_hora_salida', (horaSalida_registro, rut_empleado))
        
        # Commit para aplicar los cambios en la base de datos
        connection.commit()
        
        # Cerrar conexión y cursor
        cursor.close()
        connection.close()
        
    except Exception as e:
        # Manejar errores
        print("Error al eliminar registro de salida:", e)
        raise e
    
