from ..database.db_conección import get_connection

def agregar_empleado_service(rut_empleado, nombre_empleado, apellidos_empleado, codigo_rol, rut_empresa):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.callproc('agregar_empleado', (rut_empleado, nombre_empleado, apellidos_empleado, codigo_rol, rut_empresa))
        connection.commit()
    except Exception as e:
        raise e
    finally:
        cursor.close()
        connection.close()


def editar_empleado_service(rut_empleado, nombre_empleado, apellidos_empleado, codigo_rol):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.callproc('editar_empleado', (rut_empleado, nombre_empleado, apellidos_empleado, codigo_rol))
        connection.commit()
    except Exception as e:
        raise e
    finally:
        cursor.close()
        connection.close()


def delete_empleado_service(rut_empleado):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.callproc('eliminar_empleado', (rut_empleado,))
        connection.commit()
    except Exception as e:
        raise e
    finally:
        cursor.close()
        connection.close()


def obtener_empleados(rut_empresa):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute(
            "SELECT rut_empleado, nombre_empleado, apellidos_empleado, codigo_rol FROM empleados WHERE rut_empresa = %s",
            (rut_empresa,)
        )
        empleados = cursor.fetchall()
        return empleados
    except Exception as e:
        raise e
    finally:
        cursor.close()
        connection.close()
