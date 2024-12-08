from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from ..service.empleado_service import (
    agregar_empleado_service,
    editar_empleado_service,
    delete_empleado_service,
    obtener_empleados
)
from ..service.kpi_empleado_service import obtener_kpi_service

bp = Blueprint('empleados_Blueprint', __name__)

@bp.route('/add', methods=['POST'])
@jwt_required()
def add_empleado():
    try:
        data = request.get_json()
        required_fields = {
            'rut_empleado': str,
            'nombre_empleado': str,
            'apellidos_empleado': str,
            'codigo_rol': str
        }

        for field, field_type in required_fields.items():
            if field not in data or not isinstance(data[field], field_type):
                return jsonify({"error": f"Falta o es inválido el campo {field}"}), 400

        rut_empresa = get_jwt().get('rut_empresa')
        if not rut_empresa:
            return jsonify({"error": "rut_empresa no encontrado en el token"}), 400

        agregar_empleado_service(
            rut_empleado=data['rut_empleado'],
            nombre_empleado=data['nombre_empleado'],
            apellidos_empleado=data['apellidos_empleado'],
            codigo_rol=data['codigo_rol'],
            rut_empresa=rut_empresa
        )

        return jsonify({"message": "Empleado agregado exitosamente"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route('/edit', methods=['PUT'])
@jwt_required()
def edit_empleado():
    try:
        data = request.get_json()
        required_fields = ['rut_empleado', 'nombre_empleado', 'apellidos_empleado', 'codigo_rol']

        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Falta el campo {field}"}), 400

        editar_empleado_service(
            rut_empleado=data['rut_empleado'],
            nombre_empleado=data['nombre_empleado'],
            apellidos_empleado=data['apellidos_empleado'],
            codigo_rol=data['codigo_rol']
        )

        return jsonify({"message": "Empleado editado exitosamente"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route('/delete', methods=['DELETE'])
@jwt_required()
def delete_empleado():
    try:
        data = request.get_json()

        if 'rut_empleado' not in data:
            return jsonify({"error": "Falta el campo rut_empleado"}), 400

        delete_empleado_service(data['rut_empleado'])
        return jsonify({"message": "Empleado eliminado exitosamente"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route('/kpi', methods=['GET'])
@jwt_required()
def get_kpis():
    try:
        # Recuperar rut_empresa del JWT
        rut_empresa = get_jwt().get('rut_empresa')
        if not rut_empresa:
            return jsonify({"error": "rut_empresa no encontrado en el token"}), 400

        # Obtener mes y año de los parámetros de la consulta
        mes = request.args.get('mes')
        anio = request.args.get('anio')
        if not mes or not anio:
            return jsonify({"error": "Los parámetros 'mes' y 'anio' son requeridos"}), 400

        # Llamar al servicio para obtener los KPIs
        kpis = obtener_kpi_service(mes, anio, rut_empresa)
        
        # Verificar si hubo algún error al obtener los KPIs
        if "error" in kpis:
            return jsonify(kpis), 400  # Devuelve el error si no se encontraron KPIs

        # Retorna los datos de los KPIs en formato JSON
        return jsonify(kpis), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route('/get', methods=['GET'])
@jwt_required()
def get_empleados():
    try:
        rut_empresa = get_jwt_identity()
        empleados = obtener_empleados(rut_empresa)

        if empleados:
            empleados_list = [
                {
                    'rut_empleado': empleado[0],
                    'nombre_empleado': empleado[1],
                    'apellidos_empleado': empleado[2],
                    'codigo_rol': empleado[3]
                } for empleado in empleados
            ]
            return jsonify(empleados_list), 200
        else:
            return jsonify({"error": "No se encontraron empleados"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500
