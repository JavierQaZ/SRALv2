from flask import Blueprint, jsonify, request,send_file
from flask_jwt_extended import jwt_required, get_jwt
from ..service.informes_service import calcular_kpi_empleado_service,generar_pdf_kpi_empleado, costo_total_por_rol_service, generar_pdf_costo_total_por_rol,calcular_costo_total_service,generar_pdf_costo_total
import base64,os

bp = Blueprint('informes_blueprint', __name__)

@bp.route('/kpi_empleado', methods=['POST'])
@jwt_required()
def generar_kpi_empleado_pdf():
    try:
        # Extraer claims del JWT
        claims = get_jwt()
        rut_empresa = claims.get('rut_empresa')

        # Obtener datos del cuerpo de la solicitud
        data = request.get_json()
        mes = data.get('mes')
        anio = data.get('anio')
        rut_empleado = data.get('rut_empleado')

        # Validar parámetros
        if not rut_empresa or not rut_empleado or not mes or not anio:
            return jsonify({"error": "Faltan parámetros necesarios"}), 400

        # Llamar al servicio
        resultado = calcular_kpi_empleado_service(mes, anio, rut_empresa, rut_empleado)

        if not resultado:
            return jsonify({"error": "No se encontraron datos para los parámetros ingresados"}), 404

      # Generar PDF
        pdf_path = generar_pdf_kpi_empleado(resultado)

        # Leer el archivo PDF y convertirlo a base64
        with open(pdf_path, 'rb') as pdf_file:
            pdf_base64 = base64.b64encode(pdf_file.read()).decode('utf-8')

        # Eliminar el archivo temporal
       
        os.unlink(pdf_path)

        return jsonify({
            "pdf": pdf_base64,
            "filename": f"informe_kpi_empleado_{rut_empleado}.pdf"
        })
    except Exception as e:
        print(f"Error en generar_kpi_empleado_pdf: {str(e)}")
        return jsonify({"error": "Error interno del servidor", "detalle": str(e)}), 500
    

@bp.route('/informe_rol', methods=['POST'])
@jwt_required()
def obtener_informe_por_rol_pdf():
    try:
        # Extraer claims del JWT
        claims = get_jwt()
        rut_empresa = claims.get('rut_empresa')

        # Obtener datos del cuerpo de la solicitud
        data = request.get_json()
        mes = data.get('mes')
        anio = data.get('anio')
        codigo_rol = data.get('codigo_rol')
        

        # Validar parámetros
        if not rut_empresa:
            return jsonify({"error": "El token no contiene el rut_empresa"}), 400

        if not mes or not anio or not codigo_rol:
            return jsonify({"error": "Faltan parámetros necesarios"}), 400

        # Llamar al servicio para obtener los datos
        resultado = costo_total_por_rol_service(mes, anio, rut_empresa, codigo_rol)

        if not resultado:
            return jsonify({"error": "No se encontraron datos para los parámetros ingresados"}), 404

        # Generar PDF con los resultados obtenidos
        pdf_path = generar_pdf_costo_total_por_rol(resultado, mes, anio, codigo_rol)

        # Leer el archivo PDF y convertirlo a base64
        with open(pdf_path, 'rb') as pdf_file:
            pdf_base64 = base64.b64encode(pdf_file.read()).decode('utf-8')

        # Eliminar el archivo temporal
        
        os.unlink(pdf_path)

        # Devolver el PDF en formato base64 y un nombre sugerido para el archivo
        return jsonify({
            "pdf": pdf_base64,
            "filename": f"informe_costo_total_rol_{codigo_rol}_{mes}_{anio}.pdf"
        })

    except Exception as e:
        print(f"Error en obtener_informe_por_rol_pdf: {str(e)}")
        return jsonify({"error": "Error interno del servidor", "detalle": str(e)}), 500


@bp.route('/costo_total', methods=['POST'])
@jwt_required()
def generar_informe_costo_pdf():
    try: 
        # Extraer claims del token
        claims = get_jwt()
        rut_empresa = claims.get('rut_empresa')

        # Extraer datos del cuerpo de la solicitud
        data = request.get_json()  # Faltaban paréntesis
        mes = data.get('mes')
        anio = data.get('anio')

        # Validar parámetros
        if not rut_empresa or not mes or not anio:
            return jsonify({"error": "Faltan parámetros necesarios"}), 400

        # Llamar al servicio para calcular el costo total
        resultado = calcular_costo_total_service(mes, anio, rut_empresa)

        # Validar resultados
        if not resultado:
            return jsonify({"error": "No se encontraron datos para los parámetros ingresados"}), 404

        # Generar el PDF
        pdf_path = generar_pdf_costo_total(resultado, mes, anio, rut_empresa)

        # Leer y codificar el PDF en base64
        with open(pdf_path, 'rb') as pdf_file:
            pdf_base64 = base64.b64encode(pdf_file.read()).decode('utf-8')

        # Eliminar el archivo temporal
        os.unlink(pdf_path)

        # Responder con el PDF en base64
        return jsonify({
            "pdf": pdf_base64,
            "filename": f"informe_costo_total_{mes}_{anio}.pdf"  # Corrección del nombre del archivo
        })
    except Exception as e:
        print(f"Error en generar_informe_costo_pdf: {str(e)}")
        return jsonify({"error": "Error interno del servidor", "detalle": str(e)}), 500