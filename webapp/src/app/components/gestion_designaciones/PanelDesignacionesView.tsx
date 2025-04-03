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
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { toast } from "react-toastify";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import { Pagination } from "@mui/material";
import { AsignadorArbitros } from "../../components/gestion_designaciones/AsignadorArbitros"; // Adjust the path as needed
import { AutoFixHigh } from "@mui/icons-material";

moment.locale("es");

const DesignacionesView = () => {
  const [partidos, setPartidos] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [lugares, setLugares] = useState<any[]>([]);
  const [designaciones, setDesignaciones] = useState<Record<number, Designacion>>({});
  const [paginaActual, setPaginaActual] = useState(1);
  const partidosPorPagina = 5; // Número de partidos por página



  const [disponibilidades, setDisponibilidades] = useState<any[]>([]);

  // Estados de filtros
  const [fechaInicio, setFechaInicio] = useState<Moment | null>(moment()); // Hoy
  const [fechaFin, setFechaFin] = useState<Moment | null>(moment().add(7, "days")); // +7 días
  const [categoriaFiltro, setCategoriaFiltro] = useState<any | null>(null);
  const [lugarFiltro, setLugarFiltro] = useState<any | null>(null);
  const [partidosFiltrados, setPartidosFiltrados] = useState<any[]>([]);
  const [partidosSeleccionados, setPartidosSeleccionados] = useState<Set<number>>(new Set());


  // Estado para el diálogo de confirmación
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmarAccion, setConfirmarAccion] = useState(false);

  // Calcular los partidos de la página actual
  const indexUltimoPartido = paginaActual * partidosPorPagina;
  const indexPrimerPartido = indexUltimoPartido - partidosPorPagina;
  const partidosEnPagina = partidosFiltrados.slice(indexPrimerPartido, indexUltimoPartido);

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
  
        setPartidos(partidosLista);
        setUsuarios(usuariosLista);
        setCategorias(categoriasLista.sort((a: { nombre: string; }, b: { nombre: string; }) => a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase()))); // Ordenar categorías alfabéticamente
        setLugares(lugaresLista.sort((a: { nombre: string; }, b: { nombre: string; }) => a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase()))); // Ordenar polideportivos alfabéticamente
        setDisponibilidades(disponibilidadesLista);
  
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
        const partidosFiltradosIniciales = partidosLista.filter((partido: { fecha: moment.MomentInput; }) => {
          const fechaPartido = moment(partido.fecha);
          return fechaPartido.isBetween(moment(), moment().add(7, "days"), "day", "[]");
        }).sort((a: { fecha: moment.MomentInput; }, b: { fecha: moment.MomentInput; }) => moment(a.fecha).isBefore(moment(b.fecha)) ? -1 : 1);

        // Ordenar los partidos por fecha
        partidosFiltradosIniciales.sort((a: { fecha: moment.MomentInput; }, b: { fecha: moment.MomentInput; }) => moment(a.fecha).isBefore(moment(b.fecha)) ? -1 : 1);

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

    // Ordenar por nombre del polideportivo y luego por fecha y hora
    filtrados.sort((a, b) => {
      if (a.lugar.toLowerCase() < b.lugar.toLowerCase()) return -1;
      if (a.lugar.toLowerCase() > b.lugar.toLowerCase()) return 1;
      return moment(a.fecha).isBefore(moment(b.fecha)) ? -1 : 1;
    });

    setPartidosFiltrados(filtrados);
  };

  const obtenerArbitrosDisponibles = (fechaHora: string) => {
    const franja = obtenerFranja(fechaHora); // Obtener la franja para el partido
    
    return usuarios.filter((usuario) => {
      const disponibilidad = disponibilidades.find(
        (disp) => disp.usuarioId === usuario.id && moment(disp.fecha).isSame(moment(fechaHora), "day")
      );
      return (
        disponibilidad && (disponibilidad[franja] === 1 || disponibilidad[franja] === 2)
      );
    }).map(usuario => {
      const disponibilidad = disponibilidades.find(disp => disp.usuarioId === usuario.id && moment(disp.fecha).isSame(moment(fechaHora), "day"));
      
      let icono;
      if (disponibilidad?.[franja] === 1) {
        icono = <DirectionsCarIcon style={{ color: "blue", marginRight: 5 }} />;
      } else if (disponibilidad?.[franja] === 2) {
        icono = <DirectionsWalkIcon style={{ color: "green", marginRight: 5 }} />;
      }
  
      return {
        ...usuario,
        icono, // Incluimos el ícono aquí
        label: (
          <>
            {icono}
            {usuario.nombre} {usuario.primerApellido} {usuario.segundoApellido}
          </>
        )
      };
    }).sort((a, b) => {
      // Ordenar los árbitros alfabéticamente por su nombre completo
      const nombreA = `${a.nombre} ${a.primerApellido} ${a.segundoApellido}`;
      const nombreB = `${b.nombre} ${b.primerApellido} ${b.segundoApellido}`;
      return nombreA.localeCompare(nombreB); // Orden alfabético
    });
    ;
  };
  

  const renderAutocomplete = (partido: any, tipo: string, arbitro: "arbitro1" | "arbitro2" | "anotador") => {
    // Obtener los árbitros disponibles para el partido
    const arbitrosDisponibles = obtenerArbitrosDisponibles(partido.fecha);
  
    // Filtrar los árbitros ya asignados en otros roles del partido
    const arbitrosAsignados = Object.keys(designaciones[partido.id] || {}).map((key) => designaciones[partido.id]?.[key as keyof Designacion]?.nombre);
  
    // Filtrar las opciones para que no aparezcan los árbitros ya asignados
    const arbitrosDisponiblesFiltrados = arbitrosDisponibles.filter(
      (usuario) => !arbitrosAsignados.includes(usuario.nombre)
    );
  
    return (
      <Autocomplete
        options={arbitrosDisponiblesFiltrados}
        getOptionLabel={(option) => `${option.nombre} ${option.primerApellido} ${option.segundoApellido}`}
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
              {option.icono} {/* Usamos directamente el icono que ya está calculado */}
              {option.nombre} {option.primerApellido} {option.segundoApellido}
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
  
  const obtenerFranja = (fechaHora: string) => {
    const horaPartido = moment(fechaHora).hour();
    if (horaPartido >= 9 && horaPartido < 12) return "franja1";
    if (horaPartido >= 12 && horaPartido < 15) return "franja2";
    if (horaPartido >= 15 && horaPartido < 18) return "franja3";
    if (horaPartido >= 18 && horaPartido <= 22) return "franja4";
    return "";
  };

  
  const publicarDesignaciones = async () => {
    setOpenDialog(true); // Abrir el diálogo de confirmación
  };

  const handleConfirmar = async () => {
    try {
      for (const partido of partidosFiltrados) {
        const designacion = designaciones[partido.id];
  
        // Verificar que arbitros hay para el partido
        const arbitro1Id = designacion?.arbitro1 ? usuarios.find(usuario => usuario.nombre === designacion.arbitro1?.nombre)?.id : null;
        const arbitro2Id = designacion?.arbitro2?.nombre ? usuarios.find(usuario => usuario.nombre === designacion.arbitro2?.nombre)?.id : null;
        const anotadorId = (designacion?.anotador ?? null) ? usuarios.find(usuario => usuario.nombre === designacion.anotador?.nombre)?.id : null;
  
        // Crear el objeto de partido actualizado
        const partidoActualizado: any = {
          ...partido,
          arbitro1Id: arbitro1Id ?? null, // Si no hay árbitro, se asigna null
          arbitro2Id: arbitro2Id ?? null, // Si no hay árbitro, se asigna null
          anotadorId: anotadorId ?? null, // Si no hay anotador, se asigna null
        };
  
        // Llamada a la API para actualizar el partido
        await partidosService.actualizarPartido(partidoActualizado);
      }
      
      toast.success("Designaciones publicadas correctamente");
      setOpenDialog(false); // Cerrar el diálogo después de publicar
    } catch (error) {
      console.error("Error al publicar designaciones:", error);
      toast.error("Error al publicar designaciones");
      setOpenDialog(false); // Cerrar el diálogo en caso de error
    }
  };

  const handleCancelar = () => {
    setOpenDialog(false); // Cerrar el diálogo sin hacer nada
  };

  // Manejar cambio de página
  const handlePaginaCambio = (event: React.ChangeEvent<unknown>, nuevaPagina: number) => {
    setPaginaActual(nuevaPagina);
  };

  const handleCheckboxChange = (partidoId: number) => {
    const newSelection = new Set(partidosSeleccionados);
    if (newSelection.has(partidoId)) {
      newSelection.delete(partidoId);
    } else {
      newSelection.add(partidoId);
    }
    setPartidosSeleccionados(newSelection);
  };

   // Función para manejar la selección de todos los partidos
   const handleSeleccionarTodos = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.checked;
    if (selected) {
      // Seleccionar todos los partidos de la página actual
      const partidosIds = new Set(partidosEnPagina.map((partido) => partido.id));
      setPartidosSeleccionados(partidosIds);
    } else {
      // Desmarcar todos
      setPartidosSeleccionados(new Set());
    }
  };


  const asignarArbitrosAutomaticamente = () => {
    // Filtrar solo los partidos seleccionados
    const partidosAAsignar = partidosFiltrados.filter(partido => partidosSeleccionados.has(partido.id));
  
    // Si no hay partidos seleccionados, mostrar un mensaje
    if (partidosAAsignar.length === 0) {
      toast.warn("No se ha seleccionado ningún partido para asignar.");
      return;
    }
  
    const asignador = new AsignadorArbitros(usuarios, disponibilidades, designaciones, partidosAAsignar, categorias, lugares);
    asignador.asignarArbitros(partidosAAsignar); // Asignar árbitros solo a los partidos seleccionados
    setDesignaciones({ ...designaciones }); // Actualizamos el estado con las nuevas designaciones
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
              startIcon={<AutoFixHigh />}  // Añade el ícono al inicio del botón
            >
              Designar Automáticamente
            </Button>
            </Grid>

            <FormControlLabel
              control={
                <Checkbox
                  checked={partidosSeleccionados.size === partidosEnPagina.length}
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
                              checked={partidosSeleccionados.has(partido.id)}
                              onChange={() => handleCheckboxChange(partido.id)}
                              color="primary"
                            />
                          </Grid>
                          <Grid item xs={10}>
                            <Typography variant="h6" color="primary">
                              {partido.equipoLocal} - {partido.equipoVisitante}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {moment(partido.fecha).format("dddd, DD MMMM YYYY - HH:mm")}
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
