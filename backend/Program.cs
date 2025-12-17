using AutoRef_API.Database;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using CloudinaryDotNet;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configuración desde variables de entorno
var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY") ?? builder.Configuration["Jwt:Key"];
var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? builder.Configuration["Jwt:Issuer"] ?? "AutoRefAPI";
var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? builder.Configuration["Jwt:Audience"] ?? "AutoRefClient";

// Construir connection string desde variables de entorno si existen (MySQL)
var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");
if (string.IsNullOrEmpty(connectionString))
{
    var dbHost = Environment.GetEnvironmentVariable("DB_HOST") ?? "centerbeam.proxy.rlwy.net";
    var dbPort = Environment.GetEnvironmentVariable("DB_PORT") ?? "44269";
    var dbName = Environment.GetEnvironmentVariable("DB_NAME") ?? "railway";
    var dbUser = Environment.GetEnvironmentVariable("DB_USER") ?? "root";
    var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD") ?? "";
    
    connectionString = $"Server={dbHost};Port={dbPort};Database={dbName};User={dbUser};Password={dbPassword};";
}

builder.Services.AddControllers();

// Configurar Cloudinary desde variables de entorno
var cloudinaryAccount = new Account(
    Environment.GetEnvironmentVariable("CLOUDINARY_CLOUD_NAME") ?? builder.Configuration["CloudinarySettings:CloudName"],
    Environment.GetEnvironmentVariable("CLOUDINARY_API_KEY") ?? builder.Configuration["CloudinarySettings:ApiKey"],
    Environment.GetEnvironmentVariable("CLOUDINARY_API_SECRET") ?? builder.Configuration["CloudinarySettings:ApiSecret"]
);

var cloudinary = new Cloudinary(cloudinaryAccount);
builder.Services.AddSingleton(cloudinary);

// Configura la conexión a la base de datos (MySQL)
var serverVersion = new MySqlServerVersion(new Version(8, 0, 21));
builder.Services.AddDbContext<AppDataBase>(options =>
    options.UseMySql(connectionString, serverVersion));

// Agregar el servicio de Identity
builder.Services.AddIdentity<Usuario, ApplicationRole>()
    .AddEntityFrameworkStores<AppDataBase>()
    .AddDefaultTokenProviders();


builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey ?? throw new InvalidOperationException("JWT Key is not configured"))
        )
    };
});
// Configura Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "API",
        Description = "Descripción de tu API"
    });
});
// Configurar CORS dinámicamente
var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "http://localhost:3000";
var allowedOrigins = new List<string> 
{ 
    frontendUrl,
    "http://localhost:3000",
    "http://localhost:3001",
    "https://localhost:3000",
    "https://localhost:3001"
};

// Agregar origen adicional si existe
var additionalOrigin = Environment.GetEnvironmentVariable("ADDITIONAL_CORS_ORIGIN");
if (!string.IsNullOrEmpty(additionalOrigin))
{
    allowedOrigins.Add(additionalOrigin);
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.SetIsOriginAllowed(origin =>
        {
            // Permitir todos los localhost en desarrollo
            if (origin != null && (origin.StartsWith("http://localhost") || origin.StartsWith("https://localhost")))
                return true;
            // Permitir orígenes configurados
            return allowedOrigins.Contains(origin);
        })
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// Habilita Swagger
app.UseSwagger();

// Habilita la interfaz de usuario de Swagger
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1");
    c.RoutePrefix = string.Empty; 
});

app.UseRouting();

app.UseCors("AllowFrontend");

app.UseAuthentication();  // Añadir autenticación
app.UseAuthorization();   // Añadir autorización

app.MapControllers();

// Configuración de Identity y la base de datos
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var userManager = services.GetRequiredService<UserManager<Usuario>>();
        var roleManager = services.GetRequiredService<RoleManager<ApplicationRole>>();

    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error al inicializar datos: {ex.Message}");
    }
}

var port = Environment.GetEnvironmentVariable("PORT") ?? "10000";
app.Urls.Add($"http://0.0.0.0:{port}");

app.Run();