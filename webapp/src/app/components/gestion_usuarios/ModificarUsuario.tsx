import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, SelectChangeEvent, FilledTextFieldProps, OutlinedTextFieldProps, StandardTextFieldProps, TextFieldVariants, Autocomplete } from '@mui/material';
import authService from '../../services/UserService'; 
import clubsService from '../../services/ClubService'; // Importa el servicio de clubes
import { validaciones } from '../../utils/ValidacionesUsuarios';
import { toast } from 'react-toastify';
import { niveles } from './UserUtils';

interface ModificarUsuarioProps {
  open: boolean;
  onClose: () => void;
  usuario: any;
  onUpdate: () => void; 
}

const ModificarUsuario: React.FC<ModificarUsuarioProps> = ({ open, onClose, onUpdate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const usuario = location.state?.usuario || {};
  
  const [usuarioEditado, setUsuarioEditado] = useState({ ...usuario });
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
  const [clubes, setClubes] = useState<any[]>([]); // Estado para almacenar los clubes
  
  useEffect(() => {
    if (usuario) {
      setUsuarioEditado({
        ...usuario,
      });
    }

    // Obtener los clubes cuando el componente se monta
    const fetchClubs = async () => {
      try {
        const clubesData = await clubsService.getClubs(); // Obtener los clubes desde el servicio
        setClubes(clubesData); // Guardar los clubes en el estado
      } catch (error) {
        toast.error("Error al cargar los clubes");
      }
    };

    fetchClubs();
  }, [usuario]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
  
    if (name === 'clubVinculado') {
      // Encontramos el club por su ID
      const selectedClub = clubes.find(club => club.id === value);
      
      // Si encontramos el club, actualizamos tanto el ID como el nombre
      if (selectedClub) {
        setUsuarioEditado((prevState: any) => ({
          ...prevState,
          clubVinculadoId: selectedClub.id,  // ID del club
          clubVinculado: selectedClub.nombre  // Nombre del club
        }));
      }
    } else {
      // Para otros campos, solo actualizamos el valor correspondiente
      setUsuarioEditado((prevState: any) => ({
        ...prevState,
        [name]: value
      }));
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsuarioEditado((prevState: any) => ({
      ...prevState,
      esAdmin: e.target.checked
    }));
  };

  const handleSave = async () => {
    let erroresTemp = { ...errores };
    let isValid = true;

    // Validaciones
    isValid = validaciones(usuarioEditado, erroresTemp, isValid);

    setErrores(erroresTemp);

    if (isValid) {
      try {
        await authService.updateUser(usuarioEditado);
        onUpdate();
        toast.success('Usuario actualizado con éxito'); 
        onClose();   
        navigate('/gestionUsuarios/usuariosView');
        
      } catch (error: any) {
        toast.error(`Error: ${error.message}`); 
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

          <Autocomplete
            options={niveles}
            value={usuarioEditado.nivel || ''}
            onChange={(e: any, newValue: any) => {
              setUsuarioEditado((prevState: any) => ({
                ...prevState,
                nivel: newValue || ''
              }));
            }}
            renderInput={(params: React.JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<FilledTextFieldProps | OutlinedTextFieldProps | StandardTextFieldProps, "variant">) => (
              <TextField {...params} label="Nivel" margin="normal" fullWidth />
            )}
          />


          <Autocomplete
            options={clubes}
            getOptionLabel={(option) => option.nombre || ''}
            value={clubes.find(club => club.id === usuarioEditado.clubVinculadoId) || null}
            onChange={(e, newValue) => {
              if (newValue) {
                setUsuarioEditado((prevState: any) => ({
                  ...prevState,
                  clubVinculadoId: newValue.id,
                  clubVinculado: newValue.nombre
                }));
              } else {
                setUsuarioEditado((prevState: any) => ({
                  ...prevState,
                  clubVinculadoId: '',
                  clubVinculado: ''
                }));
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Club Vinculado" margin="normal" fullWidth />
            )}
          />


          <TextField label="Correo Electrónico" fullWidth margin="normal" name="email" value={usuarioEditado.email} onChange={handleChange} error={!!errores.email} helperText={errores.email} />
          <TextField label="Licencia" fullWidth margin="normal" name="licencia" value={usuarioEditado.licencia} onChange={handleChange} error={!!errores.licencia} helperText={errores.licencia} />
          <TextField label="Código Postal" fullWidth margin="normal" name="codigoPostal" value={usuarioEditado.codigoPostal} onChange={handleChange} error={!!errores.codigoPostal} helperText={errores.codigoPostal} />
          <TextField label="Dirección" fullWidth margin="normal" name="direccion" value={usuarioEditado.direccion} onChange={handleChange} error={!!errores.direccion} helperText={errores.direccion} />
          <TextField label="País" fullWidth margin="normal" name="pais" value={usuarioEditado.pais} onChange={handleChange} error={!!errores.pais} helperText={errores.pais} />
          <TextField label="Provincia" fullWidth margin="normal" name="region" value={usuarioEditado.region} onChange={handleChange} error={!!errores.region} helperText={errores.region} />
          <TextField label="Municipio" fullWidth margin="normal" name="ciudad" value={usuarioEditado.ciudad} onChange={handleChange} error={!!errores.ciudad} helperText={errores.ciudad} />

          <FormControlLabel control={<Checkbox checked={usuarioEditado.esAdmin} onChange={handleCheckboxChange} />} label="Asignar rol de Administrador" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="error">Cancelar</Button>
          <Button onClick={handleSave} color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModificarUsuario;
