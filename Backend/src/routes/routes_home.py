from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from ..service.home_service import obtener_nombre_empresa,obtener_nombre_usuario


bp = Blueprint('home', __name__)

@bp.route('/info_home', methods=['GET'])
@jwt_required()
def obtener_info():
    try:
        # Extraer datos del JWT
        claims = get_jwt()
        rut_empresa = claims.get('rut_empresa')
        rut_usuario = claims.get('sub')  # 'sub' se usa comúnmente para identificadores únicos como rut_usuario

        # Validar que los valores existan
        if not rut_empresa or not rut_usuario:
            return jsonify({"error": "rut_empresa o rut_usuario no encontrado en el token"}), 400

        # Obtener nombre de la empresa
        nombre_empresa = obtener_nombre_empresa(rut_empresa)
        if not nombre_empresa:
            return jsonify({"error": "Empresa no encontrada para el rut proporcionado"}), 404

        # Obtener nombre del usuario
        nombre_usuario = obtener_nombre_usuario(rut_usuario)
        if not nombre_usuario:
            return jsonify({"error": "Usuario no encontrado para el rut proporcionado"}), 404

        # Responder con los datos
        return jsonify({
            "nombre_empresa": nombre_empresa,
            "nombre_usuario": nombre_usuario
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500