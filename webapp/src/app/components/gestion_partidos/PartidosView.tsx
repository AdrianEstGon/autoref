import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  IconButton, Button, Box, Tooltip, TablePagination, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import partidosService from '../../services/PartidoService'; 
import NavBar from '../barra_navegacion/NavBar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Partido {
  id: number;
  fecha: string;
  hora: string;
  lugar: string;
  equipoLocal: string;
  equipoVisitante: string;
  categoria: string;
  competicion: string;
}

const PartidosView: React.FC = () => {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [partidosPaginados, setPartidosPaginados] = useState<Partido[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [partidoToDelete, setPartidoToDelete] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        const data = await partidosService.getPartidos();
        setPartidos(data);
        setPartidosPaginados(data.slice(0, rowsPerPage));
      } catch (error) {
        console.error('Error al obtener los partidos:', error);
      }
    };

    fetchPartidos();
  }, [rowsPerPage]);

  const handleModify = (partido: Partido) => {
    navigate('/gestionPartidos/modificarPartido', { state: { partido } });
  };

  const handleDelete = async () => {
    if (partidoToDelete !== null) {
      try {
        await partidosService.eliminarPartido(partidoToDelete);
        const updatedPartidos = partidos.filter(p => p.id !== partidoToDelete);
        setPartidos(updatedPartidos);

        // Actualizar la paginación
        const startIndex = page * rowsPerPage;
        setPartidosPaginados(updatedPartidos.slice(startIndex, startIndex + rowsPerPage));

        setOpenConfirmDialog(false);
        setPartidoToDelete(null);
        toast.success('Partido eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar partido:', error);
      }
    }
  };

  const handleOpenDeleteDialog = (id: number) => {
    setPartidoToDelete(id);
    setOpenConfirmDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenConfirmDialog(false);
    setPartidoToDelete(null);
  };

  // Función para formatear la fecha en formato "dd-mm-yyyy"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  };

  // Función para formatear la hora en formato "hh:mm"
  const formatTime = (timeString: string) => {
    const time = new Date('1970-01-01T' + timeString + 'Z');
    return time.toISOString().substr(11, 5); // Extrae solo hh:mm
  };

  const handleAdd = () => {
    navigate('/gestionPartidos/crearPartido');
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    const startIndex = newPage * rowsPerPage;
    setPartidosPaginados(partidos.slice(startIndex, startIndex + rowsPerPage));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setPartidosPaginados(partidos.slice(0, newRowsPerPage));
  };

  return (
    <>
      <NavBar />
      <Box sx={{ backgroundColor: '#F5F5DC', minHeight: '100vh' }}>
        <Container sx={{ backgroundColor: '#F5F5DC', padding: 3, borderRadius: 2 }}>
          <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, backgroundColor: '#fafafa' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={8} sx={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>
                    Gestión de Partidos
                  </TableCell>
                </TableRow>
                <TableRow sx={{ backgroundColor: '#f0f0f0', color: '#333' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Hora</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Lugar</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Equipo Local</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Equipo Visitante</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Categoría</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Competición</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {partidosPaginados.map((partido) => (
                  <TableRow key={partido.id} sx={{ '&:hover': { backgroundColor: '#e8e8e8' }, transition: '0.3s' }}>
                    <TableCell sx={{ wordWrap: 'normal', whiteSpace: 'nowrap', minWidth: '120px' }}>
                        {formatDate(partido.fecha)}
                    </TableCell>
                    <TableCell>{formatTime(partido.hora)}</TableCell>
                    <TableCell>{partido.lugar}</TableCell>
                    <TableCell>{partido.equipoLocal}</TableCell>
                    <TableCell>{partido.equipoVisitante}</TableCell>
                    <TableCell>{partido.categoria}</TableCell>
                    <TableCell>{partido.competicion}</TableCell>
                    <TableCell>
                      <Tooltip title="Modificar partido" arrow>
                        <IconButton color="primary" onClick={() => handleModify(partido)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar partido" arrow>
                        <IconButton color="error" onClick={() => handleOpenDeleteDialog(partido.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAdd}>
              Agregar Partido
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
          />
        </Container>
      </Box>

      {/* Diálogo de confirmación */}
      <Dialog open={openConfirmDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>¿Seguro que deseas eliminar este partido? Esta acción no se puede deshacer.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="error">Cancelar</Button>
          <Button onClick={handleDelete} color="primary">Eliminar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PartidosView;
