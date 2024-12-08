from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from ..service.usuarios_service import agregar_usuario_service,obtener_usuarios, eliminar_usuario

bp = Blueprint('usuarios_Blueprint', __name__)

@bp.route('/add', methods=['POST'])
@jwt_required()
def add_usuario():
    try:
        data = request.get_json()
        required_fields = {
            'rut_usuario': str,
            'nombre_usuario': str,
            'apellidos_usuario': str,
            'contrasena_usuario': str,
            'email_usuario': str,
            'codigo_rol': int
        }

        for field, field_type in required_fields.items():
            if field not in data or not isinstance(data[field], field_type):
                return jsonify({"error": f"Falta o es inválido el campo {field}"}), 400

        rut_empresa = get_jwt().get('rut_empresa')
        if not rut_empresa:
            return jsonify({"error": "rut_empresa no encontrado en el token"}), 400

        # Llama al servicio para agregar el usuario
        agregar_usuario_service(
            rut_usuario=data['rut_usuario'],
            nombre_usuario=data['nombre_usuario'],
            apellidos_usuario=data['apellidos_usuario'],
            contrasena_usuario=data['contrasena_usuario'],
            email_usuario=data['email_usuario'],
            codigo_rol=data['codigo_rol'],
            rut_empresa=rut_empresa
        )

        return jsonify({"message": "Usuario agregado exitosamente"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@bp.route('/get', methods=['GET'])
@jwt_required()
def get_usuarios():
    try:
        # Obtener rut_empresa desde los claims adicionales del JWT
        claims = get_jwt()
        rut_empresa = claims.get('rut_empresa')  # Obtenemos el rut_empresa de los claims
        
        if not rut_empresa:
            return jsonify({"error": "rut_empresa no encontrado en el token"}), 400

        # Pasar el rut_empresa a la función de servicio para obtener los usuarios
        usuarios = obtener_usuarios(rut_empresa)
        
        if usuarios:
            # Estructuramos la respuesta
            usuarios_list = [{
                'rut_usuario': usuario[0],
                'nombre_usuario': usuario[1],
                'apellidos_usuario': usuario[2],
                'email_usuario': usuario[3],
                'codigo_rol': usuario[4]
            } for usuario in usuarios]
            return jsonify(usuarios_list), 200
        else:
            return jsonify({"error": "No se encontraron usuarios"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@bp.route('/delete', methods=['DELETE'])
@jwt_required()
def delete_usuario(rut_usuario):
    try:
        # Validar que el rut_usuario no esté vacío
        if not rut_usuario:
            return jsonify({"error": "El rut_usuario es requerido"}), 400

        # Obtener rut_empresa desde los claims adicionales del JWT
        claims = get_jwt()
        rut_empresa = claims.get('rut_empresa')

        if not rut_empresa:
            return jsonify({"error": "rut_empresa no encontrado en el token"}), 400

        # Llamar al servicio para eliminar el usuario
        resultado = eliminar_usuario(rut_usuario, rut_empresa)
        
        if resultado:
            return jsonify({"message": "Usuario eliminado exitosamente"}), 200
        else:
            return jsonify({"error": "Usuario no encontrado o no autorizado"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

#@bp.route('/add', methods=['POST'])
#@jwt_required()