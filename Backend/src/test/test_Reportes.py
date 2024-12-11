import pytest
import base64
from io import BytesIO
from pypdf import PdfReader
from flask_jwt_extended import JWTManager, create_access_token
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
    """
    Prueba para verificar la generación de un PDF de KPI por empleado
    """
    # Datos válidos
    payload = {
        "mes": 9,
        "anio": 2024,
        "rut_empleado": "20756698"
    }

    # Enviar el token JWT en el header de la solicitud
    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    # Realizar la solicitud POST con el payload y el token JWT
    response = client.post("informes/kpi_empleado", json=payload, headers=headers)

    # Verificar que la respuesta tenga un estado 200
    if response.status_code == 200:
        # Verificar si la respuesta contiene el archivo PDF
        if "pdf" in response.json:
            # Verificar que el PDF esté correctamente codificado en base64
            pdf_content = base64.b64decode(response.json["pdf"])
            assert isinstance(pdf_content, bytes)
            assert pdf_content[:4] == b"%PDF"  # Validar encabezado del archivo PDF

            # Leer y validar contenido del PDF
            pdf_stream = BytesIO(pdf_content)
            reader = PdfReader(pdf_stream)
            assert len(reader.pages) > 0  # Verificar que el PDF tenga al menos una página

            # Extraer y mostrar el texto del PDF
            for page_num, page in enumerate(reader.pages):
                page_text = page.extract_text()
                print(f"Contenido de la página {page_num + 1}: \n{page_text}")  # Imprimir contenido de cada página

            # Opcional: verificar texto dentro del PDF
            page_text = reader.pages[0].extract_text()
            assert "Informe KPI Empleado" in page_text
            assert payload["rut_empleado"] in page_text
        else:
            # Si no se generó el PDF, lanzar un aviso
            print("No se generó el PDF para el período solicitado. Verifique los datos.")
            assert False, "No se generó el archivo PDF"
    else:
        # Verificar que la respuesta tenga un estado 404 o 400 si no hay datos disponibles
        if response.status_code in [404, 400]:
            print("No hay datos disponibles para el período solicitado.")
            assert "No hay datos disponibles para el período solicitado" in response.json["message"]
        else:
            assert False, f"Error inesperado en la respuesta: {response.status_code}"
