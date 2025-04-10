import React, { useState, useEffect, JSX } from "react";
import { 
  Container, Typography, Grid, Card, CardContent, Select, MenuItem, FormControl, InputLabel, TextField, Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import Autocomplete from "@mui/material/Autocomplete";
import NavigationBar from "../barra_navegacion/NavBar";
import moment, { Moment } from "moment";
import "moment/locale/es";
import partidosService from "../../services/PartidoService";
import usuariosService from "../../services/UserService";
import categoriaService from "../../services/CategoriaService";
import polideportivoService from "../../services/PolideportivoService";
import disponibilidadService from "../../services/DisponibilidadService";
import equipoService from "../../services/EquipoService";
import notificacionesService from "../../services/NotificacionService";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { toast } from "react-toastify";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import { Pagination } from "@mui/material";
import { AsignadorArbitros } from "../../components/gestion_designaciones/AsignadorArbitros"; // Adjust the path as needed
import { AutoFixHigh } from "@mui/icons-material";
import { CircularProgress } from '@mui/material';

moment.locale("es");

const DesignacionesView = () => {
  const [partidos, setPartidos] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [lugares, setLugares] = useState<any[]>([]);
  const [equipos, setEquipos] = useState<any[]>([]);
  const [designaciones, setDesignaciones] = useState<Record<string, Designacion>>({});



  const [disponibilidades, setDisponibilidades] = useState<any[]>([]);

  // Estados de filtros
  const [fechaInicio, setFechaInicio] = useState<Moment | null>(moment()); // Hoy
  const [fechaFin, setFechaFin] = useState<Moment | null>(moment().add(7, "days")); // +7 días
  const [categoriaFiltro, setCategoriaFiltro] = useState<any | null>(null);
  const [lugarFiltro, setLugarFiltro] = useState<any | null>(null);
  const [partidosFiltrados, setPartidosFiltrados] = useState<any[]>([]);
  const [partidosSeleccionados, setPartidosSeleccionados] = useState<Set<string>>(new Set());
  const [asignando, setAsignando] = useState(false);


  // Estado para el diálogo de confirmación
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmarAccion, setConfirmarAccion] = useState(false);

  type Designacion = {
    arbitro1?: { nombre: string; icono: JSX.Element };
    arbitro2?: { nombre: string; icono: JSX.Element };
    anotador?: { nombre: string; icono: JSX.Element };
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const partidosLista = await partidosService.getPartidos();
        const usuariosLista = await usuariosService.getUsuarios();
        const categoriasLista = await categoriaService.getCategorias();
        const lugaresLista = await polideportivoService.getPolideportivos();
        const disponibilidadesLista = await disponibilidadService.getDisponibilidades();
        const equiposLista = await equipoService.getEquipos(); 
  
        setPartidos(partidosLista);
        setUsuarios(usuariosLista);
        setCategorias(categoriasLista.sort((a: { nombre: string; }, b: { nombre: string; }) => a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase()))); // Ordenar categorías alfabéticamente
        setLugares(lugaresLista.sort((a: { nombre: string; }, b: { nombre: string; }) => a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase()))); // Ordenar polideportivos alfabéticamente
        setDisponibilidades(disponibilidadesLista);
        setEquipos(equiposLista); 
  
        // Crear un mapa de disponibilidades para rápido acceso
        const disponibilidadMap = new Map();
        disponibilidadesLista.forEach((disp: { usuarioId: any; }) => {
          disponibilidadMap.set(disp.usuarioId, disp);
        });
  
        // Procesar designaciones con información visual de los árbitros
        const designacionesCargadas: Record<string | number, Designacion> = {};
        partidosLista.forEach((partido: { arbitro1Id: any; arbitro2Id: any; anotadorId: any; fecha: moment.MomentInput; id: string | number; }) => {
          const arbitro1 = usuariosLista.find((user: { id: any; }) => user.id === partido.arbitro1Id);
          const arbitro2 = usuariosLista.find((user: { id: any; }) => user.id === partido.arbitro2Id);
          const anotador = usuariosLista.find((user: { id: any; }) => user.id === partido.anotadorId);
          
          const obtenerIcono = (usuarioId: string, fechaHora: string) => {
            const disponibilidad = disponibilidadesLista.find(
              (disp: { usuarioId: string; fecha: string }) =>
                disp.usuarioId === usuarioId && moment(disp.fecha).isSame(moment(fechaHora), "day")
            );
          
            if (!disponibilidad) return null;
          
            const franja = obtenerFranja(fechaHora);
            if (!franja || !(franja in disponibilidad)) return null;
          
            if (disponibilidad[franja] === 1) {
              return <DirectionsCarIcon style={{ color: "blue", marginRight: 5 }} />;
            } else if (disponibilidad[franja] === 2) {
              return <DirectionsWalkIcon style={{ color: "green", marginRight: 5 }} />;
            }
          
            return null;
          };
          designacionesCargadas[partido.id] = {
            arbitro1: arbitro1 ? (() => {
              const icono = partido.fecha ? obtenerIcono(arbitro1.id, moment(partido.fecha).toISOString()) : null;
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
              const icono = partido.fecha ? obtenerIcono(arbitro2.id, moment(partido.fecha).toISOString()) : null;
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
              const icono = partido.fecha ? obtenerIcono(anotador.id, moment(partido.fecha).toISOString()) : null;
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
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        toast.error("Error al cargar los datos");
      }
    };
  
    cargarDatos();
  }, [fechaInicio, fechaFin]);  // Asegúrate de que se recarguen los partidos cuando cambien las fechas


  
  const aplicarFiltro = () => {
    let filtrados = partidos.filter((partido) => {
      const fechaPartido = moment(partido.fecha);
      return (
        fechaPartido.isBetween(fechaInicio, fechaFin, "day", "[]") &&
        (!categoriaFiltro || partido.categoria === categoriaFiltro.nombre) &&
        (!lugarFiltro || partido.lugar === lugarFiltro.nombre)
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
    const fechaHoraCompleta = moment(`${fecha} ${hora}`, 'YYYY-MM-DD HH:mm:ss');
    const franja = obtenerFranja(hora); // Esto puede seguir usando solo la hora
  
    return usuarios
      .filter((usuario) => {
        const disponibilidad = disponibilidades.find(
          (disp) => disp.usuarioId === usuario.id && moment(disp.fecha).isSame(fechaHoraCompleta, "day")
        );
        return disponibilidad && (disponibilidad[franja] === 1 || disponibilidad[franja] === 2);
      })
      .map((usuario) => {
        const disponibilidad = disponibilidades.find(
          (disp) => disp.usuarioId === usuario.id && moment(disp.fecha).isSame(fechaHoraCompleta, "day")
        );
  
        let icono;
        if (disponibilidad?.[franja] === 1) {
          icono = <DirectionsCarIcon style={{ color: "blue", marginRight: 5 }} />;
        } else if (disponibilidad?.[franja] === 2) {
          icono = <DirectionsWalkIcon style={{ color: "green", marginRight: 5 }} />;
        }
  
        return {
          ...usuario,
          icono,
          label: (
            <>
              {icono}
              {usuario.nombre} {usuario.primerApellido} {usuario.segundoApellido}
            </>
          ),
        };
      })
      .sort((a, b) => {
        const nombreA = `${a.nombre} ${a.primerApellido} ${a.segundoApellido}`;
        const nombreB = `${b.nombre} ${b.primerApellido} ${b.segundoApellido}`;
        return nombreA.localeCompare(nombreB);
      });
  };
  
  

  const renderAutocomplete = (partido: any, tipo: string, arbitro: "arbitro1" | "arbitro2" | "anotador") => {
    // Obtener los árbitros disponibles para el partido
    const arbitrosDisponibles = obtenerArbitrosDisponibles(partido.fecha, partido.hora);
  
    // Filtrar los árbitros ya asignados en otros roles del partido
    const arbitrosAsignados = Object.keys(designaciones[partido.id] || {}).map((key) => designaciones[partido.id]?.[key as keyof Designacion]?.nombre);
  
    // Filtrar las opciones para que no aparezcan los árbitros ya asignados
    const arbitrosDisponiblesFiltrados = arbitrosDisponibles.filter(
      (usuario) => !arbitrosAsignados.includes(usuario.nombre)
    );
  
    return (
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
                : ` ${option.nombre} ${option.primerApellido ?? ""} ${option.segundoApellido ?? ""}`
}
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
              InputProps={{
                ...params.InputProps,
                startAdornment: selectedUser ? (
                  <>{selectedUser.icono}</> // Mostrar el ícono al lado del nombre del árbitro
                ) : null
              }}
            />
          );
        }}
      />
    );
  };
  
  const obtenerFranja = (horaStr: string) => {
    const hora = moment(horaStr, 'HH:mm:ss').hour();
      
        if (hora >= 9 && hora < 12) return 'franja1';
        if (hora >= 12 && hora < 15) return 'franja2';
        if (hora >= 15 && hora < 18) return 'franja3';
        if (hora >= 18 && hora < 21) return 'franja4';
      
        return '';
  };

  
  const publicarDesignaciones = async () => {
    setOpenDialog(true); // Abrir el diálogo de confirmación
  };

  const handleConfirmar = async () => {
    try {
      for (const partido of partidosFiltrados) {
        const designacion = designaciones[partido.id];
  
        const arbitro1 = designacion?.arbitro1;
        const arbitro2 = designacion?.arbitro2;
        const anotador = designacion?.anotador;
  
        const arbitro1Id = arbitro1 ? usuarios.find(usuario => usuario.nombre === arbitro1.nombre)?.id : null;
        const arbitro2Id = arbitro2 ? usuarios.find(usuario => usuario.nombre === arbitro2.nombre)?.id : null;
        const anotadorId = anotador ? usuarios.find(usuario => usuario.nombre === anotador.nombre)?.id : null;
  
        const partidoActualizado: any = {
          ...partido,
          arbitro1Id: arbitro1Id ?? null,
          arbitro2Id: arbitro2Id ?? null,
          anotadorId: anotadorId ?? null,
        };
  
        await partidosService.actualizarPartido(partidoActualizado);
  
        const nombreLugar = lugares.find(l => l.id === partido.lugarId)?.nombre ?? "lugar desconocido";
        const fechaPartido = new Date(partido.fecha);
        const dia = fechaPartido.getDate().toString().padStart(2, '0');
        const mes = (fechaPartido.getMonth() + 1).toString().padStart(2, '0');
        const año = fechaPartido.getFullYear();
        const [hours, minutes] = partido.hora.split(':').map(Number);
        const horaFormateada = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        fechaPartido.setHours(hours, minutes, 0, 0);

  
        const mensaje = `Has sido designado para el partido ${partido.equipoLocal} - ${partido.equipoVisitante}, que se disputa en el ${nombreLugar} a las ${horaFormateada} del día ${dia}/${mes}/${año}`;
  
        // Crear notificaciones
        const crearNotificacionSiAplica = async (usuarioId: string | undefined | null) => {
          if (usuarioId) {
            await notificacionesService.crearNotificacion({
              usuarioId,
              mensaje,
              fecha: fechaPartido,
            });            
          }
        };
  
        await Promise.all([
          crearNotificacionSiAplica(arbitro1Id),
          crearNotificacionSiAplica(arbitro2Id),
          crearNotificacionSiAplica(anotadorId),
        ]);
      }
  
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
      const partidosIds = new Set(partidos.map((partido) => partido.id));
      setPartidosSeleccionados(partidosIds);
    } else {
      // Desmarcar todos
      setPartidosSeleccionados(new Set());
    }
  };


  const asignarArbitrosAutomaticamente = () => {
    setAsignando(true); // Comienza el loading
  
    // Simula asincronía (si tu asignador es síncrono, usa setTimeout para ver el ícono de carga)
    setTimeout(() => {
      const partidosAAsignar = partidosFiltrados.filter(partido =>
        partidosSeleccionados.has(partido.id)
      );
  
      if (partidosAAsignar.length === 0) {
        toast.warn("No se ha seleccionado ningún partido para asignar.");
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
  
      const asignador = new AsignadorArbitros(
        usuarios,
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
    }, 300); // Esto simula un delay mínimo para que se vea el spinner
  };
  
  

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <div style={{ backgroundColor: '#eafaff', minHeight: "100vh" }}>
        <NavigationBar />
        <Container maxWidth="lg" sx={{ padding: "2rem" }}>
          <Typography variant="h4" textAlign="center" mb={3} color="#333">
            Panel de Designaciones
          </Typography>

         {/* FILTROS ENCUADRADOS */}
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

                {/* Filtro Lugar */}
                <Grid item xs={12} sm={6} md={8}>
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
                <Grid item xs={12} sm={6} md={10}>
                  <Autocomplete
                    options={categorias}
                    getOptionLabel={(option) => option.nombre}
                    value={categoriaFiltro}
                    onChange={(_, newValue) => setCategoriaFiltro(newValue)}
                    renderInput={(params) => <TextField {...params} label="Categoría" fullWidth />}
                  />
                  </Grid>
                  {/* Botón Aplicar Filtro */}
                    <Grid item xs={12} sm={6} md={2} textAlign="right">
                    <Button variant="outlined" color="primary" fullWidth sx={{ height: "56px" }} onClick={aplicarFiltro}>
                        Aplicar Filtro
                    </Button>
                    </Grid>
                
              </Grid>
            </CardContent>
          </Card>
           {/* Botón para publicar designaciones */}
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


            <FormControlLabel
              control={
                <Checkbox
                  checked={partidosSeleccionados.size === partidos.length}
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
                    <Card sx={{ backgroundColor: "#F0F4F8", borderRadius: "12px", width: "100%" }}>
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
                          <Typography variant="body2" color="textSecondary">
                            {moment(partido.fecha).format("dddd, DD MMMM YYYY")} - {moment(partido.hora, "HH:mm:ss").format("HH:mm")}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Lugar: {partido.lugar}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
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
        </Container>
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
      </div>
    </LocalizationProvider>
  );
};

export default DesignacionesView;
