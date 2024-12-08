
from decouple import Config

class Config:
    # Configuración para MySQL usando Flask-MySQLdb
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'root'
    MYSQL_PASSWORD = 'admin' #Intentar mantener esta clave puede variar segun la maquina
    MYSQL_DB = 'sral_edit'

class DevelopmentConfig(Config):
    DEBUG = True

config = {
    'development': DevelopmentConfig
}