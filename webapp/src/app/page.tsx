"use client";

import { useState } from "react";
import { TextField, Button, Card, CardContent, CardHeader, Typography, Grid, Box, Container } from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
  };

  return (
    <Container maxWidth="xl" sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", px: { xs: 2, sm: 4, md: 8 } }}>
      <Grid container spacing={4} alignItems="center" justifyContent="space-between" sx={{ width: "100%" }}>
        {/* Sección del book de imágenes */}
        <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>
          <Box sx={{ width: "100%", maxWidth: 500, height: "60vh", bgcolor: "grey.200", p: { xs: 2, md: 4 }, borderRadius: 2, boxShadow: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="h4" align="center" color="textSecondary">
              Book de Imágenes
            </Typography>
            {/* Aquí puedes agregar un carrusel de imágenes */}
          </Box>
        </Grid>
        
        {/* Sección de Login */}
        <Grid item xs={12} md={5} sx={{ display: "flex", justifyContent: "center" }}>
          <Card sx={{ width: "100%", maxWidth: 400, p: { xs: 2, md: 4 }, boxShadow: 3, borderRadius: 2 }}>
            <CardHeader title={<Typography variant="h5" align="center">Inicia sesión</Typography>} />
            <CardContent>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  variant="outlined"
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Contraseña"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  variant="outlined"
                  margin="normal"
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                  Iniciar sesión
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
