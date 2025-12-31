import mysql.connector
from mysql.connector import Error

# Configuración de la base de datos
DB_CONFIG = {
    'host': 'centerbeam.proxy.rlwy.net',
    'port': 44269,
    'user': 'root',
    'password': 'GRxhnJrlYUHUSIinGubqglouatNvvWBG',
    'database': 'railway'
}

def crear_conexion():
    """Crea y retorna una conexión a MySQL"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            print(f"✅ Conectado a MySQL")
            return connection
    except Error as e:
        print(f"❌ Error al conectar: {e}")
        return None

def main():
    connection = crear_conexion()
    if not connection:
        return
    
    try:
        cursor = connection.cursor()
        
        print("\n🗑️  Eliminando tablas de Identity innecesarias...")
        
        # Eliminar en orden correcto (por foreign keys)
        tablas = ['AspNetUserRoles', 'AspNetUserClaims', 'AspNetUserLogins', 
                  'AspNetUserTokens', 'AspNetRoleClaims', 'AspNetUsers', 'AspNetRoles']
        
        for tabla in tablas:
            cursor.execute(f"DROP TABLE IF EXISTS `{tabla}`")
            print(f"  ✅ {tabla} eliminada")
        
        connection.commit()
        print("\n✅ Tablas de Identity eliminadas. El sistema usará la tabla Usuarios directamente.")
        
    except Error as e:
        print(f"❌ Error: {e}")
    finally:
        if connection:
            connection.close()

if __name__ == "__main__":
    main()
