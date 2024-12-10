from ..database.db_conección import get_connection


def costo_total_service(mes, anio, rut_empresa):
    try:
        # Conexión a la base de datos
        connection = get_connection()
        cursor = connection.cursor()
        
        # Llamar al procedimiento almacenado
        cursor.callproc('CalcularCostoTotalPorEmpresa', [mes, anio, rut_empresa])
        
        # Leer los resultados
        resultados = cursor.fetchall()
        if resultados:
            costo_total = resultados[0][0]  # Primer valor en la primera fila
            return {"costo_total": str(costo_total)}
        else:
            return {"costo_total": str(0)}
    
    except Exception as e:
        print(f"Error en costo_total_service: {e}")
        raise
    
    finally:
        # Cerrar conexión y cursor
        if 'cursor' in locals():
            cursor.close()
        if 'connection' in locals():
            connection.close()


def costo_total_por_hora_service(mes, anio, rut_empresa):
    try:
        # Establecer conexión con la base de datos
        connection = get_connection()
        cursor = connection.cursor()

        # Ejecutar el procedimiento almacenado
        cursor.callproc('CalcularCostoTotalPorHora', [mes, anio, rut_empresa])

        # Leer el resultado
        resultado = cursor.fetchone()
        if resultado:
            return {
 #               'total_horas_trabajadas': str(resultado[0]),
 #               'costo_total_mensual': str(resultado[1]),
                'costo_por_hora': int(resultado[2])
            }
        else:
            return {
                'total_horas_trabajadas': 0,
                'costo_total_mensual': 0,
                'costo_por_hora': 0
            }

    except Exception as e:
        print(f"Error en costo_total_por_hora_service: {str(e)}")
        raise

    finally:
        # Asegurar el cierre de conexión
        if 'cursor' in locals():
            cursor.close()
        if 'connection' in locals():
            connection.close()

def promedio_horas_trabajadas_service(mes, anio, rut_empresa):
    try:
        # Establecer conexión con la base de datos
        connection = get_connection()
        cursor = connection.cursor()

        # Ejecutar el procedimiento almacenado
        cursor.callproc('CalcularPromedioHorasTrabajadas', [mes, anio, rut_empresa])

        # Leer el resultado
        resultado = cursor.fetchall()
        if resultado and len(resultado) > 0:
            promedio_horas = resultado[0][0]  # Primer valor en la primera fila
            return {"promedio_horas_trabajadas": str(promedio_horas)}
        else:
            return {"promedio_horas_trabajadas": str(0)}

    except Exception as e:
        print(f"Error en promedio_horas_trabajadas_service: {str(e)}")
        raise

    finally:
        # Asegurar el cierre de conexión
        if 'cursor' in locals():
            cursor.close()
        if 'connection' in locals():
            connection.close()


def costo_total_por_rol_service(mes, anio, rut_empresa):
    try:
        # Establecer conexión con la base de datos
        connection = get_connection()
        cursor = connection.cursor()

        # Ejecutar el procedimiento almacenado
        cursor.callproc('CalcularCostoTotalPorRol', [mes, anio, rut_empresa])

        # Leer el resultado
        resultados = []
        for result in cursor.fetchall():
            # Redondear el costo total a entero
            resultados.append({
                'codigo_rol': result[0],
                'costo_total': int(result[3])  # Redondeo del valor
            })

        return resultados

    except Exception as e:
        print(f"Error en costo_total_por_rol_service: {str(e)}")
        raise

    finally:
        # Asegurar el cierre de conexión
        if 'cursor' in locals():
            cursor.close()
        if 'connection' in locals():
            connection.close()