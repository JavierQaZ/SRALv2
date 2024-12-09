from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from ..service.gestion_service import costo_total_por_mes

bp = Blueprint('gestion_Blueprint', __name__)

@bp.route('/total_sueldos', methods=['GET'])
@jwt_required()
def total_sueldos():
    try:
        # Obtener rut_empresa desde los claims adicionales del JWT
        claims = get_jwt()
        rut_empresa = claims.get('rut_empresa')  # Obtener rut_empresa del JWT
        
        if not rut_empresa:
            return jsonify({"error": "rut_empresa no encontrado en el token"}), 400

        # Obtener el total de sueldos de todos los roles para la empresa
        total_sueldos = costo_total_por_mes(rut_empresa)
        
        if total_sueldos is not None:
            return jsonify({"total_sueldos": total_sueldos}), 200
        else:
            return jsonify({"error": "Error al obtener el total de sueldos"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500
