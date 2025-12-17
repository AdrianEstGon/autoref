-- Actualizar el hash de contraseña del usuario admin
-- El nuevo hash será generado por el programa

UPDATE Usuarios 
SET PasswordHash = @newHash
WHERE Email = 'adrian.estrada2001@gmail.com';

SELECT 'Contraseña actualizada' AS Resultado;

