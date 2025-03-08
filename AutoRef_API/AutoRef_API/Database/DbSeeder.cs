using AutoRef_API.Database;

using Microsoft.AspNetCore.Identity;

using System;
using System.Threading.Tasks;

public static class DbInitializer
{
    public static async Task SeedRolesAndAdmin(UserManager<Usuario> userManager, RoleManager<ApplicationRole> roleManager)
    {
        string adminRole = "Admin";
        string adminEmail = "admin@example.com";
        string adminPassword = "Admin@123"; // Cambia esto en producción.

        // 1. Crear el rol "Admin" si no existe
        if (!await roleManager.RoleExistsAsync(adminRole))
        {
            await roleManager.CreateAsync(new ApplicationRole { Name = adminRole });
        }

        // 2. Crear el usuario administrador si no existe
        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser == null)
        {
            adminUser = new Usuario
            {
                UserName = "admin",
                Email = adminEmail,
                //NombreCompleto = "Super Administrador",
                EmailConfirmed = true // Opcional: para evitar confirmaciones
            };

            var result = await userManager.CreateAsync(adminUser, adminPassword);

            if (!result.Succeeded)
            {
                throw new Exception("Error al crear el usuario administrador: " + string.Join(", ", result.Errors));
            }
        }

        // 3. Asignar el rol "Admin" al usuario si aún no lo tiene
        if (!await userManager.IsInRoleAsync(adminUser, adminRole))
        {
            await userManager.AddToRoleAsync(adminUser, adminRole);
        }
    }
}
