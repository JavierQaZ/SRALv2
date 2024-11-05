from flask import Blueprint, request, jsonify
from ..service.r_salida_service import add_r_salida_service,edit_r_salida_service,delete_r_salida_service
from flask_jwt_extended import jwt_required


bp = Blueprint('r_salida_Blueprint', __name__)


@bp.route('/add', methods=['POST'])
@jwt_required()
def add_r_salida():
    try:
        data = request.get_json()
        
        # Validación de datos
        required_fields = {
            'rut_empleado': str
        }
        
        for field, field_type in required_fields.items():
            if field not in data:
                return jsonify({"error": f"Falta el campo {field}"}), 400
            if not isinstance(data[field], field_type):
                return jsonify({"error": f"El campo {field} debe ser de tipo {field_type.__name__}"}), 400

        rut_empleado = data['rut_empleado']
        
        # Llamada al servicio para agregar hora de salida
        add_r_salida_service(rut_empleado)
        
        return jsonify({"message": "Hora de salida agregada exitosamente"}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@bp.route('/edit', methods=['PUT'])
@jwt_required()
def edit_r_salida():
    try:
        data = request.get_json()
        
        # Validación de datos
        required_fields = {
            'horaSalida_registro': str,  # Asumimos que la fecha y hora se envían como cadena en formato ISO 8601
            'rut_empleado': str
        }
        
        for field, field_type in required_fields.items():
            if field not in data:
                return jsonify({"error": f"Falta el campo {field}"}), 400
            if not isinstance(data[field], field_type):
                return jsonify({"error": f"El campo {field} debe ser de tipo {field_type.__name__}"}), 400

        horaSalida_registro = data['horaSalida_registro']
        rut_empleado = data['rut_empleado']
        
        # Convertir horaSalida_registro a datetime si es necesario
        from datetime import datetime
        try:
            horaSalida_registro = datetime.fromisoformat(horaSalida_registro)
        except ValueError:
            return jsonify({"error": "horaSalida_registro debe estar en formato ISO 8601"}), 400
        
        # Llamada al servicio para editar la hora de salida
        edit_r_salida_service(horaSalida_registro, rut_empleado)
        
        return jsonify({"message": "Hora de salida editada exitosamente"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@bp.route('/delete', methods=['DELETE'])
@jwt_required()
def delete_r_salida():
    try:
        data = request.get_json()
        
        # Validación de datos
        required_fields = {
            'horaSalida_registro': str,  # Asumimos que la fecha y hora se envían como cadena en formato ISO 8601
            'rut_empleado': str
        }
        
        for field, field_type in required_fields.items():
            if field not in data:
                return jsonify({"error": f"Falta el campo {field}"}), 400
            if not isinstance(data[field], field_type):
                return jsonify({"error": f"El campo {field} debe ser de tipo {field_type.__name__}"}), 400

        horaSalida_registro = data['horaSalida_registro']
        rut_empleado = data['rut_empleado']
        
        # Convertir horaSalida_registro a datetime si es necesario
        from datetime import datetime
        try:
            horaSalida_registro = datetime.fromisoformat(horaSalida_registro)
        except ValueError:
            return jsonify({"error": "horaSalida_registro debe estar en formato ISO 8601"}), 400
        
        # Llamada al servicio para eliminar registro de salida
        delete_r_salida_service(horaSalida_registro, rut_empleado)
        
        return jsonify({"message": "Registro de salida eliminado exitosamente"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
    
    
