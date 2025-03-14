import { useState, useEffect } from "react";
import { Container, TextField, Grid, Avatar, IconButton, Card, CardContent, CardHeader } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import NavBar from "../barra_navegacion/NavBar";
import apiService from "../../services/userService"; // Importar el servicio de la API

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

  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const usuarioId = localStorage.getItem("userId");
        if (usuarioId) {
          const datosUsuario = await apiService.getUsuarioById(usuarioId);
          
          // Asegúrate de que todos los valores se asignen correctamente
          setPerfil({
            fotoPerfil: datosUsuario.foto || "https://via.placeholder.com/150",
            nombre: datosUsuario.nombre || "",
            primerApellido: datosUsuario.primerApellido || "",
            segundoApellido: datosUsuario.segundoApellido || "",
            fechaNacimiento: datosUsuario.fechaNacimiento || "",
            direccion: datosUsuario.direccion || "",
            pais: datosUsuario.pais || "",
            region: datosUsuario.region || "",  // Aquí se asigna la región correctamente
            ciudad: datosUsuario.ciudad || "",  // Aquí se asigna la ciudad correctamente
            codigoPostal: datosUsuario.codigoPostal || "",
            nivel: datosUsuario.nivel || "",
            clubVinculado: datosUsuario.clubVinculado || "",
            email: datosUsuario.email || "",
            licencia: datosUsuario.licencia || "",
          });
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    obtenerPerfil();
  }, []);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  const manejarCambioFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fotoURL = URL.createObjectURL(e.target.files[0]);
      setPerfil({ ...perfil, fotoPerfil: fotoURL });
    }
  };

  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Card>
          <CardHeader title="Perfil" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                <Avatar src={perfil.fotoPerfil} sx={{ width: 100, height: 100 }} />
                <IconButton color="primary" component="label">
                  <input hidden accept="image/*" type="file" onChange={manejarCambioFoto} />
                  <PhotoCamera />
                </IconButton>
              </Grid>
              {/* Mostrar los campos con un estilo que no parezca editable */}
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Nombre" 
                  value={perfil.nombre} 
                  InputProps={{ readOnly: true }} 
                  sx={{ 
                    backgroundColor: 'transparent', 
                    pointerEvents: 'none', 
                    '& .MuiInputBase-root': {
                      border: 'none', // Remover el borde de los campos
                    }, 
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.6)', // Cambiar color de la etiqueta
                    }
                  }} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Primer Apellido" 
                  value={perfil.primerApellido} 
                  InputProps={{ readOnly: true }} 
                  sx={{ 
                    backgroundColor: 'transparent', 
                    pointerEvents: 'none', 
                    '& .MuiInputBase-root': {
                      border: 'none',
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.6)',
                    }
                  }} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Segundo Apellido" 
                  value={perfil.segundoApellido} 
                  InputProps={{ readOnly: true }} 
                  sx={{ 
                    backgroundColor: 'transparent', 
                    pointerEvents: 'none', 
                    '& .MuiInputBase-root': {
                      border: 'none',
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.6)',
                    }
                  }} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Fecha de Nacimiento" 
                  type="date" 
                  value={new Date(perfil.fechaNacimiento).toLocaleDateString('en-CA')} 
                  InputProps={{ readOnly: true }} 
                  sx={{ 
                    backgroundColor: 'transparent', 
                    pointerEvents: 'none', 
                    '& .MuiInputBase-root': {
                      border: 'none',
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.6)',
                    }
                  }} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Dirección" 
                  name="direccion" 
                  value={perfil.direccion} 
                  onChange={manejarCambio} 
                  InputProps={{ readOnly: true }} 
                  sx={{ 
                    backgroundColor: 'transparent', 
                    pointerEvents: 'none', 
                    '& .MuiInputBase-root': {
                      border: 'none',
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.6)',
                    }
                  }} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="País" 
                  name="pais" 
                  value={perfil.pais} 
                  onChange={manejarCambio} 
                  InputProps={{ readOnly: true }} 
                  sx={{ 
                    backgroundColor: 'transparent', 
                    pointerEvents: 'none', 
                    '& .MuiInputBase-root': {
                      border: 'none',
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.6)',
                    }
                  }} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Región" 
                  name="region" 
                  value={perfil.region} 
                  onChange={manejarCambio} 
                  InputProps={{ readOnly: true }} 
                  sx={{ 
                    backgroundColor: 'transparent', 
                    pointerEvents: 'none', 
                    '& .MuiInputBase-root': {
                      border: 'none',
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.6)',
                    }
                  }} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Ciudad" 
                  name="ciudad" 
                  value={perfil.ciudad} 
                  onChange={manejarCambio} 
                  InputProps={{ readOnly: true }} 
                  sx={{ 
                    backgroundColor: 'transparent', 
                    pointerEvents: 'none', 
                    '& .MuiInputBase-root': {
                      border: 'none',
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.6)',
                    }
                  }} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Código Postal" 
                  name="codigoPostal" 
                  value={perfil.codigoPostal} 
                  onChange={manejarCambio} 
                  InputProps={{ readOnly: true }} 
                  sx={{ 
                    backgroundColor: 'transparent', 
                    pointerEvents: 'none', 
                    '& .MuiInputBase-root': {
                      border: 'none',
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.6)',
                    }
                  }} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Nivel" 
                  value={perfil.nivel} 
                  InputProps={{ readOnly: true }} 
                  sx={{ 
                    backgroundColor: 'transparent', 
                    pointerEvents: 'none', 
                    '& .MuiInputBase-root': {
                      border: 'none',
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.6)',
                    }
                  }} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Club Vinculado" 
                  value={perfil.clubVinculado} 
                  InputProps={{ readOnly: true }} 
                  sx={{ 
                    backgroundColor: 'transparent', 
                    pointerEvents: 'none', 
                    '& .MuiInputBase-root': {
                      border: 'none',
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.6)',
                    }
                  }} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Correo Electrónico" 
                  name="email" 
                  value={perfil.email} 
                  onChange={manejarCambio} 
                  InputProps={{ readOnly: true }} 
                  sx={{ 
                    backgroundColor: 'transparent', 
                    pointerEvents: 'none', 
                    '& .MuiInputBase-root': {
                      border: 'none',
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.6)',
                    }
                  }} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  fullWidth 
                  label="Número de Licencia" 
                  value={perfil.licencia} 
                  InputProps={{ readOnly: true }} 
                  sx={{ 
                    backgroundColor: 'transparent', 
                    pointerEvents: 'none', 
                    '& .MuiInputBase-root': {
                      border: 'none',
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.6)',
                    }
                  }} 
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default PerfilView;
