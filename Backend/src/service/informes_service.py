from ..database.db_conección import get_connection
from fpdf import FPDF

def calcular_kpi_empleado_service(mes, anio, rut_empresa, rut_empleado):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Ejecutar el procedimiento almacenado
        cursor.callproc('calcular_kpis_empleado', [mes, anio, rut_empresa, rut_empleado])

        # Leer el resultado
        resultado = cursor.fetchone()
        if resultado:
            return {
                'rut_empleado': resultado[0],
                'nombre_empleado': resultado[1],
                'apellidos_empleado': resultado[2],
                'nombre_rol': resultado[3],
                'horas_trabajadas': float(resultado[4]),
                'salario': float(resultado[5]),
                'puntualidad': float(resultado[6]),
                'tasa_asistencia': float(resultado[7]),
                'retraso': float(resultado[8])
            }
        return None

    except Exception as e:
        print(f"Error en calcular_kpi_empleado_service: {str(e)}")
        raise

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'connection' in locals():
            connection.close()

def generar_pdf_kpi_empleado(datos):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    # Título
    pdf.set_font("Arial", style="B", size=16)
    pdf.cell(200, 10, txt="Informe KPI Empleado", ln=True, align="C")

    # Información del empleado
    pdf.set_font("Arial", size=12)
    pdf.ln(10)
    pdf.cell(200, 10, txt=f"RUT Empleado: {datos['rut_empleado']}", ln=True)
    pdf.cell(200, 10, txt=f"Nombre: {datos['nombre_empleado']} {datos['apellidos_empleado']}", ln=True)
    pdf.cell(200, 10, txt=f"Rol: {datos['nombre_rol']}", ln=True)

    # KPIs
    pdf.ln(10)
    pdf.cell(200, 10, txt=f"Horas Trabajadas: {datos['horas_trabajadas']}", ln=True)
    pdf.cell(200, 10, txt=f"Salario: {datos['salario']:.2f}", ln=True)
    pdf.cell(200, 10, txt=f"Puntualidad: {datos['puntualidad']:.2f}%", ln=True)
    pdf.cell(200, 10, txt=f"Tasa de Asistencia: {datos['tasa_asistencia']:.2f}%", ln=True)
    pdf.cell(200, 10, txt=f"Retrasos: {datos['retraso']:.2f}%", ln=True)

    # Guardar PDF
    pdf_path = f"/mnt/data/informe_kpi_empleado_{datos['rut_empleado']}.pdf"
    pdf.output(pdf_path)
    return pdf_path