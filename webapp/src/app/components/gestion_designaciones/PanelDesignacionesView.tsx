import React, { useState, useEffect, JSX, useMemo } from "react";
import { 
  Typography, Grid, Card, CardContent, TextField, Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Box,
  Chip,
  Popover,
  Avatar
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import Autocomplete from "@mui/material/Autocomplete";
import SportsVolleyballIcon from "@mui/icons-material/SportsVolleyball";
import SportsIcon from "@mui/icons-material/Sports";
import moment, { Moment } from "moment";
import "moment/locale/es";
import partidosService from "../../services/PartidoService";
import usuariosService from "../../services/UserService";
import categoriaService from "../../services/CategoriaService";
import polideportivoService from "../../services/PolideportivoService";
import disponibilidadService from "../../services/DisponibilidadService";
import equipoService from "../../services/EquipoService";
import competicionService from "../../services/CompeticionService";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { toast } from "react-toastify";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import { AsignadorArbitros } from "../../components/gestion_designaciones/AsignadorArbitros";
import { AccessTime, AutoFixHigh, Cancel, CheckCircle, Info, Comment as CommentIcon, ChatBubbleOutline } from "@mui/icons-material";
import { CircularProgress } from '@mui/material';

moment.locale("es");

const DesignacionesView = () => {
  const [partidos, setPartidos] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [lugares, setLugares] = useState<any[]>([]);
  const [equipos, setEquipos] = useState<any[]>([]);
  const [competiciones, setCompeticiones] = useState<any[]>([]);
  const [designaciones, setDesignaciones] = useState<Record<string, Designacion>>({});
  const [disponibilidades, setDisponibilidades] = useState<any[]>([]);

  // Estados de filtros
  const [fechaInicio, setFechaInicio] = useState<Moment | null>(moment()); // Hoy
  const [fechaFin, setFechaFin] = useState<Moment | null>(moment().add(7, "days")); // +7 días
  const [categoriaFiltro, setCategoriaFiltro] = useState<any | null>(null);
  const [lugarFiltro, setLugarFiltro] = useState<any | null>(null);
  const [competicionFiltro, setCompeticionFiltro] = useState<any | null>(null);

  // Filtros de árbitros (nivel / localidad)
  const [nivelFiltro, setNivelFiltro] = useState<string | null>(null);
  const [ciudadFiltro, setCiudadFiltro] = useState<string | null>(null);
  const [partidosFiltrados, setPartidosFiltrados] = useState<any[]>([]);
  const [partidosSeleccionados, setPartidosSeleccionados] = useState<Set<string>>(new Set());
  
  const [asignando, setAsignando] = useState(false);

  const [popoverAnchorEl, setPopoverAnchorEl] = useState<null | HTMLElement>(null);
  const [comentario, setComentario] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  
  // Estados para designación masiva
  const [openMassivaDialog, setOpenMassivaDialog] = useState(false);
  const [fechaInicioMasiva, setFechaInicioMasiva] = useState<Moment | null>(moment());
  const [fechaFinMasiva, setFechaFinMasiva] = useState<Moment | null>(moment().add(7, "days"));
  const [diasSemanaSeleccionados, setDiasSemanaSeleccionados] = useState<number[]>([]);
  const [arbitro1Masivo, setArbitro1Masivo] = useState<any>(null);
  const [arbitro2Masivo, setArbitro2Masivo] = useState<any>(null);
  const [anotadorMasivo, setAnotadorMasivo] = useState<any>(null);

  type Designacion = {
    arbitro1?: { nombre: string; icono: JSX.Element };
    arbitro2?: { nombre: string; icono: JSX.Element };
    anotador?: { nombre: string; icono: JSX.Element };
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [
          partidosLista,
          usuariosLista,
          categoriasLista,
          lugaresLista,
          disponibilidadesLista,
          equiposLista,
          competicionesLista,
        ] = await Promise.all([
          partidosService.getPartidos(),
          usuariosService.getUsuarios(),
          categoriaService.getCategorias(),
          polideportivoService.getPolideportivos(),
          disponibilidadService.getDisponibilidades(),
          equipoService.getEquipos(),
          competicionService.getCompeticiones(),
        ]);
  
        setPartidos(partidosLista);
        setUsuarios(usuariosLista);
        setCompeticiones(competicionesLista || []);
        setCategorias(categoriasLista.sort((a: { nombre: string; }, 
          b: { nombre: string; }) => a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase()))); // Ordenar categorías alfabéticamente
        setLugares(lugaresLista.sort((a: { nombre: string; }, 
          b: { nombre: string; }) => a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase()))); // Ordenar polideportivos alfabéticamente
        setDisponibilidades(disponibilidadesLista);
        setEquipos(equiposLista); 
  
        const disponibilidadMap = new Map();
        disponibilidadesLista.forEach((disp: { usuarioId: any; }) => {
          disponibilidadMap.set(disp.usuarioId, disp);
        });
  
        // Procesar designaciones con información visual de los árbitros
        const designacionesCargadas: Record<string | number, Designacion> = {};
        partidosLista.forEach((partido: {
          hora: any; arbitro1Id: any; arbitro2Id: any; anotadorId: any; fecha: moment.MomentInput; id: string | number; 
}) => {
          const arbitro1 = usuariosLista.find((user: { id: any; }) => user.id === partido.arbitro1Id);
          const arbitro2 = usuariosLista.find((user: { id: any; }) => user.id === partido.arbitro2Id);
          const anotador = usuariosLista.find((user: { id: any; }) => user.id === partido.anotadorId);
          
          const obtenerIcono = (usuarioId: string, fechaHora: string) => {
            // Convierte la fechaHora (que es una cadena de texto) a un objeto moment.
            const fechaHoraMoment = moment(fechaHora, "YYYY-MM-DD HH:mm:ss");
          
            // Buscar la disponibilidad correspondiente al usuario y la fecha
            const disponibilidad = disponibilidadesLista.find(
              (disp: { usuarioId: string; fecha: string }) =>
                disp.usuarioId === usuarioId && moment(disp.fecha).isSame(fechaHoraMoment, "day")
            );
          
            if (!disponibilidad) return null;
          
            // Extraer la hora de fechaHoraMoment y pasarla como una cadena a obtenerFranja
            const horaStr = fechaHoraMoment.format('HH:mm:ss');
            
            // Obtener la franja horaria de la fechaHora (ahora es un objeto moment)
            const franja = obtenerFranja(horaStr);
            
            if (!franja || !(franja in disponibilidad)) return null;
          
            // Devolver los iconos correspondientes a la disponibilidad
            if (disponibilidad[franja] === 1) {
              return <DirectionsCarIcon style={{ color: "blue", marginRight: 5 }} />;
            } else if (disponibilidad[franja] === 2) {
              return <DirectionsWalkIcon style={{ color: "green", marginRight: 5 }} />;
            }
          
            return null;
          };
          
          
          designacionesCargadas[partido.id] = {
            arbitro1: arbitro1 ? (() => {
              const fechaHoraPartido = `${partido.fecha} ${partido.hora}`;
              const icono = obtenerIcono(arbitro1.id, fechaHoraPartido);

              return {
                ...arbitro1,
                icono,
                label: (
                  <>
                    {icono}
                    {arbitro1.nombre} {arbitro1.primerApellido} {arbitro1.segundoApellido}
                  </>
                )
              };
            })() : null,
            arbitro2: arbitro2 ? (() => {
              const fechaHoraPartido = `${partido.fecha} ${partido.hora}`;
              const icono = obtenerIcono(arbitro2.id, fechaHoraPartido);
              return {
                ...arbitro2,
                icono,
                label: (
                  <>
                    {icono}
                    {arbitro2.nombre} {arbitro2.primerApellido} {arbitro2.segundoApellido}
                  </>
                )
              };
            })() : null,
            anotador: anotador ? (() => {
              const fechaHoraPartido = `${partido.fecha} ${partido.hora}`;
              const icono = obtenerIcono(anotador.id, fechaHoraPartido);

              return {
                ...anotador,
                icono,
                label: (
                  <>
                    {icono}
                    {anotador.nombre} {anotador.primerApellido} {anotador.segundoApellido}
                  </>
                )
              };
            })() : null
          };
        });
        setDesignaciones(designacionesCargadas);
  
        // Filtrar automáticamente con las fechas establecidas
        const partidosFiltradosIniciales = partidosLista
        .filter((partido: { fecha: moment.MomentInput }) => {
          const fechaPartido = moment(partido.fecha);
          return fechaPartido.isBetween(moment(), moment().add(7, "days"), "day", "[]");
        })
        .sort((a: { lugar: string; fecha: moment.MomentInput; }, b: { lugar: string; fecha: moment.MomentInput; }) => {
          const lugarA = a.lugar.toLowerCase();
          const lugarB = b.lugar.toLowerCase();

          if (lugarA < lugarB) return -1;
          if (lugarA > lugarB) return 1;

          return moment(a.fecha).diff(moment(b.fecha));
        });

      setPartidosFiltrados(partidosFiltradosIniciales);
      setPartidosSeleccionados(new Set());
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        toast.error("Error al cargar los datos");
      }
    };
  
    cargarDatos();
  }, [fechaInicio, fechaFin]);  
  
  // Función que maneja la apertura del popover
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, comentario: string) => {
    setComentario(comentario);
    setPopoverAnchorEl(event.currentTarget);
  };

  // Función que maneja el cierre del popover
  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
    setComentario(null);
  };

  const aplicarFiltro = () => {
    let filtrados = partidos.filter((partido) => {
      const fechaPartido = moment(partido.fecha);
      return (
        fechaPartido.isBetween(fechaInicio, fechaFin, "day", "[]") &&
        (!categoriaFiltro || partido.categoria === categoriaFiltro.nombre) &&
        (!lugarFiltro || partido.lugar === lugarFiltro.nombre) &&
        (!competicionFiltro || String(partido.competicionId || "") === String(competicionFiltro.id || ""))
      );
    });
  
    // Ordenar primero por lugar (alfabéticamente), luego por fecha y hora
    filtrados.sort((a, b) => {
      const lugarA = a.lugar.toLowerCase();
      const lugarB = b.lugar.toLowerCase();
  
      if (lugarA < lugarB) return -1;
      if (lugarA > lugarB) return 1;
  
      // Si el lugar es el mismo, ordenar por fecha/hora
      return moment(a.fecha).diff(moment(b.fecha));
    });
  
    setPartidosFiltrados(filtrados);
  };
  

  const obtenerArbitrosDisponibles = (fecha: string, hora: string) => {
    const fechaStr = moment(fecha).format("YYYY-MM-DD");
    const franja = obtenerFranja(hora);
  
    let usuariosBase = usuarios;
    if (nivelFiltro) {
      usuariosBase = usuariosBase.filter((u) => String(u.nivel || "") === String(nivelFiltro));
    }
    if (ciudadFiltro) {
      usuariosBase = usuariosBase.filter((u) => String(u.ciudad || "") === String(ciudadFiltro));
    }

    return usuariosBase
      .map((usuario) => {
        const disp = mapDisponibilidades.get(`${usuario.id}_${fechaStr}`);
        if (!disp || (disp[franja] !== 1 && disp[franja] !== 2)) return null;
  
        const icono = disp[franja] === 1
          ? <DirectionsCarIcon style={{ color: "blue", marginRight: 5 }} />
          : <DirectionsWalkIcon style={{ color: "green", marginRight: 5 }} />;
  
        return {
          ...usuario,
          icono,
          label: (
            <>
              {icono}
              {usuario.nombre} {usuario.primerApellido} {usuario.segundoApellido}
            </>
          )
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        const nombreA = `${a.nombre} ${a.primerApellido} ${a.segundoApellido}`;
        const nombreB = `${b.nombre} ${b.primerApellido} ${b.segundoApellido}`;
        return nombreA.localeCompare(nombreB);
      });
  };

  const niveles = useMemo(() => {
    return Array.from(new Set((usuarios || []).map((u: any) => u.nivel).filter(Boolean))).sort();
  }, [usuarios]);

  const ciudades = useMemo(() => {
    return Array.from(new Set((usuarios || []).map((u: any) => u.ciudad).filter(Boolean))).sort();
  }, [usuarios]);
  
  const mapDisponibilidades = useMemo(() => {
    const map = new Map<string, Record<string, any>>();
    disponibilidades.forEach((disp) => {
      const fecha = moment(disp.fecha).format("YYYY-MM-DD");
      const key = `${disp.usuarioId}_${fecha}`;
      map.set(key, disp);
    });
    return map;
  }, [disponibilidades]);
  
  const obtenerFranja = (horaStr: string) => {
    // Convertir la horaStr (cadena) a un objeto moment
    const horaMoment = moment(horaStr, 'HH:mm:ss');
    
    // Obtener la hora de ese objeto moment
    const hora = horaMoment.hour();
  
    // Determinar en qué franja horaria cae la hora
    if (hora >= 9 && hora < 12) return 'franja1';
    if (hora >= 12 && hora < 15) return 'franja2';
    if (hora >= 15 && hora < 18) return 'franja3';
    if (hora >= 18 && hora < 21) return 'franja4';

    return '';
  };
  
  const renderComentario = (
    partido: { id: string | number; fecha: any; hora: any; },
    arbitro: string | number,
    handlePopoverOpen: (event: React.MouseEvent<HTMLElement>, comentario: string) => void
  ) => {
    const seleccionado = designaciones[partido.id]?.[arbitro as keyof Designacion];
    if (!seleccionado || seleccionado.nombre === "Incompleto") return null;

    const fechaHoraPartido = moment(`${partido.fecha} ${partido.hora}`, "YYYY-MM-DD HH:mm:ss");
    const disponibilidad = disponibilidades.find(
      (disp) =>
        disp.usuarioId === (seleccionado as any)?.id &&
        moment(disp.fecha).isSame(fechaHoraPartido, "day") &&
        disp.comentarios?.trim() !== ""
    );

    if (!disponibilidad) return null;

    return (
      <Box mt={1} display="flex" alignItems="center" gap={1}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item>
            <Chip
              label="Comentario disponible"
              color="primary"
              size="small"
              icon={<ChatBubbleOutline />}
              onClick={(e) => handlePopoverOpen(e, disponibilidad.comentarios)}
            />
          </Grid>
          <Grid item xs>
            <Typography variant="body2" align="left" sx={{ paddingLeft: 1 }}>
              {/* Aquí podrías agregar más contenido si lo necesitas */}
            </Typography>
          </Grid>
        </Grid>
    
        <Popover
          open={Boolean(popoverAnchorEl)}
          anchorEl={popoverAnchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          PaperProps={{
            sx: {
              backgroundColor: '#ffffff', 
              mt: 1,
              borderRadius: 4,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', 
              padding: 2,
              maxWidth: 400,
              minWidth: 250,
              color: '#333333', 
              fontFamily: 'Arial, sans-serif',
              fontSize: '0.875rem',
              lineHeight: 1.5,
              wordWrap: 'break-word',
              wordBreak: 'break-word',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
          }}
        >
          <Box sx={{ padding: 2 }}>
            <Typography variant="body2" align="center">{comentario}</Typography>
          </Box>
        </Popover>
      </Box>
    );
  }    
  
  const renderAutocomplete = (
    partido: any,
    tipo: string,
    arbitro: "arbitro1" | "arbitro2" | "anotador"
  ) => {
    const arbitrosDisponibles = obtenerArbitrosDisponibles(partido.fecha, partido.hora);

    const arbitrosAsignados = Object.keys(designaciones[partido.id] || {}).map(
      (key) => designaciones[partido.id]?.[key as keyof Designacion]?.nombre
    );

    const arbitrosDisponiblesFiltrados = arbitrosDisponibles.filter(
      (usuario) => !arbitrosAsignados.includes(usuario.nombre)
    );

    const seleccionado = designaciones[partido.id]?.[arbitro];

    let estado: number = 0;
    if (arbitro === "arbitro1") estado = partido.estadoArbitro1;
    if (arbitro === "arbitro2") estado = partido.estadoArbitro2;
    if (arbitro === "anotador") estado = partido.estadoAnotador;

    const estadoTexto = {
      0: "Pendiente",
      1: "Aceptada",
      2: "Rechazada"
    }[estado];

    const estadoColor = {
      0: "warning",
      1: "success",
      2: "error"
    }[estado];

    const estadoIcono = {
      0: <AccessTime fontSize="small" />,
      1: <CheckCircle fontSize="small" />,
      2: <Cancel fontSize="small" />
    }[estado];

    return (
      <Box>
        <Autocomplete
          options={arbitrosDisponiblesFiltrados}
          getOptionLabel={(option) => {
            if (option.nombre === "Incompleto") return "Incompleto";
            return `${option.nombre} ${option.primerApellido ?? ""} ${option.segundoApellido ?? ""}`.trim();
          }}
          
          value={designaciones[partido.id]?.[arbitro] ?? null}
          onChange={(_, newValue) => setDesignaciones({
            ...designaciones,
            [partido.id]: {
              ...designaciones[partido.id],
              [arbitro]: newValue,
            }
          })}
          noOptionsText="No hay árbitros disponibles"
          renderOption={(props, option) => {
            const { key, ...restProps } = props;
            return (
              <li key={key} {...restProps}>
                {option.icono}
                {option.nombre === "Incompleto"
                  ? " Incompleto"
                  : ` ${option.nombre} ${option.primerApellido ?? ""} ${option.segundoApellido ?? ""}`}
              </li>
            );
          }}
          renderInput={(params) => {
            const selectedUser = designaciones[partido.id]?.[arbitro];
            return (
              <TextField
                {...params}
                label={tipo}
                fullWidth
                data-testid={`autocomplete-${arbitro}-${partido.id}`} 
                InputProps={{
                  ...params.InputProps,
                  startAdornment: selectedUser ? (
                    <>{selectedUser.icono}</>
                  ) : null,
                }}
              />
            );
          }}
        />

        {/* Estado visual debajo del autocomplete con ícono */}
        {seleccionado && seleccionado.nombre !== "Incompleto" && (
          <Box mt={1} display="flex" alignItems="center" gap={1}>
            <Chip
              label={`Estado: ${estadoTexto}`}
              color={estadoColor as 'success'|'warning'|'error'}
              size="small"
              variant="outlined"
              icon={estadoIcono}
            />
          </Box>
        )}

        {/* Mostrar comentario usando renderComentario */}
        {renderComentario(partido, arbitro, handlePopoverOpen)}

      </Box>
    );
  };


  const publicarDesignaciones = async () => {
    setOpenDialog(true); // Abrir el diálogo de confirmación
  };

  const abrirDesignacionMasiva = () => {
    setOpenMassivaDialog(true);
  };

  const cerrarDesignacionMasiva = () => {
    setOpenMassivaDialog(false);
    setDiasSemanaSeleccionados([]);
    setArbitro1Masivo(null);
    setArbitro2Masivo(null);
    setAnotadorMasivo(null);
  };

  const toggleDiaSemana = (dia: number) => {
    setDiasSemanaSeleccionados(prev => 
      prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]
    );
  };

  const aplicarDesignacionMasiva = () => {
    if (!fechaInicioMasiva || !fechaFinMasiva) {
      toast.error("Selecciona un rango de fechas válido");
      return;
    }

    if (!arbitro1Masivo && !arbitro2Masivo && !anotadorMasivo) {
      toast.error("Selecciona al menos un árbitro o anotador");
      return;
    }

    // Filtrar partidos por rango de fechas y días de la semana
    const partidosFiltradosMasivo = partidosFiltrados.filter(partido => {
      const fechaPartido = moment(partido.fecha);
      const dentroRango = fechaPartido.isBetween(fechaInicioMasiva, fechaFinMasiva, "day", "[]");
      
      // Si hay días de semana seleccionados, filtrar por ellos
      if (diasSemanaSeleccionados.length > 0) {
        const diaSemana = fechaPartido.day(); // 0=domingo, 1=lunes, ..., 6=sábado
        return dentroRango && diasSemanaSeleccionados.includes(diaSemana);
      }
      
      return dentroRango;
    });

    if (partidosFiltradosMasivo.length === 0) {
      toast.warn("No hay partidos que coincidan con los criterios seleccionados");
      return;
    }

    // Aplicar designaciones a los partidos filtrados
    const nuevasDesignaciones = { ...designaciones };
    partidosFiltradosMasivo.forEach(partido => {
      if (!nuevasDesignaciones[partido.id]) {
        nuevasDesignaciones[partido.id] = {};
      }
      
      if (arbitro1Masivo) {
        nuevasDesignaciones[partido.id].arbitro1 = {
          nombre: `${arbitro1Masivo.nombre} ${arbitro1Masivo.primerApellido}`,
          icono: arbitro1Masivo.icono || <PersonIcon />,
          id: arbitro1Masivo.id
        };
      }
      
      if (arbitro2Masivo) {
        nuevasDesignaciones[partido.id].arbitro2 = {
          nombre: `${arbitro2Masivo.nombre} ${arbitro2Masivo.primerApellido}`,
          icono: arbitro2Masivo.icono || <PersonIcon />,
          id: arbitro2Masivo.id
        };
      }
      
      if (anotadorMasivo) {
        nuevasDesignaciones[partido.id].anotador = {
          nombre: `${anotadorMasivo.nombre} ${anotadorMasivo.primerApellido}`,
          icono: anotadorMasivo.icono || <PersonIcon />,
          id: anotadorMasivo.id
        };
      }
    });

    setDesignaciones(nuevasDesignaciones);
    toast.success(`Designación aplicada a ${partidosFiltradosMasivo.length} partido(s)`);
    cerrarDesignacionMasiva();
  };

  const usuariosPorId = useMemo(() => {
    const map = new Map<string, any>();
    usuarios.forEach((u) => {
      map.set(u.id, u);
    });
    return map;
  }, [usuarios]);


  const handleConfirmar = async () => {
    try {
      // 5.5: solo publicar/asignar designaciones si el partido tiene fecha y hora
      const partidosConDesignacion = partidosFiltrados.filter((p) => !!designaciones[p.id]);
      const sinHorario = partidosConDesignacion.filter((p) => !p.fecha || !p.hora);
      if (sinHorario.length > 0) {
        toast.error("Hay partidos con designación pero sin fecha/hora. Fija el horario antes de publicar.");
        setOpenDialog(false);
        return;
      }

      await Promise.all(
        partidosFiltrados.map(async (partido) => {
        const designacion = designaciones[partido.id];
        if (!designacion) return;

        const { arbitro1, arbitro2, anotador } = designacion;

        const getUsuarioId = (usuario: any) =>
          usuario?.id && usuariosPorId.has(usuario.id)
            ? usuariosPorId.get(usuario.id)!.id
            : null;

        
        const estadoArbitro1 = 0;
        const estadoArbitro2 = 0;
        const estadoAnotador = 0;
  
        const arbitro1Id = getUsuarioId(arbitro1);
        const arbitro2Id = getUsuarioId(arbitro2);
        const anotadorId = getUsuarioId(anotador);
  
        // Actualizar los valores del partido
        const partidoActualizado = {
          ...partido,
          arbitro1Id,
          arbitro2Id,
          anotadorId,
          estadoArbitro1,
          estadoArbitro2,
          estadoAnotador,

        };
        // Actualizar el partido
        await partidosService.actualizarPartido(partidoActualizado);
        // Notificación: ahora se gestiona desde backend cuando cambia la asignación (evita duplicados).
  
        // **Actualizar el estado de la designación a "Pendiente" (0)**
        setDesignaciones((prevDesignaciones) => ({
          ...prevDesignaciones,
          [partido.id]: {
            ...(arbitro1 ? { arbitro1: { ...arbitro1, estado: 0 } } : { arbitro1: null }),
            ...(arbitro2 ? { arbitro2: { ...arbitro2, estado: 0 } } : { arbitro2: null }),
            ...(anotador ? { anotador: { ...anotador, estado: 0 } } : { anotador: null }),
          }
        }));

        // Actualizar el array de partidos con el nuevo estado
        setPartidos((prev) =>
          prev.map((p) => (p.id === partido.id ? partidoActualizado : p))
        );

        setPartidosFiltrados((prev) =>
          prev.map((p) => (p.id === partido.id ? partidoActualizado : p))
        );
      }));
  
      toast.success("Designaciones publicadas correctamente");
      setOpenDialog(false);
  
    } catch (error) {
      console.error("Error al publicar designaciones:", error);
      toast.error("Error al publicar designaciones");
      setOpenDialog(false);
    }
  };
  

  const handleCancelar = () => {
    setOpenDialog(false); 
  };

  const handleCheckboxChange = (partidoId: number) => {
    const newSelection = new Set(partidosSeleccionados);
    if (newSelection.has(partidoId.toString())) {
      newSelection.delete(partidoId.toString());
    } else {
      newSelection.add(partidoId.toString());
    }
    setPartidosSeleccionados(newSelection);
  };

   // Función para manejar la selección de todos los partidos
   const handleSeleccionarTodos = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.checked;
    if (selected) {
      // Seleccionar todos los partidos de la página actual
      const partidosIds = new Set(partidosFiltrados.map((partido) => partido.id));
      setPartidosSeleccionados(partidosIds);
    } else {
      // Desmarcar todos
      setPartidosSeleccionados(new Set());
    }
  };


  const asignarArbitrosAutomaticamente = () => {
    setAsignando(true); // Comienza el loading
    setTimeout(() => {
      const partidosAAsignar = partidosFiltrados.filter(partido =>
        partidosSeleccionados.has(partido.id)
      );
  
      if (partidosAAsignar.length === 0) {
        toast.warn("No se ha seleccionado ningún partido para asignar.");
        setAsignando(false);
        return;
      }

      const sinHorario = partidosAAsignar.filter((p) => !p.fecha || !p.hora);
      if (sinHorario.length > 0) {
        toast.error("Hay partidos seleccionados sin fecha/hora. Primero fija el horario del partido y vuelve a intentar.");
        setAsignando(false);
        return;
      }
  
      const designacionesFiltradas = Object.fromEntries(
        Object.entries(designaciones).filter(([partidoId]) =>
          partidosSeleccionados.has(partidoId.toString())
        )
      );
  
      const tieneArbitrosAsignados = Object.values(designacionesFiltradas).some(designacion =>
        designacion.arbitro1 || designacion.arbitro2 || designacion.anotador
      );
  
      if (tieneArbitrosAsignados) {
        toast.warn("No se pueden asignar árbitros a partidos que ya tienen designaciones.");
        setAsignando(false);
        return;
      }

      // Aplicar filtros de árbitros (nivel/ciudad) también al auto-asignador
      let usuariosBase = usuarios;
      if (nivelFiltro) usuariosBase = usuariosBase.filter((u) => String(u.nivel || "") === String(nivelFiltro));
      if (ciudadFiltro) usuariosBase = usuariosBase.filter((u) => String(u.ciudad || "") === String(ciudadFiltro));
  
      const asignador = new AsignadorArbitros(
        usuariosBase,
        disponibilidades,
        designacionesFiltradas,
        partidosAAsignar,
        categorias,
        lugares,
        equipos
      );
  
      const nuevasDesignaciones = asignador.asignarArbitros();
  
      if (nuevasDesignaciones) {
        setDesignaciones({ ...designaciones, ...nuevasDesignaciones });
      }
  
      setAsignando(false); // Finaliza el loading
    }, 300); 
  };
  
  

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #4A90E2 0%, #2C5F8D 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SportsIcon sx={{ color: "white", fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={700} sx={{ color: "#1e293b" }}>
                Panel de Designaciones
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Asigna árbitros a los partidos
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2, mb: 4 }}>
          <Card sx={{ background: "linear-gradient(135deg, #4A90E2 0%, #2C5F8D 100%)", color: "white" }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 48, height: 48 }}>
                <SportsVolleyballIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={700}>{partidosFiltrados.length}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Partidos filtrados</Typography>
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ background: "linear-gradient(135deg, #5B7C99 0%, #3A5166 100%)", color: "white" }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 48, height: 48 }}>
                <CheckCircle />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={700}>{partidosSeleccionados.size}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Seleccionados</Typography>
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ background: "linear-gradient(135deg, #7BA7D9 0%, #5B7C99 100%)", color: "white" }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 48, height: 48 }}>
                <SportsIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={700}>{usuarios.length}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Árbitros disponibles</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

         {/* FILTROS  */}
         <Card sx={{ backgroundColor: "#EDEDED", padding: "1rem", borderRadius: "12px", marginBottom: "2rem" }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                {/* Fecha Inicio */}
                <Grid item xs={12} sm={3} md={2}>
                  <DatePicker
                    label="Fecha Inicio"
                    value={fechaInicio}
                    onChange={(newValue) => setFechaInicio(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>

                {/* Fecha Fin */}
                <Grid item xs={12} sm={3} md={2}>
                  <DatePicker
                    label="Fecha Fin"
                    value={fechaFin}
                    onChange={(newValue) => setFechaFin(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>

                {/* Filtro Competición */}
                <Grid item xs={12} sm={6} md={4}>
                  <Autocomplete
                    options={competiciones}
                    getOptionLabel={(option: any) => option.nombre || ""}
                    value={competicionFiltro}
                    onChange={(_, newValue) => setCompeticionFiltro(newValue)}
                    renderInput={(params) => <TextField {...params} label="Competición" fullWidth />}
                  />
                </Grid>

                {/* Filtro Lugar */}
                <Grid item xs={12} sm={6} md={4}>
                  <Autocomplete
                    options={lugares}
                    getOptionLabel={(option) => option.nombre}
                    value={lugarFiltro}
                    onChange={(_, newValue) => setLugarFiltro(newValue)}
                    renderInput={(params) => <TextField {...params} label="Lugar" fullWidth />}
                  />
                </Grid>
              </Grid>
              {/* Nueva fila para la categoría */}
              <Grid container spacing={2} mt={2}>
                {/* Filtro Categoría */}
                <Grid item xs={12} sm={6} md={6}>
                  <Autocomplete
                    options={categorias}
                    getOptionLabel={(option) => option.nombre}
                    value={categoriaFiltro}
                    onChange={(_, newValue) => setCategoriaFiltro(newValue)}
                    renderInput={(params) => <TextField {...params} label="Categoría" fullWidth />}
                  />
                  </Grid>

                  {/* Filtro Nivel árbitro */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Autocomplete
                      options={niveles}
                      value={nivelFiltro}
                      onChange={(_, v) => setNivelFiltro(v)}
                      renderInput={(params) => <TextField {...params} label="Nivel árbitro" fullWidth />}
                    />
                  </Grid>

                  {/* Filtro Ciudad árbitro */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Autocomplete
                      options={ciudades}
                      value={ciudadFiltro}
                      onChange={(_, v) => setCiudadFiltro(v)}
                      renderInput={(params) => <TextField {...params} label="Ciudad árbitro" fullWidth />}
                    />
                  </Grid>
                
              </Grid>

              <Grid container spacing={2} mt={2}>
                <Grid item xs={12} sm={6} md={2} textAlign="right">
                  <Button variant="outlined" color="primary" fullWidth sx={{ height: "56px" }} onClick={aplicarFiltro}>
                    Aplicar Filtro
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          {/* Botón para publicar designaciones */}
          <Box>
            <Grid container spacing={2} direction="row" justifyContent="flex-start" alignItems="center">
            <Grid item xs={12} sm="auto" md={6} textAlign={'right'}>
              <Button variant="contained" color="primary" onClick={publicarDesignaciones}>
                Publicar Designaciones
              </Button>
            </Grid>


            <Grid item xs={12} sm="auto" md={6}>
              <Button
                variant="outlined"
                color="primary"
                onClick={asignarArbitrosAutomaticamente}
                startIcon={
                  asignando ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <AutoFixHigh />
                  )
                }
                disabled={asignando}
              >
                {asignando ? "Asignando..." : "Designar Automáticamente"}
              </Button>
            </Grid>

            <Grid item xs={12} sm="auto" md={6}>
              <Button
                variant="contained"
                color="secondary"
                onClick={abrirDesignacionMasiva}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  '&:hover': {
                    background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                  }
                }}
              >
                Designación Masiva
              </Button>
            </Grid>


            <FormControlLabel
              control={
                <Checkbox
                  checked={partidosSeleccionados.size === partidosFiltrados.length}
                  onChange={handleSeleccionarTodos}
                  color="primary"
                />
              }
              label="Seleccionar todos los partidos"
              style={{ margin: 10 }}
            />

            {/* LISTADO DE PARTIDOS */}
            {partidosFiltrados.length > 0 ? (
              partidosFiltrados.map((partido) => {
                return (
                  <Grid item xs={12} key={partido.id}>
                    <Card sx={{ backgroundColor: "#f7fafc", borderRadius: "12px", width: "100%" }}>
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item>
                            <Checkbox
                              checked={partidosSeleccionados.has(partido.id.toString())}
                              onChange={() => handleCheckboxChange(partido.id)}
                              color="primary"
                            />
                          </Grid>
                          <Grid item xs={10}>
                          <Typography variant="h6" color="primary">
                            {partido.equipoLocal} - {partido.equipoVisitante}
                          </Typography>
                          <Typography variant="body2">
                            {moment(partido.fecha).format("dddd, DD MMMM YYYY")} - {moment(partido.hora, "HH:mm:ss").format("HH:mm")}
                          </Typography>
                          <Typography variant="body2">
                            Lugar: {partido.lugar}
                          </Typography>
                          <Typography variant="body2">
                            Categoría: {partido.categoria}
                          </Typography>
                        </Grid>

                        </Grid>
                        <Grid container spacing={2} mt={2}>
                          <Grid item xs={12} sm={4}>
                            {renderAutocomplete(partido, "Árbitro 1", "arbitro1")}
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            {renderAutocomplete(partido, "Árbitro 2", "arbitro2")}
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            {renderAutocomplete(partido, "Anotador", "anotador")}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            ) : (
              <Typography variant="body1" textAlign="center" width="100%">
                No hay partidos que coincidan con los filtros.
              </Typography>
            )}
            </Grid>
          </Box>
        {/* Diálogo de confirmación */}
        <Dialog open={openDialog} onClose={handleCancelar}>
          <DialogTitle>Publicar designaciones</DialogTitle>
          <DialogContent>
            <Typography>¿Desea publicar las designaciones? Esta acción no se puede deshacer.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelar} color="error">Cancelar</Button>
            <Button onClick={handleConfirmar} color="primary">Confirmar</Button>
          </DialogActions>
        </Dialog>

        {/* Diálogo de designación masiva */}
        <Dialog 
          open={openMassivaDialog} 
          onClose={cerrarDesignacionMasiva}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              p: 1,
            },
          }}
        >
          <DialogTitle sx={{ 
            fontWeight: 700, 
            fontSize: '1.5rem',
            color: '#1e293b',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '12px 12px 0 0',
          }}>
            🎯 Designación Masiva de Árbitros
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Asigna los mismos árbitros a múltiples partidos seleccionando el rango de fechas y días de la semana.
              </Typography>
            </Box>

            {/* Rango de fechas */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                📅 Rango de fechas
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Fecha inicio"
                    value={fechaInicioMasiva}
                    onChange={(newValue) => setFechaInicioMasiva(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small"
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Fecha fin"
                    value={fechaFinMasiva}
                    onChange={(newValue) => setFechaFinMasiva(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small"
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Selector de días de la semana */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                📆 Días de la semana (opcional - deja vacío para todos los días)
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {[
                  { label: 'Lun', value: 1 },
                  { label: 'Mar', value: 2 },
                  { label: 'Mié', value: 3 },
                  { label: 'Jue', value: 4 },
                  { label: 'Vie', value: 5 },
                  { label: 'Sáb', value: 6 },
                  { label: 'Dom', value: 0 },
                ].map((dia) => (
                  <Chip
                    key={dia.value}
                    label={dia.label}
                    onClick={() => toggleDiaSemana(dia.value)}
                    color={diasSemanaSeleccionados.includes(dia.value) ? 'primary' : 'default'}
                    variant={diasSemanaSeleccionados.includes(dia.value) ? 'filled' : 'outlined'}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                      transition: 'all 0.2s',
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Selectores de árbitros */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                👥 Selecciona árbitros y anotador
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Autocomplete
                    options={usuarios.filter(u => u.nivel)}
                    getOptionLabel={(option) => `${option.nombre} ${option.primerApellido} ${option.segundoApellido} - ${option.nivel || ''}`}
                    value={arbitro1Masivo}
                    onChange={(_, newValue) => setArbitro1Masivo(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Árbitro 1" size="small" />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Autocomplete
                    options={usuarios.filter(u => u.nivel)}
                    getOptionLabel={(option) => `${option.nombre} ${option.primerApellido} ${option.segundoApellido} - ${option.nivel || ''}`}
                    value={arbitro2Masivo}
                    onChange={(_, newValue) => setArbitro2Masivo(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Árbitro 2" size="small" />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Autocomplete
                    options={usuarios}
                    getOptionLabel={(option) => `${option.nombre} ${option.primerApellido} ${option.segundoApellido}`}
                    value={anotadorMasivo}
                    onChange={(_, newValue) => setAnotadorMasivo(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Anotador" size="small" />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Información de partidos que coinciden */}
            <Box sx={{ 
              mt: 3, 
              p: 2, 
              bgcolor: '#f8fafc', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <Typography variant="body2" color="text.secondary">
                ℹ️ Esta designación se aplicará a los partidos que coincidan con los criterios seleccionados dentro del rango de fechas actual del filtro.
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <Button 
              onClick={cerrarDesignacionMasiva}
              variant="outlined"
              sx={{
                borderRadius: '10px',
                px: 3,
                borderColor: '#e2e8f0',
                color: '#64748b',
                '&:hover': {
                  borderColor: '#cbd5e1',
                  bgcolor: '#f8fafc',
                },
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={aplicarDesignacionMasiva}
              variant="contained"
              sx={{
                borderRadius: '10px',
                px: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                },
                transition: 'all 0.2s',
              }}
            >
              Aplicar Designación
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default DesignacionesView;
