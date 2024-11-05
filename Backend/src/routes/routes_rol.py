from flask import Blueprint, request, jsonify
from ..service.rol_service import add_rol_service, editar_rol_service, delete_rol_service,obtener_roles,obtener_costo_horas_por_rol
from flask_jwt_extended import jwt_required



bp = Blueprint('rol_Blueprint', __name__)

@bp.route('/add', methods=['POST'])
@jwt_required()
def add_rol():
    try:
        data = request.get_json()
        
        # Validación de datos
        required_fields = {
            'nombre_rol': str,
            'sueldoPorHora_rol': int
        }
        
        for field, field_type in required_fields.items():
            if field not in data:
                return jsonify({"error": f"Falta el campo {field}"}), 400
            if not isinstance(data[field], field_type):
                return jsonify({"error": f"El campo {field} debe ser de tipo {field_type.__name__}"}), 400

        nombre_rol = data['nombre_rol']
        sueldoPorHora_rol = data['sueldoPorHora_rol']
        
        # Llamada al servicio para agregar rol
        add_rol_service(nombre_rol, sueldoPorHora_rol)
        
        return jsonify({"message": "rol agregado exitosamente"}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@bp.route('/edit', methods=['PUT'])
@jwt_required()
def edit_rol():
    try:
        data = request.get_json()
        
        # Validación de datos
        required_fields = ['codigo_rol', 'nombre_rol', 'sueldoPorHora_rol']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Falta el campo {field}"}), 400

        codigo_rol = data['codigo_rol']
        nombre_rol = data['nombre_rol']
        sueldoPorHora_rol = data['sueldoPorHora_rol']
        
        # Llamada al servicio para editar rol
        editar_rol_service(codigo_rol, nombre_rol, sueldoPorHora_rol)
        
        return jsonify({"message": "Rol editado exitosamente"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/delete', methods=['DELETE'])
@jwt_required()
def delete_rol():
    try:
        data = request.get_json()
        
        # Validación de datos
        if 'codigo_rol' not in data:
            return jsonify({"error": "Falta el campo codigo_rol"}), 400

        codigo_rol = data['codigo_rol']
        
        # Llamada al servicio para eliminar el rol
        delete_rol_service(codigo_rol)
        
        return jsonify({"message": "Rol eliminado exitosamente"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@bp.route('/get', methods=['GET'])
@jwt_required()
def get_roles():
    roles = obtener_roles()
    if roles:
        roles_list = [{
            'codigo_rol': rol[0],
            'nombre_rol': rol[1],
            'sueldoPorHora_rol': float(rol[2])  # Convertir a float si es necesario
        } for rol in roles]
        return jsonify(roles_list), 200
    else:
        return jsonify({"error": "Error al obtener roles"}), 500



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