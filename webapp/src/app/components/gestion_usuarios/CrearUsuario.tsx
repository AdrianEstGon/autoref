import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, FormControlLabel, Checkbox } from '@mui/material';
import authService from '../../services/userService'; 
import { Password } from '@mui/icons-material';
import { validarNombre, validarEmail, validarNumeroLicencia, validarCodigoPostal } from '../../utils/Validaciones';

interface CrearUsuarioProps {
  open: boolean;
  onClose: () => void;
  onSave: (usuario: any) => void;
}

const CrearUsuario: React.FC<CrearUsuarioProps> = ({ open, onClose, onSave }) => {
  const navigate = useNavigate();

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    fechaNacimiento: '',
    nivel: '',
    clubVinculado: '', // Leave empty to make it optional
    licencia: '',
    username: '',
    email: '',
    password: '',
    direccion: '',
    pais: '',
    region: '',
    ciudad: '',
    codigoPostal: '',
    esAdmin: false // Default to false (unchecked)
  });

  const [errores, setErrores] = useState({
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    fechaNacimiento: '',
    nivel: '',
    clubVinculado: '', // No validation required
    licencia: '',
    username: '',
    email: '',
    password: '',
    direccion: '',
    pais: '',
    region: '',
    ciudad: '',
    codigoPostal: '',
    esAdmin: ''
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNuevoUsuario(prevState => ({
      ...prevState,
      esAdmin: e.target.checked
    }));
  };

  const handleSave = async () => {
    let erroresTemp = { ...errores };
    let isValid = true;

    // Validaciones
    if (!validarNombre(nuevoUsuario.nombre)) {
      erroresTemp.nombre = 'Nombre no válido. Solo se permiten caracteres alfabéticos y espacios.';
      isValid = false;
    } else {
      erroresTemp.nombre = '';
    }

    if (!validarNombre(nuevoUsuario.primerApellido)) {
      erroresTemp.primerApellido = 'Primer apellido no válido. Solo se permiten caracteres alfabéticos y espacios.';
      isValid = false;
    } else {
      erroresTemp.primerApellido = '';
    }

    if (nuevoUsuario.segundoApellido && !validarNombre(nuevoUsuario.segundoApellido)) {
      erroresTemp.segundoApellido = 'Segundo apellido no válido. Solo se permiten caracteres alfabéticos y espacios.';
      isValid = false;
    } else {
      erroresTemp.segundoApellido = '';
    }

    if (!validarEmail(nuevoUsuario.email)) {
      erroresTemp.email = 'Correo electrónico no válido.';
      isValid = false;
    } else {
      erroresTemp.email = '';
    }

    if (!validarNumeroLicencia(nuevoUsuario.licencia)) {
      erroresTemp.licencia = 'Número de licencia no válido. Debe ser un número positivo.';
      isValid = false;
    } else {
      erroresTemp.licencia = '';
    }

    if (!validarCodigoPostal(nuevoUsuario.codigoPostal)) {
      erroresTemp.codigoPostal = 'Código postal no válido. Debe tener exactamente 5 dígitos.';
      isValid = false;
    } else {
      erroresTemp.codigoPostal = '';
    }

    if (!nuevoUsuario.nivel) {
      erroresTemp.nivel = 'Debe seleccionar un nivel.';
      isValid = false;
    } else {
      erroresTemp.nivel = '';
    }

    if (!nuevoUsuario.clubVinculado) { // This can remain optional
      erroresTemp.clubVinculado = ''; // No validation error
    }

    if (!nuevoUsuario.fechaNacimiento) {
      erroresTemp.fechaNacimiento = 'Debe ingresar una fecha de nacimiento.';
      isValid = false;
    } else {
      erroresTemp.fechaNacimiento = '';
    }

    if (!nuevoUsuario.direccion) {
      erroresTemp.direccion = 'Debe ingresar una dirección.';
      isValid = false;
    } else {
      erroresTemp.direccion = '';
    }

    if (!nuevoUsuario.pais) {
      erroresTemp.pais = 'Debe ingresar un país.';
      isValid = false;
    } else {
      erroresTemp.pais = '';
    }

    if (!nuevoUsuario.region) {
      erroresTemp.region = 'Debe ingresar una región.';
      isValid = false;
    } else {
      erroresTemp.region = '';
    }

    if (!nuevoUsuario.ciudad) {
      erroresTemp.ciudad = 'Debe ingresar una ciudad.';
      isValid = false;
    } else {
      erroresTemp.ciudad = '';
    }

    setErrores(erroresTemp);

    if (isValid) {
      try {
        const usuarioConContraseña = {
          ...nuevoUsuario,
          username: nuevoUsuario.email,
          password: '',
        };

        await authService.register(usuarioConContraseña);
        alert('Usuario registrado con éxito');
        onClose();
        navigate('/gestionUsuarios/usuariosView');
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  const handleCancel = () => {
    navigate('/gestionUsuarios/usuariosView');
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
      <DialogContent>
        <TextField
          label="Nombre"
          fullWidth
          margin="normal"
          name="nombre"
          value={nuevoUsuario.nombre}
          onChange={handleChange}
          error={!!errores.nombre}
          helperText={errores.nombre}
        />
        <TextField
          label="Primer Apellido"
          fullWidth
          margin="normal"
          name="primerApellido"
          value={nuevoUsuario.primerApellido}
          onChange={handleChange}
          error={!!errores.primerApellido}
          helperText={errores.primerApellido}
        />
        <TextField
          label="Segundo Apellido"
          fullWidth
          margin="normal"
          name="segundoApellido"
          value={nuevoUsuario.segundoApellido}
          onChange={handleChange}
          error={!!errores.segundoApellido}
          helperText={errores.segundoApellido}
        />
        
        <TextField 
          label="Fecha de Nacimiento" 
          type="date" 
          fullWidth 
          margin="normal" 
          name="fechaNacimiento"
          value={nuevoUsuario.fechaNacimiento}
          onChange={handleChange}
          error={!!errores.fechaNacimiento}
          helperText={errores.fechaNacimiento}
          InputLabelProps={{ shrink: true }}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Nivel</InputLabel>
          <Select name="nivel" value={nuevoUsuario.nivel} onChange={(e) => handleChange(e as SelectChangeEvent<string>)} error={!!errores.nivel}> 
            {niveles.map((nivel, index) => (
              <MenuItem key={index} value={nivel}>
                {nivel}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Club Vinculado</InputLabel>
          <Select name="clubVinculado" value={nuevoUsuario.clubVinculado} onChange={(e) => handleChange(e as SelectChangeEvent<string>)} error={!!errores.clubVinculado}>
            {clubes.map((club, index) => (
              <MenuItem key={index} value={club}>
                {club}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Correo Electrónico"
          fullWidth
          margin="normal"
          name="email"
          value={nuevoUsuario.email}
          onChange={handleChange}
          error={!!errores.email}
          helperText={errores.email}
        />
        <TextField
          label="Licencia"
          fullWidth
          margin="normal"
          name="licencia"
          value={nuevoUsuario.licencia}
          onChange={handleChange}
          error={!!errores.licencia}
          helperText={errores.licencia}
        />
        <TextField
          label="Código Postal"
          fullWidth
          margin="normal"
          name="codigoPostal"
          value={nuevoUsuario.codigoPostal}
          onChange={handleChange}
          error={!!errores.codigoPostal}
          helperText={errores.codigoPostal}
        />
        <TextField label="Dirección" fullWidth margin="normal" name="direccion" value={nuevoUsuario.direccion} onChange={handleChange} error={!!errores.direccion} helperText={errores.direccion} />
        <TextField label="País" fullWidth margin="normal" name="pais" value={nuevoUsuario.pais} onChange={handleChange} error={!!errores.pais} helperText={errores.pais} />
        <TextField label="Región" fullWidth margin="normal" name="region" value={nuevoUsuario.region} onChange={handleChange} error={!!errores.region} helperText={errores.region} />
        <TextField label="Ciudad" fullWidth margin="normal" name="ciudad" value={nuevoUsuario.ciudad} onChange={handleChange} error={!!errores.ciudad} helperText={errores.ciudad} />

        <FormControlLabel
          control={<Checkbox checked={nuevoUsuario.esAdmin} onChange={handleCheckboxChange} />}
          label="Asignar rol de Administrador"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">Cancelar</Button>
        <Button onClick={handleSave} color="primary">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CrearUsuario;
