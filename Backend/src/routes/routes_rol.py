from flask import Blueprint, request, jsonify
from ..service.rol_service import add_rol_service, editar_rol_service,obtener_roles,obtener_costo_horas_por_rol, delete_rol_service
from flask_jwt_extended import jwt_required,get_jwt_identity,get_jwt



bp = Blueprint('rol_Blueprint', __name__)


@bp.route('/add', methods=['POST'])
@jwt_required()
def add_rol():
    try:
        data = request.get_json()
        
        # Validación de datos

        required_fields = {
            'nombre_rol': str,
            'sueldoPorHora_rol': (int, float)
        }
        

        for field, field_type in required_fields.items():
            if field not in data:
                return jsonify({"error": f"Falta el campo {field}"}), 400


        nombre_rol = data['nombre_rol']
        sueldoPorHora_rol = data['sueldoPorHora_rol']
    

        # Obtener rut_empresa desde el JWT (de los claims adicionales)
        claims = get_jwt()
        rut_empresa = claims.get('rut_empresa')

        # Verifica si rut_empresa está presente
        if rut_empresa is None:
            return jsonify({"error": "rut_empresa no encontrado en el token"}), 400

        # Llamada al servicio para agregar rol con rut_empresa
        add_rol_service(nombre_rol, sueldoPorHora_rol, rut_empresa)

        return jsonify({"message": "Rol agregado exitosamente"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
    
@bp.route('/edit', methods=['PUT'])
@jwt_required()
def edit_rol():
    try:
        # Obtener los datos de la solicitud
        data = request.get_json()
        
        # Validación: asegurarse de que los campos requeridos estén presentes
        if 'codigo_rol' not in data or 'sueldoPorHora_rol' not in data:
            return jsonify({"error": "Faltan campos requeridos: 'codigo_rol' y 'sueldoPorHora_rol'"}), 400

        codigo_rol = data['codigo_rol']
        sueldoPorHora_rol = data['sueldoPorHora_rol']
        
        # Llamada al servicio para actualizar el sueldo por hora
        editar_rol_service(codigo_rol, sueldoPorHora_rol)
        
        return jsonify({"message": "Sueldo por hora del rol actualizado exitosamente"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#@bp.route('/delete', methods=['DELETE'])
#@jwt_required()
#def delete_rol():


@bp.route('/get', methods=['GET'])
@jwt_required()
def get_roles():
    try:
        # Obtener rut_empresa desde los claims adicionales del JWT
        claims = get_jwt()
        rut_empresa = claims.get('rut_empresa')  # Aquí obtenemos el rut_empresa de los claims
        
        if not rut_empresa:
            return jsonify({"error": "rut_empresa no encontrado en el token"}), 400

        # Pasar el rut_empresa a la función de servicio para obtener los roles
        roles = obtener_roles(rut_empresa)
        
        if roles:
            # Estructuramos la respuesta
            roles_list = [{
                'codigo_rol': rol[0],
                'nombre_rol': rol[1],
                'sueldoPorHora_rol': float(rol[2])  # Convertimos a float si es necesario
            } for rol in roles]
            return jsonify(roles_list), 200
        else:
            return jsonify({"error": "Error al obtener roles"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@bp.route('/Kpi_sueldo_por_rol', methods=['POST'])
@jwt_required()
def obtener_costo_horas_por_rol_route():
    try:
        data = request.get_json()

        # Validación de datos
        required_fields = ['codigo_rol', 'mes', 'anio']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Falta el campo '{field}'"}), 400

        codigo_rol = data['codigo_rol']
        mes = data['mes']
        anio = data['anio']

        # Llamada al servicio para obtener el costo de horas por rol
        resultado = obtener_costo_horas_por_rol(codigo_rol, mes, anio)

        # Estructura de respuesta
        response = {
            "codigo_rol": resultado["codigo_rol"],
            "mes": resultado["mes"],
            "anio": resultado["anio"],
            "total_horas_trabajadas": resultado["total_horas_trabajadas"],
            "costo_total": resultado["costo_total"]
        }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@bp.route('/delete', methods=['DELETE'])
@jwt_required()
def delete_rol():
    try:
        # Extraer los datos de la solicitud
        data = request.get_json()

        # Validar que se envió el campo 'codigo_rol'
        if 'codigo_rol' not in data:
            return jsonify({"error": "Falta el campo 'codigo_rol'"}), 400

        codigo_rol = data['codigo_rol']

        # Llamar al servicio para eliminar el rol
        delete_rol_service(codigo_rol)

        return jsonify({"message": "Rol eliminado exitosamente"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500