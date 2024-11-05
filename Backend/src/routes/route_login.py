# routes_login.py
from flask import Blueprint, request, jsonify
from ..service.login_service import login

bp = Blueprint('login_blueprint', __name__)

@bp.route('/login', methods=['POST'])
def user_login():
    try:
        data = request.get_json()

        if 'rut_empleado' not in data or 'contrasena' not in data:
            return jsonify({"error": "Falta el rut_empleado o la contrasena"}), 400

        rut_empleado = data['rut_empleado']
        contrasena = data['contrasena']

        token = login(rut_empleado, contrasena)
        if token:
            return jsonify({"token": token}), 200
        else:
            return jsonify({"error": "Credenciales inválidas"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500