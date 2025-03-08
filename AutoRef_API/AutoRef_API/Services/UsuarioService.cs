using AutoRef_API.Database;

using Microsoft.AspNetCore.Identity;

public class UsuarioService
{
    private readonly UserManager<Usuario> _userManager;

    public UsuarioService(UserManager<Usuario> userManager)
    {
        _userManager = userManager;
    }

    public async Task CrearUsuarioAsync(string nombreUsuario, string contrasena)
    {
        var usuario = new Usuario { UserName = nombreUsuario, Email = "email@example.com" };
        var result = await _userManager.CreateAsync(usuario, contrasena);

        if (result.Succeeded)
        {
            // El usuario se ha creado correctamente
        }
        else
        {
            // Manejar errores de creación
        }
    }
    public async Task AsignarRolAUsuario(Usuario usuario, string rol)
    {
        var result = await _userManager.AddToRoleAsync(usuario, rol);

        if (result.Succeeded)
        {
            // El rol fue asignado correctamente
        }
        else
        {
            // Manejar errores
        }
    }

}
