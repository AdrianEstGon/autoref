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
        
        print("➕ Añadiendo columnas faltantes del modelo Usuario.cs...\n")
        
        # Columnas del modelo Usuario.cs que faltan
        columnas_faltantes = [
            "ADD COLUMN `Nombre` VARCHAR(255) NULL",
            "ADD COLUMN `PrimerApellido` VARCHAR(255) NULL",
            "ADD COLUMN `SegundoApellido` VARCHAR(255) NULL",
            "ADD COLUMN `FechaNacimiento` DATETIME NULL",
            "ADD COLUMN `Nivel` VARCHAR(255) NULL",
            "ADD COLUMN `ClubVinculadoId` VARCHAR(36) NULL",
            "ADD COLUMN `Licencia` INT NOT NULL DEFAULT 0",
            "ADD COLUMN `Direccion` VARCHAR(255) NULL",
            "ADD COLUMN `Pais` VARCHAR(255) NULL",
            "ADD COLUMN `Region` VARCHAR(255) NULL",
            "ADD COLUMN `Ciudad` VARCHAR(255) NULL",
            "ADD COLUMN `CodigoPostal` VARCHAR(255) NULL",
            "ADD COLUMN `Latitud` DOUBLE NOT NULL DEFAULT 0",
            "ADD COLUMN `Longitud` DOUBLE NOT NULL DEFAULT 0",
            "ADD COLUMN `FotoPerfil` VARCHAR(255) NULL",
            "ADD COLUMN `Iban` VARCHAR(255) NULL",
            "ADD COLUMN `Bic` VARCHAR(255) NULL",
            "ADD COLUMN `TitularCuenta` VARCHAR(255) NULL"
        ]
        
        for columna_sql in columnas_faltantes:
            try:
                cursor.execute(f"ALTER TABLE Usuarios {columna_sql}")
                nombre_col = columna_sql.split('`')[1]
                print(f"  ✅ {nombre_col}")
            except Error as e:
                if "Duplicate column" in str(e):
                    nombre_col = columna_sql.split('`')[1]
                    print(f"  ⚠️  {nombre_col} ya existe")
                else:
                    print(f"  ❌ Error: {e}")
        
        connection.commit()
        print("\n✅ Tabla Usuarios actualizada con todas las columnas necesarias")
        
    except Error as e:
        print(f"❌ Error: {e}")
    finally:
        if connection:
            connection.close()

if __name__ == "__main__":
    main()
