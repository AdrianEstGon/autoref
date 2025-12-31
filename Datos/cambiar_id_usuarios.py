import mysql.connector
from mysql.connector import Error

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
        
        print("🔧 Cambiando columna Id de BIGINT a VARCHAR (GUID)...\n")
        
        # Eliminar AUTO_INCREMENT primero
        cursor.execute("""
            ALTER TABLE Usuarios 
            MODIFY COLUMN Id VARCHAR(36) NOT NULL
        """)
        
        print("✅ Columna Id cambiada a VARCHAR(36) para soportar GUIDs")
        
        connection.commit()
        
    except Error as e:
        print(f"❌ Error: {e}")
    finally:
        if connection:
            connection.close()

if __name__ == "__main__":
    main()
