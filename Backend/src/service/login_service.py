from flask_jwt_extended import create_access_token
from ..database.db_conección import get_connection
import bcrypt


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
        if result:
            contrasena_hash = result[0]
            rut_empresa = result[1]

            # Compara la contraseña proporcionada con la almacenada
            if bcrypt.checkpw(contrasena_usuario.encode('utf-8'), contrasena_hash.encode('utf-8')):
                # Contraseña válida, genera el token
                access_token = create_access_token(identity=rut_usuario, additional_claims={"rut_empresa": rut_empresa})
                return access_token
        
        # Si no coincide o el usuario no existe
        return None  

    except Exception as e:
        print(f"Error en login: {e}")
        return None

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'connection' in locals():
            connection.close()


