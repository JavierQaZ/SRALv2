from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from ..service.usuarios_service import agregar_usuario_service,obtener_usuarios, eliminar_usuario, edit_contrasena_usuario

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
                'email_usuario': usuario[3]
            } for usuario in usuarios]
            return jsonify(usuarios_list), 200
        else:
            return jsonify({"error": "No se encontraron usuarios"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@bp.route('/delete', methods=['DELETE'])
@jwt_required()
def delete_usuario():
    try:
        # Extraer los datos de la solicitud
        data = request.get_json()

        # Validar que se envió el campo 'rut_usuario'
        if 'rut_usuario' not in data:
            return jsonify({"error": "Falta el campo 'rut_usuario'"}), 400

        rut_usuario = data['rut_usuario']

        # Llamar al servicio para eliminar el usuario
        resultado = eliminar_usuario(rut_usuario)

       
        return jsonify({"message": "Usuario eliminado exitosamente"}), 200
        

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route('/edit_contrasena', methods=['PUT'])
@jwt_required()
def edit_contrasena():
    try:
        # Obtener datos del cuerpo de la solicitud
        data = request.get_json()
        required_fields = {
            'contrasena_actual': str,
            'nueva_contrasena': str,
            'confirmar_contrasena': str
        }

        # Verificar que todos los campos estén presentes y sean válidos
        for field, field_type in required_fields.items():
            if field not in data or not isinstance(data[field], field_type):
                return jsonify({"error": f"El campo '{field}' es requerido y debe ser una cadena"}), 400

        # Verificar que las contraseñas nuevas coincidan
        if data['nueva_contrasena'] != data['confirmar_contrasena']:
            return jsonify({"error": "Las contraseñas no coinciden"}), 400

        # Obtener rut_usuario y rut_empresa desde los claims adicionales del JWT
        claims = get_jwt()
        rut_usuario = claims.get('rut_usuario')  # Obtenemos el rut_usuario del JWT
        rut_empresa = claims.get('rut_empresa')  # Obtenemos el rut_empresa del JWT

        if not rut_usuario or not rut_empresa:
            return jsonify({"error": "rut_usuario o rut_empresa no encontrados en el token"}), 400

        # Llamar al servicio para verificar la contraseña actual y actualizar la nueva
        resultado = edit_contrasena_usuario(
            rut_usuario=rut_usuario,
            rut_empresa=rut_empresa,
            contrasena_actual=data['contrasena_actual'],
            nueva_contrasena=data['nueva_contrasena']
        )

        if resultado:
            return jsonify({"message": "Contraseña actualizada exitosamente"}), 200
        else:
            return jsonify({"error": "La contraseña actual no es correcta"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500
