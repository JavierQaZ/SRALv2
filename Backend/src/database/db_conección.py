from config import Config
import pymysql

def get_connection():
    try:
        # Carga las variables de entorno desde el archivo config.py
        host = Config.MYSQL_HOST
        user = Config.MYSQL_USER
        password = Config.MYSQL_PASSWORD
        db = Config.MYSQL_DB

        # Devuelve una conexión (socket)
        return pymysql.connect(
            host=host,
            user=user,
            password=password,
            db=db
        )
    except pymysql.Error as e:
        print("Error al conectar a la base de datos:", e)
        raise e