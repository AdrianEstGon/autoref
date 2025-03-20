import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, FormHelperText } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { Popper } from '@mui/material'; // Importa Popper
import partidosService from '../../services/PartidoService';
import polideportivosService from '../../services/PolideportivoService';
import equiposService from '../../services/EquipoService'; // Agregado para obtener equipos
import categoriasService from '../../services/CategoriaService'; // Agregado para obtener categorías
import { toast } from 'react-toastify';
import { validarPartido } from '../../utils/ValidacionesPartidos';

interface CrearPartidoProps {
  open: boolean;
  onClose: () => void;
  onSave: (partido: any) => void;
}

const CrearPartido: React.FC<CrearPartidoProps> = ({ open, onClose, onSave }) => {
  const navigate = useNavigate();

  const [nuevoPartido, setNuevoPartido] = useState({
    equipoLocal: '',
    equipoVisitante: '',
    fecha: '',
    hora: '',
    lugarId: '', // ID del polideportivo
    categoria: '', // Categoria seleccionada
    jornada: '',
    nPartido: '',
  });

  const [errores, setErrores] = useState({
    equipoLocal: '',
    equipoVisitante: '',
    fecha: '',
    hora: '',
    lugarId: '',
    categoria: '',
    jornada: '',
    nPartido: '',
  });

  const [polideportivos, setPolideportivos] = useState<{ id: string; nombre: string }[]>([]); // Lista de polideportivos
  const [equipos, setEquipos] = useState<{ id: string; nombre: string }[]>([]); // Lista de equipos
  const [categorias, setCategorias] = useState<{ id: string; nombre: string }[]>([]); // Lista de categorías
  const [equiposFiltrados, setEquiposFiltrados] = useState<{ id: string; nombre: string }[]>([]); // Equipos filtrados por categoría

  useEffect(() => {
    const fetchData = async () => {
      try {
        const polideportivosData = await polideportivosService.getPolideportivos();
        setPolideportivos(polideportivosData);

        const categoriasData = await categoriasService.getCategorias();
        setCategorias(categoriasData);
      } catch (error) {
        toast.error('Error cargando los datos');
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  // Cuando se selecciona una categoría, filtramos los equipos
  useEffect(() => {
    if (nuevoPartido.categoria) {
      const fetchEquipos = async () => {
        try {
          const equiposData = await equiposService.getEquiposPorCategoria(nuevoPartido.categoria); // Asumimos que tienes un endpoint que filtra los equipos por categoría
          setEquiposFiltrados(equiposData);

          // Si no hay equipos para la categoría seleccionada, mostramos un toast informativo
          if (equiposData.length === 0) {
            toast.info('No hay equipos disponibles para esta categoría.');
            // Limpiamos los equipos locales y visitantes ya que no hay equipos disponibles
            setNuevoPartido(prevState => ({
              ...prevState,
              equipoLocal: '',
              equipoVisitante: '',
            }));
          }
        } catch (error) {
          toast.error('Error obteniendo los equipos');
        }
      };

      fetchEquipos();
    }
  }, [nuevoPartido.categoria]);

  const handleChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setNuevoPartido(prevState => ({
      ...prevState,
      [name as string]: value,
    }));
  };

  const handleSave = async () => {
    let erroresTemp = { ...errores };
    let isValid = true;

    isValid = validarPartido(nuevoPartido, erroresTemp, isValid);
    setErrores(erroresTemp);

    if (isValid) {
      try {
        await partidosService.crearPartido(nuevoPartido);
        toast.success('Partido registrado con éxito');
        onClose();
        navigate('/gestionPartidos/partidosView');
      } catch (error: any) {
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  const handleCancel = () => {
    navigate('/gestionPartidos/partidosView');
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>Agregar Nuevo Partido</DialogTitle>
      <DialogContent sx={{ overflowY: 'auto' }}>
        {/* Paso 1: Selección de categoría */}
        <FormControl fullWidth margin="normal" error={!!errores.categoria}>
          <Autocomplete
            options={categorias}
            getOptionLabel={(option) => option.nombre}
            value={categorias.find(categoria => categoria.id === nuevoPartido.categoria) || null}
            onChange={(_, newValue) => setNuevoPartido(prevState => ({
              ...prevState,
              categoria: newValue ? newValue.id : '',
            }))}
            disablePortal
            PopperComponent={(props) => <Popper {...props} placement="bottom-start" />}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Categoría"
                error={!!errores.categoria}
                helperText={errores.categoria}
                variant="outlined"
              />
            )}
          />
        </FormControl>

        {/* Resto del formulario con equipos filtrados por categoría */}
        <FormControl fullWidth margin="normal" error={!!errores.equipoLocal}>
          <Autocomplete
            options={equiposFiltrados}
            getOptionLabel={(option) => option.nombre}
            value={equiposFiltrados.find(equipo => equipo.id === nuevoPartido.equipoLocal) || null}
            onChange={(_, newValue) => setNuevoPartido(prevState => ({
              ...prevState,
              equipoLocal: newValue ? newValue.id : '',
            }))}
            disablePortal
            PopperComponent={(props) => <Popper {...props} placement="bottom-start" />}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Equipo Local"
                error={!!errores.equipoLocal}
                helperText={errores.equipoLocal}
                disabled={equiposFiltrados.length === 0} // Deshabilitado si no hay equipos disponibles
              />
            )}
          />
        </FormControl>

        <FormControl fullWidth margin="normal" error={!!errores.equipoVisitante}>
          <Autocomplete
            options={equiposFiltrados}
            getOptionLabel={(option) => option.nombre}
            value={equiposFiltrados.find(equipo => equipo.id === nuevoPartido.equipoVisitante) || null}
            onChange={(_, newValue) => setNuevoPartido(prevState => ({
              ...prevState,
              equipoVisitante: newValue ? newValue.id : '',
            }))}
            disablePortal
            PopperComponent={(props) => <Popper {...props} placement="bottom-start" />}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Equipo Visitante"
                error={!!errores.equipoVisitante}
                helperText={errores.equipoVisitante}
                disabled={equiposFiltrados.length === 0} // Deshabilitado si no hay equipos disponibles
              />
            )}
          />
        </FormControl>

        {/* Campos adicionales */}
        <TextField
          label="Fecha"
          type="date"
          fullWidth
          margin="normal"
          name="fecha"
          value={nuevoPartido.fecha}
          onChange={handleChange}
          error={!!errores.fecha}
          helperText={errores.fecha}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Hora"
          type="time"
          fullWidth
          margin="normal"
          name="hora"
          value={nuevoPartido.hora}
          onChange={handleChange}
          error={!!errores.hora}
          helperText={errores.hora}
          InputLabelProps={{ shrink: true }}
        />

        <FormControl fullWidth margin="normal" error={!!errores.lugarId}>
          <Autocomplete
            options={polideportivos}
            getOptionLabel={(option) => option.nombre}
            value={polideportivos.find(polideportivo => polideportivo.id === nuevoPartido.lugarId) || null}
            onChange={(_, newValue) => setNuevoPartido(prevState => ({
              ...prevState,
              lugarId: newValue ? newValue.id : '',
            }))}
            disablePortal
            PopperComponent={(props) => <Popper {...props} placement="bottom-start" />}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Polideportivo"
                error={!!errores.lugarId}
                helperText={errores.lugarId}
              />
            )}
          />
        </FormControl>

        <TextField
          label="Jornada"
          fullWidth
          margin="normal"
          name="jornada"
          value={nuevoPartido.jornada}
          onChange={handleChange}
          error={!!errores.jornada}
          helperText={errores.jornada}
        />
        <TextField
          label="Número de Partido"
          fullWidth
          margin="normal"
          name="nPartido"
          value={nuevoPartido.nPartido}
          onChange={handleChange}
          error={!!errores.nPartido}
          helperText={errores.nPartido}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="error">Cancelar</Button>
        <Button onClick={handleSave} color="primary">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CrearPartido;
