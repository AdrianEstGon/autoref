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
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"❌ Error: {e}")
        return None

def main():
    connection = crear_conexion()
    if not connection:
        return
    
    try:
        cursor = connection.cursor()
        
        print("📋 Columnas actuales de la tabla Usuarios:\n")
        cursor.execute("DESCRIBE Usuarios")
        for row in cursor.fetchall():
            print(f"  - {row[0]:30} {row[1]:20} {row[2]:5} {row[3]:5}")
        
        print("\n➕ Añadiendo columnas necesarias para Identity...\n")
        
        columnas_identity = [
            "ADD COLUMN `UserName` VARCHAR(256) NULL",
            "ADD COLUMN `NormalizedUserName` VARCHAR(256) NULL",
            "ADD COLUMN `NormalizedEmail` VARCHAR(256) NULL",
            "ADD COLUMN `EmailConfirmed` TINYINT(1) NOT NULL DEFAULT 0",
            "ADD COLUMN `PasswordHash` TEXT NULL",
            "ADD COLUMN `SecurityStamp` TEXT NULL",
            "ADD COLUMN `ConcurrencyStamp` TEXT NULL",
            "ADD COLUMN `PhoneNumber` TEXT NULL",
            "ADD COLUMN `PhoneNumberConfirmed` TINYINT(1) NOT NULL DEFAULT 0",
            "ADD COLUMN `TwoFactorEnabled` TINYINT(1) NOT NULL DEFAULT 0",
            "ADD COLUMN `LockoutEnd` DATETIME(6) NULL",
            "ADD COLUMN `LockoutEnabled` TINYINT(1) NOT NULL DEFAULT 0",
            "ADD COLUMN `AccessFailedCount` INT NOT NULL DEFAULT 0"
        ]
        
        for columna_sql in columnas_identity:
            try:
                cursor.execute(f"ALTER TABLE Usuarios {columna_sql}")
                print(f"  ✅ {columna_sql.split('`')[1]}")
            except Error as e:
                if "Duplicate column" in str(e):
                    print(f"  ⚠️  {columna_sql.split('`')[1]} ya existe")
                else:
                    print(f"  ❌ Error: {e}")
        
        connection.commit()
        
        # Crear índices
        print("\n📑 Creando índices...")
        try:
            cursor.execute("CREATE UNIQUE INDEX UserNameIndex ON Usuarios (NormalizedUserName)")
            print("  ✅ Índice UserNameIndex creado")
        except Error as e:
            if "Duplicate key" in str(e):
                print("  ⚠️  Índice UserNameIndex ya existe")
            else:
                print(f"  ❌ Error: {e}")
        
        try:
            cursor.execute("CREATE INDEX EmailIndex ON Usuarios (NormalizedEmail)")
            print("  ✅ Índice EmailIndex creado")
        except Error as e:
            if "Duplicate key" in str(e):
                print("  ⚠️  Índice EmailIndex ya existe")
            else:
                print(f"  ❌ Error: {e}")
        
        connection.commit()
        
        print("\n✅ Tabla Usuarios actualizada para soportar Identity")
        
    except Error as e:
        print(f"❌ Error: {e}")
    finally:
        if connection:
            connection.close()

if __name__ == "__main__":
    main()
