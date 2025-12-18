using System;
using AutoRef_API.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoRef_API.Migrations;

[DbContext(typeof(AppDataBase))]
[Migration("20251218211500_GestionClubesEquipos")]
public class GestionClubesEquipos : Migration
{
    private static void AddColumnIfMissing(MigrationBuilder migrationBuilder, string table, string column, string definitionSql)
    {
        // Compatible con versiones antiguas: no usa "IF NOT EXISTS" (no soportado en algunos MySQL).
        migrationBuilder.Sql($@"SET @__autoref_col_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = '{table}'
    AND COLUMN_NAME = '{column}'
);");

        migrationBuilder.Sql($@"SET @__autoref_sql := (
  SELECT IF(
    @__autoref_col_exists = 0,
    'ALTER TABLE `{table}` ADD COLUMN `{column}` {definitionSql}',
    'DO 0'
  )
);");

        migrationBuilder.Sql("PREPARE __autoref_stmt FROM @__autoref_sql;");
        migrationBuilder.Sql("EXECUTE __autoref_stmt;");
        migrationBuilder.Sql("DEALLOCATE PREPARE __autoref_stmt;");
    }

    private static void CreateIndexIfMissing(MigrationBuilder migrationBuilder, string table, string indexName, string columnsSql, bool unique)
    {
        migrationBuilder.Sql($@"SET @__autoref_idx_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = '{table}'
    AND INDEX_NAME = '{indexName}'
);");

        var create = unique
            ? $"CREATE UNIQUE INDEX `{indexName}` ON `{table}` ({columnsSql})"
            : $"CREATE INDEX `{indexName}` ON `{table}` ({columnsSql})";

        migrationBuilder.Sql($@"SET @__autoref_sql := (
  SELECT IF(
    @__autoref_idx_exists = 0,
    '{create}',
    'DO 0'
  )
);");

        migrationBuilder.Sql("PREPARE __autoref_stmt FROM @__autoref_sql;");
        migrationBuilder.Sql("EXECUTE __autoref_stmt;");
        migrationBuilder.Sql("DEALLOCATE PREPARE __autoref_stmt;");
    }

    private static void AddForeignKeyIfMissing(
        MigrationBuilder migrationBuilder,
        string table,
        string fkName,
        string column,
        string principalTable,
        string principalColumn,
        string onDeleteSql)
    {
        migrationBuilder.Sql($@"SET @__autoref_fk_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = '{table}'
    AND CONSTRAINT_NAME = '{fkName}'
    AND CONSTRAINT_TYPE = 'FOREIGN KEY'
);");

        var addFk = $"ALTER TABLE `{table}` ADD CONSTRAINT `{fkName}` FOREIGN KEY (`{column}`) REFERENCES `{principalTable}` (`{principalColumn}`) ON DELETE {onDeleteSql}";

        migrationBuilder.Sql($@"SET @__autoref_sql := (
  SELECT IF(
    @__autoref_fk_exists = 0,
    '{addFk}',
    'DO 0'
  )
);");

        migrationBuilder.Sql("PREPARE __autoref_stmt FROM @__autoref_sql;");
        migrationBuilder.Sql("EXECUTE __autoref_stmt;");
        migrationBuilder.Sql("DEALLOCATE PREPARE __autoref_stmt;");
    }

    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // Clubs: datos fiscales + responsables
        // NOTA: esta migración pudo quedar a medias en producción (falló creando un índice). Para permitir reintentos,
        // añadimos columnas de forma idempotente (check en information_schema).
        AddColumnIfMissing(migrationBuilder, "Clubs", "RazonSocial", "longtext CHARACTER SET utf8mb4 NULL");
        AddColumnIfMissing(migrationBuilder, "Clubs", "CIF", "varchar(255) CHARACTER SET utf8mb4 NULL");
        AddColumnIfMissing(migrationBuilder, "Clubs", "DireccionFiscal", "longtext CHARACTER SET utf8mb4 NULL");
        AddColumnIfMissing(migrationBuilder, "Clubs", "CodigoPostalFiscal", "longtext CHARACTER SET utf8mb4 NULL");
        AddColumnIfMissing(migrationBuilder, "Clubs", "ProvinciaFiscal", "longtext CHARACTER SET utf8mb4 NULL");
        AddColumnIfMissing(migrationBuilder, "Clubs", "CiudadFiscal", "longtext CHARACTER SET utf8mb4 NULL");
        AddColumnIfMissing(migrationBuilder, "Clubs", "EmailFacturacion", "varchar(255) CHARACTER SET utf8mb4 NULL");
        AddColumnIfMissing(migrationBuilder, "Clubs", "Telefono", "longtext CHARACTER SET utf8mb4 NULL");
        AddColumnIfMissing(migrationBuilder, "Clubs", "ResponsableNombre", "longtext CHARACTER SET utf8mb4 NULL");
        AddColumnIfMissing(migrationBuilder, "Clubs", "ResponsableEmail", "varchar(255) CHARACTER SET utf8mb4 NULL");
        AddColumnIfMissing(migrationBuilder, "Clubs", "ResponsableTelefono", "longtext CHARACTER SET utf8mb4 NULL");

        // Categorias: cupos
        AddColumnIfMissing(migrationBuilder, "Categorias", "MinJugadores", "int NULL");
        AddColumnIfMissing(migrationBuilder, "Categorias", "MaxJugadores", "int NULL");

        // Equipos: competición
        AddColumnIfMissing(migrationBuilder, "Equipos", "CompeticionId", "char(36) NULL COLLATE ascii_general_ci");

        // MySQL: el campo Nombre de Equipos debe ser VARCHAR para poder indexarlo (no TEXT/LONGTEXT).
        // MODIFY es idempotente si ya está en el tipo objetivo.
        migrationBuilder.Sql("ALTER TABLE `Equipos` MODIFY COLUMN `Nombre` varchar(255) CHARACTER SET utf8mb4 NOT NULL;");

        CreateIndexIfMissing(migrationBuilder, "Clubs", "IX_Clubs_FederacionId_CIF", "`FederacionId`, `CIF`", unique: true);

        CreateIndexIfMissing(migrationBuilder, "Equipos", "IX_Equipos_ClubId_CompeticionId_CategoriaId_Nombre", "`ClubId`, `CompeticionId`, `CategoriaId`, `Nombre`", unique: true);

        CreateIndexIfMissing(migrationBuilder, "Equipos", "IX_Equipos_CompeticionId", "`CompeticionId`", unique: false);

        AddForeignKeyIfMissing(
            migrationBuilder,
            table: "Equipos",
            fkName: "FK_Equipos_Competiciones_CompeticionId",
            column: "CompeticionId",
            principalTable: "Competiciones",
            principalColumn: "Id",
            onDeleteSql: "RESTRICT");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(
            name: "FK_Equipos_Competiciones_CompeticionId",
            table: "Equipos");

        migrationBuilder.DropIndex(
            name: "IX_Clubs_FederacionId_CIF",
            table: "Clubs");

        migrationBuilder.DropIndex(
            name: "IX_Equipos_ClubId_CompeticionId_CategoriaId_Nombre",
            table: "Equipos");

        migrationBuilder.DropIndex(
            name: "IX_Equipos_CompeticionId",
            table: "Equipos");

        migrationBuilder.AlterColumn<string>(
            name: "Nombre",
            table: "Equipos",
            type: "longtext",
            nullable: false,
            oldClrType: typeof(string),
            oldType: "varchar(255)")
            .Annotation("MySql:CharSet", "utf8mb4")
            .OldAnnotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.DropColumn(
            name: "RazonSocial",
            table: "Clubs");

        migrationBuilder.DropColumn(
            name: "CIF",
            table: "Clubs");

        migrationBuilder.DropColumn(
            name: "DireccionFiscal",
            table: "Clubs");

        migrationBuilder.DropColumn(
            name: "CodigoPostalFiscal",
            table: "Clubs");

        migrationBuilder.DropColumn(
            name: "ProvinciaFiscal",
            table: "Clubs");

        migrationBuilder.DropColumn(
            name: "CiudadFiscal",
            table: "Clubs");

        migrationBuilder.DropColumn(
            name: "EmailFacturacion",
            table: "Clubs");

        migrationBuilder.DropColumn(
            name: "Telefono",
            table: "Clubs");

        migrationBuilder.DropColumn(
            name: "ResponsableNombre",
            table: "Clubs");

        migrationBuilder.DropColumn(
            name: "ResponsableEmail",
            table: "Clubs");

        migrationBuilder.DropColumn(
            name: "ResponsableTelefono",
            table: "Clubs");

        migrationBuilder.DropColumn(
            name: "MinJugadores",
            table: "Categorias");

        migrationBuilder.DropColumn(
            name: "MaxJugadores",
            table: "Categorias");

        migrationBuilder.DropColumn(
            name: "CompeticionId",
            table: "Equipos");
    }
}


