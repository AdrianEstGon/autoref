using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoRef_API.Database;
using AutoRef_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using AutoRef_API.Services;

namespace AutoRef_API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PartidosController : ControllerBase
    {
        private readonly AppDataBase _context;

        public PartidosController(AppDataBase context)
        {
            _context = context;
        }

        // GET: api/Partidos
        [Authorize(Roles = "Admin,Federacion,ComiteArbitros")]
        [HttpGet]
        public async Task<IActionResult> GetPartidos()
        {
            // Obtener la lista de partidos desde la base de datos
            var partidos = await _context.Partidos
                .Include(p => p.Lugar)  // Incluir los detalles del lugar (Polideportivo)
                .Include(p => p.EquipoLocal)  // Incluir detalles del equipo local
                .Include(p => p.EquipoVisitante)  // Incluir detalles del equipo visitante
                .Include(p => p.Categoria)  // Incluir detalles de la categoría
                .Include(p => p.Arbitro1)  // Incluir detalles del primer árbitro
                .Include(p => p.Arbitro2)  // Incluir detalles del segundo árbitro
                .Include(p => p.Anotador)  // Incluir detalles del anotador
                .ToListAsync();

            var partidoList = new List<object>();

            foreach (var partido in partidos)
            {
                partidoList.Add(new
                {
                    partido.Id,
                    EquipoLocal = partido.EquipoLocal?.Nombre,
                    partido.EquipoLocalId,               
                    EquipoVisitante = partido.EquipoVisitante?.Nombre,
                    partido.EquipoVisitanteId,
                    partido.Fecha,
                    partido.Hora,
                    Lugar = partido.Lugar?.Nombre,  
                    partido.LugarId,
                    Categoria = partido.Categoria?.Nombre,
                    partido.CategoriaId,
                    partido.CompeticionId,
                    partido.Jornada,
                    partido.NumeroPartido,
                    partido.Arbitro1Id,
                    partido.Arbitro2Id,
                    partido.AnotadorId,
                    partido.EstadoArbitro1,
                    partido.EstadoArbitro2,
                    partido.EstadoAnotador,
                });
            }

            return Ok(partidoList);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Partido>> GetPartido(Guid id)
        {
            var partido = await _context.Partidos
                .Include(p => p.Lugar)
                .Include(p => p.EquipoLocal)
                .Include(p => p.EquipoVisitante)
                .Include(p => p.Categoria)
                .Include(p => p.Arbitro1)
                .Include(p => p.Arbitro2)
                .Include(p => p.Anotador)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (partido == null)
            {
                return NotFound(new { message = "No se encontró el partido con el ID proporcionado." });
            }

            var resultado = new
            {
                partido.Id,
                partido.NumeroPartido,
                EquipoLocal = partido.EquipoLocal?.Nombre,
                partido.EquipoLocalId,
                EquipoVisitante = partido.EquipoVisitante?.Nombre,
                partido.EquipoVisitanteId,
                Fecha = partido.Fecha.ToString("yyyy-MM-dd"),
                Hora = partido.Hora,
                Lugar = partido.Lugar != null ? new
                {
                    Nombre = partido.Lugar.Nombre,
                    Latitud = partido.Lugar.Latitud,
                    Longitud = partido.Lugar.Longitud
                } : null,
                partido.LugarId,
                Categoria = partido.Categoria?.Nombre,
                partido.CategoriaId,
                partido.Jornada,
                Arbitro1 = partido.Arbitro1 != null ? $"{partido.Arbitro1.Nombre} {partido.Arbitro1.PrimerApellido} {partido.Arbitro1.SegundoApellido} " : null,
                Arbitro1Licencia = partido.Arbitro1?.Licencia,
                Arbitro2 = partido.Arbitro2 != null ? $"{partido.Arbitro2.Nombre} {partido.Arbitro2.PrimerApellido} {partido.Arbitro2.SegundoApellido}" : null,
                Arbitro2Licencia = partido.Arbitro2?.Licencia,
                Anotador = partido.Anotador != null ? $"{partido.Anotador.Nombre} {partido.Anotador.PrimerApellido} {partido.Anotador.SegundoApellido}" : null,
                AnotadorLicencia = partido.Anotador?.Licencia,
                partido.EstadoArbitro1,
                partido.EstadoArbitro2,
                partido.EstadoAnotador,
            };

            return Ok(resultado);
        }

        [HttpGet("Usuario/{userId}")]
        public async Task<IActionResult> GetPartidosByUserId(Guid userId)
        {
            var partidos = await _context.Partidos
                .Include(p => p.Lugar)
                .Include(p => p.EquipoLocal)
                .Include(p => p.EquipoVisitante)
                .Include(p => p.Categoria)
                .Include(p => p.Arbitro1)
                .Include(p => p.Arbitro2)
                .Include(p => p.Anotador)
                .Where(p => p.Arbitro1Id == userId || p.Arbitro2Id == userId || p.AnotadorId == userId)
                .ToListAsync();

            if (partidos == null || partidos.Count == 0)
            {
                return Ok(new { message = "No hay partidos designados para este usuario." });
            }

            var resultado = partidos.Select(partido => new
            {
                partido.Id,
                EquipoLocal = partido.EquipoLocal?.Nombre,
                partido.EquipoLocalId,
                EquipoVisitante = partido.EquipoVisitante?.Nombre,
                partido.EquipoVisitanteId,
                partido.Fecha,
                partido.Hora,
                Lugar = partido.Lugar?.Nombre,
                partido.LugarId,
                Categoria = partido.Categoria?.Nombre,
                partido.CategoriaId,
                partido.Jornada,
                partido.NumeroPartido,
                Arbitro1 = partido.Arbitro1 != null ? $"{partido.Arbitro1.Nombre} {partido.Arbitro1.PrimerApellido} {partido.Arbitro1.SegundoApellido}" : null,
                Arbitro2 = partido.Arbitro2 != null ? $"{partido.Arbitro2.Nombre} {partido.Arbitro2.PrimerApellido} {partido.Arbitro2.SegundoApellido}" : null,
                Anotador = partido.Anotador != null ? $"{partido.Anotador.Nombre} {partido.Anotador.PrimerApellido} {partido.Anotador.SegundoApellido}" : null,
                partido.Arbitro1Id,
                partido.Arbitro2Id,
                partido.AnotadorId,
                partido.EstadoArbitro1,
                partido.EstadoArbitro2,
                partido.EstadoAnotador,
            });

            return Ok(resultado);
        }
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Federacion,ComiteArbitros")]
        public async Task<IActionResult> UpdatePartido(Guid id, [FromBody] UpdatePartidoModel partidoModel)
        {
            if (id != partidoModel.Id)
                return BadRequest(new { message = "El ID del partido no coincide." });

            var partido = await _context.Partidos
                .FirstOrDefaultAsync(p => p.Id == id);

            if (partido == null)
                return NotFound(new { message = "El partido no existe." });

            var datosOriginales = new
            {
                partido.EquipoLocalId,
                partido.EquipoVisitanteId,
                partido.Fecha,
                partido.Hora,
                partido.LugarId,
                partido.CategoriaId,
                partido.Jornada,
                partido.NumeroPartido
            };

            partido.EquipoLocalId = partidoModel.EquipoLocalId;
            partido.EquipoVisitanteId = partidoModel.EquipoVisitanteId;
            partido.Fecha = partidoModel.Fecha;
            partido.Hora = TimeSpan.Parse(partidoModel.Hora);
            partido.LugarId = partidoModel.LugarId;
            partido.CategoriaId = partidoModel.CategoriaId;
            partido.CompeticionId = partidoModel.CompeticionId;
            partido.Jornada = partidoModel.Jornada;
            partido.NumeroPartido = partidoModel.NumeroPartido;
            partido.Arbitro1Id = partidoModel.Arbitro1Id;
            partido.Arbitro2Id = partidoModel.Arbitro2Id;
            partido.AnotadorId = partidoModel.AnotadorId;
            partido.EstadoArbitro1 = partidoModel.EstadoArbitro1;
            partido.EstadoArbitro2 = partidoModel.EstadoArbitro2;
            partido.EstadoAnotador = partidoModel.EstadoAnotador;

            bool datosPartidoModificados =
                datosOriginales.EquipoLocalId != partido.EquipoLocalId ||
                datosOriginales.EquipoVisitanteId != partido.EquipoVisitanteId ||
                datosOriginales.Fecha != partido.Fecha ||
                datosOriginales.Hora != partido.Hora ||
                datosOriginales.LugarId != partido.LugarId ||
                datosOriginales.CategoriaId != partido.CategoriaId ||
                datosOriginales.Jornada != partido.Jornada ||
                datosOriginales.NumeroPartido != partido.NumeroPartido;

            await _context.SaveChangesAsync();

            if (datosPartidoModificados)
            {
                partido = await _context.Partidos
                    .Include(p => p.Lugar)
                    .Include(p => p.Categoria)
                    .Include(p => p.EquipoLocal)
                    .Include(p => p.EquipoVisitante)
                    .Include(p => p.Arbitro1)
                    .Include(p => p.Arbitro2)
                    .Include(p => p.Anotador)
                    .FirstOrDefaultAsync(p => p.Id == id);

                async Task NotificarCambio(Usuario usuario, Partido partido)
                {
                    if (usuario?.Email != null)
                    {
                        string GetNombreCompleto(Usuario? u) =>
                            u == null ? "Sin definir" : $"{u.Nombre} {u.PrimerApellido} {u.SegundoApellido}";

                        string mensajeCorreo =
                            "El siguiente partido que tienes designado ha sido modificado:\n\n" +
                            $"- Fecha: {partido.Fecha:yyyy-MM-dd}\n" +
                            $"- Hora: {partido.Hora}\n" +
                            $"- Lugar: {partido.Lugar?.Nombre ?? "Sin definir"}\n" +
                            $"- Categoría: {partido.Categoria?.Nombre ?? "Sin definir"}\n" +
                            $"- Jornada: {partido.Jornada}\n" +
                            $"- Nº de Partido: {partido.NumeroPartido}\n" +
                            $"- Equipo Local: {partido.EquipoLocal?.Nombre ?? "Sin definir"}\n" +
                            $"- Equipo Visitante: {partido.EquipoVisitante?.Nombre ?? "Sin definir"}\n" +
                            $"- Árbitro 1: {GetNombreCompleto(partido.Arbitro1)}\n" +
                            $"- Árbitro 2: {GetNombreCompleto(partido.Arbitro2)}\n" +
                            $"- Anotador: {GetNombreCompleto(partido.Anotador)}\n\n" +
                            "Revisa tus designaciones para más información.";

                        var mailService = new MailService();
                        await mailService.SendEmailAsync(
                            usuario.Email,
                            "Modificación en un partido asignado",
                            $"Hola {usuario.Nombre},\n\n{mensajeCorreo}\n\nGracias."
                        );

                        string mensajeNotificacion = $"El partido que se disputa en la fecha {partido.Fecha:yyyy-MM-dd} a las {partido.Hora} entre los equipos {partido.EquipoLocal?.Nombre ?? "Sin definir"} y {partido.EquipoVisitante?.Nombre ?? "Sin definir"} de la categoría {partido.Categoria?.Nombre ?? "Sin definir"} ha sido modificado. Revisa tus designaciones para más información.";

                        var notificacion = new Notificacion
                        {
                            UsuarioId = usuario.Id,
                            Mensaje = mensajeNotificacion,
                            Fecha = partido.Fecha,
                            Leida = false
                        };

                        _context.Notificaciones.Add(notificacion);
                        await _context.SaveChangesAsync();
                    }
                }

                await NotificarCambio(partido.Arbitro1, partido);
                await NotificarCambio(partido.Arbitro2, partido);
                await NotificarCambio(partido.Anotador, partido);
            }

            return Ok(new { message = "Partido actualizado con éxito." });
        }






        [HttpPost("crearPartido")]
        [Authorize(Roles = "Admin,Federacion,ComiteArbitros")]
        public async Task<IActionResult> CrearPartido([FromBody] PartidoModel partidoModel)
        {
            if (partidoModel == null)
            {
                return BadRequest(new { message = "Los datos del partido no son válidos" });
            }

            // Convertir la fecha recibida (string) en un objeto DateTime
            DateTime fechaPartido = DateTime.Parse(partidoModel.Fecha.ToString("yyyy-MM-dd"));

            // Convertir la hora recibida (string) en un objeto TimeSpan
            TimeSpan horaPartido = TimeSpan.Parse(partidoModel.Hora);

            // Combinar la fecha y la hora en un único DateTime
            DateTime fechaHoraPartido = fechaPartido.Add(horaPartido);

            // Crear el partido con los valores correctos
            var partido = new Partido
            {
                CompeticionId = partidoModel.CompeticionId,
                LugarId = partidoModel.LugarId,
                Arbitro1Id = null,  
                Arbitro2Id = null,  
                AnotadorId = null,  
                Fecha = fechaHoraPartido,  
                Hora = horaPartido, 
                EquipoLocalId = partidoModel.EquipoLocalId,
                EquipoVisitanteId = partidoModel.EquipoVisitanteId,
                CategoriaId = partidoModel.CategoriaId,
                Jornada = partidoModel.Jornada,
                NumeroPartido = partidoModel.NumeroPartido,
                EstadoArbitro1 = 0, // Estado inicial del árbitro 1
                EstadoArbitro2 = 0, // Estado inicial del árbitro 2
                EstadoAnotador = 0, // Estado inicial del anotador
            };

            // Guardar el partido en la base de datos
            _context.Partidos.Add(partido);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Partido creado con éxito", partido });
        }

        // DELETE: api/Partidos/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Federacion,ComiteArbitros")]
        public async Task<IActionResult> DeletePartido(Guid id)
        {
            var partido = await _context.Partidos
            .Include(p => p.Arbitro1)
            .Include(p => p.Arbitro2)
            .Include(p => p.Anotador)
            .Include(p => p.EquipoLocal)
            .Include(p => p.EquipoVisitante)
            .Include(p => p.Categoria)
            .Include(p => p.Lugar)
            .FirstOrDefaultAsync(p => p.Id == id);

            if (partido == null)
            {
                return NotFound(new { message = "El partido no existe." });
            }

            // Notificar a los usuarios asignados
            if (partido.Arbitro1 != null) await NotificarCancelacion(partido.Arbitro1, partido);
            if (partido.Arbitro2 != null) await NotificarCancelacion(partido.Arbitro2, partido);
            if (partido.Anotador != null) await NotificarCancelacion(partido.Anotador, partido);

            // Eliminar el partido
            _context.Partidos.Remove(partido);
            await _context.SaveChangesAsync();


            return Ok(new { message = "Partido eliminado con éxito." });
        }

        async Task NotificarCancelacion(Usuario usuario, Partido partido)
        {
            if (usuario?.Email != null)
            {
                string mensajeCorreo = $@"Te informamos que el siguiente partido al que estabas asignado ha sido cancelado:

- Fecha: {partido.Fecha:yyyy-MM-dd}
- Hora: {partido.Hora}
- Lugar: {partido.Lugar?.Nombre ?? "Sin definir"}
- Categoría: {partido.Categoria?.Nombre ?? "Sin definir"}
- Equipo Local: {partido.EquipoLocal?.Nombre ?? "Sin definir"}
- Equipo Visitante: {partido.EquipoVisitante?.Nombre ?? "Sin definir"}

Lamentamos las molestias.";

                // Enviar correo
                var mailService = new MailService();
                await mailService.SendEmailAsync(
                    usuario.Email,
                    "Cancelación de partido asignado",
                    $"Hola {usuario.Nombre},\n\n{mensajeCorreo}\n\nGracias."
                );

                // Crear notificación en la base de datos
                string mensajeNotificacion = $"El partido que se disputaba en la fecha {partido.Fecha:yyyy-MM-dd} a las {partido.Hora} entre los equipos {partido.EquipoLocal?.Nombre ?? "Sin definir"} y {partido.EquipoVisitante?.Nombre ?? "Sin definir"} de la categoría {partido.Categoria?.Nombre ?? "Sin definir"} ha sido cancelado. Revisa tus designaciones.";

                var notificacion = new Notificacion
                {
                    UsuarioId = usuario.Id,
                    Mensaje = mensajeNotificacion,
                    Fecha = partido.Fecha,
                    Leida = false
                };

                _context.Notificaciones.Add(notificacion);
                await _context.SaveChangesAsync();
            }
        }

        public class UpdateEstadoDesignacionModel
        {
            public int Estado { get; set; }
        }

        /// <summary>
        /// Actualiza el estado de aceptación/rechazo del usuario autenticado sobre su rol en el partido (Árbitro 1/2 o Anotador).
        /// </summary>
        [HttpPut("{id:guid}/estado")]
        [Authorize(Roles = "Arbitro,Admin,Federacion,ComiteArbitros")]
        public async Task<IActionResult> UpdateEstadoDesignacion(Guid id, [FromBody] UpdateEstadoDesignacionModel model)
        {
            if (model == null) return BadRequest(new { message = "Datos inválidos" });
            if (model.Estado < 0 || model.Estado > 2) return BadRequest(new { message = "Estado inválido" });

            var partido = await _context.Partidos.FirstOrDefaultAsync(p => p.Id == id);
            if (partido == null) return NotFound(new { message = "El partido no existe." });

            var userIdString = User?.Claims?.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

            var isAdminLike = User.IsInRole("Admin") || User.IsInRole("Federacion") || User.IsInRole("ComiteArbitros");

            if (isAdminLike)
            {
                // Por defecto, en modo admin-like se actualiza el estado del rol que corresponda al usuario si está asignado.
                // Si no está asignado a ningún rol, no permitimos cambiar estados (evita cambios arbitrarios).
                if (partido.Arbitro1Id == userId) partido.EstadoArbitro1 = model.Estado;
                else if (partido.Arbitro2Id == userId) partido.EstadoArbitro2 = model.Estado;
                else if (partido.AnotadorId == userId) partido.EstadoAnotador = model.Estado;
                else return BadRequest(new { message = "El usuario no está asignado a este partido." });
            }
            else
            {
                // Árbitro: solo puede actualizar su propio estado
                if (partido.Arbitro1Id == userId) partido.EstadoArbitro1 = model.Estado;
                else if (partido.Arbitro2Id == userId) partido.EstadoArbitro2 = model.Estado;
                else if (partido.AnotadorId == userId) partido.EstadoAnotador = model.Estado;
                else return BadRequest(new { message = "El usuario no está asignado a este partido." });
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Estado actualizado con éxito." });
        }







    }
}

