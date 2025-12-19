import React, { useMemo, useState, useEffect } from 'react';
import { Box, Container, Typography, Chip, Stack, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import PublicoTopBar from './PublicoTopBar';
import { getNoticias, Noticia } from './noticiasData';

const PublicoNoticiaDetalleView: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [noticias, setNoticias] = useState<Noticia[]>([]);

  useEffect(() => {
    setNoticias(getNoticias());
  }, []);

  const noticia = useMemo(() => noticias.find((n) => n.slug === slug), [slug, noticias]);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
      <PublicoTopBar />
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
        <Button variant="outlined" color="inherit" onClick={() => navigate('/noticias')} sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700, mb: 2 }}>
          Volver a noticias
        </Button>

        {!noticia ? (
          <Box sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
            <Typography variant="h5" fontWeight={800} sx={{ color: '#0f172a' }}>
              Noticia no encontrada
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Puede que el enlace sea antiguo o se haya cambiado.
            </Typography>
          </Box>
        ) : (
          <>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
              <Chip size="small" label={noticia.fecha} variant="outlined" />
              <Chip size="small" label="AutoRef" sx={{ bgcolor: 'rgba(74,144,226,0.12)', color: '#1e3a8a' }} />
            </Stack>
            <Typography variant="h3" fontWeight={900} sx={{ color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              {noticia.titulo}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1.5 }}>
              {noticia.resumen}
            </Typography>

            <Box
              sx={{
                mt: 3,
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                height: { xs: 200, md: 320 },
                backgroundImage: `linear-gradient(135deg, rgba(2,6,23,0.40) 0%, rgba(2,6,23,0.15) 100%), url(${noticia.imagen || '/fondo.jpeg'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />

            <Box sx={{ mt: 3, p: { xs: 2.25, md: 3 }, borderRadius: '18px', bgcolor: '#fff', border: '1px solid #e2e8f0' }}>
              <Typography variant="body1" sx={{ color: '#0f172a', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                {noticia.contenido}
              </Typography>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default PublicoNoticiaDetalleView;


