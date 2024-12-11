import pytest
from flask_jwt_extended import JWTManager, create_access_token
from config import config
from src import create_app
import MySQLdb 

@pytest.fixture
def app():
    """
    Fixture para crear una instancia de la aplicación para pruebas
    """
    # Usar la configuración de desarrollo
    configuration = config['development']
    app = create_app(configuration)
    
    # Configuraciones específicas para pruebas
    app.config['TESTING'] = True
    app.config['JWT_SECRET_KEY'] = 'test-secret-key'
    
    # Configuraciones JWT requeridas
    app.config['JWT_TOKEN_LOCATION'] = ['headers']
    app.config['JWT_HEADER_NAME'] = 'Authorization'
    app.config['JWT_HEADER_TYPE'] = 'Bearer'
    
    # Inicializar JWTManager
    JWTManager(app)
    
    return app

@pytest.fixture
def client(app):
    """
    Fixture para crear un cliente de prueba
    """
    return app.test_client()

@pytest.fixture
def access_token(app):
    """
    Fixture para generar un token de acceso de prueba
    """
    with app.app_context():
        # Simula un token con rut_empresa
        return create_access_token(
            identity='1111', 
            additional_claims={'rut_empresa': '1111'}
        )

def test_crear_usuario_exitoso(client, access_token):
    """
    Prueba la creación de un nuevo usuario con datos válidos y verifica su existencia en la base de datos
    """
    # Datos de prueba para un nuevo usuario
    nuevo_usuario = {
        'rut_usuario': '12345678-0',
        'nombre_usuario': 'Juan',
        'apellidos_usuario': 'Pérez González',
        'contrasena_usuario': 'password123',
        'email_usuario': 'juan.perez@ejemplo.com'
    }
    
    # Realizar la solicitud POST para crear usuario
    response = client.post(
        '/usuarios/add', 
        json=nuevo_usuario,
        headers={'Authorization': f'Bearer {access_token}'}
    )
    
    # Imprimir respuesta para depuración
    print("Respuesta de creación de usuario:", response.get_json())
    
    # Verificaciones
    assert response.status_code == 201
    assert response.get_json()['message'] == 'Usuario agregado exitosamente'
    
    # Verificar que el usuario haya sido agregado a la base de datos
    db = MySQLdb.connect(
        host='localhost',
        user='root', 
        password='root',
        database='sral_edit'
    )
    cursor = db.cursor()
    
    # Realizar la consulta para verificar que el usuario existe en la base de datos
    cursor.execute("SELECT * FROM usuarios WHERE rut_usuario = %s", ('12345678-0',))
    usuario_db = cursor.fetchone()
    
    # Imprimir los resultados para depuración
    print("Usuario encontrado en la base de datos:", usuario_db)
    
    # Verificar que se haya encontrado al usuario
    assert usuario_db is not None  # Verifica que el usuario exista en la base de datos
    
    # Ahora ajusta los índices según el orden de las columnas en la base de datos
    # Si el orden es: rut_usuario, nombre_usuario, apellidos_usuario, contrasena_usuario, email_usuario
    assert usuario_db[2] == 'Juan'  # Verifica que el nombre sea correcto (índice 1 si es el segundo campo)
    assert usuario_db[3] == 'Pérez González'  # Verifica los apellidos (índice 2 si es el tercer campo)
    cursor.close()
    db.close()

def test_crear_usuario_con_credenciales_existentes(client, access_token):
    """
    Prueba que no se pueda crear un usuario con un rut_usuario o email_usuario ya existentes
    """
    # Datos de prueba para un nuevo usuario
    usuario_existente = {
        'rut_usuario': '12345678-0',  # Usando un rut_usuario ya creado previamente
        'nombre_usuario': 'Pedro',
        'apellidos_usuario': 'González',
        'contrasena_usuario': 'password456',
        'email_usuario': 'pedro.gonzalez@ejemplo.com'
    }
    
    # Realizar la solicitud POST para crear usuario con rut_usuario existente
    response = client.post(
        '/usuarios/add', 
        json=usuario_existente,
        headers={'Authorization': f'Bearer {access_token}'}
    )
    
    # Imprimir respuesta para depuración
    print("Respuesta al crear usuario con rut existente:", response.get_json())
    
    # Verificaciones
    assert response.status_code == 400  # Suponiendo que se lanza un error 400 para datos duplicados
    assert 'Ya existe un usuario' in response.get_json()['error']  # Verifica que el error sea por rut_usuario duplicado
