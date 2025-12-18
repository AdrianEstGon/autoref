using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace AutoRef_API.Database;

// Permite a EF Core crear el DbContext en diseño (migraciones) sin depender del host/DI (Cloudinary, etc.)
public class AppDataBaseFactory : IDesignTimeDbContextFactory<AppDataBase>
{
    public AppDataBase CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");
        if (string.IsNullOrEmpty(connectionString))
        {
            var dbHost = Environment.GetEnvironmentVariable("DB_HOST") ?? "localhost";
            var dbPort = Environment.GetEnvironmentVariable("DB_PORT") ?? "3306";
            var dbName = Environment.GetEnvironmentVariable("DB_NAME") ?? "railway";
            var dbUser = Environment.GetEnvironmentVariable("DB_USER") ?? "root";
            var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD") ?? "";

            connectionString = $"Server={dbHost};Port={dbPort};Database={dbName};User={dbUser};Password={dbPassword};";
        }

        var optionsBuilder = new DbContextOptionsBuilder<AppDataBase>();
        var serverVersion = new MySqlServerVersion(new Version(8, 0, 21));
        optionsBuilder.UseMySql(connectionString, serverVersion);

        return new AppDataBase(optionsBuilder.Options);
    }
}


