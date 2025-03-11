import { useState } from "react";
import { Container, TextField, Grid, Avatar, IconButton, MenuItem, Typography, Card, CardContent, CardHeader } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import NavBar from "../barra_navegacion/NavBar";

const countries = ["España", "México", "Argentina", "Colombia", "Chile"];
const regions = ["Andalucía", "Cataluña", "Madrid", "Valencia"];
const cities = ["Sevilla", "Barcelona", "Madrid", "Valencia"];

const PerfilView = () => {
  const [profile, setProfile] = useState({
    photo: "https://via.placeholder.com/150",
    name: "Juan",
    lastName1: "Pérez",
    lastName2: "González",
    birthDate: "1990-01-01",
    address: "Calle Falsa 123",
    country: "España",
    region: "Andalucía",
    city: "Sevilla",
    postalCode: "41001",
    level: "Avanzado",
    club: "Club Deportivo Sevilla",
    email: "juan.perez@example.com",
    licenseNumber: "123456789"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const photoURL = URL.createObjectURL(e.target.files[0]);
      setProfile({ ...profile, photo: photoURL });
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
                <Avatar src={profile.photo} sx={{ width: 100, height: 100 }} />
                <IconButton color="primary" component="label">
                  <input hidden accept="image/*" type="file" onChange={handlePhotoChange} />
                  <PhotoCamera />
                </IconButton>
              </Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Nombre" value={profile.name} disabled /></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Primer Apellido" value={profile.lastName1} disabled /></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Segundo Apellido" value={profile.lastName2} disabled /></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Fecha de Nacimiento" type="date" value={profile.birthDate} disabled /></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Dirección" name="address" value={profile.address} onChange={handleChange} /></Grid>
              <Grid item xs={12} md={6}>
                <TextField select fullWidth label="País" name="country" value={profile.country} onChange={handleChange}>
                  {countries.map((c) => (<MenuItem key={c} value={c}>{c}</MenuItem>))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField select fullWidth label="Región" name="region" value={profile.region} onChange={handleChange}>
                  {regions.map((r) => (<MenuItem key={r} value={r}>{r}</MenuItem>))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField select fullWidth label="Ciudad" name="city" value={profile.city} onChange={handleChange}>
                  {cities.map((c) => (<MenuItem key={c} value={c}>{c}</MenuItem>))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Código Postal" name="postalCode" value={profile.postalCode} onChange={handleChange} /></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Nivel" value={profile.level} disabled /></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Club Vinculado" value={profile.club} disabled /></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Correo Electrónico" name="email" value={profile.email} onChange={handleChange} /></Grid>
              <Grid item xs={12} md={6}><TextField fullWidth label="Número de Licencia" value={profile.licenseNumber} disabled /></Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default PerfilView;
