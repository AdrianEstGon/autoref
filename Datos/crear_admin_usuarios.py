import mysql.connector
from mysql.connector import Error
import bcrypt
import uuid
from datetime import datetime

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

def hash_password(password):
    """Hash de contraseña compatible con ASP.NET Core Identity usando BCrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def obtener_columnas_tabla(connection):
    """Obtiene las columnas de la tabla Usuarios"""
    cursor = connection.cursor()
    cursor.execute("DESCRIBE Usuarios")
    columnas = [row[0] for row in cursor.fetchall()]
    cursor.close()
    return columnas

def crear_usuario_admin(connection):
    """Crea un usuario administrador en la tabla Usuarios"""
    cursor = connection.cursor()
    
    # Datos del usuario
    user_id = str(uuid.uuid4())
    username = "admin"
    email = "admin@autoref.es"
    password = "Admin123"
    
    print(f"\n👤 Creando usuario administrador:")
    print(f"   Usuario: {username}")
    print(f"   Email: {email}")
    print(f"   Contraseña: {password}")
    
    # Verificar columnas existentes
    columnas = obtener_columnas_tabla(connection)
    print(f"\n📋 Columnas en tabla Usuarios: {', '.join(columnas[:10])}{'...' if len(columnas) > 10 else ''}")
    
    # Hash de la contraseña
    password_hash = hash_password(password)
    security_stamp = str(uuid.uuid4())
    concurrency_stamp = str(uuid.uuid4())
    
    # Verificar si el usuario ya existe
    cursor.execute("SELECT Id FROM Usuarios WHERE UserName = %s OR Email = %s", (username, email))
    if cursor.fetchone():
        print(f"   ⚠️  Usuario {username} ya existe")
        cursor.close()
        return
    
    # Construir INSERT dinámicamente según columnas disponibles
    columnas_insert = []
    valores_insert = []
    placeholders = []
    
    # Columnas obligatorias de Identity
    if 'Id' in columnas:
        columnas_insert.append('Id')
        valores_insert.append(user_id)
        placeholders.append('%s')
    
    if 'UserName' in columnas:
        columnas_insert.append('UserName')
        valores_insert.append(username)
        placeholders.append('%s')
    
    if 'NormalizedUserName' in columnas:
        columnas_insert.append('NormalizedUserName')
        valores_insert.append(username.upper())
        placeholders.append('%s')
    
    if 'Email' in columnas:
        columnas_insert.append('Email')
        valores_insert.append(email)
        placeholders.append('%s')
    
    if 'NormalizedEmail' in columnas:
        columnas_insert.append('NormalizedEmail')
        valores_insert.append(email.upper())
        placeholders.append('%s')
    
    if 'EmailConfirmed' in columnas:
        columnas_insert.append('EmailConfirmed')
        valores_insert.append(1)
        placeholders.append('%s')
    
    if 'PasswordHash' in columnas:
        columnas_insert.append('PasswordHash')
        valores_insert.append(password_hash)
        placeholders.append('%s')
    
    if 'SecurityStamp' in columnas:
        columnas_insert.append('SecurityStamp')
        valores_insert.append(security_stamp)
        placeholders.append('%s')
    
    if 'ConcurrencyStamp' in columnas:
        columnas_insert.append('ConcurrencyStamp')
        valores_insert.append(concurrency_stamp)
        placeholders.append('%s')
    
    if 'PhoneNumberConfirmed' in columnas:
        columnas_insert.append('PhoneNumberConfirmed')
        valores_insert.append(0)
        placeholders.append('%s')
    
    if 'TwoFactorEnabled' in columnas:
        columnas_insert.append('TwoFactorEnabled')
        valores_insert.append(0)
        placeholders.append('%s')
    
    if 'LockoutEnabled' in columnas:
        columnas_insert.append('LockoutEnabled')
        valores_insert.append(0)
        placeholders.append('%s')
    
    if 'AccessFailedCount' in columnas:
        columnas_insert.append('AccessFailedCount')
        valores_insert.append(0)
        placeholders.append('%s')
    
    # Columnas obligatorias del Excel
    if 'Fecha_de_creacion' in columnas:
        columnas_insert.append('Fecha_de_creacion')
        valores_insert.append(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
        placeholders.append('%s')
    
    if 'Fecha_de_modificacion' in columnas:
        columnas_insert.append('Fecha_de_modificacion')
        valores_insert.append(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
        placeholders.append('%s')
    
    if 'Name' in columnas:
        columnas_insert.append('Name')
        valores_insert.append('Administrador')
        placeholders.append('%s')
    
    if 'Password_digest' in columnas:
        columnas_insert.append('Password_digest')
        valores_insert.append('')
        placeholders.append('%s')
    
    if 'Remember_token' in columnas:
        columnas_insert.append('Remember_token')
        valores_insert.append('')
        placeholders.append('%s')
    
    if 'Config' in columnas:
        columnas_insert.append('Config')
        valores_insert.append('{}')
        placeholders.append('%s')
    
    if 'Roles' in columnas:
        columnas_insert.append('Roles')
        valores_insert.append('admin')
        placeholders.append('%s')
    
    if 'Color' in columnas:
        columnas_insert.append('Color')
        valores_insert.append('#000000')
        placeholders.append('%s')
    
    if 'Scopes' in columnas:
        columnas_insert.append('Scopes')
        valores_insert.append('[]')
        placeholders.append('%s')
    
    if 'Notification_config' in columnas:
        columnas_insert.append('Notification_config')
        valores_insert.append('{}')
        placeholders.append('%s')
    
    if 'Notification_custom_channels' in columnas:
        columnas_insert.append('Notification_custom_channels')
        valores_insert.append('[]')
        placeholders.append('%s')
    
    if 'Notification_channels' in columnas:
        columnas_insert.append('Notification_channels')
        valores_insert.append('[]')
        placeholders.append('%s')
    
    if 'Search_text_cache' in columnas:
        columnas_insert.append('Search_text_cache')
        valores_insert.append('')
        placeholders.append('%s')
    
    if 'Habilitado' in columnas:
        columnas_insert.append('Habilitado')
        valores_insert.append(1)
        placeholders.append('%s')
    
    # Construir SQL
    sql = f"""
        INSERT INTO Usuarios ({', '.join(columnas_insert)})
        VALUES ({', '.join(placeholders)})
    """
    
    # Ejecutar INSERT
    try:
        cursor.execute(sql, tuple(valores_insert))
        connection.commit()
        print(f"   ✅ Usuario administrador creado en Usuarios: {user_id}")
    except Error as e:
        print(f"   ❌ Error al crear usuario: {e}")
        print(f"   SQL: {sql}")
        connection.rollback()
        cursor.close()
        return
    
    cursor.close()
    
    print(f"\n{'='*80}")
    print("✅ USUARIO ADMINISTRADOR CREADO EXITOSAMENTE")
    print(f"{'='*80}")
    print(f"\n📝 Credenciales de acceso:")
    print(f"   Usuario: {username}")
    print(f"   Contraseña: {password}")
    print(f"   Email: {email}")
    print(f"\n⚠️  IMPORTANTE: Cambia la contraseña después del primer inicio de sesión")

def main():
    print("="*80)
    print("👤 CREACIÓN DE USUARIO ADMINISTRADOR EN TABLA USUARIOS")
    print("="*80)
    
    connection = crear_conexion()
    if not connection:
        return
    
    try:
        crear_usuario_admin(connection)
    except Error as e:
        print(f"\n❌ Error: {e}")
    finally:
        if connection and connection.is_connected():
            connection.close()
            print("\n🔌 Conexión cerrada")

if __name__ == "__main__":
    main()
