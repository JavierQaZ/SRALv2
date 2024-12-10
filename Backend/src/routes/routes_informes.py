from flask import Blueprint, jsonify, request,send_file
from flask_jwt_extended import jwt_required, get_jwt
from ..service.informes_service import calcular_kpi_empleado_service,generar_pdf_kpi_empleado
import base64

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
        import os
        os.unlink(pdf_path)

        return jsonify({
            "pdf": pdf_base64,
            "filename": f"informe_kpi_empleado_{rut_empleado}.pdf"
        })
    except Exception as e:
        print(f"Error en generar_kpi_empleado_pdf: {str(e)}")
        return jsonify({"error": "Error interno del servidor", "detalle": str(e)}), 500