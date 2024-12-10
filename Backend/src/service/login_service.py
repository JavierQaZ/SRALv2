from flask_jwt_extended import create_access_token
from ..database.db_conección import get_connection


def login(rut_usuario, contrasena_usuario):

    try:
        # Validación de las entradas antes de la consulta
        if not rut_usuario or not contrasena_usuario:
            raise ValueError("El rut_usuario y la contrasena_usuario son requeridos")

        # Conexión a la base de datos
        connection = get_connection()
        cursor = connection.cursor()


        # Consulta SQL
        cursor.execute("SELECT contrasena_usuario, rut_empresa FROM usuarios WHERE rut_usuario = %s", (rut_usuario,))
        result = cursor.fetchone()

        # Verifica si el usuario existe y la contraseña coincide
        if result and result[0] == contrasena_usuario:
            # El usuario y la contraseña coinciden, generamos el token
            rut_empresa = result[1]
            access_token = create_access_token(identity=rut_usuario, additional_claims={"rut_empresa": rut_empresa})
            return access_token
        else:
            return None  # Credenciales inválidas

    except Exception as e:
        print(f"Error en login: {e}")
        return None

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


