import mysql.connector
from mysql.connector import Error
import hashlib
import os
import base64

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

def hash_password_identity_v3(password):
    """
    Genera un hash compatible con ASP.NET Core Identity v3
    Formato: AQAAAAEAACcQAAAAE + salt (16 bytes) + hash (32 bytes)
    """
    # Generar salt aleatorio de 16 bytes
    salt = os.urandom(16)
    
    # Usar PBKDF2 con 10000 iteraciones (default de Identity v3)
    iterations = 10000
    hash_bytes = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, iterations, dklen=32)
    
    # Formato Identity v3:
    # - Version marker: 0x01 (1 byte)
    # - Format marker: 0x01 (1 byte) 
    # - Iteration count: 10000 en little-endian (4 bytes)
    # - Salt length: 16 (4 bytes)
    # - Salt: 16 bytes
    # - Hash: 32 bytes
    
    # Construir el array completo
    version = b'\x01'  # Identity v3
    format_marker = b'\x00'  # PBKDF2
    iter_count = iterations.to_bytes(4, byteorder='big')
    salt_size = len(salt).to_bytes(4, byteorder='big')
    
    full_hash = version + format_marker + iter_count + salt_size + salt + hash_bytes
    
    # Convertir a Base64
    return base64.b64encode(full_hash).decode('utf-8')

def main():
    connection = crear_conexion()
    if not connection:
        return
    
    try:
        cursor = connection.cursor()
        
        password = "Admin123"
        print(f"🔐 Generando hash compatible con Identity para: {password}\n")
        
        # Generar hash compatible
        password_hash = hash_password_identity_v3(password)
        
        print(f"Hash generado: {password_hash[:50]}...\n")
        
        # Actualizar usuario admin
        cursor.execute("""
            UPDATE Usuarios 
            SET PasswordHash = %s
            WHERE Email = 'admin@autoref.es'
        """, (password_hash,))
        
        connection.commit()
        print(f"✅ Contraseña actualizada ({cursor.rowcount} filas)")
        print(f"\n📝 Credenciales:")
        print(f"   Email: admin@autoref.es")
        print(f"   Contraseña: {password}")
        
    except Error as e:
        print(f"❌ Error: {e}")
    finally:
        if connection:
            connection.close()

if __name__ == "__main__":
    main()
