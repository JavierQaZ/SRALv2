from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from ..service.gestion_service import  costo_total_service

bp = Blueprint('gestion_Blueprint', __name__)


@bp.route('/costo_total', methods=['POST'])
@jwt_required()
def obtener_costo_total():
    try:
        # Extraer claims y parámetros
        claims = get_jwt()
        rut_empresa = claims.get('rut_empresa')
        data = request.get_json()

        mes = int(data.get('mes'))
        anio = int(data.get('anio'))

        # Validar parámetros
        if not rut_empresa or not mes or not anio:
            return jsonify({"error": "Parámetros faltantes"}), 400

        # Llamar al servicio
        resultado = costo_total_service(mes, anio, rut_empresa)

        # Devolver el resultado directamente
        return jsonify(resultado), 200

    except Exception as e:
        print(f"Error en obtener_costo_total: {e}")
        return jsonify({"error": "Error interno del servidor", "detalle": str(e)}), 500