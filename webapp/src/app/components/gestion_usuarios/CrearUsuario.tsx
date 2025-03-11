import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Importamos useNavigate
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface CrearUsuarioProps {
  open: boolean;
  onClose: () => void;
  onSave: (usuario: any) => void;
}

const CrearUsuario: React.FC<CrearUsuarioProps> = ({ open, onClose, onSave }) => {
  const navigate = useNavigate();  // Hook de navegación

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    fechaNacimiento: '',
    nivel: '',
    clubVinculado: '',
    licencia: '',
    email: '',
    direccion: '',
    pais: '',
    region: '',
    ciudad: '',
    codigoPostal: ''
  });

  const niveles = ['Candidato Territorial I Pista', 'Nivel I Pista', 'Nivel I + Hab. Nivel II Pista', 
    'Nivel II Pista', 'Nivel II Pista + Hab. Nacional C Pista', 'Nacional C Pista', 
    'Nacional B Pista', 'Nacional A Pista', 'Internacional Pista'];

  const clubes = ['Club Voleibol Oviedo', 'CID Jovellanos', 'RGC Covadonga', 'Club Voleibol La Calzada', 
    'AD Los Campos', 'AD Curtidora', 'AD Playas de Llanes', 'Arriondas', 'Nava', 
    'CV Siero', 'Noreña', 'CREIMI', 'Colegio San Ignacio'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | React.ChangeEvent<{ name?: string; value: unknown }> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setNuevoUsuario(prevState => ({
      ...prevState,
      [name as string]: value
    }));
  };

  const handleSave = () => {
    onSave(nuevoUsuario);
    navigate('/gestionUsuarios/usuariosView');  // Redirige después de guardar
  };

  const handleCancel = () => {
    navigate('/gestionUsuarios/usuariosView');  // Redirige después de cancelar
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
      <DialogContent>
        <TextField label="Nombre" fullWidth margin="normal" name="nombre" value={nuevoUsuario.nombre} onChange={handleChange} />
        <TextField label="Primer Apellido" fullWidth margin="normal" name="primerApellido" value={nuevoUsuario.primerApellido} onChange={handleChange} />
        <TextField label="Segundo Apellido" fullWidth margin="normal" name="segundoApellido" value={nuevoUsuario.segundoApellido} onChange={handleChange} />

        {/* Campo de fecha sin dependencias adicionales */}
        <TextField 
          label="Fecha de Nacimiento" 
          type="date" 
          fullWidth 
          margin="normal" 
          name="fechaNacimiento"
          value={nuevoUsuario.fechaNacimiento}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Nivel</InputLabel>
          <Select name="nivel" value={nuevoUsuario.nivel} onChange={(e) => handleChange(e as SelectChangeEvent<string>)}>
            {niveles.map((nivel, index) => (
              <MenuItem key={index} value={nivel}>
                {nivel}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Club Vinculado</InputLabel>
          <Select name="clubVinculado" value={nuevoUsuario.clubVinculado} onChange={(e) => handleChange(e as SelectChangeEvent<string>)}>
            {clubes.map((club, index) => (
              <MenuItem key={index} value={club}>
                {club}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField label="Licencia" fullWidth margin="normal" name="licencia" value={nuevoUsuario.licencia} onChange={handleChange} />
        <TextField label="Correo Electrónico" fullWidth margin="normal" name="email" value={nuevoUsuario.email} onChange={handleChange} />
        <TextField label="Dirección" fullWidth margin="normal" name="direccion" value={nuevoUsuario.direccion} onChange={handleChange} />
        <TextField label="País" fullWidth margin="normal" name="pais" value={nuevoUsuario.pais} onChange={handleChange} />
        <TextField label="Región" fullWidth margin="normal" name="region" value={nuevoUsuario.region} onChange={handleChange} />
        <TextField label="Ciudad" fullWidth margin="normal" name="ciudad" value={nuevoUsuario.ciudad} onChange={handleChange} />
        <TextField label="Código Postal" fullWidth margin="normal" name="codigoPostal" value={nuevoUsuario.codigoPostal} onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">Cancelar</Button>
        <Button onClick={handleSave} color="primary">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CrearUsuario;
