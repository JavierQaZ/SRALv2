from ..database.db_conección import get_connection

def costo_total_por_mes(rut_empresa):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Consulta para obtener la suma de los sueldos de todos los roles filtrados por rut_empresa
        cursor.execute("""
            SELECT SUM(sueldoPorHora_rol) 
            FROM roles 
            WHERE rut_empresa = %s
        """, (rut_empresa,))

        # Obtener el resultado de la consulta
        total_sueldos = cursor.fetchone()[0]

        return total_sueldos if total_sueldos is not None else 0

    except Exception as e:
        raise e
    finally:
        cursor.close()
        connection.close()

