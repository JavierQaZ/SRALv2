from ..database.db_conección import get_connection
from fpdf import FPDF
import os,tempfile

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


    

    # Crear un archivo temporal
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
        pdf.output(temp_file.name)
        temp_file_path = temp_file.name

    return temp_file_path




def costo_total_por_rol_service(mes, anio, rut_empresa, codigo_rol):
    try:
        # Establecer conexión con la base de datos
        connection = get_connection()
        cursor = connection.cursor()
        
        # Ejecutar el procedimiento almacenado
        cursor.callproc('informe_rol', [mes, anio, rut_empresa, codigo_rol])
        
        # Leer el resultado
        resultados = cursor.fetchall()
        if resultados:
            datos = []
            for resultado in resultados:
                datos.append({
                    'codigo_rol': resultado[0],
                    'nombre_rol': resultado[1],
                    'cantidad_empleados': int(resultado[2]),
                    'costo_total': float(resultado[3])
                })
            return datos
        
        return None
    
    except Exception as e:
        print(f"Error en costo_total_por_rol_service: {str(e)}")
        raise
    finally:
        # Asegurar el cierre de conexión
        if 'cursor' in locals():
            cursor.close()
        if 'connection' in locals():
            connection.close()

def generar_pdf_costo_total_por_rol(datos, mes, anio, codigo_rol):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    # Título
    pdf.set_font("Arial", style="B", size=16)
    pdf.cell(200, 10, txt="Informe de Costos por Rol", ln=True, align="C")

    # Información del informe
    pdf.set_font("Arial", size=12)
    pdf.ln(10)
    pdf.cell(200, 10, txt=f"Mes: {mes}", ln=True)
    pdf.cell(200, 10, txt=f"Año: {anio}", ln=True)
    pdf.cell(200, 10, txt=f"Código de Rol: {codigo_rol}", ln=True)

    # Encabezados de tabla
    pdf.ln(10)
    pdf.set_font("Arial", style="B")
    pdf.cell(45, 10, txt="Código de Rol", border=1, align="C")
    pdf.cell(45, 10, txt="Nombre de Rol", border=1, align="C")
    pdf.cell(45, 10, txt="Cantidad Empleados", border=1, align="C")
    pdf.cell(45, 10, txt="Costo Total", border=1, align="C")
    pdf.ln()

    # Datos de la tabla
    pdf.set_font("Arial")
    for registro in datos:
        pdf.cell(45, 10, txt=str(registro['codigo_rol']), border=1, align="C")
        pdf.cell(45, 10, txt=registro.get('nombre_rol', 'N/A'), border=1, align="C")
        pdf.cell(45, 10, txt=str(registro['cantidad_empleados']), border=1, align="C")
        pdf.cell(45, 10, txt=f"${registro['costo_total']:,.2f}", border=1, align="C")
        pdf.ln()


    # Crear un archivo temporal
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
        pdf.output(temp_file.name)
        temp_file_path = temp_file.name

    return temp_file_path

def calcular_costo_total_service(mes, anio, rut_empresa):
    try:
        # Establecer la conexión
        connection = get_connection()
        cursor = connection.cursor()

        # Llamar al procedimiento almacenado
        cursor.callproc('Informe_costo_total', [mes, anio, rut_empresa])

        # Obtener el resultado
        resultado = cursor.fetchone()
        if resultado:
            return {
                'total_horas_trabajadas': float(resultado[0]),
                'costo_total_mensual': float(resultado[1]),
                'costo_por_hora': float(resultado[2])
            }
        return None

    except Exception as e:
        print(f"Error en calcular_costo_total_service: {str(e)}")
        raise

    finally:
        # Cerrar el cursor y la conexión
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'connection' in locals() and connection:
            connection.close()



def generar_pdf_costo_total(datos, mes, anio, rut_empresa):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    # Título
    pdf.set_font("Arial", style="B", size=16)
    pdf.cell(200, 10, txt="Informe de Costo Total Mensual", ln=True, align="C")

    # Información del informe
    pdf.set_font("Arial", size=12)
    pdf.ln(10)
    pdf.cell(200, 10, txt=f"RUT Empresa: {rut_empresa}", ln=True)
    pdf.cell(200, 10, txt=f"Mes: {mes}", ln=True)
    pdf.cell(200, 10, txt=f"Año: {anio}", ln=True)

    # Resultados del procedimiento almacenado
    pdf.ln(10)
    pdf.cell(200, 10, txt="Resultados:", ln=True)
    pdf.ln(5)
    pdf.cell(200, 10, txt=f"Total de Horas Trabajadas: {datos['total_horas_trabajadas']:.2f}", ln=True)
    pdf.cell(200, 10, txt=f"Costo Total Mensual: ${datos['costo_total_mensual']:.2f}", ln=True)
    pdf.cell(200, 10, txt=f"Costo Promedio por Hora: ${datos['costo_por_hora']:.2f}", ln=True)

    # Crear un archivo temporal
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
        pdf.output(temp_file.name)
        temp_file_path = temp_file.name

    return temp_file_path