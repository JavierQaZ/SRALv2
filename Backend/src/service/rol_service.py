from ..database.db_conección import get_connection

def add_rol_service(nombre_rol, sueldoPorHora_rol, rut_empresa):
    try:
        connection = get_connection()
        cursor = connection.cursor()


        # Llamar al procedimiento almacenado para agregar un rol, incluyendo rut_empresa
        cursor.callproc('agregar_rol', (nombre_rol, sueldoPorHora_rol, rut_empresa))
        
        # Commit para aplicar los cambios en la base de datos
        connection.commit()
        

        # Cerrar conexión y cursor
        cursor.close()
        connection.close()
        

    except Exception as e:
        # Manejar errores
        print("Error al agregar empleado:", e)
        print("Error al agregar rol:", e)

        
def editar_rol_service(codigo_rol, sueldoPorHora_rol):
    try:
        # Obtener la conexión a la base de datos
        connection = get_connection()
        cursor = connection.cursor()

        # Llamar al procedimiento almacenado para actualizar el sueldo por hora del rol
        cursor.callproc('editar_rol', (codigo_rol, sueldoPorHora_rol))
        
        # Commit para aplicar los cambios en la base de datos
        # Aplicar los cambios en la base de datos
        connection.commit()
        
        # Cerrar conexión y cursor


        
    except Exception as e:
        # Manejar errores

        print("Error al actualizar sueldo por hora del rol:", e)
        raise e




        
#def delete_rol_service(codigo_rol):
#    try:
#


# Este es el servicio que obtendría los roles por rut_empresa
def obtener_roles(rut_empresa):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Obtener los resultados
        # Filtramos por rut_empresa para obtener los roles específicos de esa empresa
        cursor.execute("""
            SELECT codigo_rol, nombre_rol, sueldoPorHora_rol
            FROM rol
            WHERE rut_empresa = %s
        """, (rut_empresa,))
        
        # Obtener todos los resultados
        roles = cursor.fetchall()

        return roles
    

    except Exception as e:
        # Manejar errores
        print("Error al obtener roles:", e)
        return None

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()



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

    
def delete_rol_service(codigo_rol):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Llamar al procedimiento almacenado para eliminar el rol
        cursor.callproc('eliminar_rol', (codigo_rol,))

        # Confirmar los cambios en la base de datos
        connection.commit()

    except Exception as e:
        raise e

    finally:
        # Asegurarse de cerrar el cursor y la conexión
        cursor.close()
        connection.close()
