from flask import Flask
from flask_cors import CORS
from .routes import route_login, routes_empleados, routes_rol, routes_r_entrada, routes_r_salida

def create_app(Config):
    app = Flask(__name__)
    app.config.from_object(Config)

    # Configurar CORS
    CORS(app, resources={"/empleados/*": {"origins": "http://localhost:5000", "methods": ["POST", "PUT", "GET", "DELETE"]}})
    CORS(app, resources={"/rol/*": {"origins": "http://localhost:5000", "methods": ["POST", "PUT", "GET", "DELETE"]}})
    CORS(app, resources={"/r_entrada/*": {"origins": "http://localhost:5000", "methods": ["POST", "PUT", "GET", "DELETE"]}})
    CORS(app, resources={"/r_salida/*": {"origins": "http://localhost:5000", "methods": ["POST", "PUT", "GET", "DELETE"]}})
    CORS(app, resources={"/kpi/*": {"origins": "http://localhost:5000", "methods": ["POST", "PUT", "GET", "DELETE"]}})

    app.register_blueprint(routes_empleados.bp, url_prefix="/empleados")
    app.register_blueprint(routes_rol.bp, url_prefix="/rol")
    app.register_blueprint(routes_r_entrada.bp, url_prefix="/r_entrada")
    app.register_blueprint(routes_r_salida.bp, url_prefix="/r_salida")

    app.register_blueprint(route_login.bp)
    return app
