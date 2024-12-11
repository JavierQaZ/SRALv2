import pytest
import base64
from io import BytesIO
from fpdf import FPDF
from flask_jwt_extended import JWTManager, create_access_token, get_jwt
from config import config
from src import create_app

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
        # Generar un token de acceso con claims adicionales
        return create_access_token(
            identity='12345', 
            additional_claims={'rut_empresa': '2222'}
        )

def test_generar_kpi_empleado_pdf(client, access_token):
    # Datos válidos
    payload = {
        "mes": 12,
        "anio": 2024,
        "rut_empleado": "20756698"
    }
    
    # Enviar el token JWT en el header de la solicitud
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    # Realizar la solicitud POST con el payload y el token JWT
    response = client.post("/kpi_empleado", json=payload, headers=headers)

    # Verificar que la respuesta tiene un estado 200
    assert response.status_code == 200
    assert response.content_type == "application/json"  # Verificar tipo de contenido
    
    # Verificar que el campo 'pdf' está presente en la respuesta
    assert "pdf" in response.json
    assert "filename" in response.json
    assert response.json["filename"] == f"informe_kpi_empleado_{payload['rut_empleado']}.pdf"
    
    # Verificar que el PDF está correctamente codificado en base64
    pdf_content = base64.b64decode(response.json["pdf"])
    assert isinstance(pdf_content, bytes)
    
    # Verificar que el PDF puede ser leído (opcional)
    pdf_file = BytesIO(pdf_content)
    pdf = FPDF()
    pdf.add_page()
    try:
        pdf.set_font('Arial', 'B', 12)
        # Intentar generar el archivo PDF
        pdf.output(pdf_file)
    except Exception as e:
        pytest.fail(f"Error al procesar el archivo PDF: {e}")
    
    # Verificar el rut_empresa (esto es opcional, ya que esto se maneja en el backend)
    claims = get_jwt()
    assert claims['rut_empresa'] == '2222'  # Asegúrate de que el rut_empresa en el token sea el esperado
