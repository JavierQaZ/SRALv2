from flask import Blueprint, request, jsonify
from ..service.r_entrada_service import add_r_entrada_service, edit_r_entrada_service, delete_r_entrada_service
from flask_jwt_extended import jwt_required


bp = Blueprint('r_entrada_Blueprint', __name__)

@bp.route('/add', methods=['POST'])
@jwt_required()
def add_r_entrada():
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
        
        # Llamada al servicio para agregar hora de ingreso
        add_r_entrada_service(rut_empleado)
        
        return jsonify({"message": "Hora de ingreso agregada exitosamente"}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


@bp.route('/edit', methods=['PUT'])
@jwt_required()
def edit_hora_ingreso():
    try:
        data = request.get_json()
        
        # Validación de datos
        required_fields = {
            'horaIngreso_registro': str,  # Asumimos que la fecha y hora se envían como cadena en formato ISO 8601
            'rut_empleado': str
        }
        
        for field, field_type in required_fields.items():
            if field not in data:
                return jsonify({"error": f"Falta el campo {field}"}), 400
            if not isinstance(data[field], field_type):
                return jsonify({"error": f"El campo {field} debe ser de tipo {field_type.__name__}"}), 400

        horaIngreso_registro = data['horaIngreso_registro']
        rut_empleado = data['rut_empleado']
        
        # Convertir horaIngreso_registro a datetime si es necesario
        from datetime import datetime
        try:
            horaIngreso_registro = datetime.fromisoformat(horaIngreso_registro)
        except ValueError:
            return jsonify({"error": "Hora Ingreso debe estar en formato ISO 8601"}), 400
        
        # Llamada al servicio para editar la hora de salida
        edit_r_entrada_service(horaIngreso_registro, rut_empleado)
        
        return jsonify({"message": "Hora de Ingreso editada exitosamente"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@bp.route('/delete', methods=['DELETE'])
@jwt_required()
def delete_r_entrada():
    try:
        data = request.get_json()
        
        # Validación de datos
        required_fields = {
            'horaIngreso_registro': str,  # Asumimos que la fecha y hora se envían como cadena en formato ISO 8601
            'rut_empleado': str
        }
        
        for field, field_type in required_fields.items():
            if field not in data:
                return jsonify({"error": f"Falta el campo {field}"}), 400
            if not isinstance(data[field], field_type):
                return jsonify({"error": f"El campo {field} debe ser de tipo {field_type.__name__}"}), 400

        horaIngreso_registro = data['horaIngreso_registro']
        rut_empleado = data['rut_empleado']
        
        # Convertir horaIngreso_registro a datetime si es necesario
        from datetime import datetime
        try:
            horaIngreso_registro = datetime.fromisoformat(horaIngreso_registro)
        except ValueError:
            return jsonify({"error": "horaIngreso_registro debe estar en formato ISO 8601"}), 400
        
        # Llamada al servicio para editar la hora de entrada
        delete_r_entrada_service(horaIngreso_registro, rut_empleado)
        
        return jsonify({"message": "Registro de entrada eliminado exitosamente"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500