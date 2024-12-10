from ..database.db_conección import get_connection

def agregar_usuario_service(rut_usuario, nombre_usuario, apellidos_usuario, contrasena_usuario, email_usuario, rut_empresa):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Llamada al procedimiento almacenado
        cursor.callproc('agregar_usuario', (
            rut_usuario,
            rut_empresa,
            nombre_usuario,
            apellidos_usuario,
            contrasena_usuario,
            email_usuario
           
        ))
        connection.commit()
    except Exception as e:
        raise e
    finally:
        cursor.close()
        connection.close()

def obtener_usuarios(rut_empresa):
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute(
            """
            SELECT 
                rut_usuario, 
                nombre_usuario, 
                apellidos_usuario, 
                email_usuario
               
            FROM usuarios 
            WHERE rut_empresa = %s AND id_rol_gestion = 2
            """,
            (rut_empresa)
        )
        usuarios = cursor.fetchall()
        return usuarios
    except Exception as e:
        raise e
    finally:
        cursor.close()
        connection.close()

def eliminar_usuario(rut_usuario):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Asegúrate de pasar el argumento como una tupla (con una coma al final)
        cursor.callproc('eliminar_usuario', (rut_usuario,))  # Nota la coma al final
        connection.commit()

    except Exception as e:
        raise e
    finally:
        cursor.close()
        connection.close()


        
def editar_contrasena_usuario(rut_usuario, nueva_contrasena):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Llamada al procedimiento almacenado
        cursor.callproc('editar_contrasena', (rut_usuario, nueva_contrasena))
        connection.commit()

        # Verificar si se afectó alguna fila
        if cursor.rowcount > 0:
            return True
        return False

    except Exception as e:
        raise e
    finally:
        cursor.close()
        connection.close()


def verificar_contrasena_actual(rut_usuario, contrasena_actual):
    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Verificar la contraseña actual
        cursor.execute(
            "SELECT contrasena_usuario FROM usuarios WHERE rut_usuario = %s",
            (rut_usuario,)
        )
        resultado = cursor.fetchone()

        if not resultado or resultado[0] != contrasena_actual:
            return False  # Contraseña actual incorrecta

        return True  # Contraseña correcta

    except Exception as e:
        raise e
    finally:
        cursor.close()
        connection.close()
