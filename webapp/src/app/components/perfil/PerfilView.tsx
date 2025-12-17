import { useState, useEffect } from "react";
import {
  TextField,
  Grid,
  Avatar,
  IconButton,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  CircularProgress,
  Chip,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import { PhotoCamera } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CakeIcon from "@mui/icons-material/Cake";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import userService from "../../services/UserService";
import clubService from "../../services/ClubService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PerfilView = () => {
  const [perfil, setPerfil] = useState({
    fotoPerfil: "https://via.placeholder.com/150",
    nombre: "",
    primerApellido: "",
    segundoApellido: "",
    fechaNacimiento: "",
    direccion: "",
    pais: "",
    region: "",
    ciudad: "",
    codigoPostal: "",
    nivel: "",
    clubVinculado: "",
    email: "",
    licencia: "",
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  const [passwordError, setPasswordError] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [clubNombre, setClubNombre] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const usuarioId = localStorage.getItem("userId");
        if (usuarioId) {
          const datosUsuario = await userService.getUsuarioById(usuarioId);
          setPerfil({
            fotoPerfil: datosUsuario.fotoPerfil || "https://via.placeholder.com/150",
            nombre: datosUsuario.nombre || "",
            primerApellido: datosUsuario.primerApellido || "",
            segundoApellido: datosUsuario.segundoApellido || "",
            fechaNacimiento: datosUsuario.fechaNacimiento
            ? new Date(datosUsuario.fechaNacimiento)
                .toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
                .replace(/\//g, "-") // Reemplaza "/" por "-"
            : "",
          
            direccion: datosUsuario.direccion || "",
            pais: datosUsuario.pais || "",
            region: datosUsuario.region || "",
            ciudad: datosUsuario.ciudad || "",
            codigoPostal: datosUsuario.codigoPostal || "",
            nivel: datosUsuario.nivel || "",
            clubVinculado: datosUsuario.clubVinculadoId || "No tiene club vinculado",
            email: datosUsuario.email || "",
            licencia: datosUsuario.licencia || "",
          });

          // Obtener el nombre del club vinculado
          if (datosUsuario.clubVinculadoId) {
            obtenerClubNombre(datosUsuario.clubVinculadoId);
          }
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    obtenerPerfil();
  }, []);

  const obtenerClubNombre = async (clubId: string) => {
    try {
      const club = await clubService.getClubById(clubId);
      setClubNombre(club.nombre || "Club no encontrado");
    } catch (error) {
      console.error("Error al obtener el nombre del club:", error);
      setClubNombre("Club no encontrado");
    }
  };

  const manejarCambioFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploadingPhoto(true);
      const fotoURL = URL.createObjectURL(e.target.files[0]);

      try {
        const usuarioId = localStorage.getItem("userId");
        if (usuarioId) {
          await userService.uploadProfilePicture(e.target.files[0]);
          setFotoPreview(fotoURL);  // Actualizamos la preview localmente
          localStorage.setItem("fotoPerfil", fotoURL);
          toast.success("Foto de perfil actualizada con éxito");
          window.dispatchEvent(new Event("storage")); // Notificar cambios
        }
      } catch (error) {
        console.error("Error al subir la foto de perfil:", error);
        toast.error("Error al actualizar la foto de perfil");
      } finally {
        setIsUploadingPhoto(false);
      }
    }
  };

  const validarContraseñaSegura = (password: string) => {
    const longitudMinima = /.{8,}/;
    const tieneMayuscula = /[A-Z]/;
    const tieneMinuscula = /[a-z]/;
    const tieneNumero = /\d/;
    const tieneCaracterEspecial = /[!@#$%^&*(),.?":{}|<>]/;

    if (!longitudMinima.test(password)) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }
    if (!tieneMayuscula.test(password)) {
      return "La contraseña debe contener al menos una letra mayúscula.";
    }
    if (!tieneMinuscula.test(password)) {
      return "La contraseña debe contener al menos una letra minúscula.";
    }
    if (!tieneNumero.test(password)) {
      return "La contraseña debe contener al menos un número.";
    }
    if (!tieneCaracterEspecial.test(password)) {
      return "La contraseña debe contener al menos un carácter especial.";
    }

    return "";
  };

  const handlePasswordChange = async () => {
    setOldPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden");
      return;
    }

    const errorContraseña = validarContraseñaSegura(newPassword);
    if (errorContraseña) {
      setNewPasswordError(errorContraseña);
      return;
    }

    try {
      const response = await userService.changePassword({
        OldPassword: oldPassword,
        NewPassword: newPassword,
      });

      if (response.status === 200) {
        toast.success("Contraseña actualizada con éxito");
        setOpenDialog(false);
      } else {
        toast.error("Error al cambiar la contraseña");
      }
    } catch (error) {
      toast.error("Error al cambiar la contraseña");

      if (error instanceof Error && error.message.includes("La contraseña actual no es correcta")) {
        setOldPasswordError("La contraseña actual es incorrecta");
      } else {
        toast.error("Error al cambiar la contraseña");
      }
    } finally {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PersonIcon sx={{ color: "white", fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: "#1e293b" }}>
              Mi Perfil
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Información personal y configuración
            </Typography>
          </Box>
        </Box>
      </Box>

      <Card 
        elevation={0}
        sx={{ 
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
          backgroundColor: "#ffffff",
          width: "100%",
          overflow: 'visible',
        }}
      >
        {/* Header con gradiente */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            pt: 4,
            pb: 6,
            px: 3,
            borderRadius: '24px 24px 0 0',
            position: 'relative',
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'white',
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            {perfil.nombre} {perfil.primerApellido}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
            <Chip 
              label={perfil.nivel || 'Sin nivel'}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 500 }}
            />
            <Chip 
              label={`Lic: ${perfil.licencia}`}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 500 }}
            />
          </Box>
        </Box>

          <CardContent sx={{ mt: -4, position: 'relative', zIndex: 1 }}>
      <Grid container spacing={3} justifyContent="center">
        {/* Avatar mejorado */}
        <Grid item xs={12} display="flex" justifyContent="center" flexDirection="column" alignItems="center">
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={fotoPreview || perfil.fotoPerfil}
              sx={{ 
                width: 140, 
                height: 140, 
                border: '5px solid white',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
              }}
            />
            <Tooltip title="Modificar foto de perfil" arrow>
              <IconButton 
                component="label"
                disabled={isUploadingPhoto}
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: '#2563eb',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
                  '&:hover': {
                    bgcolor: '#1e40af',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                <input hidden accept="image/*" type="file" onChange={manejarCambioFoto} />
                {isUploadingPhoto ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <PhotoCamera />}
              </IconButton>
            </Tooltip>
          </Box>
          {isUploadingPhoto && (
            <Typography variant="caption" sx={{ mt: 2, color: '#64748b' }}>
              Subiendo foto...
            </Typography>
          )}
        </Grid>
        
        {/* Los campos del perfil */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Nombre"
            value={perfil.nombre}
            InputProps={{ 
              readOnly: true,
            }}
            variant="outlined"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                bgcolor: '#f8fafc',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Primer Apellido"
            value={perfil.primerApellido}
            InputProps={{ 
              readOnly: true,
            }}
            variant="outlined"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                bgcolor: '#f8fafc',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Segundo Apellido"
            value={perfil.segundoApellido}
            InputProps={{ 
              readOnly: true,
            }}
            variant="outlined"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                bgcolor: '#f8fafc',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Fecha de Nacimiento"
            value={perfil.fechaNacimiento}
            InputProps={{ 
              readOnly: true,
            }}
            variant="outlined"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                bgcolor: '#f8fafc',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Dirección"
            value={perfil.direccion}
            InputProps={{ 
              readOnly: true,
            }}
            variant="outlined"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                bgcolor: '#f8fafc',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="País"
            value={perfil.pais}
            InputProps={{ 
              readOnly: true,
            }}
            variant="outlined"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                bgcolor: '#f8fafc',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Región"
            value={perfil.region}
            InputProps={{ 
              readOnly: true,
            }}
            variant="outlined"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                bgcolor: '#f8fafc',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Ciudad"
            value={perfil.ciudad}
            InputProps={{ 
              readOnly: true,
            }}
            variant="outlined"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                bgcolor: '#f8fafc',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Código Postal"
            value={perfil.codigoPostal}
            InputProps={{ 
              readOnly: true,
            }}
            variant="outlined"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                bgcolor: '#f8fafc',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Nivel"
            value={perfil.nivel}
            InputProps={{ 
              readOnly: true,
            }}
            variant="outlined"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                bgcolor: '#f8fafc',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Club Vinculado"
            value={clubNombre}
            InputProps={{ 
              readOnly: true,
            }}
            variant="outlined"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                bgcolor: '#f8fafc',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Correo Electrónico"
            value={perfil.email}
            InputProps={{ readOnly: true }}
            variant="filled"
            sx={{ backgroundColor: "#f5f5f5", borderRadius: 1 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Licencia"
            value={perfil.licencia}
            InputProps={{ readOnly: true }}
            variant="filled"
            sx={{ backgroundColor: "#f5f5f5", borderRadius: 1 }}
          />
        </Grid>

        {/* Botón de Modificar Contraseña */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => {
              // Limpiar todos los campos y errores antes de abrir el diálogo
              setOldPassword("");
              setNewPassword("");
              setConfirmPassword("");
              setOldPasswordError("");
              setNewPasswordError("");
              setConfirmPasswordError("");
              setPasswordError("");
              setOpenDialog(true);
            }}
            sx={{ 
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              px: 4,
              py: 1,
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                boxShadow: '0 6px 16px rgba(37, 99, 235, 0.4)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s',
            }}
          >
            🔒 Modificar Contraseña
          </Button>
        </Grid>
      </Grid>
    </CardContent>
  </Card>

      {/* Diálogo de cambiar contraseña */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            p: 1,
            minWidth: '450px',
          },
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700, 
          fontSize: '1.5rem',
          color: '#1e293b',
          textAlign: 'center',
          pt: 3,
        }}>
          🔒 Modificar Contraseña
        </DialogTitle>
        <DialogContent sx={{ px: 4, pt: 3 }}>
          <TextField
            fullWidth
            label="Contraseña Actual"
            type={showOldPassword ? "text" : "password"}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            error={Boolean(oldPasswordError)}
            helperText={oldPasswordError}
            variant="outlined"
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&:hover fieldset': {
                  borderColor: '#2563eb',
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end">
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Nueva Contraseña"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={Boolean(newPasswordError)}
            helperText={newPasswordError}
            variant="outlined"
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&:hover fieldset': {
                  borderColor: '#2563eb',
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Confirmar Nueva Contraseña"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={Boolean(confirmPasswordError)}
            helperText={confirmPasswordError}
            variant="outlined"
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&:hover fieldset': {
                  borderColor: '#2563eb',
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 3, gap: 1 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            sx={{
              borderRadius: '10px',
              px: 3,
              borderColor: '#e2e8f0',
              color: '#64748b',
              '&:hover': {
                borderColor: '#cbd5e1',
                bgcolor: '#f8fafc',
              },
            }}
          >
            Cancelar
          </Button>
          <Button 
            variant="contained"
            onClick={handlePasswordChange}
            sx={{
              borderRadius: '10px',
              px: 3,
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
              },
              transition: 'all 0.2s',
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PerfilView;
