from flask import Blueprint, request, jsonify
from ..service.login_service import login

bp = Blueprint('login_blueprint', __name__)

@bp.route('/login', methods=['POST'])
def user_login():
    try:
        # Recibe los datos del cuerpo de la solicitud
        data = request.get_json()

        # Validación de que los campos estén presentes en el JSON
        if 'rut_usuario' not in data or 'contrasena_usuario' not in data:
            return jsonify({"error": "Falta el rut_usuario o la contrasena_usuario"}), 400

        rut_usuario = data['rut_usuario']
        contrasena_usuario = data['contrasena_usuario']

        # Intentamos hacer login llamando al servicio
        token = login(rut_usuario, contrasena_usuario)
        if token:
            return jsonify({"success": True, "token": token}), 200
        else:
            return jsonify({"success": False, "error": "Credenciales inválidas"}), 401

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
