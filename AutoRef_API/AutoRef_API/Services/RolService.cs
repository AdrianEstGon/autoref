using AutoRef_API.Database;
using Microsoft.AspNetCore.Identity;

public class RolService
{
    private readonly RoleManager<ApplicationRole> _roleManager;

    public RolService(RoleManager<ApplicationRole> roleManager)
    {
        _roleManager = roleManager;
    }

    public async Task CrearRolAsync(string nombreRol)
    {
        var rol = new ApplicationRole { Name = nombreRol };
        var result = await _roleManager.CreateAsync(rol);

        if (result.Succeeded)
        {
            // El rol se ha creado correctamente
        }
        else
        {
            // Manejar errores de creación
        }
    }
}
