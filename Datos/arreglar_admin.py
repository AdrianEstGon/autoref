import mysql.connector
from mysql.connector import Error
from datetime import datetime

DB_CONFIG = {
    'host': 'centerbeam.proxy.rlwy.net',
    'port': 44269,
    'user': 'root',
    'password': 'GRxhnJrlYUHUSIinGubqglouatNvvWBG',
    'database': 'railway'
}

def crear_conexion():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection if connection.is_connected() else None
    except Error as e:
        print(f"❌ Error: {e}")
        return None

def main():
    connection = crear_conexion()
    if not connection:
        return
    
    try:
        cursor = connection.cursor()
        
        print("🔧 Actualizando usuario admin con valores por defecto...\n")
        
        # Actualizar usuario admin con fecha de nacimiento válida
        cursor.execute("""
            UPDATE Usuarios 
            SET FechaNacimiento = '1990-01-01',
                Licencia = 0,
                Latitud = 0,
                Longitud = 0
            WHERE Email = 'admin@autoref.es'
        """)
        
        connection.commit()
        print(f"✅ Usuario admin actualizado ({cursor.rowcount} filas)")
        
    except Error as e:
        print(f"❌ Error: {e}")
    finally:
        if connection:
            connection.close()

if __name__ == "__main__":
    main()
