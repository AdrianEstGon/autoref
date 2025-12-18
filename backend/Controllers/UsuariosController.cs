using AutoRef_API.Database;
using AutoRef_API.Services;

using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;


[Route("api/[controller]")]
[ApiController]
public class UsuariosController : ControllerBase
{
    private readonly UserManager<Usuario> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly SignInManager<Usuario> _signInManager;
    private readonly HttpClient _httpClient;
    private readonly Cloudinary _cloudinary;
    private readonly AppDataBase _context;
    private readonly IConfiguration _configuration;
    private readonly string _googleMapsApiKey; 

    public UsuariosController(
        UserManager<Usuario> userManager,
        RoleManager<ApplicationRole> roleManager,
        SignInManager<Usuario> signInManager,
        Cloudinary cloudinary, AppDataBase context, IConfiguration configuration)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _signInManager = signInManager;
        _httpClient = new HttpClient();
        _cloudinary = cloudinary;
        _context = context;
        _configuration = configuration;
        _googleMapsApiKey = Environment.GetEnvironmentVariable("GOOGLE_MAPS_API_KEY") ?? "AIzaSyC24LaFVU6RgtEswKeAvrryUFBg7CBgONQ";
    }

    [Authorize]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        var userExistente = await _userManager.FindByEmailAsync(model.Email);
        if (userExistente != null)
        {
            return BadRequest(new { message = "El correo electr�nico ya est� registrado" });
        }

 
        var licenciaExistente = await _userManager.Users
            .AnyAsync(u => u.Licencia == model.Licencia);

        if (licenciaExistente)
        {
            return BadRequest(new { message = "El n�mero de licencia ya est� registrado" });
        }
        
        // Obtener las coordenadas (geolocalizaci�n)
        var coordenadas = await ObtenerCoordenadas(model.Direccion, model.Ciudad, model.Pais);

        // Generar la contrase�a
        var contrasenaGenerada = GenerarContrasena(model.Nombre); 

        var user = new Usuario
        {
            UserName = model.Username,
            Email = model.Email,
            Nombre = model.Nombre,
            PrimerApellido = model.PrimerApellido,
            SegundoApellido = model.SegundoApellido,
            FechaNacimiento = model.FechaNacimiento,
            Nivel = model.Nivel,
            ClubVinculadoId = model.ClubVinculadoId,
            Licencia = model.Licencia,
            Direccion = model.Direccion,
            Pais = model.Pais,
            Region = model.Region,
            Ciudad = model.Ciudad,
            CodigoPostal = model.CodigoPostal,
            Latitud = coordenadas.Latitud,
            Longitud = coordenadas.Longitud,
        };

        // Registrar el usuario
        var result = await _userManager.CreateAsync(user, contrasenaGenerada);

        if (result.Succeeded)
        {
            // Enviar la contrase�a por correo
            var mailService = new MailService();  // Crear instancia del servicio de correo
            await mailService.SendEmailAsync(model.Email, "Tu nueva contrase�a", $"Hola {model.Nombre},\n\nTu nueva contrase�a es: {contrasenaGenerada}\n\nSaludos!");

            // Asignación de rol:
            // - Si EsAdmin => Admin (compatibilidad con UI actual)
            // - Si no => usa model.Rol si viene, y si no, asigna Arbitro por defecto
            var roleToAssign = model.EsAdmin ? "Admin" : (string.IsNullOrWhiteSpace(model.Rol) ? "Arbitro" : model.Rol!.Trim());

            // Crear rol si no existe (por seguridad)
            if (!await _roleManager.RoleExistsAsync(roleToAssign))
            {
                await _roleManager.CreateAsync(new ApplicationRole { Name = roleToAssign });
            }

            await _userManager.AddToRoleAsync(user, roleToAssign);

            return Ok(new { message = "Usuario registrado con �xito", role = roleToAssign });
        }

        return BadRequest(result.Errors);
    }

    // Funci�n para generar una contrase�a aleatoria (con s�mbolos, letras y n�meros)
    private string GenerarContrasena(string nombre)
    {
        var random = new Random();
        var longitud = 12; // Longitud de la contrase�a
        var caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?/";
        var contrasena = new StringBuilder();

        // Agregar al menos una letra may�scula, una min�scula, un n�mero y un s�mbolo
        contrasena.Append(nombre.Substring(0, 1).ToUpper()); // Usar la primera letra del nombre en may�scula
        contrasena.Append('a'); // Garantizar que haya una letra min�scula
        contrasena.Append('1'); // Garantizar que haya un n�mero
        contrasena.Append('!'); // Garantizar que haya un s�mbolo

        for (int i = contrasena.Length; i < longitud; i++)
        {
            contrasena.Append(caracteres[random.Next(caracteres.Length)]);
        }

        var contrasenaFinal = contrasena.ToString().ToCharArray();
        random.Shuffle(contrasenaFinal);

        return new string(contrasenaFinal);
    }



    private async Task<(double Latitud, double Longitud)> ObtenerCoordenadas(string direccion, string ciudad, string pais)
    {
        var direccionCompleta = $"{direccion}, {ciudad}, {pais}";
        var url = $"https://maps.googleapis.com/maps/api/geocode/json?address={Uri.EscapeDataString(direccionCompleta)}&key={_googleMapsApiKey}";

        var response = await _httpClient.GetAsync(url);
        if (!response.IsSuccessStatusCode)
        {
            return (0, 0);
        }

        var jsonResponse = await response.Content.ReadAsStringAsync();
        dynamic data = JsonConvert.DeserializeObject(jsonResponse);

        if (data.status == "OK")
        {
            var location = data.results[0].geometry.location;
            return ((double)location.lat, (double)location.lng);
        }
        return (0, 0);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        var user = await _userManager.FindByNameAsync(model.Email);
        if (user == null)
            return Unauthorized(new { message = "Usuario o contrase�a incorrectos" });

        var result = await _signInManager.PasswordSignInAsync(user, model.Password, false, false);
        if (!result.Succeeded)
            return Unauthorized(new { message = "Usuario o contrase�a incorrectos" });

        var roles = await _userManager.GetRolesAsync(user);

        // Generar el token JWT
        var token = GenerateJwtToken(user, roles);

        return Ok(new
        {
            message = "Inicio de sesi�n exitoso",
            token,   // Agrega el token en la respuesta
            role = roles.FirstOrDefault() ?? "Arbitro",// Asegura rol para frontend
            roles = roles.ToList(),
            id = user.Id,
            fotoPerfil = user.FotoPerfil,
            licencia = user.Licencia,
            clubVinculadoId = user.ClubVinculadoId
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("create-role")]
    public async Task<IActionResult> CreateRole([FromBody] RoleModel model)
    {
        if (!await _roleManager.RoleExistsAsync(model.RoleName))
        {
            var role = new ApplicationRole { Name = model.RoleName };
            var result = await _roleManager.CreateAsync(role);

            if (result.Succeeded)
                return Ok(new { message = "Rol creado con �xito" });

            return BadRequest(result.Errors);
        }

        return BadRequest(new { message = "El rol ya existe" });
    }


    [Authorize(Roles = "Admin")]
    [HttpPost("assign-role")]
    public async Task<IActionResult> AssignRole([FromBody] AssignRoleModel model)
    {
        var user = await _userManager.FindByNameAsync(model.Username);
        if (user == null)
            return NotFound(new { message = "Usuario no encontrado" });

        var result = await _userManager.AddToRoleAsync(user, model.RoleName);

        if (result.Succeeded)
            return Ok(new { message = "Rol asignado con �xito" });

        return BadRequest(result.Errors);
    }


    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {

        var users = await _userManager.Users
                .Include(p => p.ClubVinculado)  
                .ToListAsync();
        var userList = new List<object>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            userList.Add(new
            {
                user.Id,
                user.UserName,
                user.ClubVinculadoId,
                user.Licencia,
                user.Nivel,
                user.Nombre,
                user.PrimerApellido,
                user.SegundoApellido,
                user.FechaNacimiento,
                user.FotoPerfil,
                user.Longitud,
                user.Latitud,
                user.Email,
                Roles = roles,
                user.CodigoPostal,
                user.Ciudad,
                user.Direccion,
                user.Pais,
                user.Region,
                ClubVinculado = user.ClubVinculado?.Nombre
            });
        }

        return Ok(userList);
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserById(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "Usuario no encontrado" });
        }

        var roles = await _userManager.GetRolesAsync(user);

        return Ok(new
        {
            user.Id,
            user.UserName,
            user.ClubVinculadoId,
            user.Licencia,
            user.Nivel,
            user.Nombre,
            user.PrimerApellido,
            user.SegundoApellido,
            user.FechaNacimiento,
            user.FotoPerfil,
            user.Longitud,
            user.Latitud,
            user.Email,
            Roles = roles,
            user.CodigoPostal,
            user.Ciudad,
            user.Direccion,
            user.Pais,
            user.Region,
            ClubVinculado = user.ClubVinculado?.Nombre
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "Usuario no encontrado" });
        }

        var userGuid = Guid.Parse(id); 

        // 1. Eliminar disponibilidades
        var disponibilidades = await _context.Disponibilidades
            .Where(d => d.UsuarioId == userGuid)
            .ToListAsync();

        _context.Disponibilidades.RemoveRange(disponibilidades);

        

        var partidos = await _context.Partidos
            .Where(p => p.Arbitro1Id == userGuid || p.Arbitro2Id == userGuid || p.AnotadorId == userGuid)
            .ToListAsync();


        foreach (var partido in partidos)
        {
            if (partido.Arbitro1Id == userGuid) partido.Arbitro1Id = null;
            if (partido.Arbitro2Id == userGuid) partido.Arbitro2Id = null;
            if (partido.AnotadorId == userGuid) partido.AnotadorId = null;
        }

        await _context.SaveChangesAsync();

        // 3. Eliminar roles asignados al usuario
        var roles = await _userManager.GetRolesAsync(user);
        foreach (var role in roles)
        {
            await _userManager.RemoveFromRoleAsync(user, role);
        }

        // 4. Eliminar el usuario
        var result = await _userManager.DeleteAsync(user);
        if (result.Succeeded)
        {
            return Ok(new { message = "Usuario, disponibilidades y asignaciones eliminadas con �xito" });
        }

        return BadRequest(new { message = "Error al eliminar el usuario", errors = result.Errors });
    }


    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateModel model)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "Usuario no encontrado" });
        }

        if (model.Licencia != 0)
        {
            var licenciaEnUso = await _userManager.Users
                .AnyAsync(u => u.Id != user.Id && u.Licencia == model.Licencia);

            if (licenciaEnUso)
            {
                return BadRequest(new { message = "El n�mero de licencia ya est� en uso por otro usuario" });
            }
        }



        user.Nombre = model.Nombre;
        user.PrimerApellido = model.PrimerApellido;
        user.SegundoApellido = model.SegundoApellido;
        user.FechaNacimiento = model.FechaNacimiento;
        user.Nivel = model.Nivel;
        user.ClubVinculadoId = model.ClubVinculadoId;
        user.Licencia = model.Licencia;
        user.Direccion = model.Direccion;
        user.Pais = model.Pais;
        user.Region = model.Region;
        user.Ciudad = model.Ciudad;
        user.CodigoPostal = model.CodigoPostal;
        user.FotoPerfil = model.FotoPerfil;

        // Obtener las coordenadas actualizadas
        var coordenadas = await ObtenerCoordenadas(model.Direccion, model.Ciudad, model.Pais);
        user.Latitud = coordenadas.Latitud;
        user.Longitud = coordenadas.Longitud;

        // Roles:
        // - Si llegan Roles explícitos => sincronizar roles del usuario
        // - Si no llegan => mantener el comportamiento antiguo (solo Admin mediante EsAdmin)
        if (model.Roles != null && model.Roles.Count > 0)
        {
            var desiredRoles = model.Roles
                .Where(r => !string.IsNullOrWhiteSpace(r))
                .Select(r => r.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            if (model.EsAdmin && !desiredRoles.Any(r => r.Equals("Admin", StringComparison.OrdinalIgnoreCase)))
            {
                desiredRoles.Add("Admin");
            }

            // Crear roles que falten
            foreach (var roleName in desiredRoles)
            {
                if (!await _roleManager.RoleExistsAsync(roleName))
                {
                    await _roleManager.CreateAsync(new ApplicationRole { Name = roleName });
                }
            }

            var currentRoles = await _userManager.GetRolesAsync(user);

            var rolesToRemove = currentRoles.Where(cr => !desiredRoles.Contains(cr, StringComparer.OrdinalIgnoreCase)).ToList();
            var rolesToAdd = desiredRoles.Where(dr => !currentRoles.Contains(dr, StringComparer.OrdinalIgnoreCase)).ToList();

            foreach (var role in rolesToRemove)
            {
                await _userManager.RemoveFromRoleAsync(user, role);
            }
            foreach (var role in rolesToAdd)
            {
                await _userManager.AddToRoleAsync(user, role);
            }
        }
        else
        {
            // Comportamiento antiguo: solo Admin
            var esAdminActual = await _userManager.IsInRoleAsync(user, "Admin");
            if (model.EsAdmin && !esAdminActual)
            {
                await _userManager.AddToRoleAsync(user, "Admin");
            }
            else if (!model.EsAdmin && esAdminActual)
            {
                await _userManager.RemoveFromRoleAsync(user, "Admin");
            }
        }

        var result = await _userManager.UpdateAsync(user);
        if (result.Succeeded)
        {
            return Ok(new { message = "Usuario actualizado con �xito" });
        }

        return BadRequest(new { message = "Error al actualizar el usuario", errors = result.Errors });
    }

    [Authorize]
    [HttpPut("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel model)
    {
        if (model.UserId == null)
        {
            return BadRequest(new { message = "El ID de usuario es obligatorio" });
        }

        var user = await _userManager.FindByIdAsync(model.UserId.ToString());

        if (user == null)
        {
            return NotFound(new { message = "Usuario no encontrado" });
        }

        var result = await _userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);

        if (result.Succeeded)
        {
            return Ok(new { message = "Contrase�a actualizada con �xito" });
        }

        if (result.Errors.Any(e => e.Code == "PasswordMismatch"))
        {
            return BadRequest(new { message = "La contrase�a actual no es correcta" });
        }

        return BadRequest(new { message = "Error al cambiar la contrase�a", errors = result.Errors });
    }

    [Authorize]
    [HttpPut("upload-profile-picture/{userId}")]
    public async Task<IActionResult> UploadProfilePicture(string userId, IFormFile file)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return NotFound(new { message = "Usuario no encontrado" });
        }

        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "No se proporcion� ninguna imagen" });
        }

        // Cargar la imagen a Cloudinary
        var uploadParams = new ImageUploadParams()
        {
            File = new FileDescription(file.FileName, file.OpenReadStream())
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

        if (uploadResult.StatusCode == HttpStatusCode.OK)
        {
            // Obtener la URL p�blica de la imagen
            var imageUrl = uploadResult.SecureUrl.ToString();

            // Guardar la URL de la imagen en la base de datos
            user.FotoPerfil = imageUrl;

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return Ok(new { message = "Foto de perfil actualizada con �xito", imageUrl = imageUrl });
            }
        }

        return BadRequest(new { message = "Error al cargar la imagen", details = uploadResult.Error?.Message });
    }


    [Authorize]
    [HttpGet("profile-picture")]
    public async Task<IActionResult> GetProfilePicture()
    {
        var user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));

        if (user == null)
        {
            return NotFound(new { message = "Usuario no encontrado" });
        }

        // Verificar si el usuario tiene una URL v�lida de Cloudinary
        if (string.IsNullOrEmpty(user.FotoPerfil))
        {
            return NotFound(new { message = "No se ha establecido una foto de perfil" });
        }

        // Si la URL de la foto est� en Cloudinary, devolverla como una URL de redirecci�n
        return Redirect(user.FotoPerfil); // Redirige a la imagen en Cloudinary
    }

    private string GenerateJwtToken(Usuario user, IList<string> roles)
    {
        var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, user.UserName),
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email)
    };
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(12),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
