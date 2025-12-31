import pandas as pd
import mysql.connector
from mysql.connector import Error
import os
from unidecode import unidecode

# Configuración de la base de datos
DB_CONFIG = {
    'host': 'centerbeam.proxy.rlwy.net',
    'port': 44269,
    'user': 'root',
    'password': 'GRxhnJrlYUHUSIinGubqglouatNvvWBG',
    'database': 'railway'
}

def normalizar_nombre(nombre):
    """Normaliza nombres de tablas/columnas: primera letra mayúscula, sin tildes"""
    # Quitar tildes
    sin_tildes = unidecode(str(nombre))
    # Primera letra mayúscula
    return sin_tildes.capitalize()

def inferir_tipo_mysql(series, nombre_columna):
    """Infiere el tipo de dato MySQL basado en el contenido de la columna"""
    nombre_lower = nombre_columna.lower()
    
    # Casos especiales por nombre
    if nombre_lower == 'id':
        return 'BIGINT PRIMARY KEY AUTO_INCREMENT'
    
    if 'precio' in nombre_lower or 'importe' in nombre_lower or 'cantidad' in nombre_lower:
        return 'DECIMAL(10,2)'
    
    if 'email' in nombre_lower or 'correo' in nombre_lower:
        return 'VARCHAR(255)'
    
    if 'telefono' in nombre_lower or 'movil' in nombre_lower:
        return 'VARCHAR(20)'
    
    # Análisis del contenido
    non_null = series.dropna()
    if len(non_null) == 0:
        return 'VARCHAR(255)'
    
    # Verificar si es fecha/datetime
    if pd.api.types.is_datetime64_any_dtype(series):
        return 'DATETIME'
    
    # Verificar si es numérico
    try:
        numeric = pd.to_numeric(non_null, errors='coerce')
        if numeric.notna().sum() > len(non_null) * 0.8:
            if (numeric == numeric.astype(int)).all():
                max_val = abs(numeric).max()
                if max_val < 128:
                    return 'TINYINT'
                elif max_val < 32768:
                    return 'SMALLINT'
                elif max_val < 2147483648:
                    return 'INT'
                else:
                    return 'BIGINT'
            else:
                return 'DOUBLE'
    except:
        pass
    
    # Verificar booleano
    bool_values = {'true', 'false', 'si', 'no', 'sí', '1', '0', 'yes', 'no'}
    str_lower = non_null.astype(str).str.lower().str.strip()
    if str_lower.isin(bool_values).sum() > len(non_null) * 0.8:
        return 'BOOLEAN'
    
    # Texto por defecto
    max_len = non_null.astype(str).str.len().max()
    if max_len > 500:
        return 'TEXT'
    elif max_len > 255:
        return 'VARCHAR(500)'
    else:
        return 'VARCHAR(255)'

def generar_create_table(nombre_archivo, df):
    """Genera el SQL CREATE TABLE a partir de un DataFrame"""
    # Normalizar nombre de tabla
    tabla_nombre = normalizar_nombre(nombre_archivo.replace('.xlsx', '').replace(' ', '_'))
    
    columnas_sql = []
    
    for col in df.columns:
        col_normalizada = normalizar_nombre(str(col).replace(' ', '_'))
        tipo_sql = inferir_tipo_mysql(df[col], col)
        
        # Si no es PRIMARY KEY, agregar NULL/NOT NULL
        if 'PRIMARY KEY' not in tipo_sql:
            # Verificar si la columna tiene valores nulos
            tiene_nulos = df[col].isna().any()
            nullable = 'NULL' if tiene_nulos else 'NOT NULL'
            columnas_sql.append(f"  `{col_normalizada}` {tipo_sql} {nullable}")
        else:
            columnas_sql.append(f"  `{col_normalizada}` {tipo_sql}")
    
    sql = f"CREATE TABLE `{tabla_nombre}` (\n"
    sql += ",\n".join(columnas_sql)
    sql += "\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"
    
    return tabla_nombre, sql

def crear_conexion():
    """Crea y retorna una conexión a MySQL"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            print(f"✅ Conectado a MySQL: {DB_CONFIG['host']}:{DB_CONFIG['port']}")
            return connection
    except Error as e:
        print(f"❌ Error al conectar a MySQL: {e}")
        return None

def crear_tabla(connection, nombre_tabla, sql_create):
    """Crea una tabla en la base de datos"""
    try:
        cursor = connection.cursor()
        
        # Verificar si la tabla existe
        cursor.execute(f"SHOW TABLES LIKE '{nombre_tabla}'")
        if cursor.fetchone():
            print(f"  ⚠️  La tabla {nombre_tabla} ya existe, saltando...")
            return False
        
        # Crear la tabla
        cursor.execute(sql_create)
        connection.commit()
        print(f"  ✅ Tabla {nombre_tabla} creada exitosamente")
        return True
        
    except Error as e:
        print(f"  ❌ Error al crear tabla {nombre_tabla}: {e}")
        return False
    finally:
        if cursor:
            cursor.close()

def main():
    print("="*80)
    print("🔧 CREACIÓN DE TABLAS DESDE EXCEL")
    print("="*80)
    
    datos_path = r"c:\Users\ruben\Desktop\autoref\Datos"
    excel_files = [f for f in os.listdir(datos_path) if f.endswith('.xlsx')]
    
    # Excluir archivos que son solo análisis
    excel_files = [f for f in excel_files if not f.startswith('partidos')]
    
    print(f"\n📁 Carpeta: {datos_path}")
    print(f"📊 Archivos Excel encontrados: {len(excel_files)}")
    print(f"\n📋 Archivos a procesar:")
    for f in sorted(excel_files):
        print(f"  - {f}")
    
    # Conectar a la base de datos
    print(f"\n🔌 Conectando a la base de datos...")
    connection = crear_conexion()
    if not connection:
        print("❌ No se pudo conectar a la base de datos. Abortando.")
        return
    
    try:
        tablas_creadas = []
        tablas_existentes = []
        errores = []
        
        print("\n" + "="*80)
        print("📝 PROCESANDO ARCHIVOS...")
        print("="*80)
        
        for excel_file in sorted(excel_files):
            print(f"\n📄 Procesando: {excel_file}")
            filepath = os.path.join(datos_path, excel_file)
            
            try:
                # Leer Excel
                df = pd.read_excel(filepath)
                print(f"  📊 Filas: {len(df)}, Columnas: {len(df.columns)}")
                
                # Generar CREATE TABLE
                nombre_tabla, sql_create = generar_create_table(excel_file, df)
                print(f"  📝 Tabla a crear: {nombre_tabla}")
                
                # Mostrar SQL (primeras líneas)
                sql_preview = '\n'.join(sql_create.split('\n')[:5]) + '\n  ...'
                print(f"  📋 SQL:\n{sql_preview}")
                
                # Crear tabla
                if crear_tabla(connection, nombre_tabla, sql_create):
                    tablas_creadas.append(nombre_tabla)
                else:
                    tablas_existentes.append(nombre_tabla)
                    
            except Exception as e:
                print(f"  ❌ Error procesando {excel_file}: {e}")
                errores.append((excel_file, str(e)))
        
        # Resumen final
        print("\n" + "="*80)
        print("📋 RESUMEN FINAL")
        print("="*80)
        
        print(f"\n✅ Tablas creadas ({len(tablas_creadas)}):")
        for tabla in tablas_creadas:
            print(f"  - {tabla}")
        
        if tablas_existentes:
            print(f"\n⚠️  Tablas que ya existían ({len(tablas_existentes)}):")
            for tabla in tablas_existentes:
                print(f"  - {tabla}")
        
        if errores:
            print(f"\n❌ Errores ({len(errores)}):")
            for archivo, error in errores:
                print(f"  - {archivo}: {error}")
        
        print(f"\n{'='*80}")
        print("✅ Proceso completado")
        print("="*80)
        
    finally:
        if connection and connection.is_connected():
            connection.close()
            print("\n🔌 Conexión cerrada")

if __name__ == "__main__":
    main()
