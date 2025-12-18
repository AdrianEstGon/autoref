import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, Autocomplete, Popper, Select, MenuItem, InputLabel, Typography } from '@mui/material';
import authService from '../../services/UserService';
import clubsService from '../../services/ClubService';
import { toast } from 'react-toastify';
import { niveles } from '../../utils/UserUtils';
import { validaciones } from '../../utils/ValidacionesUsuarios';
import type { CrearUsuarioProps, Club, ValidationErrors } from '../../types';

const CrearUsuario: React.FC<CrearUsuarioProps> = ({ open, onClose, onSave }) => {
  const navigate = useNavigate();

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    fechaNacimiento: '',
    nivel: '',
    clubVinculadoId: null as string | null,
    licencia: '',
    username: '',
    email: '',
    password: '',
    direccion: '',
    pais: '',
    region: '',
    ciudad: '',
    codigoPostal: '',
    esAdmin: false,
    rol: 'Arbitro'
  });

  const [errores, setErrores] = useState({
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    fechaNacimiento: '',
    nivel: '',
    clubVinculadoId: '', 
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

  const [clubes, setClubes] = useState<Club[]>([]); 

  // Llamada a la API para obtener los clubes
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const clubesData = await clubsService.getClubs(); 
        const sortedClubs = clubesData.sort((a: any, b: any) => 
          a.nombre.localeCompare(b.nombre)
        );
        setClubes(sortedClubs); 
      } catch (error) {
        toast.error("Error al cargar los clubes");
      }
    };

    if (open) {
      fetchClubs();
    }
  }, [open]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNuevoUsuario(prevState => ({
      ...prevState,
      [name]: value
    }));
  }, []);

  const handleRolChange = useCallback((rol: string) => {
    setNuevoUsuario(prev => ({
      ...prev,
      rol,
      esAdmin: rol === 'Admin'
    }));
  }, []);

  const handleSave = useCallback(async () => {
    const erroresTemp = { ...errores };
    let isValid = true;

    // Validaciones
    isValid = validaciones(nuevoUsuario, erroresTemp, isValid);

    setErrores(erroresTemp);

    if (isValid) {
      try {
        const usuarioConContraseña = {
          ...nuevoUsuario,
          username: nuevoUsuario.email,
          // Si se deja vacío, el backend genera contraseña y (si hay SMTP) intenta enviarla por email
          password: nuevoUsuario.password || '',
          rol: nuevoUsuario.rol,
          esAdmin: nuevoUsuario.rol === 'Admin'
        };

        await authService.register(usuarioConContraseña);
        toast.success('Usuario registrado con éxito'); 
        onClose();
        navigate('/gestionUsuarios/usuariosView');
      } catch (error: any) {
        const mensajeBackend = error?.response?.data?.message;
        const mensaje = mensajeBackend || error.message || 'Error desconocido';
        toast.error(mensaje);
      }
    }
  }, [nuevoUsuario, errores, onClose, navigate]);

  const handleCancel = useCallback(() => {
    onClose();
    navigate('/gestionUsuarios/usuariosView');
  }, [onClose, navigate]);


  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
      <DialogContent>
        {/* Campos del formulario */}
        <TextField label="Nombre" fullWidth margin="normal" name="nombre" value={nuevoUsuario.nombre} onChange={handleChange} error={!!errores.nombre} helperText={errores.nombre} />
        <TextField label="Primer Apellido" fullWidth margin="normal" name="primerApellido" value={nuevoUsuario.primerApellido} onChange={handleChange} error={!!errores.primerApellido} helperText={errores.primerApellido} />
        <TextField label="Segundo Apellido" fullWidth margin="normal" name="segundoApellido" value={nuevoUsuario.segundoApellido} onChange={handleChange} error={!!errores.segundoApellido} helperText={errores.segundoApellido} />
        <TextField label="Fecha de Nacimiento" type="date" fullWidth margin="normal" name="fechaNacimiento" value={nuevoUsuario.fechaNacimiento} onChange={handleChange} error={!!errores.fechaNacimiento} helperText={errores.fechaNacimiento} InputLabelProps={{ shrink: true }} />

        {/* Nivel Select as Autocomplete */}
        <FormControl fullWidth margin="normal" error={!!errores.nivel}>
          <Autocomplete
            options={niveles}
            value={nuevoUsuario.nivel}
            onChange={(_, newValue) => {
              setNuevoUsuario(prevState => ({ ...prevState, nivel: newValue ?? '' }));
            }}
            renderInput={(params) => (
              <TextField {...params} label="Nivel" error={!!errores.nivel} helperText={errores.nivel} />
            )}
            disablePortal
            PopperComponent={(props) => {
              return <Popper {...props} placement="bottom-start" />;
            }}
          />
        </FormControl>

        {/* Club Vinculado Select as Autocomplete */}
        <FormControl fullWidth margin="normal">
        <Autocomplete
          options={clubes}
          getOptionLabel={(option) => option?.nombre || ""}
          value={clubes.find(club => club.id === nuevoUsuario.clubVinculadoId) || null}
          onChange={(_, newValue) => {
            setNuevoUsuario(prevState => ({
              ...prevState,
              clubVinculadoId: newValue?.id || null 
            }));
          }}

          renderInput={(params) => (
            <TextField {...params} label="Club Vinculado" error={!!errores.clubVinculadoId} helperText={errores.clubVinculadoId} />
          )}
          disablePortal
          PopperComponent={(props) => <Popper {...props} placement="bottom-start" />}
        />
        </FormControl>
        <TextField label="Correo Electrónico" fullWidth margin="normal" name="email" value={nuevoUsuario.email} onChange={handleChange} error={!!errores.email} helperText={errores.email} />

        {/* Contraseña opcional: recomendada para Club/Federación si no hay SMTP */}
        {nuevoUsuario.rol !== 'Arbitro' && (
          <>
            <TextField
              label="Contraseña (opcional)"
              fullWidth
              margin="normal"
              name="password"
              type="password"
              value={nuevoUsuario.password}
              onChange={handleChange}
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: -0.5 }}>
              Si la dejas vacía, el sistema intentará generar una y enviarla por email (requiere SMTP configurado).
            </Typography>
          </>
        )}

        <TextField label="Licencia" fullWidth margin="normal" name="licencia" value={nuevoUsuario.licencia} onChange={handleChange} error={!!errores.licencia} helperText={errores.licencia} />
        <TextField label="Código Postal" fullWidth margin="normal" name="codigoPostal" value={nuevoUsuario.codigoPostal} onChange={handleChange} error={!!errores.codigoPostal} helperText={errores.codigoPostal} />
        <TextField label="Dirección" fullWidth margin="normal" name="direccion" value={nuevoUsuario.direccion} onChange={handleChange} error={!!errores.direccion} helperText={errores.direccion} />
        <TextField label="País" fullWidth margin="normal" name="pais" value={nuevoUsuario.pais} onChange={handleChange} error={!!errores.pais} helperText={errores.pais} />
        <TextField label="Provincia" fullWidth margin="normal" name="region" value={nuevoUsuario.region} onChange={handleChange} error={!!errores.region} helperText={errores.region} />
        <TextField label="Municipio" fullWidth margin="normal" name="ciudad" value={nuevoUsuario.ciudad} onChange={handleChange} error={!!errores.ciudad} helperText={errores.ciudad} />

        <FormControl fullWidth margin="normal">
          <InputLabel id="rol-label">Rol</InputLabel>
          <Select
            labelId="rol-label"
            label="Rol"
            value={nuevoUsuario.rol}
            onChange={(e) => handleRolChange(String(e.target.value))}
          >
            <MenuItem value="Arbitro">Árbitro</MenuItem>
            <MenuItem value="Club">Club</MenuItem>
            <MenuItem value="Federacion">Federación</MenuItem>
            <MenuItem value="Admin">Administrador</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="error">Cancelar</Button>
        <Button onClick={handleSave} color="primary">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CrearUsuario;
