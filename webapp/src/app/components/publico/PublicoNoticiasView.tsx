import React, { useState, useEffect } from 'react';
import { Box, Card, CardActionArea, CardContent, CardMedia, Container, Typography, Stack, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PublicoTopBar from './PublicoTopBar';
import { getNoticias, Noticia } from './noticiasData';

const PublicoNoticiasView: React.FC = () => {
  const navigate = useNavigate();
  const [noticias, setNoticias] = useState<Noticia[]>([]);

  useEffect(() => {
    setNoticias(getNoticias());
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
      <PublicoTopBar />
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={800} sx={{ color: '#0f172a', letterSpacing: '-0.02em' }}>
            Noticias
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Actualizaciones, comunicados y novedades de la competición.
          </Typography>
        </Box>

        <Stack spacing={2.5}>
          {noticias.map((n) => (
            <Card key={n.slug} sx={{ borderRadius: '18px', overflow: 'hidden', border: '1px solid #e2e8f0' }} elevation={0}>
              <CardActionArea onClick={() => navigate(`/noticias/${n.slug}`)} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '260px 1fr' } }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={n.imagen || '/fondo.jpeg'}
                  alt={n.titulo}
                  sx={{ height: { xs: 180, md: '100%' } }}
                />
                <CardContent sx={{ p: { xs: 2.25, md: 3 } }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Chip size="small" label={n.fecha} variant="outlined" />
                    <Chip size="small" label="AutoRef" sx={{ bgcolor: 'rgba(74,144,226,0.12)', color: '#1e3a8a' }} />
                  </Stack>
                  <Typography variant="h6" fontWeight={800} sx={{ color: '#0f172a' }}>
                    {n.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                    {n.resumen}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default PublicoNoticiasView;


