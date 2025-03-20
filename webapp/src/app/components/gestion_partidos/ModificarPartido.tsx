import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, FormHelperText 
} from '@mui/material';
import { Autocomplete, Popper } from '@mui/material';
import partidosService from '../../services/PartidoService';
import polideportivosService from '../../services/PolideportivoService';
import { toast } from 'react-toastify';
import { validarPartido } from '../../utils/ValidacionesPartidos';

interface ModificarPartidoProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (partido: any) => void;
}

const ModificarPartido: React.FC<ModificarPartidoProps> = ({ open, onClose, onUpdate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const partido = location.state?.partido || null;

  const [partidoModificado, setPartidoModificado] = useState<any>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [polideportivos, setPolideportivos] = useState<{ id: string; nombre: string }[]>([]);

  useEffect(() => {
    // Cargar lista de polideportivos
    const fetchPolideportivos = async () => {
      try {
        const data = await polideportivosService.getPolideportivos();
        setPolideportivos(data);
      } catch (error) {
        console.error('Error al obtener polideportivos:', error);
      }
    };

    fetchPolideportivos();
  }, []);

  useEffect(() => {
    if (open && partido) {
      setPartidoModificado({ ...partido });
    }
  }, [open, partido]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPartidoModificado((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    let erroresTemp = {
      equipoLocal: '',
      equipoVisitante: '',
      fecha: '',
      hora: '',
      lugarId: '',
      categoria: '',
      jornada: '',
      nPartido: ''
    };
    let isValid = validarPartido(partidoModificado, erroresTemp, true);
    setErrores(erroresTemp);

    if (isValid) {
      try {
        await partidosService.actualizarPartido(partidoModificado);
        toast.success('Partido actualizado con éxito');
        onUpdate(partidoModificado);
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

  if (!partidoModificado) return null; // No renderizar si no hay partido seleccionado

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Modificar Partido</DialogTitle>
      <DialogContent>
        <TextField
          label="Equipo Local"
          fullWidth
          margin="normal"
          name="equipoLocal"
          value={partidoModificado.equipoLocal || ''}
          onChange={handleChange}
          error={!!errores.equipoLocal}
          helperText={errores.equipoLocal}
        />
        <TextField
          label="Equipo Visitante"
          fullWidth
          margin="normal"
          name="equipoVisitante"
          value={partidoModificado.equipoVisitante || ''}
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
          value={partidoModificado.fecha || ''}
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
          value={partidoModificado.hora || ''}
          onChange={handleChange}
          error={!!errores.hora}
          helperText={errores.hora}
          InputLabelProps={{ shrink: true }}
        />
        
        <FormControl fullWidth margin="normal" error={!!errores.lugarId}>
          <Autocomplete
            options={polideportivos}
            getOptionLabel={(option) => option.nombre}
            value={polideportivos.find(polideportivo => polideportivo.id === partidoModificado.lugarId) || null}
            onChange={(_, newValue) => setPartidoModificado((prevState: any) => ({
              ...prevState,
              lugarId: newValue ? newValue.id : '',
            }))}
            disablePortal
            PopperComponent={(props) => <Popper {...props} placement="bottom-start" />}
            renderInput={(params) => (
              <TextField {...params} label="Polideportivo" error={!!errores.lugarId} helperText={errores.lugarId} />
            )}
          />
          {errores.lugarId && <FormHelperText>{errores.lugarId}</FormHelperText>}
        </FormControl>

        <TextField
          label="Categoría"
          fullWidth
          margin="normal"
          name="categoria"
          value={partidoModificado.categoria || ''}
          onChange={handleChange}
          error={!!errores.categoria}
          helperText={errores.categoria}
        />
        <TextField
          label="Jornada"
          fullWidth
          margin="normal"
          name="jornada"
          type="number"
          value={partidoModificado.jornada || ''}
          onChange={handleChange}
          error={!!errores.jornada}
          helperText={errores.jornada}
        />
        <TextField
          label="Número de Partido"
          fullWidth
          margin="normal"
          name="nPartido"
          type="number"
          value={partidoModificado.nPartido || ''}
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

export default ModificarPartido;
