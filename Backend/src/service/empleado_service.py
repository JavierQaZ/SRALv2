from ..database.db_conección import get_connection


def agregar_empleado_service(rut_empleado, nombre_empleado, apellidos_empleado, codigo_rol):#, TotalHoras, SueldoTotal):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Llamar al procedimiento almacenado para agregar un empleado
        cursor.callproc('agregar_empleado', (rut_empleado, nombre_empleado, apellidos_empleado, codigo_rol))#, TotalHoras, SueldoTotal))
        
        # Commit para aplicar los cambios en la base de datos
        connection.commit()
        
        # Cerrar conexión y cursor
        cursor.close()
        connection.close()
        
    except Exception as e:
        # Manejar errores
        print("Error al agregar empleado:", e)
        
        
def editar_empleado_service(rut_empleado, nombre_empleado, apellidos_empleado, codigo_rol, TotalHoras, SueldoTotal):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Llamar al procedimiento almacenado para editar un empleado
        cursor.callproc('editar_empleado', (rut_empleado, nombre_empleado, apellidos_empleado, codigo_rol, TotalHoras, SueldoTotal))
        
        # Commit para aplicar los cambios en la base de datos
        connection.commit()
        
        # Cerrar conexión y cursor
        cursor.close()
        connection.close()
        
    except Exception as e:
        # Manejar errores
        print("Error al editar empleado:", e)
        raise e
    
def delete_empleado_service(rut_empleado):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Llamar al procedimiento almacenado para eliminar un empleado
        cursor.callproc('eliminar_empleado', (rut_empleado,))
        
        # Commit para aplicar los cambios en la base de datos
        connection.commit()
        
        # Cerrar conexión y cursor
        cursor.close()
        connection.close()
        
    except Exception as e:
        # Manejar errores
        print("Error al eliminar empleado:", e)
        raise e
        
def obtener_empleados_service():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        
        # Consulta para obtener todos los empleados
        cursor.execute("SELECT rut_empleado, nombre_empleado, apellidos_empleado, codigo_rol, totalHorasTrabajadas_empleado, sueldoTotal_empleado FROM empleados")
        
        # Obtener todos los registros
        empleados = cursor.fetchall()
        
        # Cerrar conexión y cursor
        cursor.close()
        connection.close()
        
        return empleados
    
    except Exception as e:
        print("Error al obtener empleados:", e)
        return None
    
#{
#    "rut_empleado": "1111111-8",
#    "nombre_empleado": "perla",
#    "apellidos_empleado": "Pérez",
#    "codigo_rol": "1",
#    "TotalHoras": 40,
#    "SueldoTotal": 1000
#}



