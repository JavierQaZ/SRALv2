from flask import Flask
from flask_cors import CORS
from .routes import route_login, routes_empleados, routes_informes, routes_rol, routes_r_entrada, routes_r_salida, routes_usuarios, routes_gestion,routes_home
def create_app(Config):
    app = Flask(__name__)
    app.config.from_object(Config)

    # Configurar CORS para permitir el origen correcto
    CORS(app, resources={r"/*": {"origins": "http://localhost:5173", "methods": ["POST", "PUT", "GET", "DELETE"]}})

    app.register_blueprint(routes_empleados.bp, url_prefix="/empleados")
    app.register_blueprint(routes_rol.bp, url_prefix="/rol")
    app.register_blueprint(routes_r_entrada.bp, url_prefix="/r_entrada")
    app.register_blueprint(routes_r_salida.bp, url_prefix="/r_salida")
    app.register_blueprint(routes_usuarios.bp, url_prefix="/usuarios")
    app.register_blueprint(routes_gestion.bp, url_prefix="/gestion")
    app.register_blueprint(routes_home.bp, url_prefix="/home")
    app.register_blueprint(routes_informes.bp, url_prefix="/informes")

    app.register_blueprint(route_login.bp)
    return app