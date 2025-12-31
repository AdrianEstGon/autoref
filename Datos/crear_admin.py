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
            print(f"✅ Conectado a MySQL: {DB_CONFIG['host']}:{DB_CONFIG['port']}")
            return connection
    except Error as e:
        print(f"❌ Error al conectar a MySQL: {e}")
        return None

def verificar_tablas_identity(connection):
    """Verifica si existen las tablas de Identity"""
    cursor = connection.cursor()
    tablas_identity = ['AspNetRoles', 'AspNetUsers', 'AspNetUserRoles']
    existentes = []
    
    for tabla in tablas_identity:
        cursor.execute(f"SHOW TABLES LIKE '{tabla}'")
        if cursor.fetchone():
            existentes.append(tabla)
    
    cursor.close()
    return existentes

def crear_tablas_identity(connection):
    """Crea las tablas necesarias de Identity si no existen"""
    cursor = connection.cursor()
    
    # Tabla AspNetRoles
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS `AspNetRoles` (
            `Id` VARCHAR(255) NOT NULL,
            `Name` VARCHAR(256) NULL,
            `NormalizedName` VARCHAR(256) NULL,
            `ConcurrencyStamp` VARCHAR(255) NULL,
            PRIMARY KEY (`Id`),
            UNIQUE INDEX `RoleNameIndex` (`NormalizedName`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """)
    
    # Tabla AspNetUsers
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS `AspNetUsers` (
            `Id` VARCHAR(255) NOT NULL,
            `UserName` VARCHAR(256) NULL,
            `NormalizedUserName` VARCHAR(256) NULL,
            `Email` VARCHAR(256) NULL,
            `NormalizedEmail` VARCHAR(256) NULL,
            `EmailConfirmed` TINYINT(1) NOT NULL DEFAULT 0,
            `PasswordHash` TEXT NULL,
            `SecurityStamp` TEXT NULL,
            `ConcurrencyStamp` TEXT NULL,
            `PhoneNumber` TEXT NULL,
            `PhoneNumberConfirmed` TINYINT(1) NOT NULL DEFAULT 0,
            `TwoFactorEnabled` TINYINT(1) NOT NULL DEFAULT 0,
            `LockoutEnd` DATETIME(6) NULL,
            `LockoutEnabled` TINYINT(1) NOT NULL DEFAULT 0,
            `AccessFailedCount` INT NOT NULL DEFAULT 0,
            `Discriminator` VARCHAR(255) NOT NULL DEFAULT 'Usuario',
            `NombreCompleto` VARCHAR(255) NULL,
            `PersonaId` BIGINT NULL,
            PRIMARY KEY (`Id`),
            UNIQUE INDEX `UserNameIndex` (`NormalizedUserName`),
            INDEX `EmailIndex` (`NormalizedEmail`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """)
    
    # Tabla AspNetUserRoles
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS `AspNetUserRoles` (
            `UserId` VARCHAR(255) NOT NULL,
            `RoleId` VARCHAR(255) NOT NULL,
            PRIMARY KEY (`UserId`, `RoleId`),
            INDEX `IX_AspNetUserRoles_RoleId` (`RoleId`),
            CONSTRAINT `FK_AspNetUserRoles_AspNetRoles_RoleId` 
                FOREIGN KEY (`RoleId`) REFERENCES `AspNetRoles` (`Id`) ON DELETE CASCADE,
            CONSTRAINT `FK_AspNetUserRoles_AspNetUsers_UserId` 
                FOREIGN KEY (`UserId`) REFERENCES `AspNetUsers` (`Id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """)
    
    connection.commit()
    cursor.close()
    print("✅ Tablas de Identity verificadas/creadas")

def hash_password(password):
    """Hash de contraseña compatible con ASP.NET Core Identity usando BCrypt"""
    # BCrypt salt
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    # Formato para ASP.NET Core Identity (BCrypt)
    return hashed.decode('utf-8')

def crear_usuario_admin(connection):
    """Crea un usuario administrador"""
    cursor = connection.cursor()
    
    # Datos del usuario
    user_id = str(uuid.uuid4())
    role_id = str(uuid.uuid4())
    username = "admin"
    email = "admin@autoref.es"
    password = "Admin123"
    nombre_completo = "Administrador"
    
    print(f"\n👤 Creando usuario administrador:")
    print(f"   Usuario: {username}")
    print(f"   Email: {email}")
    print(f"   Contraseña: {password}")
    print(f"   Nombre: {nombre_completo}")
    
    # Hash de la contraseña
    password_hash = hash_password(password)
    
    # 1. Crear rol Admin si no existe
    cursor.execute("SELECT Id FROM AspNetRoles WHERE NormalizedName = 'ADMIN'")
    existing_role = cursor.fetchone()
    
    if existing_role:
        role_id = existing_role[0]
        print(f"   ℹ️  Rol Admin ya existe: {role_id}")
    else:
        cursor.execute("""
            INSERT INTO AspNetRoles (Id, Name, NormalizedName, ConcurrencyStamp)
            VALUES (%s, %s, %s, %s)
        """, (role_id, "Admin", "ADMIN", str(uuid.uuid4())))
        print(f"   ✅ Rol Admin creado: {role_id}")
    
    # 2. Verificar si el usuario ya existe
    cursor.execute("SELECT Id FROM AspNetUsers WHERE NormalizedUserName = 'ADMIN'")
    if cursor.fetchone():
        print(f"   ⚠️  Usuario {username} ya existe")
        cursor.close()
        return
    
    # 3. Crear usuario en AspNetUsers
    cursor.execute("""
        INSERT INTO AspNetUsers (
            Id, UserName, NormalizedUserName, Email, NormalizedEmail,
            EmailConfirmed, PasswordHash, SecurityStamp, ConcurrencyStamp,
            PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnabled,
            AccessFailedCount, Discriminator, NombreCompleto
        ) VALUES (
            %s, %s, %s, %s, %s,
            1, %s, %s, %s,
            0, 0, 0,
            0, 'Usuario', %s
        )
    """, (
        user_id, username, username.upper(), email, email.upper(),
        password_hash, str(uuid.uuid4()), str(uuid.uuid4()),
        nombre_completo
    ))
    print(f"   ✅ Usuario creado en AspNetUsers: {user_id}")
    
    # 4. Asignar rol al usuario
    cursor.execute("""
        INSERT INTO AspNetUserRoles (UserId, RoleId)
        VALUES (%s, %s)
    """, (user_id, role_id))
    print(f"   ✅ Rol Admin asignado al usuario")
    
    connection.commit()
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
    print("👤 CREACIÓN DE USUARIO ADMINISTRADOR")
    print("="*80)
    
    connection = crear_conexion()
    if not connection:
        return
    
    try:
        # Verificar/crear tablas de Identity
        tablas_existentes = verificar_tablas_identity(connection)
        print(f"\n📋 Tablas Identity encontradas: {', '.join(tablas_existentes) if tablas_existentes else 'ninguna'}")
        
        crear_tablas_identity(connection)
        
        # Crear usuario admin
        crear_usuario_admin(connection)
        
    except Error as e:
        print(f"\n❌ Error: {e}")
    finally:
        if connection and connection.is_connected():
            connection.close()
            print("\n🔌 Conexión cerrada")

if __name__ == "__main__":
    main()
