using AutoRef_API.Database;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace AutoRef_API.Tools;

/// <summary>
/// Herramienta para crear usuarios de prueba para testing.
/// Ejecutar una sola vez después del primer despliegue.
/// </summary>
public static class CrearUsuariosTest
{
    public static async Task CrearUsuariosPrueba(
        UserManager<Usuario> userManager,
        RoleManager<ApplicationRole> roleManager)
    {
        Console.WriteLine("=== CREANDO USUARIOS DE PRUEBA ===");

        var usuarios = new[]
        {
            new
            {
                Email = "federacion@test.com",
                Username = "federacion@test.com",
                Password = "Fed123!",
                Rol = "Federacion",
                Nombre = "Usuario",
                PrimerApellido = "Federacion",
                Licencia = 1001,
                Nivel = "Federacion"
            },
            new
            {
                Email = "comite@test.com",
                Username = "comite@test.com",
                Password = "Com123!",
                Rol = "ComiteArbitros",
                Nombre = "Usuario",
                PrimerApellido = "Comite",
                Licencia = 2001,
                Nivel = "Comite"
            },
            new
            {
                Email = "club@test.com",
                Username = "club@test.com",
                Password = "Club123!",
                Rol = "Club",
                Nombre = "Usuario",
                PrimerApellido = "Club",
                Licencia = 3001,
                Nivel = "Club"
            },
            new
            {
                Email = "arbitro1@test.com",
                Username = "arbitro1@test.com",
                Password = "Arb123!",
                Rol = "Arbitro",
                Nombre = "Juan",
                PrimerApellido = "Arbitro",
                Licencia = 4001,
                Nivel = "Nacional"
            },
            new
            {
                Email = "arbitro2@test.com",
                Username = "arbitro2@test.com",
                Password = "Arb123!",
                Rol = "Arbitro",
                Nombre = "Maria",
                PrimerApellido = "Arbitro",
                Licencia = 4002,
                Nivel = "Regional"
            }
        };

        foreach (var u in usuarios)
        {
            // Verificar si el usuario ya existe
            var existingUser = await userManager.FindByEmailAsync(u.Email);
            if (existingUser != null)
            {
                Console.WriteLine($"⚠ Usuario {u.Email} ya existe, saltando...");
                continue;
            }

            // Verificar si el número de licencia ya existe
            var licenciaExistente = await userManager.Users.AnyAsync(usr => usr.Licencia == u.Licencia);
            if (licenciaExistente)
            {
                Console.WriteLine($"⚠ Licencia {u.Licencia} ya existe, saltando {u.Email}...");
                continue;
            }

            var usuario = new Usuario
            {
                UserName = u.Username,
                Email = u.Email,
                Nombre = u.Nombre,
                PrimerApellido = u.PrimerApellido,
                SegundoApellido = "Test",
                FechaNacimiento = new DateTime(1990, 1, 1),
                Nivel = u.Nivel,
                Licencia = u.Licencia,
                Direccion = "Calle Test 123",
                Pais = "España",
                Region = "Asturias",
                Ciudad = "Oviedo",
                CodigoPostal = "33000",
                Latitud = 43.361328,
                Longitud = -5.849389,
                Iban = "ES1234567890123456789012",
                Bic = "TESTESMMXXX",
                TitularCuenta = $"{u.Nombre} {u.PrimerApellido} Test",
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(usuario, u.Password);

            if (result.Succeeded)
            {
                // Asegurar que el rol existe
                if (!await roleManager.RoleExistsAsync(u.Rol))
                {
                    await roleManager.CreateAsync(new ApplicationRole { Name = u.Rol });
                }

                await userManager.AddToRoleAsync(usuario, u.Rol);
                Console.WriteLine($"✓ Usuario creado: {u.Email} ({u.Rol})");
            }
            else
            {
                Console.WriteLine($"✗ Error creando {u.Email}: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
        }

        Console.WriteLine("");
        Console.WriteLine("=== RESUMEN DE USUARIOS DE PRUEBA ===");
        Console.WriteLine("");
        Console.WriteLine("ROL              | EMAIL                  | CONTRASEÑA");
        Console.WriteLine("-----------------|------------------------|------------");
        Console.WriteLine("Federacion       | federacion@test.com    | Fed123!");
        Console.WriteLine("ComiteArbitros   | comite@test.com        | Com123!");
        Console.WriteLine("Club             | club@test.com          | Club123!");
        Console.WriteLine("Arbitro          | arbitro1@test.com      | Arb123!");
        Console.WriteLine("Arbitro          | arbitro2@test.com      | Arb123!");
        Console.WriteLine("");
        Console.WriteLine("Nota: El rol 'Publico' no requiere autenticación");
        Console.WriteLine("");
    }
}
