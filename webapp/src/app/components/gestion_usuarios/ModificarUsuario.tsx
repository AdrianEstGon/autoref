import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, SelectChangeEvent } from '@mui/material';
import authService from '../../services/userService'; 
import { validarNombre, validarEmail, validarNumeroLicencia, validarCodigoPostal } from '../../utils/Validaciones';
import { toast } from 'react-toastify';

interface ModificarUsuarioProps {
  open: boolean;
  onClose: () => void;
  usuario: any;
  onUpdate: () => void; // Para actualizar la lista de usuarios tras modificar
}

const ModificarUsuario: React.FC<ModificarUsuarioProps> = ({ open, onClose, onUpdate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const usuario = location.state?.usuario || {};
  
  const [usuarioEditado, setUsuarioEditado] = useState({ ...usuario });
  const [errores, setErrores] = useState<{ [key: string]: string }>({});

  const niveles = ['Candidato Territorial I Pista', 'Nivel I Pista', 'Nivel I + Hab. Nivel II Pista', 
    'Nivel II Pista', 'Nivel II + Hab. Nacional C Pista', 'Nacional C Pista', 
    'Nacional B Pista', 'Nacional A Pista', 'Internacional Pista'];

  const clubes = ['Club Voleibol Oviedo', 'CID Jovellanos', 'RGC Covadonga', 'Club Voleibol La Calzada', 
    'AD Los Campos', 'AD Curtidora', 'AD Playas de Llanes', 'Arriondas', 'Nava', 
    'CV Siero', 'Noreña', 'CREIMI', 'Colegio San Ignacio'];

  useEffect(() => {
    setUsuarioEditado(usuario);
  }, [usuario]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setUsuarioEditado((prevState: any) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsuarioEditado((prevState: any) => ({
      ...prevState,
      esAdmin: e.target.checked
    }));
  };

  const handleSave = async () => {
    let erroresTemp: { [key: string]: string } = {};
    let isValid = true;

    // Validaciones
    if (!validarNombre(usuarioEditado.nombre)) {
      erroresTemp.nombre = 'Nombre no válido.';
      isValid = false;
    }

    if (!validarNombre(usuarioEditado.primerApellido)) {
      erroresTemp.primerApellido = 'Primer apellido no válido.';
      isValid = false;
    }

    if (usuarioEditado.segundoApellido && !validarNombre(usuarioEditado.segundoApellido)) {
      erroresTemp.segundoApellido = 'Segundo apellido no válido.';
      isValid = false;
    }

    if (!validarEmail(usuarioEditado.email)) {
      erroresTemp.email = 'Correo electrónico no válido.';
      isValid = false;
    }

    if (!validarNumeroLicencia(usuarioEditado.licencia)) {
      erroresTemp.licencia = 'Número de licencia no válido.';
      isValid = false;
    }

    if (!validarCodigoPostal(usuarioEditado.codigoPostal)) {
      erroresTemp.codigoPostal = 'Código postal no válido.';
      isValid = false;
    }

    if (!usuarioEditado.nivel) {
      erroresTemp.nivel = 'Debe seleccionar un nivel.';
      isValid = false;
    }

    if (!usuarioEditado.fechaNacimiento) {
      erroresTemp.fechaNacimiento = 'Debe ingresar una fecha de nacimiento.';
      isValid = false;
    }

    if (!usuarioEditado.direccion) {
      erroresTemp.direccion = 'Debe ingresar una dirección.';
      isValid = false;
    }

    if (!usuarioEditado.pais) {
      erroresTemp.pais = 'Debe ingresar un país.';
      isValid = false;
    }

    if (!usuarioEditado.region) {
      erroresTemp.region = 'Debe ingresar una región.';
      isValid = false;
    }

    if (!usuarioEditado.ciudad) {
      erroresTemp.ciudad = 'Debe ingresar una ciudad.';
      isValid = false;
    }

    setErrores(erroresTemp);

    if (isValid) {
      try {
        await authService.updateUser(usuarioEditado);
        onUpdate();
        toast.success('Usuario actualizado con éxito'); // Usamos toast en lugar de Snackbar
        onClose();   
        navigate('/gestionUsuarios/usuariosView');
        
      } catch (error: any) {
        toast.error(`Error: ${error.message}`); // Usamos toast en lugar de Snackbar
      }
    }
  };

  const handleCancel = () => {
    navigate('/gestionUsuarios/usuariosView');
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle>Modificar Usuario</DialogTitle>
        <DialogContent>
          <TextField label="Nombre" fullWidth margin="normal" name="nombre" value={usuarioEditado.nombre} onChange={handleChange} error={!!errores.nombre} helperText={errores.nombre} />
          <TextField label="Primer Apellido" fullWidth margin="normal" name="primerApellido" value={usuarioEditado.primerApellido} onChange={handleChange} error={!!errores.primerApellido} helperText={errores.primerApellido} />
          <TextField label="Segundo Apellido" fullWidth margin="normal" name="segundoApellido" value={usuarioEditado.segundoApellido} onChange={handleChange} error={!!errores.segundoApellido} helperText={errores.segundoApellido} />
          <TextField label="Fecha de Nacimiento" type="date" fullWidth margin="normal" name="fechaNacimiento" value={new Date(usuarioEditado.fechaNacimiento).toLocaleDateString('en-CA')} onChange={handleChange} error={!!errores.fechaNacimiento} helperText={errores.fechaNacimiento} InputLabelProps={{ shrink: true }} />

          <FormControl fullWidth margin="normal">
            <InputLabel>Nivel</InputLabel>
            <Select name="nivel" value={usuarioEditado.nivel} onChange={handleChange}>
              {niveles.map((nivel, index) => <MenuItem key={index} value={nivel}>{nivel}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
              <InputLabel>Club Vinculado</InputLabel>
              <Select name="clubVinculado" value={usuarioEditado.clubVinculado} onChange={(e) => handleChange(e as SelectChangeEvent<string>)} error={!!errores.clubVinculado}>
              {clubes.map((club, index) => (
                  <MenuItem key={index} value={club}>
                  {club}
                  </MenuItem>
              ))}
              </Select>
          </FormControl>

          <TextField label="Correo Electrónico" fullWidth margin="normal" name="email" value={usuarioEditado.email} onChange={handleChange} error={!!errores.email} helperText={errores.email} />
          <TextField label="Licencia" fullWidth margin="normal" name="licencia" value={usuarioEditado.licencia} onChange={handleChange} error={!!errores.licencia} helperText={errores.licencia} />
          <TextField label="Código Postal" fullWidth margin="normal" name="codigoPostal" value={usuarioEditado.codigoPostal} onChange={handleChange} error={!!errores.codigoPostal} helperText={errores.codigoPostal} />
          <TextField label="Dirección" fullWidth margin="normal" name="direccion" value={usuarioEditado.direccion} onChange={handleChange} error={!!errores.direccion} helperText={errores.direccion} />
          <TextField label="País" fullWidth margin="normal" name="pais" value={usuarioEditado.pais} onChange={handleChange} error={!!errores.pais} helperText={errores.pais} />
          <TextField label="Provincia" fullWidth margin="normal" name="provincia" value={usuarioEditado.region} onChange={handleChange} error={!!errores.region} helperText={errores.region} />
          <TextField label="Municipio" fullWidth margin="normal" name="municipio" value={usuarioEditado.ciudad} onChange={handleChange} error={!!errores.ciudad} helperText={errores.ciudad} />

          <FormControlLabel control={<Checkbox checked={usuarioEditado.esAdmin} onChange={handleCheckboxChange} />} label="Asignar rol de Administrador" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="secondary">Cancelar</Button>
          <Button onClick={handleSave} color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModificarUsuario;
