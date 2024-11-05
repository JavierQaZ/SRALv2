from ..database.db_conección import get_connection

def add_rol_service(nombre_rol,sueldoPorHora_rol):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Llamar al procedimiento almacenado para agregar un empleado
        cursor.callproc('agregar_rol', (nombre_rol, sueldoPorHora_rol))
        
        # Commit para aplicar los cambios en la base de datos
        connection.commit()
        
        # Cerrar conexión y cursor
        cursor.close()
        connection.close()
        
    except Exception as e:
        # Manejar errores
        print("Error al agregar empleado:", e)
        
def editar_rol_service(codigo_rol, nombre_rol, sueldoPorHora_rol):
    try:
        # Obtener la conexión a la base de datos
        connection = get_connection()
        cursor = connection.cursor()

        # Llamar al procedimiento almacenado para editar un rol
        cursor.callproc('editar_rol', (codigo_rol, nombre_rol, sueldoPorHora_rol))
        
        # Commit para aplicar los cambios en la base de datos
        connection.commit()
        
        # Cerrar conexión y cursor
        cursor.close()
        connection.close()
        
    except Exception as e:
        # Manejar errores
        print("Error al editar rol:", e)
        raise e
        
def delete_rol_service(codigo_rol):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Llamar al procedimiento almacenado para eliminar un rol
        cursor.callproc('eliminar_rol', (codigo_rol,))
        
        # Commit para aplicar los cambios en la base de datos
        connection.commit()
        
        # Cerrar conexión y cursor
        cursor.close()
        connection.close()
        
    except Exception as e:
        # Manejar errores
        print("Error al eliminar rol:", e)
        raise e
    

def obtener_roles():
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Ejecutar la consulta SQL para obtener todos los roles
        cursor.execute("SELECT * FROM rol")

        # Obtener los resultados
        roles = cursor.fetchall()

        # Cerrar conexión y cursor
        cursor.close()
        connection.close()

        return roles
    
    except Exception as e:
        # Manejar errores
        print("Error al obtener roles:", e)
        return None


def obtener_costo_horas_por_rol(codigo_rol, mes, anio):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Llamar al procedimiento almacenado
        cursor.callproc('CalcularCostoHorasPorRol3', (codigo_rol, mes, anio))

        # Ejecutar una consulta para obtener los resultados del procedimiento almacenado
        result = cursor.fetchone()
        
        # Asignar valores devueltos, si existen resultados
        if result:
            total_horas_trabajadas = result[0]
            costo_total = result[1]
        else:
            total_horas_trabajadas = 0
            costo_total = 0

        # Cerrar conexión y cursor
        cursor.close()
        connection.close()

        return {
            "codigo_rol": codigo_rol,
            "mes": mes,
            "anio": anio,
            "total_horas_trabajadas": total_horas_trabajadas,
            "costo_total": costo_total
        }

    except Exception as e:
        print("Error al obtener el costo de horas por rol:", e)
        raise