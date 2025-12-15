public class RegisterModel
{
    public string? Username { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
    public string? Nombre { get; set; }
    public string? PrimerApellido { get; set; }
    public string? SegundoApellido { get; set; }
    public DateTime FechaNacimiento { get; set; }
    public string? Nivel { get; set; }
    public Guid? ClubVinculadoId { get; set; }
    public int Licencia { get; set; }
    public string? Direccion { get; set; }
    public string? Pais { get; set; }
    public string? Region { get; set; }
    public string? Ciudad { get; set; }
    public string? CodigoPostal { get; set; }
    public bool EsAdmin { get; set; } 
}

public class UpdateModel
{
    public Guid? Id { get; set; }
    public string? Username { get; set; }
    public string? Email { get; set; }
    public string? Nombre { get; set; }
    public string? PrimerApellido { get; set; }
    public string? SegundoApellido { get; set; }
    public DateTime FechaNacimiento { get; set; }
    public string? Nivel { get; set; }
    public Guid? ClubVinculadoId { get; set; }

    public string? ClubVinculado { get; set; }   
    public int Licencia { get; set; }
    public string? Direccion { get; set; }
    public string? Pais { get; set; }
    public string? Region { get; set; }
    public string? Ciudad { get; set; }
    public string? CodigoPostal { get; set; }

    public required List<string> Roles { get; set; }

    public double Latitud { get; set; }
    public double Longitud { get; set; }
    public string? FotoPerfil { get; set; }
    public bool EsAdmin { get; set; } 
}

public class ChangePasswordModel
{
    public string? OldPassword { get; set; }
    public string? NewPassword { get; set; }

    public Guid? UserId { get; set;}
}


public class LoginModel
{

    public string? Email { get; set; }
    public string? Password { get; set; }
}

public class RoleModel
{
    public string? RoleName { get; set; }
}

public class AssignRoleModel
{
    public string? Username { get; set; }
    public string? RoleName { get; set; }
}
