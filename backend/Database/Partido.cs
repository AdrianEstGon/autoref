namespace AutoRef_API.Database;


using System;

public class Partido
{
    public Guid Id { get; set; }
    
    // Referencias principales
    public Guid? CompeticionId { get; set; }
    public virtual Competicion? Competicion { get; set; }

    public Guid? TemporadaId { get; set; }
    public virtual Temporada? Temporada { get; set; }

    public Guid? CategoriaId { get; set; }
    public virtual Categoria? Categoria { get; set; }

    public Guid? EdicionId { get; set; }
    public Guid? FaseEdicionId { get; set; }
    public Guid? GrupoEdicionId { get; set; }
    public Guid? CompetitionGroupId { get; set; }
    public Guid? TorneoId { get; set; }

    // Equipos
    public Guid? EquipoLocalId { get; set; }
    public virtual Equipo? EquipoLocal { get; set; }
    public string? NombreLocal { get; set; }

    public Guid? EquipoVisitanteId { get; set; }
    public virtual Equipo? EquipoVisitante { get; set; }
    public string? NombreVisitante { get; set; }

    // Lugar
    public Guid? LugarId { get; set; }
    public virtual Polideportivo? Lugar { get; set; }
    public int? NumeroPista { get; set; }
    public string? NombrePabellon { get; set; }
    public string? Zona { get; set; }

    // Fecha y hora
    public DateTime? Fecha { get; set; }
    public TimeSpan? Hora { get; set; }
    public DateTime? FechaJornada { get; set; }
    public DateTime? FechaEstimada { get; set; }
    public string? FranjaHoraria { get; set; }
    public int Jornada { get; set; }
    public int NumeroPartido { get; set; }

    // Referencias
    public string? Ref { get; set; }
    public string? RefPartidoCalendario { get; set; }

    // Árbitros
    public Guid? Arbitro1Id { get; set; }
    public virtual Usuario? Arbitro1 { get; set; }

    public Guid? Arbitro2Id { get; set; }
    public virtual Usuario? Arbitro2 { get; set; }

    public Guid? AnotadorId { get; set; }
    public virtual Usuario? Anotador { get; set; }

    // Estado de árbitros
    public int EstadoArbitro1 { get; set; }
    public int EstadoArbitro2 { get; set; }
    public int EstadoAnotador { get; set; }
    public string? MotivoEstadoArbitro1 { get; set; }
    public string? MotivoEstadoArbitro2 { get; set; }
    public string? MotivoEstadoAnotador { get; set; }
    public DateTime? FechaRespuestaArbitro1Utc { get; set; }
    public DateTime? FechaRespuestaArbitro2Utc { get; set; }
    public DateTime? FechaRespuestaAnotadorUtc { get; set; }

    // IDs de árbitros confirmados (JSON array)
    public string? ConfirmedRefereeIds { get; set; }
    public bool DesignacionArbitralCompleta { get; set; }
    public bool ConfirmadaDesignacion { get; set; }

    // Estado de arbitraje
    public string? EstadoArbitraje { get; set; }
    public string? DatosArbitraje { get; set; }
    public string? EstadoHorario { get; set; }

    // Resultado y cierre
    public bool Cerrado { get; set; }
    public DateTime? FechaCierreUtc { get; set; }
    public int? ResultadoLocal { get; set; }
    public int? ResultadoVisitante { get; set; }
    public string? Resultado { get; set; }

    // Estadísticas (JSON)
    public string? Estadisticas { get; set; }

    // Comentarios
    public string? Comentarios { get; set; }

    // Reglas de juego (JSON)
    public string? ReglasJuego { get; set; }

    // Convocatorias (JSON de IDs o datos)
    public string? ConvocatoriaLocalPlayers { get; set; }
    public string? ConvocatoriaVisitantePlayers { get; set; }
    public string? ConvocatoriaLocalPeople { get; set; }
    public string? ConvocatoriaVisitantePeople { get; set; }

    // Foto acta
    public string? FotoActa { get; set; }

    // Clubes y equipos (cache texto)
    public string? Clubes { get; set; }
    public string? Equipos { get; set; }

    // Datos de grupo
    public int? NumEquiposEnGrupo { get; set; }
    public string? NombreGrupo { get; set; }
    public string? CachedSummary { get; set; }

    // Categoría (cache texto)
    public string? NombreCategoria { get; set; }
    public string? NombreGenero { get; set; }
    public string? NombreCategoriaPlaya { get; set; }
    public string? Deporte { get; set; }
    public string? NombreEnCalendario { get; set; }

    // Acta
    public virtual ActaPartido? Acta { get; set; }

    // Importación
    public long? ImportId { get; set; }
    public DateTime? FechaCreacion { get; set; }
    public DateTime? FechaDestruccion { get; set; }
}

