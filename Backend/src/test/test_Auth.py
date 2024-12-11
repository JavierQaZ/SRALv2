from app import app  # Asegúrate de importar la app configurada correctamente
from flask_jwt_extended import create_access_token
import pytest

@pytest.fixture
def client():
    app.config['TESTING'] = True  # Asegúrate de que la app esté en modo de prueba
    with app.test_client() as client:
        yield client

def test_login_success(client):
    # Simula una solicitud POST para hacer login
    response = client.post('/login', json={
        'rut_usuario': '1111',
        'contrasena_usuario': '1111'
    })

    # Verifica que el código de estado sea 200 (OK)
    assert response.status_code == 200,"❌1.-Prueba Credenciales Correctas: ❌False"
    data = response.get_json()
    print("✅1.-Prueba Credenciales Correctas:✅True")

# Test para verificar que faltan campos en el request
def test_login_missing_fields(client):
    # Simula una solicitud POST con campos faltantes
    response = client.post('/login', json={
        'rut_usuario': '1111'
        # Falta la contrasena_usuario
    })
    
    # Verifica que el código de estado sea 400 (Bad Request)
    assert response.status_code == 400
    
    # Verifica que la respuesta contenga el error adecuado
    response_json = response.get_json()
    assert 'error' in response_json
    assert response_json['error'] == 'Falta el rut_usuario o la contrasena_usuario'
    print("✅2.- Prueba Credenciales faltantes ")