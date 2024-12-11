from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from ..service.usuarios_service import agregar_usuario_service,obtener_usuarios, eliminar_usuario, editar_contrasena_usuario, verificar_contrasena_actual
import bcrypt , re

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
        
        try:
            contrasena_cifrada = bcrypt.hashpw(
                data['contrasena_usuario'].encode('utf-8'), bcrypt.gensalt()
            ).decode('utf-8')
        except Exception as e:
            return jsonify({"error": f"Error al hashear la contraseña: {str(e)}"}), 500

        # Llama al servicio para agregar el usuario
        agregar_usuario_service(
            rut_usuario=data['rut_usuario'],
            nombre_usuario=data['nombre_usuario'],
            apellidos_usuario=data['apellidos_usuario'],
            contrasena_usuario=contrasena_cifrada,  # Usamos la contraseña cifrada
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
                return jsonify({"error": f"El campo '{field}' es requerido y debe ser una cadena de texto."}), 400

        # Verificar que las contraseñas nuevas coincidan
        if data['nueva_contrasena'] != data['confirmar_contrasena']:
            return jsonify({"error": "Las contraseñas nuevas no coinciden."}), 400

        # Obtener rut_usuario desde los claims adicionales del JWT
        claims = get_jwt()
        rut_usuario = claims.get('sub')  # Obtenemos el rut_usuario del JWT

        # Verificar que rut_usuario esté presente en el token
        if not rut_usuario:
            return jsonify({"error": "El campo 'rut_usuario' no está presente en el token."}), 400

        # Verificar la contraseña actual antes de proceder a cambiarla
        resultado = verificar_contrasena_actual(rut_usuario, data['contrasena_actual'])

        if not resultado:
            return jsonify({"error": "La contraseña actual no es correcta."}), 401

        # Generar hash de la nueva contraseña con depuración
        try:
            # Convertir a bytes
            nueva_contrasena_bytes = data['nueva_contrasena'].encode('utf-8')
            
            # Generar un salt válido
            salt = bcrypt.gensalt(rounds=12)
            
            # Depuración del salt
            print(f"Salt generado: {salt}")
            
            # Generar hash de la contraseña
            nueva_contrasena_cifrada = bcrypt.hashpw(nueva_contrasena_bytes, salt)
            
            # Convertir hash a string para base de datos
            nueva_contrasena_str = nueva_contrasena_cifrada.decode('utf-8')
        
        except Exception as e:
            import traceback
            traceback.print_exc()
            return jsonify({"error": f"Error al generar hash de contraseña: {str(e)}"}), 500

        # Actualizar la contraseña en la base de datos
        resultado = editar_contrasena_usuario(
            rut_usuario=rut_usuario,
            nueva_contrasena=nueva_contrasena_str
        )

        if resultado:
            return jsonify({"message": "Contraseña actualizada exitosamente."}), 200
        else:
            return jsonify({"error": "Hubo un error al actualizar la contraseña."}), 500

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Ocurrió un error inesperado: {str(e)}"}), 500
