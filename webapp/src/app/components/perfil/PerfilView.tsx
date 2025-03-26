import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Grid,
  Avatar,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import NavBar from "../barra_navegacion/NavBar";
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

  // Estado para la gestión de contraseñas
  const [oldPassword, setOldPassword] = useState(""); // Contraseña actual
  const [newPassword, setNewPassword] = useState(""); // Nueva contraseña
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirmación de nueva contraseña
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false); // Estado para mostrar el progreso de subida de la foto

  // Estados para manejar los errores de cada campo
  const [passwordError, setPasswordError] = useState(""); // Error global
  const [oldPasswordError, setOldPasswordError] = useState(""); // Error para la contraseña actual
  const [newPasswordError, setNewPasswordError] = useState(""); // Error para la nueva contraseña
  const [confirmPasswordError, setConfirmPasswordError] = useState(""); // Error para confirmación de contraseña

  // Estado para manejar el Dialog de cambiar contraseña
  const [openDialog, setOpenDialog] = useState(false);
  const [clubNombre, setClubNombre] = useState("");

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
              ? new Date(datosUsuario.fechaNacimiento).toLocaleDateString("en-CA")
              : "",
            direccion: datosUsuario.direccion || "",
            pais: datosUsuario.pais || "",
            region: datosUsuario.region || "",
            ciudad: datosUsuario.ciudad || "",
            codigoPostal: datosUsuario.codigoPostal || "",
            nivel: datosUsuario.nivel || "",
            clubVinculado: datosUsuario.clubVinculadoId || "",
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

    // Función para obtener el nombre del club
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
      setIsUploadingPhoto(true); // Iniciar animación de carga
      const fotoURL = URL.createObjectURL(e.target.files[0]);
  
      try {
        const usuarioId = localStorage.getItem("userId");
        if (usuarioId) {
          await userService.uploadProfilePicture(e.target.files[0]); // Subir imagen
          setPerfil({ ...perfil, fotoPerfil: fotoURL });
          toast.success("Foto de perfil actualizada con éxito");
        }
      } catch (error) {
        console.error("Error al subir la foto de perfil:", error);
        toast.error("Error al actualizar la foto de perfil");
      } finally {
        setIsUploadingPhoto(false); // Finalizar animación de carga
      }
    }
  };

  // Función de validación de la nueva contraseña
  const validarContraseñaSegura = (password: string) => {
    const longitudMinima = /.{8,}/; // Al menos 8 caracteres
    const tieneMayuscula = /[A-Z]/; // Al menos una letra mayúscula
    const tieneMinuscula = /[a-z]/; // Al menos una letra minúscula
    const tieneNumero = /\d/; // Al menos un número
    const tieneCaracterEspecial = /[!@#$%^&*(),.?":{}|<>]/; // Al menos un carácter especial

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

    return ""; // Contraseña válida
  };

  const handlePasswordChange = async () => {
    // Limpiar errores anteriores
    setOldPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden");
      return;
    }

    // Validar la nueva contraseña
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
        setOpenDialog(false); // Cerrar el diálogo después de cambiar la contraseña
      } else {
        toast.error("Error al cambiar la contraseña"); 
      }
    } catch (error) {
      toast.error("Error al cambiar la contraseña");

      // Verificar el tipo de error y manejarlo
      if (error instanceof Error && error.message.includes("La contraseña actual no es correcta")) {
        setOldPasswordError("La contraseña actual es incorrecta");
      } else {
        toast.error("Error al cambiar la contraseña"); // Usamos toast para error general
      }
    } finally {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <>
      <NavBar />
      <Box sx={{ background: "#F5F5DC", minHeight: "100vh", py: 5 }}>
        <Container maxWidth="md">
          <Card sx={{ borderRadius: 3, boxShadow: 6, backgroundColor: "#fff" }}>
            <CardHeader title={<Typography variant="h5" fontWeight={600}>Perfil</Typography>} sx={{ textAlign: "center", pb: 0 }} />
            <CardContent>
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} display="flex" justifyContent="center" flexDirection="column" alignItems="center">
                  <Avatar src={perfil.fotoPerfil} sx={{ width: 120, height: 120, boxShadow: 3 }} />
                  <Tooltip title="Modificar foto de perfil">
                    <IconButton color="primary" component="label" sx={{ mt: 2 }} disabled={isUploadingPhoto}>
                      <input hidden accept="image/*" type="file" onChange={(e) => manejarCambioFoto(e)} />
                      {isUploadingPhoto ? <CircularProgress size={24} /> : <PhotoCamera fontSize="large" />}
                    </IconButton>
                  </Tooltip>

                </Grid>
                {Object.entries(perfil).map(([key, value]) => (
                  key !== "fotoPerfil" && key !== "clubVinculado" && (
                    <Grid item xs={12} md={6} key={key}>
                      <TextField
                        fullWidth
                        label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        value={value}
                        InputProps={{ readOnly: true }}
                        variant="filled"
                        sx={{
                          backgroundColor: "#f5f5f5",
                          borderRadius: 1,
                          '& .MuiInputBase-root': {
                            border: 'none',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#666',
                          }
                        }}
                      />
                    </Grid>
                  )
                ))}
                 {/* Campo del nombre del club */}
                 <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Club Vinculado"
                    value={clubNombre} // Se muestra el nombre del club en lugar del ID
                    InputProps={{ readOnly: true }}
                    variant="filled"
                    sx={{
                      backgroundColor: "#f5f5f5",
                      borderRadius: 1,
                      '& .MuiInputBase-root': { border: 'none' },
                      '& .MuiInputLabel-root': { color: '#666' },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setOpenDialog(true)} // Abre el diálogo de cambiar contraseña
                    sx={{ mt: 3 }}
                  >
                    Modificar Contraseña
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* Diálogo de cambio de contraseña */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Cambiar Contraseña</DialogTitle>
        <DialogContent>
          <TextField
            label="Contraseña Actual"
            type="password"
            fullWidth
            variant="outlined"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            sx={{ mb: 2, mt: 2 }}
            error={!!oldPasswordError}
            helperText={oldPasswordError}
          />
          <TextField
            label="Nueva Contraseña"
            type="password"
            fullWidth
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 2 }}
            error={!!newPasswordError}
            helperText={newPasswordError}
          />
          <TextField
            label="Confirmar Nueva Contraseña"
            type="password"
            fullWidth
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: 2 }}
            error={!!confirmPasswordError}
            helperText={confirmPasswordError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="error">
            Cancelar
          </Button>
          <Button onClick={handlePasswordChange} color="primary">
            Cambiar Contraseña
          </Button>
        </DialogActions>
      </Dialog>
      <div />
    </>
  );
};

export default PerfilView;
