from ..database.db_conección import get_connection
import pymysql

def costo_total_service(mes, anio, rut_empresa):
    try:
        # Conexión a la base de datos
        connection = get_connection()
        cursor = connection.cursor()
        
        # Llamar al procedimiento almacenado
        cursor.callproc('CalcularCostoTotalPorEmpresa', [mes, anio, rut_empresa])
        
        # Leer los resultados
        resultados = cursor.fetchall()
        if resultados:
            costo_total = resultados[0][0]  # Primer valor en la primera fila
            return {"costo_total": float(costo_total)}
        else:
            return {"costo_total": 0.0}
    
    except Exception as e:
        print(f"Error en costo_total_service: {e}")
        raise
    
    finally:
        # Cerrar conexión y cursor
        if 'cursor' in locals():
            cursor.close()
        if 'connection' in locals():
            connection.close()