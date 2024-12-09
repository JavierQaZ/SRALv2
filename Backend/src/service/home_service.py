from ..database.db_conección import get_connection

def obtener_nombre_empresa(rut_empresa):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Consulta para obtener el nombre de la empresa
        query = "SELECT nombre_empresa FROM empresas WHERE rut_empresa = %s"
        cursor.execute(query, (rut_empresa,))

        # Obtener el resultado
        result = cursor.fetchone()
        return result[0] if result else None

    except Exception as e:
        raise e
    finally:
        cursor.close()
        connection.close()

from ..database.db_conección import get_connection

def obtener_nombre_usuario(rut_usuario):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Consulta para obtener el nombre del usuario
        query = "SELECT CONCAT(nombre_usuario, ' ', apellidos_usuario) AS nombre_completo FROM usuarios WHERE rut_usuario = %s"
        cursor.execute(query, (rut_usuario,))

        # Obtener el resultado
        result = cursor.fetchone()
        return result[0] if result else None

    except Exception as e:
        raise e
    finally:
        cursor.close()
        connection.close()


