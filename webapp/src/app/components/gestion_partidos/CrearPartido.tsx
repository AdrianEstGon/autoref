import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, FormHelperText } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { Popper } from '@mui/material'; // Importa Popper
import partidosService from '../../services/PartidoService'; 
import polideportivosService from '../../services/PolideportivoService'; 
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
    lugarId: '', // Debemos almacenar el ID del polideportivo aquí
    categoria: '',
    competicion: '',
  });

  const [errores, setErrores] = useState({
    equipoLocal: '',
    equipoVisitante: '',
    fecha: '',
    hora: '',
    lugarId: '', // Error para el lugarId
    categoria: '',
    competicion: '',
  });

  const [polideportivos, setPolideportivos] = useState<{ id: string; nombre: string }[]>([]); // Lista de polideportivos

  useEffect(() => {
    const fetchPolideportivos = async () => {
      try {
        const data = await polideportivosService.getPolideportivos();
        setPolideportivos(data);
      } catch (error) {
        toast.error('Error cargando los polideportivos');
      }
    };

    if (open) {
      fetchPolideportivos();
    }
  }, [open]);

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
        // Aquí le pasas el ID del polideportivo
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
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Agregar Nuevo Partido</DialogTitle>
      <DialogContent>
        <TextField
          label="Equipo Local"
          fullWidth
          margin="normal"
          name="equipoLocal"
          value={nuevoPartido.equipoLocal}
          onChange={handleChange}
          error={!!errores.equipoLocal}
          helperText={errores.equipoLocal}
        />
        <TextField
          label="Equipo Visitante"
          fullWidth
          margin="normal"
          name="equipoVisitante"
          value={nuevoPartido.equipoVisitante}
          onChange={handleChange}
          error={!!errores.equipoVisitante}
          helperText={errores.equipoVisitante}
        />
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
            disablePortal  // Desactiva el portal para que las opciones no se desplieguen fuera del contenedor
            PopperComponent={(props) => {
              // Este es el componente Popper personalizado para asegurar que las opciones se muestren hacia abajo
              return <Popper {...props} placement="bottom-start" />;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Polideportivo"
                error={!!errores.lugarId}
                helperText={errores.lugarId}
              />
            )}
          />
          {errores.lugarId && <FormHelperText>{errores.lugarId}</FormHelperText>}
        </FormControl>

        <TextField
          label="Categoría"
          fullWidth
          margin="normal"
          name="categoria"
          value={nuevoPartido.categoria}
          onChange={handleChange}
          error={!!errores.categoria}
          helperText={errores.categoria}
        />
        <TextField
          label="Competición"
          fullWidth
          margin="normal"
          name="competicion"
          value={nuevoPartido.competicion}
          onChange={handleChange}
          error={!!errores.competicion}
          helperText={errores.competicion}
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
