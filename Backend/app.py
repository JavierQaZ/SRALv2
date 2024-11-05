from flask_jwt_extended import JWTManager
from config import config
from src import create_app
from datetime import timedelta

configuration = config['development']
app = create_app(configuration)

# Configurar JWT
app.config['JWT_SECRET_KEY'] = 'tu_secreto_aqui'  # Cambia esto por una clave secreta segura
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=100000000000)
jwt = JWTManager(app)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
