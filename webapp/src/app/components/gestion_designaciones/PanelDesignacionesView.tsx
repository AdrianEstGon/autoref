import React, { useState, useEffect } from "react";
import { 
  Container, Typography, Grid, Card, CardContent, Select, MenuItem, FormControl, InputLabel, TextField, Button
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
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { toast } from "react-toastify";

moment.locale("es");

const DesignacionesView = () => {
  const [partidos, setPartidos] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [lugares, setLugares] = useState<any[]>([]);
  const [designaciones, setDesignaciones] = useState<Record<number, { arbitro1?: string; arbitro2?: string; anotador?: string }>>({});

  // Estados de filtros
  const [fechaInicio, setFechaInicio] = useState<Moment | null>(moment().startOf("month"));
  const [fechaFin, setFechaFin] = useState<Moment | null>(moment().endOf("month"));
  const [categoriaFiltro, setCategoriaFiltro] = useState<any | null>(null);
  const [lugarFiltro, setLugarFiltro] = useState<any | null>(null);
  const [partidosFiltrados, setPartidosFiltrados] = useState<any[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const partidosLista = await partidosService.getPartidos();
        const usuariosLista = await usuariosService.getUsuarios();
        const categoriasLista = await categoriaService.getCategorias();
        const lugaresLista = await polideportivoService.getPolideportivos();

        setPartidos(partidosLista);
        setUsuarios(usuariosLista);
        setCategorias(categoriasLista);
        setLugares(lugaresLista);
        setPartidosFiltrados(partidosLista);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        toast.error("Error al cargar los datos");
      }
    };

    cargarDatos();
  }, []);

  const handleChange = (partidoId: number, tipo: string, valor: any) => {
    setDesignaciones((prev) => ({
      ...prev,
      [partidoId]: {
        ...prev[partidoId],
        [tipo]: valor,
      },
    }));
  };

  const aplicarFiltro = () => {
    setPartidosFiltrados(
      partidos.filter((partido) => {
        const fechaPartido = moment(partido.fecha);
        return (
          fechaPartido.isBetween(fechaInicio, fechaFin, "day", "[]") &&
          (!categoriaFiltro || partido.categoria === categoriaFiltro.nombre) &&
          (!lugarFiltro || partido.lugar === lugarFiltro.nombre)
        );
      })
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <div style={{ backgroundColor: "#F5F5DC", minHeight: "100vh" }}>
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
                    <Button variant="contained" color="primary" fullWidth sx={{ height: "56px" }} onClick={aplicarFiltro}>
                        Aplicar Filtro
                    </Button>
                    </Grid>
                
              </Grid>
            </CardContent>
          </Card>

          {/* LISTADO DE PARTIDOS */}
          <Grid container spacing={2} direction="column">
            {partidosFiltrados.length > 0 ? (
              partidosFiltrados.map((partido) => (
                <Grid item xs={12} key={partido.id}>
                  <Card sx={{ backgroundColor: "#F0F4F8", borderRadius: "12px", width: "100%" }}>
                    <CardContent>
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

                      <Grid container spacing={2} mt={2}>
                        <Grid item xs={12} sm={4}>
                          <Autocomplete
                            options={usuarios}
                            getOptionLabel={(option) => `${option.nombre} ${option.primerApellido} ${option.segundoApellido}`}
                            value={designaciones[partido.id]?.arbitro1 || null}
                            onChange={(_, newValue) => handleChange(partido.id, "arbitro1", newValue)}
                            renderInput={(params) => <TextField {...params} label="Árbitro 1" fullWidth />}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Autocomplete
                            options={usuarios}
                            getOptionLabel={(option) => `${option.nombre} ${option.primerApellido} ${option.segundoApellido}`}
                            value={designaciones[partido.id]?.arbitro2 || null}
                            onChange={(_, newValue) => handleChange(partido.id, "arbitro2", newValue)}
                            renderInput={(params) => <TextField {...params} label="Árbitro 2" fullWidth />}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Autocomplete
                            options={usuarios}
                            getOptionLabel={(option) => `${option.nombre} ${option.primerApellido} ${option.segundoApellido}`}
                            value={designaciones[partido.id]?.anotador || null}
                            onChange={(_, newValue) => handleChange(partido.id, "anotador", newValue)}
                            renderInput={(params) => <TextField {...params} label="Anotador" fullWidth />}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body1" textAlign="center" width="100%">
                No hay partidos que coincidan con los filtros.
              </Typography>
            )}
          </Grid>
        </Container>
      </div>
    </LocalizationProvider>
  );
};

export default DesignacionesView;
