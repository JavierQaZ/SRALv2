from ..database.db_conección import get_connection
from decimal import Decimal, ROUND_HALF_UP

def obtener_kpi_service(mes, anio, rut_empresa):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Llamar al procedimiento almacenado para obtener KPIs por mes y año
        cursor.callproc('calcular_kpis_empresa', (mes, anio, rut_empresa))
        kpis_totales = cursor.fetchall()

        # Cerrar conexión y cursor
        cursor.close()
        connection.close()

        # Añadir nombres de los datos y formatear los KPI
        kpis_nombres = {
            "mes": mes,
            "anio": anio,
            "datos": []
        }

        for kpi in kpis_totales:
            # Convertir puntualidad, tasa de asistencia y retraso a formato adecuado
            puntualidad_promedio_decimal = Decimal(kpi[6]).quantize(Decimal('0.0000'), rounding=ROUND_HALF_UP)
            puntualidad_promedio_str = f"{puntualidad_promedio_decimal}"
            
            tasa_asistencia_decimal = Decimal(kpi[7]).quantize(Decimal('0.0000'), rounding=ROUND_HALF_UP)
            tasa_asistencia_str = f"{tasa_asistencia_decimal}"

            retraso_decimal = Decimal(kpi[8]).quantize(Decimal('0.0000'), rounding=ROUND_HALF_UP)
            retraso_str = f"{retraso_decimal}"

            # Crear diccionario con los datos de cada empleado
            kpi_dict = {
                "rut_empleado": kpi[0],            # Rut
                "nombre_empleado": kpi[1],         # Nombre
                "apellidos_empleado": kpi[2],      # Apellidos
                "rol": kpi[3],                     # Rol
                "horas_trabajadas": f"{kpi[4]}",   # Horas trabajadas
                "sueldo_total": f"{kpi[5]:.2f}",       # Salario formateado a 2 decimales
                "puntualidad_promedio": puntualidad_promedio_str,  # Puntualidad
                "tasa_asistencia": tasa_asistencia_str,  # Tasa de asistencia
                "indice_retraso": retraso_str            # Retraso
            }

            # Añadir el diccionario a la lista de datos
            kpis_nombres["datos"].append(kpi_dict)

        return kpis_nombres

    except Exception as e:
        print(f"Error al obtener KPIs: {str(e)}")
        raise