# login_service.py
from flask_jwt_extended import create_access_token
from ..database.db_conección import get_connection

def login(rut_empleado, contrasena):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Consulta para obtener la contraseña del empleado
        cursor.execute("SELECT contrasena FROM usuarios WHERE rut_empleado = %s", (rut_empleado,))
        result = cursor.fetchone()

        if result and result[0] == contrasena:
            # Generar un token JWT
            access_token = create_access_token(identity=rut_empleado)
            return access_token
        else:
            return None

    except Exception as e:
        print("Error en el login:", e)
        return None
    finally:
        cursor.close()