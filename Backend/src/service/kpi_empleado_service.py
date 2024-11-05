from ..database.db_conección import get_connection
from decimal import Decimal, ROUND_HALF_UP

def obtener_kpi_service(mes, anio):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Llamar al procedimiento almacenado para obtener KPIs por mes y año
        cursor.callproc('obtener_kpis_por_mes', (mes, anio))
        kpis_totales = cursor.fetchall()

        # Cerrar conexión y cursor
        cursor.close()
        connection.close()

        # Añadir nombres de los datos y formatear puntualidad promedio
        kpis_nombres = {
            "mes": mes,
            "anio": anio,
            "datos": []
        }

        for kpi in kpis_totales:
            # Convertir puntualidad_promedio a Decimal y formatear como cadena con 4 decimales
            puntualidad_promedio_decimal = Decimal(kpi[8]).quantize(Decimal('0.0000'), rounding=ROUND_HALF_UP)
            puntualidad_promedio_str = f"{puntualidad_promedio_decimal}"

            kpi_dict = {
                "rut_empleado": kpi[0],
                "nombre_empleado": kpi[1],
                "apellidos_empleado": kpi[2],
                "rol": kpi[3],
                "sueldo_total": f"{kpi[6]:.2f}",
                "horas_trabajadas": f"{kpi[7]}",
                "puntualidad_promedio": puntualidad_promedio_str,
                "tasa_asistencia": f"{kpi[9]:.4f}",
                "indice_retraso": f"{kpi[10]:.4f}"
            }
            kpis_nombres["datos"].append(kpi_dict)

        return kpis_nombres

    except Exception as e:
        # Manejar errores
        print(f"Error al obtener KPIs: {str(e)}")
        raise
