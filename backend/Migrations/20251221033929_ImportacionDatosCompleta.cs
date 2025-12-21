using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoRef_API.Migrations
{
    /// <inheritdoc />
    public partial class ImportacionDatosCompleta : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Personas_Documento",
                table: "Personas");

            migrationBuilder.DropIndex(
                name: "IX_LicenciasPersonas_PersonaId_TemporadaId_ModalidadId",
                table: "LicenciasPersonas");

            migrationBuilder.DropIndex(
                name: "IX_Equipos_ClubId",
                table: "Equipos");

            migrationBuilder.AddColumn<string>(
                name: "Bic",
                table: "Usuarios",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Iban",
                table: "Usuarios",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "TitularCuenta",
                table: "Usuarios",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<double>(
                name: "Longitud",
                table: "Polideportivos",
                type: "double",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "double");

            migrationBuilder.AlterColumn<double>(
                name: "Latitud",
                table: "Polideportivos",
                type: "double",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "double");

            migrationBuilder.AddColumn<string>(
                name: "ClubesIds",
                table: "Polideportivos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Direccion",
                table: "Polideportivos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaCreacion",
                table: "Polideportivos",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaDestruccion",
                table: "Polideportivos",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "ImportId",
                table: "Polideportivos",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Poblacion",
                table: "Polideportivos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Servicios",
                table: "Polideportivos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Zona",
                table: "Polideportivos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<DateTime>(
                name: "FechaNacimiento",
                table: "Personas",
                type: "datetime(6)",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)");

            migrationBuilder.AlterColumn<string>(
                name: "Documento",
                table: "Personas",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "AppUserId",
                table: "Personas",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<bool>(
                name: "CertificadoAusenciaDelitos",
                table: "Personas",
                type: "tinyint(1)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Comentarios",
                table: "Personas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Disponibilidad",
                table: "Personas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaCreacion",
                table: "Personas",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaDestruccion",
                table: "Personas",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "ImportId",
                table: "Personas",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Lat",
                table: "Personas",
                type: "double",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Lng",
                table: "Personas",
                type: "double",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Nacionalidad",
                table: "Personas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "NivelArbitro",
                table: "Personas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "NivelEntrenador",
                table: "Personas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "NumeroCuenta",
                table: "Personas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "NumeroLicenciaAntiguo",
                table: "Personas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<long>(
                name: "OldId",
                table: "Personas",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Poblacion",
                table: "Personas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Sexo",
                table: "Personas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "TipoDocumento",
                table: "Personas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Vacaciones",
                table: "Personas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ZonaArbitraje",
                table: "Personas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<TimeSpan>(
                name: "Hora",
                table: "Partidos",
                type: "time(6)",
                nullable: true,
                oldClrType: typeof(TimeSpan),
                oldType: "time(6)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "Fecha",
                table: "Partidos",
                type: "datetime(6)",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)");

            migrationBuilder.AddColumn<string>(
                name: "CachedSummary",
                table: "Partidos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Clubes",
                table: "Partidos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Comentarios",
                table: "Partidos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "CompetitionGroupId",
                table: "Partidos",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<bool>(
                name: "ConfirmadaDesignacion",
                table: "Partidos",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ConfirmedRefereeIds",
                table: "Partidos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ConvocatoriaLocalPeople",
                table: "Partidos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ConvocatoriaLocalPlayers",
                table: "Partidos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ConvocatoriaVisitantePeople",
                table: "Partidos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ConvocatoriaVisitantePlayers",
                table: "Partidos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "DatosArbitraje",
                table: "Partidos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Deporte",
                table: "Partidos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<bool>(
                name: "DesignacionArbitralCompleta",
                table: "Partidos",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "EdicionId",
                table: "Partidos",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<string>(
                name: "Equipos",
                table: "Partidos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Estadisticas",
                table: "Partidos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "EstadoArbitraje",
                table: "Partidos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "EstadoHorario",
                table: "Partidos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "FaseEdicionId",
                table: "Partidos",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaCreacion",
                table: "Partidos",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaDestruccion",
                table: "Partidos",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaEstimada",
                table: "Partidos",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaJornada",
                table: "Partidos",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FotoActa",
                table: "Partidos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "FranjaHoraria",
                table: "Partidos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "GrupoEdicionId",
                table: "Partidos",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<long>(
                name: "ImportId",
                table: "Partidos",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NombreCategoria",
                table: "Partidos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "NombreCategoriaPlaya",
                table: "Partidos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "NombreEnCalendario",
                table: "Partidos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "NombreGenero",
                table: "Partidos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "NombreGrupo",
                table: "Partidos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "NombreLocal",
                table: "Partidos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "NombrePabellon",
                table: "Partidos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "NombreVisitante",
                table: "Partidos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "NumEquiposEnGrupo",
                table: "Partidos",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NumeroPista",
                table: "Partidos",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Ref",
                table: "Partidos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "RefPartidoCalendario",
                table: "Partidos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ReglasJuego",
                table: "Partidos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Resultado",
                table: "Partidos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "TemporadaId",
                table: "Partidos",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<Guid>(
                name: "TorneoId",
                table: "Partidos",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<string>(
                name: "Zona",
                table: "Partidos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<Guid>(
                name: "ModalidadId",
                table: "LicenciasPersonas",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci",
                oldClrType: typeof(Guid),
                oldType: "char(36)")
                .OldAnnotation("Relational:Collation", "ascii_general_ci");

            migrationBuilder.AlterColumn<DateTime>(
                name: "FechaAlta",
                table: "LicenciasPersonas",
                type: "datetime(6)",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)");

            migrationBuilder.AddColumn<string>(
                name: "CategoriaArbitro",
                table: "LicenciasPersonas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "CategoriaEntrenador",
                table: "LicenciasPersonas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "ClubId",
                table: "LicenciasPersonas",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<string>(
                name: "CodigoPostal",
                table: "LicenciasPersonas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Direccion",
                table: "LicenciasPersonas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "EquiposIds",
                table: "LicenciasPersonas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "FacturaId",
                table: "LicenciasPersonas",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaCreacion",
                table: "LicenciasPersonas",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaDestruccion",
                table: "LicenciasPersonas",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaFin",
                table: "LicenciasPersonas",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaMutua",
                table: "LicenciasPersonas",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Genero",
                table: "LicenciasPersonas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<bool>(
                name: "HabilitadoCategoriaSuperior",
                table: "LicenciasPersonas",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HabilitadoNacional",
                table: "LicenciasPersonas",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<long>(
                name: "ImportId",
                table: "LicenciasPersonas",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Importe",
                table: "LicenciasPersonas",
                type: "decimal(65,30)",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Lat",
                table: "LicenciasPersonas",
                type: "double",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Lng",
                table: "LicenciasPersonas",
                type: "double",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Nombre",
                table: "LicenciasPersonas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Poblacion",
                table: "LicenciasPersonas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Provincia",
                table: "LicenciasPersonas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Tipo",
                table: "LicenciasPersonas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Equipos",
                type: "varchar(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "CampoJuegoId",
                table: "Equipos",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<string>(
                name: "Comentarios",
                table: "Equipos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "CompeticionId",
                table: "Equipos",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<Guid>(
                name: "EdicionId",
                table: "Equipos",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<string>(
                name: "Estado",
                table: "Equipos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaCreacion",
                table: "Equipos",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaDestruccion",
                table: "Equipos",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "ImportId",
                table: "Equipos",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IndiceCategoría",
                table: "Equipos",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "InscripcionCircuitoCompleto",
                table: "Equipos",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "InscritoPorId",
                table: "Equipos",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<string>(
                name: "PlayerData",
                table: "Equipos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "PosicionRanking",
                table: "Equipos",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PuntosRanking",
                table: "Equipos",
                type: "decimal(65,30)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Sexo",
                table: "Equipos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "TorneoId",
                table: "Equipos",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<decimal>(
                name: "ValorAleatorioEmpates",
                table: "Equipos",
                type: "decimal(65,30)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CategoriaId",
                table: "Competiciones",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<int>(
                name: "ChangePoints",
                table: "Competiciones",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CompetitionGroupId",
                table: "Competiciones",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<string>(
                name: "ConfiguracionSets",
                table: "Competiciones",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<bool>(
                name: "ControlJugadores",
                table: "Competiciones",
                type: "tinyint(1)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CriteriosClasificacion",
                table: "Competiciones",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<bool>(
                name: "EsMixto",
                table: "Competiciones",
                type: "tinyint(1)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaCreacion",
                table: "Competiciones",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaDestruccion",
                table: "Competiciones",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HayLibero",
                table: "Competiciones",
                type: "tinyint(1)",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "ImportId",
                table: "Competiciones",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaxJugadoresPorEquipo",
                table: "Competiciones",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaxStaffPorEquipo",
                table: "Competiciones",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MinJugadoresPorEquipo",
                table: "Competiciones",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MinStaffPorEquipo",
                table: "Competiciones",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ModalidadId",
                table: "Competiciones",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<int>(
                name: "NumeroJugadoresEnPista",
                table: "Competiciones",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Posicion",
                table: "Competiciones",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Precios",
                table: "Competiciones",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "PuntuacionClasificacion",
                table: "Competiciones",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "PuntuacionPlaya",
                table: "Competiciones",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ResolucionEmpate",
                table: "Competiciones",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "SetPoints",
                table: "Competiciones",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Sets",
                table: "Competiciones",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Sexo",
                table: "Competiciones",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "TemporadaId",
                table: "Competiciones",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<string>(
                name: "TipoCompeticion",
                table: "Competiciones",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<bool>(
                name: "VisibleClub",
                table: "Competiciones",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "VisibleWeb",
                table: "Competiciones",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "AdministracionAsociadaId",
                table: "Clubs",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<long>(
                name: "AppUserId",
                table: "Clubs",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CIF",
                table: "Clubs",
                type: "varchar(255)",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "CiudadFiscal",
                table: "Clubs",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<long>(
                name: "ClientId",
                table: "Clubs",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CodigoPostalFiscal",
                table: "Clubs",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "DireccionFiscal",
                table: "Clubs",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Clubs",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "EmailFacturacion",
                table: "Clubs",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Escudo",
                table: "Clubs",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaCreacion",
                table: "Clubs",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaDestruccion",
                table: "Clubs",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "ImportId",
                table: "Clubs",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProvinciaFiscal",
                table: "Clubs",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "RazonSocial",
                table: "Clubs",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ResponsableEmail",
                table: "Clubs",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ResponsableNombre",
                table: "Clubs",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ResponsableTelefono",
                table: "Clubs",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Telefono",
                table: "Clubs",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Categorias",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldMaxLength: 255)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "BornFrom",
                table: "Categorias",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "BornTo",
                table: "Categorias",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CategoriasPermitidas",
                table: "Categorias",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Color",
                table: "Categorias",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Descripcion",
                table: "Categorias",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "DimensionesPistaFemenino",
                table: "Categorias",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "DimensionesPistaMasculino",
                table: "Categorias",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "DimensionesPlayaFemenino",
                table: "Categorias",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "DimensionesPlayaMasculino",
                table: "Categorias",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "EdadInicio",
                table: "Categorias",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaCreacion",
                table: "Categorias",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaDestruccion",
                table: "Categorias",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Federado",
                table: "Categorias",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<long>(
                name: "ImportId",
                table: "Categorias",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaxJugadores",
                table: "Categorias",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MinJugadores",
                table: "Categorias",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NombrePlaya",
                table: "Categorias",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "NumeroAnios",
                table: "Categorias",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Posicion",
                table: "Categorias",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Token",
                table: "Categorias",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "CompeticionesCategorias",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    CompeticionId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    CategoriaId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    InscripcionDesde = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    InscripcionHasta = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Cuota = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
                    HorarioLocalDesde = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    HorarioLocalHasta = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Activa = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompeticionesCategorias", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CompeticionesCategorias_Categorias_CategoriaId",
                        column: x => x.CategoriaId,
                        principalTable: "Categorias",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CompeticionesCategorias_Competiciones_CompeticionId",
                        column: x => x.CompeticionId,
                        principalTable: "Competiciones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "CompeticionesReglas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    CompeticionId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    PuntosVictoria = table.Column<int>(type: "int", nullable: false),
                    PuntosEmpate = table.Column<int>(type: "int", nullable: false),
                    PuntosDerrota = table.Column<int>(type: "int", nullable: false),
                    OrdenDesempateJson = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompeticionesReglas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CompeticionesReglas_Competiciones_CompeticionId",
                        column: x => x.CompeticionId,
                        principalTable: "Competiciones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Cursos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Nombre = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Permalink = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    InicioInscripcion = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    FinInscripcion = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Requisitos = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Formato = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Precio = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
                    InformacionAdicional = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ImagenCabecera = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Entidad = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FederacionId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    ImportId = table.Column<long>(type: "bigint", nullable: true),
                    FechaCreacion = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    FechaDestruccion = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cursos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Cursos_Federaciones_FederacionId",
                        column: x => x.FederacionId,
                        principalTable: "Federaciones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Designaciones",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ArbitroId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    ArbitroNumero = table.Column<int>(type: "int", nullable: true),
                    PartidoId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    PistaId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    Desde = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Hasta = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Dia = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Estado = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MotivoRechazo = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FechaDesignacion = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    FechaRespuesta = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    FechaCancelacion = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    CourtLat = table.Column<double>(type: "double", nullable: true),
                    CourtLng = table.Column<double>(type: "double", nullable: true),
                    RefereeLat = table.Column<double>(type: "double", nullable: true),
                    RefereeLng = table.Column<double>(type: "double", nullable: true),
                    Partidos = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Equipos = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Clubes = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ImportId = table.Column<long>(type: "bigint", nullable: true),
                    FechaCreacion = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    FechaDestruccion = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Designaciones", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Designaciones_Partidos_PartidoId",
                        column: x => x.PartidoId,
                        principalTable: "Partidos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Designaciones_Polideportivos_PistaId",
                        column: x => x.PistaId,
                        principalTable: "Polideportivos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Designaciones_Usuarios_ArbitroId",
                        column: x => x.ArbitroId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Facturas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ClubId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Numero = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FechaEmision = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    FechaVencimiento = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Estado = table.Column<int>(type: "int", nullable: false),
                    BaseImponible = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    Iva = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    Total = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    Observaciones = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FechaCreacionUtc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    FechaPagoUtc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ReferenciaPago = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Facturas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Facturas_Clubs_ClubId",
                        column: x => x.ClubId,
                        principalTable: "Clubs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "FasesTorneo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Nombre = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EdicionId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    TorneoId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    NumeroFase = table.Column<int>(type: "int", nullable: false),
                    TipoFase = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Dia = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    HoraInicio = table.Column<TimeSpan>(type: "time(6)", nullable: true),
                    HoraObjetivoFin = table.Column<TimeSpan>(type: "time(6)", nullable: true),
                    TamanoPista = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EspecificarNumPista = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    ImportId = table.Column<long>(type: "bigint", nullable: true),
                    FechaCreacion = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    FechaDestruccion = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FasesTorneo", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "FechasEntrenamiento",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    TrainingId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    Dia = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Horario = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ImportId = table.Column<long>(type: "bigint", nullable: true),
                    FechaCreacion = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    FechaDestruccion = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FechasEntrenamiento", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "GruposEdicion",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Nombre = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FaseEdicionId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    EdicionId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    CampoJuegoId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    TipoCompeticion = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AsignacionEquipos = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Estado = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FechasJuego = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CriteriosClasificacion = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    NumeroPista = table.Column<int>(type: "int", nullable: true),
                    PagoArbitraje = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PagadorFijoId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    CacheClasificacion = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CacheHtmlClasificacion = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ImportId = table.Column<long>(type: "bigint", nullable: true),
                    FechaCreacion = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    FechaDestruccion = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GruposEdicion", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GruposEdicion_Polideportivos_CampoJuegoId",
                        column: x => x.CampoJuegoId,
                        principalTable: "Polideportivos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Jugadores",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    PersonaId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    EquipoId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    EdicionId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    Rol = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Numero = table.Column<int>(type: "int", nullable: true),
                    TieneLicencia = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Nacionalidad = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    HabilitadoCategoriaSuperior = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    HabilitadoCategoriaNacional = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CategoriaEntrenador = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreadoPorArbitro = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    TieneSeguroMedico = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    PermitidoMayor = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    ImportId = table.Column<long>(type: "bigint", nullable: true),
                    FechaCreacion = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    FechaDestruccion = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Jugadores", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Jugadores_Equipos_EquipoId",
                        column: x => x.EquipoId,
                        principalTable: "Equipos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Jugadores_Personas_PersonaId",
                        column: x => x.PersonaId,
                        principalTable: "Personas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Liquidaciones",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    UsuarioId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Tipo = table.Column<int>(type: "int", nullable: false),
                    PartidoId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    Fecha = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Estado = table.Column<int>(type: "int", nullable: false),
                    Observaciones = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Total = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    FechaCreacionUtc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    FechaEnvioUtc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    FechaResolucionUtc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ResueltaPorUsuarioId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    MotivoRechazo = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Liquidaciones", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Liquidaciones_Partidos_PartidoId",
                        column: x => x.PartidoId,
                        principalTable: "Partidos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Liquidaciones_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "OrdenesPago",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Estado = table.Column<int>(type: "int", nullable: false),
                    FechaCreacionUtc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ExportadaUtc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    EjecutadaUtc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    PeriodoDesde = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    PeriodoHasta = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    GeneradaPorUsuarioId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    Referencia = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Total = table.Column<decimal>(type: "decimal(65,30)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrdenesPago", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "PartidosCambiosSolicitudes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    PartidoId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ClubSolicitanteId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ClubReceptorId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    FechaOriginal = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    HoraOriginal = table.Column<TimeSpan>(type: "time(6)", nullable: false),
                    LugarOriginalId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    FechaPropuesta = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    HoraPropuesta = table.Column<TimeSpan>(type: "time(6)", nullable: false),
                    LugarPropuestoId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    Motivo = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Estado = table.Column<int>(type: "int", nullable: false),
                    FechaSolicitudUtc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    FechaRespuestaClubUtc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    AceptadoPorClub = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    FechaValidacionFederacionUtc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    AprobadoPorFederacion = table.Column<bool>(type: "tinyint(1)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PartidosCambiosSolicitudes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PartidosCambiosSolicitudes_Partidos_PartidoId",
                        column: x => x.PartidoId,
                        principalTable: "Partidos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PartidosCambiosSolicitudes_Polideportivos_LugarOriginalId",
                        column: x => x.LugarOriginalId,
                        principalTable: "Polideportivos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_PartidosCambiosSolicitudes_Polideportivos_LugarPropuestoId",
                        column: x => x.LugarPropuestoId,
                        principalTable: "Polideportivos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "FacturaLineas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    FacturaId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Concepto = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Cantidad = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    PrecioUnitario = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    Importe = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    IvaPorcentaje = table.Column<decimal>(type: "decimal(65,30)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FacturaLineas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FacturaLineas_Facturas_FacturaId",
                        column: x => x.FacturaId,
                        principalTable: "Facturas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Pagos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Ref = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Fecha = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Tipo = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Importe = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    Descripcion = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ClubId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    PersonaId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    EquipoId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    JugadorId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    PartidoId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    FacturaId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    LicenciaId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    Cliente = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Token = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ImportId = table.Column<long>(type: "bigint", nullable: true),
                    FechaDestruccion = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pagos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Pagos_Clubs_ClubId",
                        column: x => x.ClubId,
                        principalTable: "Clubs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Pagos_Equipos_EquipoId",
                        column: x => x.EquipoId,
                        principalTable: "Equipos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Pagos_Facturas_FacturaId",
                        column: x => x.FacturaId,
                        principalTable: "Facturas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Pagos_Jugadores_JugadorId",
                        column: x => x.JugadorId,
                        principalTable: "Jugadores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Pagos_LicenciasPersonas_LicenciaId",
                        column: x => x.LicenciaId,
                        principalTable: "LicenciasPersonas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Pagos_Partidos_PartidoId",
                        column: x => x.PartidoId,
                        principalTable: "Partidos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Pagos_Personas_PersonaId",
                        column: x => x.PersonaId,
                        principalTable: "Personas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "LiquidacionItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    LiquidacionId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Tipo = table.Column<int>(type: "int", nullable: false),
                    Descripcion = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Cantidad = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    PrecioUnitario = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    Km = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
                    Importe = table.Column<decimal>(type: "decimal(65,30)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LiquidacionItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LiquidacionItems_Liquidaciones_LiquidacionId",
                        column: x => x.LiquidacionId,
                        principalTable: "Liquidaciones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "OrdenesPagoItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    OrdenPagoId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    LiquidacionId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    UsuarioId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Importe = table.Column<decimal>(type: "decimal(65,30)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrdenesPagoItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrdenesPagoItems_Liquidaciones_LiquidacionId",
                        column: x => x.LiquidacionId,
                        principalTable: "Liquidaciones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OrdenesPagoItems_OrdenesPago_OrdenPagoId",
                        column: x => x.OrdenPagoId,
                        principalTable: "OrdenesPago",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrdenesPagoItems_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("012f80f7-3b7d-4df2-8a07-35e80c0ba0b0"),
                columns: new[] { "CategoriaId", "ChangePoints", "CompetitionGroupId", "ConfiguracionSets", "ControlJugadores", "CriteriosClasificacion", "EsMixto", "FechaCreacion", "FechaDestruccion", "HayLibero", "ImportId", "MaxJugadoresPorEquipo", "MaxStaffPorEquipo", "MinJugadoresPorEquipo", "MinStaffPorEquipo", "ModalidadId", "NumeroJugadoresEnPista", "Posicion", "Precios", "PuntuacionClasificacion", "PuntuacionPlaya", "ResolucionEmpate", "SetPoints", "Sets", "Sexo", "TemporadaId", "TipoCompeticion", "VisibleClub", "VisibleWeb" },
                values: new object[] { null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, null, null, null, null, null, null, null, null, null, false, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("1d0c0e1d-4e64-44f5-9f08-3fe6a6f4e0d9"),
                columns: new[] { "CategoriaId", "ChangePoints", "CompetitionGroupId", "ConfiguracionSets", "ControlJugadores", "CriteriosClasificacion", "EsMixto", "FechaCreacion", "FechaDestruccion", "HayLibero", "ImportId", "MaxJugadoresPorEquipo", "MaxStaffPorEquipo", "MinJugadoresPorEquipo", "MinStaffPorEquipo", "ModalidadId", "NumeroJugadoresEnPista", "Posicion", "Precios", "PuntuacionClasificacion", "PuntuacionPlaya", "ResolucionEmpate", "SetPoints", "Sets", "Sexo", "TemporadaId", "TipoCompeticion", "VisibleClub", "VisibleWeb" },
                values: new object[] { null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, null, null, null, null, null, null, null, null, null, false, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("2a2602f8-5f1a-4e02-8ef6-4a1ce41c4b4f"),
                columns: new[] { "CategoriaId", "ChangePoints", "CompetitionGroupId", "ConfiguracionSets", "ControlJugadores", "CriteriosClasificacion", "EsMixto", "FechaCreacion", "FechaDestruccion", "HayLibero", "ImportId", "MaxJugadoresPorEquipo", "MaxStaffPorEquipo", "MinJugadoresPorEquipo", "MinStaffPorEquipo", "ModalidadId", "NumeroJugadoresEnPista", "Posicion", "Precios", "PuntuacionClasificacion", "PuntuacionPlaya", "ResolucionEmpate", "SetPoints", "Sets", "Sexo", "TemporadaId", "TipoCompeticion", "VisibleClub", "VisibleWeb" },
                values: new object[] { null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, null, null, null, null, null, null, null, null, null, false, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("376842d8-2f21-4f79-a0e2-e4b809c8a02a"),
                columns: new[] { "CategoriaId", "ChangePoints", "CompetitionGroupId", "ConfiguracionSets", "ControlJugadores", "CriteriosClasificacion", "EsMixto", "FechaCreacion", "FechaDestruccion", "HayLibero", "ImportId", "MaxJugadoresPorEquipo", "MaxStaffPorEquipo", "MinJugadoresPorEquipo", "MinStaffPorEquipo", "ModalidadId", "NumeroJugadoresEnPista", "Posicion", "Precios", "PuntuacionClasificacion", "PuntuacionPlaya", "ResolucionEmpate", "SetPoints", "Sets", "Sexo", "TemporadaId", "TipoCompeticion", "VisibleClub", "VisibleWeb" },
                values: new object[] { null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, null, null, null, null, null, null, null, null, null, false, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("4ce48b7a-7c1a-4a84-8b30-e150d37ca006"),
                columns: new[] { "CategoriaId", "ChangePoints", "CompetitionGroupId", "ConfiguracionSets", "ControlJugadores", "CriteriosClasificacion", "EsMixto", "FechaCreacion", "FechaDestruccion", "HayLibero", "ImportId", "MaxJugadoresPorEquipo", "MaxStaffPorEquipo", "MinJugadoresPorEquipo", "MinStaffPorEquipo", "ModalidadId", "NumeroJugadoresEnPista", "Posicion", "Precios", "PuntuacionClasificacion", "PuntuacionPlaya", "ResolucionEmpate", "SetPoints", "Sets", "Sexo", "TemporadaId", "TipoCompeticion", "VisibleClub", "VisibleWeb" },
                values: new object[] { null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, null, null, null, null, null, null, null, null, null, false, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("5c6e5ea5-7af8-437f-a9f2-1f6b16c08a2c"),
                columns: new[] { "CategoriaId", "ChangePoints", "CompetitionGroupId", "ConfiguracionSets", "ControlJugadores", "CriteriosClasificacion", "EsMixto", "FechaCreacion", "FechaDestruccion", "HayLibero", "ImportId", "MaxJugadoresPorEquipo", "MaxStaffPorEquipo", "MinJugadoresPorEquipo", "MinStaffPorEquipo", "ModalidadId", "NumeroJugadoresEnPista", "Posicion", "Precios", "PuntuacionClasificacion", "PuntuacionPlaya", "ResolucionEmpate", "SetPoints", "Sets", "Sexo", "TemporadaId", "TipoCompeticion", "VisibleClub", "VisibleWeb" },
                values: new object[] { null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, null, null, null, null, null, null, null, null, null, false, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("624f3f92-cf13-4fa7-bc4b-53c9fd2e6b6b"),
                columns: new[] { "CategoriaId", "ChangePoints", "CompetitionGroupId", "ConfiguracionSets", "ControlJugadores", "CriteriosClasificacion", "EsMixto", "FechaCreacion", "FechaDestruccion", "HayLibero", "ImportId", "MaxJugadoresPorEquipo", "MaxStaffPorEquipo", "MinJugadoresPorEquipo", "MinStaffPorEquipo", "ModalidadId", "NumeroJugadoresEnPista", "Posicion", "Precios", "PuntuacionClasificacion", "PuntuacionPlaya", "ResolucionEmpate", "SetPoints", "Sets", "Sexo", "TemporadaId", "TipoCompeticion", "VisibleClub", "VisibleWeb" },
                values: new object[] { null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, null, null, null, null, null, null, null, null, null, false, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("6b47f3a0-0c87-4cf2-8b4e-90c2a0a4db8d"),
                columns: new[] { "CategoriaId", "ChangePoints", "CompetitionGroupId", "ConfiguracionSets", "ControlJugadores", "CriteriosClasificacion", "EsMixto", "FechaCreacion", "FechaDestruccion", "HayLibero", "ImportId", "MaxJugadoresPorEquipo", "MaxStaffPorEquipo", "MinJugadoresPorEquipo", "MinStaffPorEquipo", "ModalidadId", "NumeroJugadoresEnPista", "Posicion", "Precios", "PuntuacionClasificacion", "PuntuacionPlaya", "ResolucionEmpate", "SetPoints", "Sets", "Sexo", "TemporadaId", "TipoCompeticion", "VisibleClub", "VisibleWeb" },
                values: new object[] { null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, null, null, null, null, null, null, null, null, null, false, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("6e53d4b1-f35c-4d68-b8a0-468b06605c64"),
                columns: new[] { "CategoriaId", "ChangePoints", "CompetitionGroupId", "ConfiguracionSets", "ControlJugadores", "CriteriosClasificacion", "EsMixto", "FechaCreacion", "FechaDestruccion", "HayLibero", "ImportId", "MaxJugadoresPorEquipo", "MaxStaffPorEquipo", "MinJugadoresPorEquipo", "MinStaffPorEquipo", "ModalidadId", "NumeroJugadoresEnPista", "Posicion", "Precios", "PuntuacionClasificacion", "PuntuacionPlaya", "ResolucionEmpate", "SetPoints", "Sets", "Sexo", "TemporadaId", "TipoCompeticion", "VisibleClub", "VisibleWeb" },
                values: new object[] { null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, null, null, null, null, null, null, null, null, null, false, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("75fa3c5a-3335-468e-94a2-8d7c4f6c57a6"),
                columns: new[] { "CategoriaId", "ChangePoints", "CompetitionGroupId", "ConfiguracionSets", "ControlJugadores", "CriteriosClasificacion", "EsMixto", "FechaCreacion", "FechaDestruccion", "HayLibero", "ImportId", "MaxJugadoresPorEquipo", "MaxStaffPorEquipo", "MinJugadoresPorEquipo", "MinStaffPorEquipo", "ModalidadId", "NumeroJugadoresEnPista", "Posicion", "Precios", "PuntuacionClasificacion", "PuntuacionPlaya", "ResolucionEmpate", "SetPoints", "Sets", "Sexo", "TemporadaId", "TipoCompeticion", "VisibleClub", "VisibleWeb" },
                values: new object[] { null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, null, null, null, null, null, null, null, null, null, false, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("80a146e0-7c3f-4e5c-8ca3-2d9bb56a1d0c"),
                columns: new[] { "CategoriaId", "ChangePoints", "CompetitionGroupId", "ConfiguracionSets", "ControlJugadores", "CriteriosClasificacion", "EsMixto", "FechaCreacion", "FechaDestruccion", "HayLibero", "ImportId", "MaxJugadoresPorEquipo", "MaxStaffPorEquipo", "MinJugadoresPorEquipo", "MinStaffPorEquipo", "ModalidadId", "NumeroJugadoresEnPista", "Posicion", "Precios", "PuntuacionClasificacion", "PuntuacionPlaya", "ResolucionEmpate", "SetPoints", "Sets", "Sexo", "TemporadaId", "TipoCompeticion", "VisibleClub", "VisibleWeb" },
                values: new object[] { null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, null, null, null, null, null, null, null, null, null, false, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("8b4bf1f1-215a-4c27-a7b6-1c6c3a1b6d5d"),
                columns: new[] { "CategoriaId", "ChangePoints", "CompetitionGroupId", "ConfiguracionSets", "ControlJugadores", "CriteriosClasificacion", "EsMixto", "FechaCreacion", "FechaDestruccion", "HayLibero", "ImportId", "MaxJugadoresPorEquipo", "MaxStaffPorEquipo", "MinJugadoresPorEquipo", "MinStaffPorEquipo", "ModalidadId", "NumeroJugadoresEnPista", "Posicion", "Precios", "PuntuacionClasificacion", "PuntuacionPlaya", "ResolucionEmpate", "SetPoints", "Sets", "Sexo", "TemporadaId", "TipoCompeticion", "VisibleClub", "VisibleWeb" },
                values: new object[] { null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, null, null, null, null, null, null, null, null, null, false, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("9714711c-b47a-4aa7-b923-7b9c0b90d385"),
                columns: new[] { "CategoriaId", "ChangePoints", "CompetitionGroupId", "ConfiguracionSets", "ControlJugadores", "CriteriosClasificacion", "EsMixto", "FechaCreacion", "FechaDestruccion", "HayLibero", "ImportId", "MaxJugadoresPorEquipo", "MaxStaffPorEquipo", "MinJugadoresPorEquipo", "MinStaffPorEquipo", "ModalidadId", "NumeroJugadoresEnPista", "Posicion", "Precios", "PuntuacionClasificacion", "PuntuacionPlaya", "ResolucionEmpate", "SetPoints", "Sets", "Sexo", "TemporadaId", "TipoCompeticion", "VisibleClub", "VisibleWeb" },
                values: new object[] { null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, null, null, null, null, null, null, null, null, null, false, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("a1c760f2-a6f8-451b-8614-8ed95d40182b"),
                columns: new[] { "CategoriaId", "ChangePoints", "CompetitionGroupId", "ConfiguracionSets", "ControlJugadores", "CriteriosClasificacion", "EsMixto", "FechaCreacion", "FechaDestruccion", "HayLibero", "ImportId", "MaxJugadoresPorEquipo", "MaxStaffPorEquipo", "MinJugadoresPorEquipo", "MinStaffPorEquipo", "ModalidadId", "NumeroJugadoresEnPista", "Posicion", "Precios", "PuntuacionClasificacion", "PuntuacionPlaya", "ResolucionEmpate", "SetPoints", "Sets", "Sexo", "TemporadaId", "TipoCompeticion", "VisibleClub", "VisibleWeb" },
                values: new object[] { null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, null, null, null, null, null, null, null, null, null, false, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("a73b0e31-2f05-4b64-9a8e-448e2a1e8b5f"),
                columns: new[] { "CategoriaId", "ChangePoints", "CompetitionGroupId", "ConfiguracionSets", "ControlJugadores", "CriteriosClasificacion", "EsMixto", "FechaCreacion", "FechaDestruccion", "HayLibero", "ImportId", "MaxJugadoresPorEquipo", "MaxStaffPorEquipo", "MinJugadoresPorEquipo", "MinStaffPorEquipo", "ModalidadId", "NumeroJugadoresEnPista", "Posicion", "Precios", "PuntuacionClasificacion", "PuntuacionPlaya", "ResolucionEmpate", "SetPoints", "Sets", "Sexo", "TemporadaId", "TipoCompeticion", "VisibleClub", "VisibleWeb" },
                values: new object[] { null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, null, null, null, null, null, null, null, null, null, false, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("b5e0c3c9-0d3b-4a4d-8d66-0ad8f91b2f6e"),
                columns: new[] { "CategoriaId", "ChangePoints", "CompetitionGroupId", "ConfiguracionSets", "ControlJugadores", "CriteriosClasificacion", "EsMixto", "FechaCreacion", "FechaDestruccion", "HayLibero", "ImportId", "MaxJugadoresPorEquipo", "MaxStaffPorEquipo", "MinJugadoresPorEquipo", "MinStaffPorEquipo", "ModalidadId", "NumeroJugadoresEnPista", "Posicion", "Precios", "PuntuacionClasificacion", "PuntuacionPlaya", "ResolucionEmpate", "SetPoints", "Sets", "Sexo", "TemporadaId", "TipoCompeticion", "VisibleClub", "VisibleWeb" },
                values: new object[] { null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, null, null, null, null, null, null, null, null, null, false, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("c0db6dd5-5709-41e0-b8d3-f70222b2c1e4"),
                columns: new[] { "CategoriaId", "ChangePoints", "CompetitionGroupId", "ConfiguracionSets", "ControlJugadores", "CriteriosClasificacion", "EsMixto", "FechaCreacion", "FechaDestruccion", "HayLibero", "ImportId", "MaxJugadoresPorEquipo", "MaxStaffPorEquipo", "MinJugadoresPorEquipo", "MinStaffPorEquipo", "ModalidadId", "NumeroJugadoresEnPista", "Posicion", "Precios", "PuntuacionClasificacion", "PuntuacionPlaya", "ResolucionEmpate", "SetPoints", "Sets", "Sexo", "TemporadaId", "TipoCompeticion", "VisibleClub", "VisibleWeb" },
                values: new object[] { null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, null, null, null, null, null, null, null, null, null, false, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("c2d56f5b-62ab-4b7f-9b3b-04f06c9f8a87"),
                columns: new[] { "CategoriaId", "ChangePoints", "CompetitionGroupId", "ConfiguracionSets", "ControlJugadores", "CriteriosClasificacion", "EsMixto", "FechaCreacion", "FechaDestruccion", "HayLibero", "ImportId", "MaxJugadoresPorEquipo", "MaxStaffPorEquipo", "MinJugadoresPorEquipo", "MinStaffPorEquipo", "ModalidadId", "NumeroJugadoresEnPista", "Posicion", "Precios", "PuntuacionClasificacion", "PuntuacionPlaya", "ResolucionEmpate", "SetPoints", "Sets", "Sexo", "TemporadaId", "TipoCompeticion", "VisibleClub", "VisibleWeb" },
                values: new object[] { null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, null, null, null, null, null, null, null, null, null, false, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("c3e8c8e2-3cfe-4b1c-8a7f-9b6b567a7f9a"),
                columns: new[] { "CategoriaId", "ChangePoints", "CompetitionGroupId", "ConfiguracionSets", "ControlJugadores", "CriteriosClasificacion", "EsMixto", "FechaCreacion", "FechaDestruccion", "HayLibero", "ImportId", "MaxJugadoresPorEquipo", "MaxStaffPorEquipo", "MinJugadoresPorEquipo", "MinStaffPorEquipo", "ModalidadId", "NumeroJugadoresEnPista", "Posicion", "Precios", "PuntuacionClasificacion", "PuntuacionPlaya", "ResolucionEmpate", "SetPoints", "Sets", "Sexo", "TemporadaId", "TipoCompeticion", "VisibleClub", "VisibleWeb" },
                values: new object[] { null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, null, null, null, null, null, null, null, null, null, false, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("d2bf94da-08a1-4fdc-8d7b-945e52a23b58"),
                columns: new[] { "CategoriaId", "ChangePoints", "CompetitionGroupId", "ConfiguracionSets", "ControlJugadores", "CriteriosClasificacion", "EsMixto", "FechaCreacion", "FechaDestruccion", "HayLibero", "ImportId", "MaxJugadoresPorEquipo", "MaxStaffPorEquipo", "MinJugadoresPorEquipo", "MinStaffPorEquipo", "ModalidadId", "NumeroJugadoresEnPista", "Posicion", "Precios", "PuntuacionClasificacion", "PuntuacionPlaya", "ResolucionEmpate", "SetPoints", "Sets", "Sexo", "TemporadaId", "TipoCompeticion", "VisibleClub", "VisibleWeb" },
                values: new object[] { null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, null, null, null, null, null, null, null, null, null, false, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("d3a11a4b-b9c2-4d07-9b4e-67b7f532a6d1"),
                columns: new[] { "CategoriaId", "ChangePoints", "CompetitionGroupId", "ConfiguracionSets", "ControlJugadores", "CriteriosClasificacion", "EsMixto", "FechaCreacion", "FechaDestruccion", "HayLibero", "ImportId", "MaxJugadoresPorEquipo", "MaxStaffPorEquipo", "MinJugadoresPorEquipo", "MinStaffPorEquipo", "ModalidadId", "NumeroJugadoresEnPista", "Posicion", "Precios", "PuntuacionClasificacion", "PuntuacionPlaya", "ResolucionEmpate", "SetPoints", "Sets", "Sexo", "TemporadaId", "TipoCompeticion", "VisibleClub", "VisibleWeb" },
                values: new object[] { null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, null, null, null, null, null, null, null, null, null, false, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("e5f7f38a-6261-4e9d-a0d5-5d90f2e4e5a1"),
                columns: new[] { "CategoriaId", "ChangePoints", "CompetitionGroupId", "ConfiguracionSets", "ControlJugadores", "CriteriosClasificacion", "EsMixto", "FechaCreacion", "FechaDestruccion", "HayLibero", "ImportId", "MaxJugadoresPorEquipo", "MaxStaffPorEquipo", "MinJugadoresPorEquipo", "MinStaffPorEquipo", "ModalidadId", "NumeroJugadoresEnPista", "Posicion", "Precios", "PuntuacionClasificacion", "PuntuacionPlaya", "ResolucionEmpate", "SetPoints", "Sets", "Sexo", "TemporadaId", "TipoCompeticion", "VisibleClub", "VisibleWeb" },
                values: new object[] { null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, null, null, null, null, null, null, null, null, null, false, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("f8a5e909-4a6a-4a1d-84d9-64283a4ab4e4"),
                columns: new[] { "CategoriaId", "ChangePoints", "CompetitionGroupId", "ConfiguracionSets", "ControlJugadores", "CriteriosClasificacion", "EsMixto", "FechaCreacion", "FechaDestruccion", "HayLibero", "ImportId", "MaxJugadoresPorEquipo", "MaxStaffPorEquipo", "MinJugadoresPorEquipo", "MinStaffPorEquipo", "ModalidadId", "NumeroJugadoresEnPista", "Posicion", "Precios", "PuntuacionClasificacion", "PuntuacionPlaya", "ResolucionEmpate", "SetPoints", "Sets", "Sexo", "TemporadaId", "TipoCompeticion", "VisibleClub", "VisibleWeb" },
                values: new object[] { null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, null, null, null, null, null, null, null, null, null, false, false });

            migrationBuilder.CreateIndex(
                name: "IX_Polideportivos_ImportId",
                table: "Polideportivos",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_Personas_ImportId",
                table: "Personas",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_Partidos_CompeticionId",
                table: "Partidos",
                column: "CompeticionId");

            migrationBuilder.CreateIndex(
                name: "IX_Partidos_ImportId",
                table: "Partidos",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_Partidos_TemporadaId",
                table: "Partidos",
                column: "TemporadaId");

            migrationBuilder.CreateIndex(
                name: "IX_LicenciasPersonas_ClubId",
                table: "LicenciasPersonas",
                column: "ClubId");

            migrationBuilder.CreateIndex(
                name: "IX_LicenciasPersonas_FacturaId",
                table: "LicenciasPersonas",
                column: "FacturaId");

            migrationBuilder.CreateIndex(
                name: "IX_LicenciasPersonas_ImportId",
                table: "LicenciasPersonas",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_LicenciasPersonas_PersonaId",
                table: "LicenciasPersonas",
                column: "PersonaId");

            migrationBuilder.CreateIndex(
                name: "IX_Equipos_CampoJuegoId",
                table: "Equipos",
                column: "CampoJuegoId");

            migrationBuilder.CreateIndex(
                name: "IX_Equipos_ClubId_CompeticionId_CategoriaId_Nombre",
                table: "Equipos",
                columns: new[] { "ClubId", "CompeticionId", "CategoriaId", "Nombre" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Equipos_CompeticionId",
                table: "Equipos",
                column: "CompeticionId");

            migrationBuilder.CreateIndex(
                name: "IX_Equipos_ImportId",
                table: "Equipos",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_Competiciones_CategoriaId",
                table: "Competiciones",
                column: "CategoriaId");

            migrationBuilder.CreateIndex(
                name: "IX_Competiciones_ImportId",
                table: "Competiciones",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_Competiciones_ModalidadId",
                table: "Competiciones",
                column: "ModalidadId");

            migrationBuilder.CreateIndex(
                name: "IX_Competiciones_TemporadaId",
                table: "Competiciones",
                column: "TemporadaId");

            migrationBuilder.CreateIndex(
                name: "IX_Clubs_FederacionId_CIF",
                table: "Clubs",
                columns: new[] { "FederacionId", "CIF" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Clubs_ImportId",
                table: "Clubs",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_Categorias_ImportId",
                table: "Categorias",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_CompeticionesCategorias_CategoriaId",
                table: "CompeticionesCategorias",
                column: "CategoriaId");

            migrationBuilder.CreateIndex(
                name: "IX_CompeticionesCategorias_CompeticionId_CategoriaId",
                table: "CompeticionesCategorias",
                columns: new[] { "CompeticionId", "CategoriaId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CompeticionesReglas_CompeticionId",
                table: "CompeticionesReglas",
                column: "CompeticionId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Cursos_FederacionId",
                table: "Cursos",
                column: "FederacionId");

            migrationBuilder.CreateIndex(
                name: "IX_Cursos_ImportId",
                table: "Cursos",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_Designaciones_ArbitroId",
                table: "Designaciones",
                column: "ArbitroId");

            migrationBuilder.CreateIndex(
                name: "IX_Designaciones_ImportId",
                table: "Designaciones",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_Designaciones_PartidoId",
                table: "Designaciones",
                column: "PartidoId");

            migrationBuilder.CreateIndex(
                name: "IX_Designaciones_PistaId",
                table: "Designaciones",
                column: "PistaId");

            migrationBuilder.CreateIndex(
                name: "IX_FacturaLineas_FacturaId",
                table: "FacturaLineas",
                column: "FacturaId");

            migrationBuilder.CreateIndex(
                name: "IX_Facturas_ClubId",
                table: "Facturas",
                column: "ClubId");

            migrationBuilder.CreateIndex(
                name: "IX_Facturas_Estado",
                table: "Facturas",
                column: "Estado");

            migrationBuilder.CreateIndex(
                name: "IX_Facturas_Numero",
                table: "Facturas",
                column: "Numero",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FasesTorneo_ImportId",
                table: "FasesTorneo",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_FechasEntrenamiento_ImportId",
                table: "FechasEntrenamiento",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_GruposEdicion_CampoJuegoId",
                table: "GruposEdicion",
                column: "CampoJuegoId");

            migrationBuilder.CreateIndex(
                name: "IX_GruposEdicion_ImportId",
                table: "GruposEdicion",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_Jugadores_EquipoId",
                table: "Jugadores",
                column: "EquipoId");

            migrationBuilder.CreateIndex(
                name: "IX_Jugadores_ImportId",
                table: "Jugadores",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_Jugadores_PersonaId",
                table: "Jugadores",
                column: "PersonaId");

            migrationBuilder.CreateIndex(
                name: "IX_Liquidaciones_Estado",
                table: "Liquidaciones",
                column: "Estado");

            migrationBuilder.CreateIndex(
                name: "IX_Liquidaciones_PartidoId",
                table: "Liquidaciones",
                column: "PartidoId");

            migrationBuilder.CreateIndex(
                name: "IX_Liquidaciones_UsuarioId_Fecha",
                table: "Liquidaciones",
                columns: new[] { "UsuarioId", "Fecha" });

            migrationBuilder.CreateIndex(
                name: "IX_LiquidacionItems_LiquidacionId",
                table: "LiquidacionItems",
                column: "LiquidacionId");

            migrationBuilder.CreateIndex(
                name: "IX_OrdenesPago_Estado",
                table: "OrdenesPago",
                column: "Estado");

            migrationBuilder.CreateIndex(
                name: "IX_OrdenesPagoItems_LiquidacionId",
                table: "OrdenesPagoItems",
                column: "LiquidacionId");

            migrationBuilder.CreateIndex(
                name: "IX_OrdenesPagoItems_OrdenPagoId",
                table: "OrdenesPagoItems",
                column: "OrdenPagoId");

            migrationBuilder.CreateIndex(
                name: "IX_OrdenesPagoItems_UsuarioId",
                table: "OrdenesPagoItems",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Pagos_ClubId",
                table: "Pagos",
                column: "ClubId");

            migrationBuilder.CreateIndex(
                name: "IX_Pagos_EquipoId",
                table: "Pagos",
                column: "EquipoId");

            migrationBuilder.CreateIndex(
                name: "IX_Pagos_FacturaId",
                table: "Pagos",
                column: "FacturaId");

            migrationBuilder.CreateIndex(
                name: "IX_Pagos_ImportId",
                table: "Pagos",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_Pagos_JugadorId",
                table: "Pagos",
                column: "JugadorId");

            migrationBuilder.CreateIndex(
                name: "IX_Pagos_LicenciaId",
                table: "Pagos",
                column: "LicenciaId");

            migrationBuilder.CreateIndex(
                name: "IX_Pagos_PartidoId",
                table: "Pagos",
                column: "PartidoId");

            migrationBuilder.CreateIndex(
                name: "IX_Pagos_PersonaId",
                table: "Pagos",
                column: "PersonaId");

            migrationBuilder.CreateIndex(
                name: "IX_PartidosCambiosSolicitudes_Estado",
                table: "PartidosCambiosSolicitudes",
                column: "Estado");

            migrationBuilder.CreateIndex(
                name: "IX_PartidosCambiosSolicitudes_LugarOriginalId",
                table: "PartidosCambiosSolicitudes",
                column: "LugarOriginalId");

            migrationBuilder.CreateIndex(
                name: "IX_PartidosCambiosSolicitudes_LugarPropuestoId",
                table: "PartidosCambiosSolicitudes",
                column: "LugarPropuestoId");

            migrationBuilder.CreateIndex(
                name: "IX_PartidosCambiosSolicitudes_PartidoId",
                table: "PartidosCambiosSolicitudes",
                column: "PartidoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Competiciones_Categorias_CategoriaId",
                table: "Competiciones",
                column: "CategoriaId",
                principalTable: "Categorias",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Competiciones_Modalidades_ModalidadId",
                table: "Competiciones",
                column: "ModalidadId",
                principalTable: "Modalidades",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Competiciones_Temporadas_TemporadaId",
                table: "Competiciones",
                column: "TemporadaId",
                principalTable: "Temporadas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Equipos_Competiciones_CompeticionId",
                table: "Equipos",
                column: "CompeticionId",
                principalTable: "Competiciones",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Equipos_Polideportivos_CampoJuegoId",
                table: "Equipos",
                column: "CampoJuegoId",
                principalTable: "Polideportivos",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_LicenciasPersonas_Clubs_ClubId",
                table: "LicenciasPersonas",
                column: "ClubId",
                principalTable: "Clubs",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_LicenciasPersonas_Facturas_FacturaId",
                table: "LicenciasPersonas",
                column: "FacturaId",
                principalTable: "Facturas",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Partidos_Temporadas_TemporadaId",
                table: "Partidos",
                column: "TemporadaId",
                principalTable: "Temporadas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Competiciones_Categorias_CategoriaId",
                table: "Competiciones");

            migrationBuilder.DropForeignKey(
                name: "FK_Competiciones_Modalidades_ModalidadId",
                table: "Competiciones");

            migrationBuilder.DropForeignKey(
                name: "FK_Competiciones_Temporadas_TemporadaId",
                table: "Competiciones");

            migrationBuilder.DropForeignKey(
                name: "FK_Equipos_Competiciones_CompeticionId",
                table: "Equipos");

            migrationBuilder.DropForeignKey(
                name: "FK_Equipos_Polideportivos_CampoJuegoId",
                table: "Equipos");

            migrationBuilder.DropForeignKey(
                name: "FK_LicenciasPersonas_Clubs_ClubId",
                table: "LicenciasPersonas");

            migrationBuilder.DropForeignKey(
                name: "FK_LicenciasPersonas_Facturas_FacturaId",
                table: "LicenciasPersonas");

            migrationBuilder.DropForeignKey(
                name: "FK_Partidos_Temporadas_TemporadaId",
                table: "Partidos");

            migrationBuilder.DropTable(
                name: "CompeticionesCategorias");

            migrationBuilder.DropTable(
                name: "CompeticionesReglas");

            migrationBuilder.DropTable(
                name: "Cursos");

            migrationBuilder.DropTable(
                name: "Designaciones");

            migrationBuilder.DropTable(
                name: "FacturaLineas");

            migrationBuilder.DropTable(
                name: "FasesTorneo");

            migrationBuilder.DropTable(
                name: "FechasEntrenamiento");

            migrationBuilder.DropTable(
                name: "GruposEdicion");

            migrationBuilder.DropTable(
                name: "LiquidacionItems");

            migrationBuilder.DropTable(
                name: "OrdenesPagoItems");

            migrationBuilder.DropTable(
                name: "Pagos");

            migrationBuilder.DropTable(
                name: "PartidosCambiosSolicitudes");

            migrationBuilder.DropTable(
                name: "Liquidaciones");

            migrationBuilder.DropTable(
                name: "OrdenesPago");

            migrationBuilder.DropTable(
                name: "Facturas");

            migrationBuilder.DropTable(
                name: "Jugadores");

            migrationBuilder.DropIndex(
                name: "IX_Polideportivos_ImportId",
                table: "Polideportivos");

            migrationBuilder.DropIndex(
                name: "IX_Personas_ImportId",
                table: "Personas");

            migrationBuilder.DropIndex(
                name: "IX_Partidos_CompeticionId",
                table: "Partidos");

            migrationBuilder.DropIndex(
                name: "IX_Partidos_ImportId",
                table: "Partidos");

            migrationBuilder.DropIndex(
                name: "IX_Partidos_TemporadaId",
                table: "Partidos");

            migrationBuilder.DropIndex(
                name: "IX_LicenciasPersonas_ClubId",
                table: "LicenciasPersonas");

            migrationBuilder.DropIndex(
                name: "IX_LicenciasPersonas_FacturaId",
                table: "LicenciasPersonas");

            migrationBuilder.DropIndex(
                name: "IX_LicenciasPersonas_ImportId",
                table: "LicenciasPersonas");

            migrationBuilder.DropIndex(
                name: "IX_LicenciasPersonas_PersonaId",
                table: "LicenciasPersonas");

            migrationBuilder.DropIndex(
                name: "IX_Equipos_CampoJuegoId",
                table: "Equipos");

            migrationBuilder.DropIndex(
                name: "IX_Equipos_ClubId_CompeticionId_CategoriaId_Nombre",
                table: "Equipos");

            migrationBuilder.DropIndex(
                name: "IX_Equipos_CompeticionId",
                table: "Equipos");

            migrationBuilder.DropIndex(
                name: "IX_Equipos_ImportId",
                table: "Equipos");

            migrationBuilder.DropIndex(
                name: "IX_Competiciones_CategoriaId",
                table: "Competiciones");

            migrationBuilder.DropIndex(
                name: "IX_Competiciones_ImportId",
                table: "Competiciones");

            migrationBuilder.DropIndex(
                name: "IX_Competiciones_ModalidadId",
                table: "Competiciones");

            migrationBuilder.DropIndex(
                name: "IX_Competiciones_TemporadaId",
                table: "Competiciones");

            migrationBuilder.DropIndex(
                name: "IX_Clubs_FederacionId_CIF",
                table: "Clubs");

            migrationBuilder.DropIndex(
                name: "IX_Clubs_ImportId",
                table: "Clubs");

            migrationBuilder.DropIndex(
                name: "IX_Categorias_ImportId",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "Bic",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "Iban",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "TitularCuenta",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "ClubesIds",
                table: "Polideportivos");

            migrationBuilder.DropColumn(
                name: "Direccion",
                table: "Polideportivos");

            migrationBuilder.DropColumn(
                name: "FechaCreacion",
                table: "Polideportivos");

            migrationBuilder.DropColumn(
                name: "FechaDestruccion",
                table: "Polideportivos");

            migrationBuilder.DropColumn(
                name: "ImportId",
                table: "Polideportivos");

            migrationBuilder.DropColumn(
                name: "Poblacion",
                table: "Polideportivos");

            migrationBuilder.DropColumn(
                name: "Servicios",
                table: "Polideportivos");

            migrationBuilder.DropColumn(
                name: "Zona",
                table: "Polideportivos");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Personas");

            migrationBuilder.DropColumn(
                name: "CertificadoAusenciaDelitos",
                table: "Personas");

            migrationBuilder.DropColumn(
                name: "Comentarios",
                table: "Personas");

            migrationBuilder.DropColumn(
                name: "Disponibilidad",
                table: "Personas");

            migrationBuilder.DropColumn(
                name: "FechaCreacion",
                table: "Personas");

            migrationBuilder.DropColumn(
                name: "FechaDestruccion",
                table: "Personas");

            migrationBuilder.DropColumn(
                name: "ImportId",
                table: "Personas");

            migrationBuilder.DropColumn(
                name: "Lat",
                table: "Personas");

            migrationBuilder.DropColumn(
                name: "Lng",
                table: "Personas");

            migrationBuilder.DropColumn(
                name: "Nacionalidad",
                table: "Personas");

            migrationBuilder.DropColumn(
                name: "NivelArbitro",
                table: "Personas");

            migrationBuilder.DropColumn(
                name: "NivelEntrenador",
                table: "Personas");

            migrationBuilder.DropColumn(
                name: "NumeroCuenta",
                table: "Personas");

            migrationBuilder.DropColumn(
                name: "NumeroLicenciaAntiguo",
                table: "Personas");

            migrationBuilder.DropColumn(
                name: "OldId",
                table: "Personas");

            migrationBuilder.DropColumn(
                name: "Poblacion",
                table: "Personas");

            migrationBuilder.DropColumn(
                name: "Sexo",
                table: "Personas");

            migrationBuilder.DropColumn(
                name: "TipoDocumento",
                table: "Personas");

            migrationBuilder.DropColumn(
                name: "Vacaciones",
                table: "Personas");

            migrationBuilder.DropColumn(
                name: "ZonaArbitraje",
                table: "Personas");

            migrationBuilder.DropColumn(
                name: "CachedSummary",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "Clubes",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "Comentarios",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "CompetitionGroupId",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "ConfirmadaDesignacion",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "ConfirmedRefereeIds",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "ConvocatoriaLocalPeople",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "ConvocatoriaLocalPlayers",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "ConvocatoriaVisitantePeople",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "ConvocatoriaVisitantePlayers",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "DatosArbitraje",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "Deporte",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "DesignacionArbitralCompleta",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "EdicionId",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "Equipos",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "Estadisticas",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "EstadoArbitraje",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "EstadoHorario",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "FaseEdicionId",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "FechaCreacion",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "FechaDestruccion",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "FechaEstimada",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "FechaJornada",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "FotoActa",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "FranjaHoraria",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "GrupoEdicionId",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "ImportId",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "NombreCategoria",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "NombreCategoriaPlaya",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "NombreEnCalendario",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "NombreGenero",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "NombreGrupo",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "NombreLocal",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "NombrePabellon",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "NombreVisitante",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "NumEquiposEnGrupo",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "NumeroPista",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "Ref",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "RefPartidoCalendario",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "ReglasJuego",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "Resultado",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "TemporadaId",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "TorneoId",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "Zona",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "CategoriaArbitro",
                table: "LicenciasPersonas");

            migrationBuilder.DropColumn(
                name: "CategoriaEntrenador",
                table: "LicenciasPersonas");

            migrationBuilder.DropColumn(
                name: "ClubId",
                table: "LicenciasPersonas");

            migrationBuilder.DropColumn(
                name: "CodigoPostal",
                table: "LicenciasPersonas");

            migrationBuilder.DropColumn(
                name: "Direccion",
                table: "LicenciasPersonas");

            migrationBuilder.DropColumn(
                name: "EquiposIds",
                table: "LicenciasPersonas");

            migrationBuilder.DropColumn(
                name: "FacturaId",
                table: "LicenciasPersonas");

            migrationBuilder.DropColumn(
                name: "FechaCreacion",
                table: "LicenciasPersonas");

            migrationBuilder.DropColumn(
                name: "FechaDestruccion",
                table: "LicenciasPersonas");

            migrationBuilder.DropColumn(
                name: "FechaFin",
                table: "LicenciasPersonas");

            migrationBuilder.DropColumn(
                name: "FechaMutua",
                table: "LicenciasPersonas");

            migrationBuilder.DropColumn(
                name: "Genero",
                table: "LicenciasPersonas");

            migrationBuilder.DropColumn(
                name: "HabilitadoCategoriaSuperior",
                table: "LicenciasPersonas");

            migrationBuilder.DropColumn(
                name: "HabilitadoNacional",
                table: "LicenciasPersonas");

            migrationBuilder.DropColumn(
                name: "ImportId",
                table: "LicenciasPersonas");

            migrationBuilder.DropColumn(
                name: "Importe",
                table: "LicenciasPersonas");

            migrationBuilder.DropColumn(
                name: "Lat",
                table: "LicenciasPersonas");

            migrationBuilder.DropColumn(
                name: "Lng",
                table: "LicenciasPersonas");

            migrationBuilder.DropColumn(
                name: "Nombre",
                table: "LicenciasPersonas");

            migrationBuilder.DropColumn(
                name: "Poblacion",
                table: "LicenciasPersonas");

            migrationBuilder.DropColumn(
                name: "Provincia",
                table: "LicenciasPersonas");

            migrationBuilder.DropColumn(
                name: "Tipo",
                table: "LicenciasPersonas");

            migrationBuilder.DropColumn(
                name: "CampoJuegoId",
                table: "Equipos");

            migrationBuilder.DropColumn(
                name: "Comentarios",
                table: "Equipos");

            migrationBuilder.DropColumn(
                name: "CompeticionId",
                table: "Equipos");

            migrationBuilder.DropColumn(
                name: "EdicionId",
                table: "Equipos");

            migrationBuilder.DropColumn(
                name: "Estado",
                table: "Equipos");

            migrationBuilder.DropColumn(
                name: "FechaCreacion",
                table: "Equipos");

            migrationBuilder.DropColumn(
                name: "FechaDestruccion",
                table: "Equipos");

            migrationBuilder.DropColumn(
                name: "ImportId",
                table: "Equipos");

            migrationBuilder.DropColumn(
                name: "IndiceCategoría",
                table: "Equipos");

            migrationBuilder.DropColumn(
                name: "InscripcionCircuitoCompleto",
                table: "Equipos");

            migrationBuilder.DropColumn(
                name: "InscritoPorId",
                table: "Equipos");

            migrationBuilder.DropColumn(
                name: "PlayerData",
                table: "Equipos");

            migrationBuilder.DropColumn(
                name: "PosicionRanking",
                table: "Equipos");

            migrationBuilder.DropColumn(
                name: "PuntosRanking",
                table: "Equipos");

            migrationBuilder.DropColumn(
                name: "Sexo",
                table: "Equipos");

            migrationBuilder.DropColumn(
                name: "TorneoId",
                table: "Equipos");

            migrationBuilder.DropColumn(
                name: "ValorAleatorioEmpates",
                table: "Equipos");

            migrationBuilder.DropColumn(
                name: "CategoriaId",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "ChangePoints",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "CompetitionGroupId",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "ConfiguracionSets",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "ControlJugadores",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "CriteriosClasificacion",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "EsMixto",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "FechaCreacion",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "FechaDestruccion",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "HayLibero",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "ImportId",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "MaxJugadoresPorEquipo",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "MaxStaffPorEquipo",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "MinJugadoresPorEquipo",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "MinStaffPorEquipo",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "ModalidadId",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "NumeroJugadoresEnPista",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "Posicion",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "Precios",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "PuntuacionClasificacion",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "PuntuacionPlaya",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "ResolucionEmpate",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "SetPoints",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "Sets",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "Sexo",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "TemporadaId",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "TipoCompeticion",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "VisibleClub",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "VisibleWeb",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "AdministracionAsociadaId",
                table: "Clubs");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Clubs");

            migrationBuilder.DropColumn(
                name: "CIF",
                table: "Clubs");

            migrationBuilder.DropColumn(
                name: "CiudadFiscal",
                table: "Clubs");

            migrationBuilder.DropColumn(
                name: "ClientId",
                table: "Clubs");

            migrationBuilder.DropColumn(
                name: "CodigoPostalFiscal",
                table: "Clubs");

            migrationBuilder.DropColumn(
                name: "DireccionFiscal",
                table: "Clubs");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Clubs");

            migrationBuilder.DropColumn(
                name: "EmailFacturacion",
                table: "Clubs");

            migrationBuilder.DropColumn(
                name: "Escudo",
                table: "Clubs");

            migrationBuilder.DropColumn(
                name: "FechaCreacion",
                table: "Clubs");

            migrationBuilder.DropColumn(
                name: "FechaDestruccion",
                table: "Clubs");

            migrationBuilder.DropColumn(
                name: "ImportId",
                table: "Clubs");

            migrationBuilder.DropColumn(
                name: "ProvinciaFiscal",
                table: "Clubs");

            migrationBuilder.DropColumn(
                name: "RazonSocial",
                table: "Clubs");

            migrationBuilder.DropColumn(
                name: "ResponsableEmail",
                table: "Clubs");

            migrationBuilder.DropColumn(
                name: "ResponsableNombre",
                table: "Clubs");

            migrationBuilder.DropColumn(
                name: "ResponsableTelefono",
                table: "Clubs");

            migrationBuilder.DropColumn(
                name: "Telefono",
                table: "Clubs");

            migrationBuilder.DropColumn(
                name: "BornFrom",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "BornTo",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "CategoriasPermitidas",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "Color",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "Descripcion",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "DimensionesPistaFemenino",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "DimensionesPistaMasculino",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "DimensionesPlayaFemenino",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "DimensionesPlayaMasculino",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "EdadInicio",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "FechaCreacion",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "FechaDestruccion",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "Federado",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "ImportId",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "MaxJugadores",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "MinJugadores",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "NombrePlaya",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "NumeroAnios",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "Posicion",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "Token",
                table: "Categorias");

            migrationBuilder.AlterColumn<double>(
                name: "Longitud",
                table: "Polideportivos",
                type: "double",
                nullable: false,
                defaultValue: 0.0,
                oldClrType: typeof(double),
                oldType: "double",
                oldNullable: true);

            migrationBuilder.AlterColumn<double>(
                name: "Latitud",
                table: "Polideportivos",
                type: "double",
                nullable: false,
                defaultValue: 0.0,
                oldClrType: typeof(double),
                oldType: "double",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "FechaNacimiento",
                table: "Personas",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Documento",
                table: "Personas",
                type: "varchar(255)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<TimeSpan>(
                name: "Hora",
                table: "Partidos",
                type: "time(6)",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0),
                oldClrType: typeof(TimeSpan),
                oldType: "time(6)",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "Fecha",
                table: "Partidos",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "ModalidadId",
                table: "LicenciasPersonas",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                collation: "ascii_general_ci",
                oldClrType: typeof(Guid),
                oldType: "char(36)",
                oldNullable: true)
                .OldAnnotation("Relational:Collation", "ascii_general_ci");

            migrationBuilder.AlterColumn<DateTime>(
                name: "FechaAlta",
                table: "LicenciasPersonas",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Equipos",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldMaxLength: 255)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Categorias",
                type: "varchar(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Personas_Documento",
                table: "Personas",
                column: "Documento",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LicenciasPersonas_PersonaId_TemporadaId_ModalidadId",
                table: "LicenciasPersonas",
                columns: new[] { "PersonaId", "TemporadaId", "ModalidadId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Equipos_ClubId",
                table: "Equipos",
                column: "ClubId");
        }
    }
}
