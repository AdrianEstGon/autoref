import React, { useState, useEffect } from 'react';
import { 
  Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  IconButton, Button, Box, TablePagination, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle, Typography, Chip, Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile'; 
import partidosService from '../../services/PartidoService'; 
import polideportivoService from '../../services/PolideportivoService';
import equiposService from '../../services/EquipoService';
import categoriaService from '../../services/CategoriaService';
import NavBar from '../barra_navegacion/NavBar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import * as XLSX from 'xlsx';

interface Partido {
  id: number;
  fecha: string;
  hora: string;
  lugar: string;
  equipoLocal: string;
  equipoVisitante: string;
  categoria: string;
  jornada: number;
  numeroPartido: number;
  polideportivoId?: number;
}

const PartidosView: React.FC = () => {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [partidosPaginados, setPartidosPaginados] = useState<Partido[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [partidoToDelete, setPartidoToDelete] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const navigate = useNavigate();
  const fetchPartidos = async () => {
    try {
      const data = await partidosService.getPartidos();

      const sortedPartidos = data.sort((a: any, b: any) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
      setPartidos(sortedPartidos);
    } catch (error) {
      console.error('Error al obtener los partidos:', error);
    }
  };
  useEffect(() => {
    fetchPartidos();
  }, []); 
  
  useEffect(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setPartidosPaginados(partidos.slice(startIndex, endIndex));
  }, [partidos, page, rowsPerPage]);

  const handleModify = (partido: Partido) => {
    navigate('/gestionPartidos/modificarPartido', { state: { partido } });
  };

  const handleDelete = async () => {
    if (partidoToDelete !== null) {
      try {
        await partidosService.eliminarPartido(partidoToDelete);
        const updatedPartidos = partidos.filter(p => p.id !== partidoToDelete);
        setPartidos(updatedPartidos);

        const startIndex = page * rowsPerPage;
        setPartidosPaginados(updatedPartidos.slice(startIndex, startIndex + rowsPerPage));

        setOpenConfirmDialog(false);
        setPartidoToDelete(null);
        toast.success('Partido eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar partido:', error);
        toast.error('Hubo un error al eliminar el partido');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '00:00';

    try {
      const time = new Date(`1970-01-01T${timeString}Z`);
      if (isNaN(time.getTime())) throw new Error('Hora inválida');
      return time.toISOString().substr(11, 5);
    } catch (error) {
      console.error('Error al formatear la hora:', timeString);
      return '00:00';
    }
  };

  const handleAdd = () => {
    navigate('/gestionPartidos/crearPartido');
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    const startIndex = newPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setPartidosPaginados(partidos.slice(startIndex, endIndex));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setPartidosPaginados(partidos.slice(0, newRowsPerPage));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setSelectedFile(file);
  
      const reader = new FileReader();
  
      reader.onload = async (event) => {
        const binaryStr = event.target?.result;
        const wb = XLSX.read(binaryStr, { type: 'binary' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);
  
        const formatDateFromExcel = (excelValue: string | number) => {
          if (typeof excelValue === 'number') {
            // Convertir el número de serie de Excel a fecha
            const excelEpoch = new Date(1900, 0, 1);
            const convertedDate = new Date(excelEpoch.getTime() + (excelValue - 1) * 86400000);
            return `${convertedDate.getFullYear()}-${String(convertedDate.getMonth() + 1).padStart(2, '0')}-${String(convertedDate.getDate()).padStart(2, '0')}`;
          } else if (typeof excelValue === 'string') {
            const parts = excelValue.split('/');
            if (parts.length === 3) {
              return `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
          }
          return '';
        };
  
        const nuevosPartidos = await Promise.all(
          data.map(async (item: any) => {
            let lugar = item.Lugar;
            let lugarId = null;
            let equipoLocal = null;
            let equipoLocalId = null;
            let equipoVisitante = null;
            let equipoVisitanteId = null;
            let categoria = null;
            let categoriaId = null;
  
            if (!lugar || lugar.toLowerCase() === "por determinar") {
              lugar = null;
              lugarId = null;
            } else {
              const polideportivo = await polideportivoService.getPolideportivoByName(lugar);
              if (polideportivo) {
                lugar = polideportivo.nombre;
                lugarId = polideportivo.id;
              } else {
                lugar = null;
                lugarId = null;
              }
            }
  
            if (item.EquipoLocal) {
              const equipoLocalData = await equiposService.getEquipoByNameAndCategory(item.EquipoLocal, item.Categoria);
              if (equipoLocalData) {
                equipoLocalId = equipoLocalData.id;
                equipoLocal = equipoLocalData.nombre;
              }
            }
  
            if (item.EquipoVisitante) {
              const equipoVisitanteData = await equiposService.getEquipoByNameAndCategory(item.EquipoVisitante, item.Categoria);
              if (equipoVisitanteData) {
                equipoVisitanteId = equipoVisitanteData.id;
                equipoVisitante = equipoVisitanteData.nombre;
              }
            }
  
            if (item.Categoria) {
              const categoriaData = await categoriaService.getCategoriaByName(item.Categoria);
              if (categoriaData) {
                categoriaId = categoriaData.id;
                categoria = categoriaData.nombre;
              }
            }
  
            return {
              fecha: formatDateFromExcel(item.Fecha),
              hora: item.Hora,
              lugar: lugar,
              equipoLocal: equipoLocal,
              equipoVisitante: equipoVisitante,
              categoria: categoria,
              jornada: item.Jornada,
              numeroPartido: item.NumeroPartido,
              lugarId: lugarId,
              equipoLocalId: equipoLocalId,
              equipoVisitanteId: equipoVisitanteId,
              categoriaId: categoriaId
            };
          })
        );
  
        try {
          const partidosCreados = await Promise.all(
            nuevosPartidos.map(async (partido) => {
              const partidoCreado = await partidosService.crearPartido(partido);
              return partidoCreado;
            })
          );
  
          toast.success('Partidos cargados correctamente');
  
          setPartidos((prevPartidos) => {
            const nuevosPartidos = [...prevPartidos, ...partidosCreados];
            setPartidosPaginados(nuevosPartidos.slice(0, rowsPerPage));
            return nuevosPartidos;
          });
  
          setPartidosPaginados((prevPartidos) => [...prevPartidos, ...partidosCreados].slice(0, rowsPerPage));
          fetchPartidos();
        } catch (error) {
          console.error('Error al cargar los partidos:', error);
          toast.error('Hubo un error al cargar los partidos');
        }
      };
  
      reader.readAsBinaryString(file);
    }
  };

  return (
    <>
      <NavBar />
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          minHeight: '100vh', 
          pt: 4, 
          pb: 12,
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          {/* Header moderno */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: '#1e293b',
                mb: 1,
              }}
            >
              ⚽ Gestión de Partidos
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#64748b',
              }}
            >
              Administra los partidos y sus horarios
            </Typography>
          </Box>

          <TableContainer 
            component={Paper} 
            elevation={0}
            sx={{ 
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Table>
              <TableHead>
                <TableRow 
                  sx={{ 
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  }}
                >
                  <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>Fecha</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>Hora</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>Lugar</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>Equipo Local</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>Equipo Visitante</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>Categoría</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>Jornada</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem', textAlign: 'center' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {partidos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((partido, index) => (
                  <TableRow 
                    key={partido.id ?? `temp-${Math.random()}`}
                    sx={{
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                      '&:hover': {
                        backgroundColor: 'rgba(139, 92, 246, 0.05)',
                        transform: 'scale(1.001)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <TableCell sx={{ py: 2, px: 2 }}>
                      <Chip 
                        label={formatDate(partido.fecha)}
                        size="small"
                        sx={{
                          bgcolor: '#f0f9ff',
                          color: '#0369a1',
                          fontWeight: 500,
                          fontSize: '0.75rem',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2 }}>
                      <Typography variant="body2" fontWeight={600} color="#64748b">
                        {formatTime(partido.hora)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2 }}>
                      <Typography variant="body2">
                        {partido.lugar || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {partido.equipoLocal}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {partido.equipoVisitante}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2 }}>
                      <Chip 
                        label={partido.categoria}
                        size="small"
                        sx={{
                          bgcolor: '#f3e8ff',
                          color: '#6b21a8',
                          fontWeight: 500,
                          fontSize: '0.75rem',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2 }}>
                      <Chip 
                        label={`J${partido.jornada}`}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: '#cbd5e1',
                          color: '#64748b',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2, textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <Tooltip title="Modificar partido" arrow>
                          <IconButton 
                            size="small"
                            onClick={() => handleModify(partido)}
                            sx={{
                              bgcolor: '#f3e8ff',
                              color: '#8b5cf6',
                              '&:hover': {
                                bgcolor: '#e9d5ff',
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar partido" arrow>
                          <IconButton 
                            size="small"
                            onClick={() => { setPartidoToDelete(partido.id); setOpenConfirmDialog(true); }}
                            sx={{
                              bgcolor: '#fef2f2',
                              color: '#ef4444',
                              '&:hover': {
                                bgcolor: '#fee2e2',
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box 
            sx={{ 
              position: 'fixed', 
              bottom: 0, 
              left: 0, 
              right: 0,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderTop: '1px solid #e2e8f0', 
              py: 2, 
              px: { xs: 2, sm: 4, md: 8 }, 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              justifyContent: 'space-between', 
              alignItems: 'center',
              zIndex: 10,
              boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: { xs: 2, sm: 0 } }}>
              <Button 
                variant="contained"
                onClick={handleAdd} 
                startIcon={<AddIcon />}
                sx={{ 
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  px: 3,
                  py: 1.2,
                  borderRadius: '10px',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                    boxShadow: '0 6px 16px rgba(139, 92, 246, 0.4)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                Agregar Partido
              </Button>
              <Button 
                variant="outlined" 
                component="label"
                startIcon={<UploadFileIcon />}
                sx={{
                  borderColor: '#10b981',
                  color: '#10b981',
                  borderWidth: '2px',
                  px: 3,
                  py: 1.2,
                  borderRadius: '10px',
                  '&:hover': {
                    borderColor: '#059669', 
                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                    borderWidth: '2px',
                  },
                }}
              >
                Importar desde Excel
                <input type="file" id="upload-file" accept=".xlsx, .xls" onChange={handleFileUpload} hidden />
              </Button>
            </Box>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={partidos.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por página"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
              sx={{
                '& .MuiTablePagination-select': {
                  borderRadius: '8px',
                  bgcolor: '#f8fafc',
                },
                '& .MuiIconButton-root': {
                  borderRadius: '8px',
                  '&:hover': {
                    bgcolor: '#f1f5f9',
                  },
                },
              }}
            />
          </Box>

          <Dialog 
            open={openConfirmDialog} 
            onClose={() => setOpenConfirmDialog(false)}
            PaperProps={{
              sx: {
                borderRadius: '16px',
                p: 1,
              },
            }}
          >
            <DialogTitle sx={{ 
              fontWeight: 700, 
              fontSize: '1.25rem',
              color: '#1e293b',
            }}>
              ⚠️ Eliminar Partido
            </DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ color: '#64748b', fontSize: '1rem' }}>
                ¿Estás seguro de que deseas eliminar este partido? Esta acción no se puede deshacer.
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
              <Button 
                onClick={() => setOpenConfirmDialog(false)}
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
                onClick={handleDelete}
                variant="contained"
                sx={{
                  borderRadius: '10px',
                  px: 3,
                  bgcolor: '#ef4444',
                  '&:hover': {
                    bgcolor: '#dc2626',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                Eliminar
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </>
  );
};

export default PartidosView;
