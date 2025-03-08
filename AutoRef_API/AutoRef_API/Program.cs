using AutoRef_API.Database;

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configura la conexi�n a la base de datos
builder.Services.AddDbContext<AppDataBase>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Agregar el servicio de Identity
builder.Services.AddIdentity<Usuario, ApplicationRole>()
    .AddEntityFrameworkStores<AppDataBase>()
    .AddDefaultTokenProviders();

// Configura Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "API",
        Description = "Descripci�n de tu API"
    });
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});
var app = builder.Build();
app.UseCors("AllowFrontend");
// Configure the HTTP request pipeline.
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
    c.RoutePrefix = string.Empty; // Para que Swagger UI est� en la ra�z
});

app.UseRouting();

app.UseAuthentication();  // A�adir autenticaci�n
app.UseAuthorization();   // A�adir autorizaci�n

app.MapControllers();

// Configuraci�n de Identity y la base de datos
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var userManager = services.GetRequiredService<UserManager<Usuario>>();
        var roleManager = services.GetRequiredService<RoleManager<ApplicationRole>>();

        // Llamar al m�todo para inicializar roles y admin
        await DbInitializer.SeedRolesAndAdmin(userManager, roleManager);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error al inicializar datos: {ex.Message}");
    }
}

app.Run();
