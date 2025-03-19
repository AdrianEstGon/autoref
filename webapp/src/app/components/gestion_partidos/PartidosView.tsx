import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  IconButton, Button, Box, Tooltip, TablePagination, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle, Input, Typography as MuiTypography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile'; // Nuevo icono de carga de archivos
import partidosService from '../../services/PartidoService'; 
import polideportivoService from '../../services/PolideportivoService';
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
  nPartido: number;
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

  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        const data = await partidosService.getPartidos();
        
        // Ordenar los partidos por fecha y hora
        const sortedPartidos = data.sort((a: { fecha: string; hora: string; }, b: { fecha: string; hora: string; }) => {
          const dateA = new Date(a.fecha + 'T' + a.hora);
          const dateB = new Date(b.fecha + 'T' + b.hora);
          return dateA.getTime() - dateB.getTime(); // Ordenar de menor a mayor
        });
  
        setPartidos(sortedPartidos);
  
        // Lógica para mostrar solo los primeros partidos según la página y las filas por página
        const startIndex = page * rowsPerPage;  // Asegurarse de usar 'page' para la paginación correcta
        const endIndex = startIndex + rowsPerPage;
        setPartidosPaginados(sortedPartidos.slice(startIndex, endIndex));
  
      } catch (error) {
        console.error('Error al obtener los partidos:', error);
      }
    };
  
    fetchPartidos();
  }, [partidos, rowsPerPage, page]); // Dependencias: partidos, rowsPerPage y page
  
  

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

  const handleOpenDeleteDialog = (id: number) => {
    setPartidoToDelete(id);
    setOpenConfirmDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenConfirmDialog(false);
    setPartidoToDelete(null);
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
  
    // Actualiza partidosPaginados solo con los partidos visibles en la página actual
    setPartidosPaginados(partidos.slice(startIndex, endIndex));
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Resetea a la primera página
  
    // Actualiza los partidos paginados con el número nuevo de filas por página
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

        const formatDateFromExcel = (dateString: string) => {
          if (dateString && typeof dateString === 'string') {
            const parts = dateString.split('/');
            if (parts.length === 3) {
              return `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
          }
          return '';
        };

        const nuevosPartidos = await Promise.all(data.map(async (item: any) => {
          let lugar = item.Lugar;
          let lugarId = null;

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

          return {
            fecha: formatDateFromExcel(item.Fecha),
            hora: item.Hora,
            lugar: lugar,
            equipoLocal: item.EquipoLocal,
            equipoVisitante: item.EquipoVisitante,
            categoria: item.Categoria,
            jornada: item.Jornada,
            nPartido: item.NumeroPartido,
            lugarId: lugarId
          };
        }));

        try {
          const partidosCreados = await Promise.all(nuevosPartidos.map(async (partido) => {
            const partidoCreado = await partidosService.crearPartido(partido);
            return partidoCreado;
          }));

          toast.success('Partidos cargados correctamente');

          setPartidos((prevPartidos) => [...prevPartidos, ...partidosCreados]);
          setPartidosPaginados((prevPartidos) => [...prevPartidos, ...partidosCreados].slice(0, rowsPerPage));

        } catch (error) {
          console.error('Error al cargar los partidos:', error);
          toast.error('Hubo un error al cargar los partidos');
        }
      };

      reader.readAsBinaryString(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    toast.info('Archivo eliminado');

    const inputFile = document.getElementById('upload-file') as HTMLInputElement;
    if (inputFile) {
      inputFile.value = '';
    }
  };

  return (
    <>
      <NavBar />
      <Box sx={{ backgroundColor: '#F5F5DC', minHeight: '100vh' }}>
        <Container sx={{ backgroundColor: '#F5F5DC', padding: 3, borderRadius: 2, minWidth: '70%' }}>
        <TableContainer 
          component={Paper} 
          sx={{ 
            boxShadow: 3, 
            borderRadius: 2, 
            backgroundColor: '#fafafa', 
            width: '100%', // Asegurarse de que el contenedor de la tabla ocupe todo el ancho
            overflowX: 'hidden' // Eliminar el scroll horizontal
          }}
        >
          <Table sx={{ width: '100%' }}> {/* Asegurarse de que la tabla ocupe el 100% del contenedor */}
            <TableHead>
              <TableRow>
                <TableCell colSpan={9} sx={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>
                  Gestión de Partidos
                </TableCell>
              </TableRow>
              <TableRow sx={{ backgroundColor: '#f0f0f0', color: '#333' }}>
                {/* Ajustar la columna de Fecha con medidas relativas */}
                <TableCell sx={{ fontWeight: 'bold', minWidth: '4vw' }}>Fecha</TableCell>

                {/* Ajustar la columna de Hora */}
                <TableCell sx={{ fontWeight: 'bold', minWidth: '4vw' }}>Hora</TableCell>

                {/* Ajustar la columna de Lugar con medidas relativas */}
                <TableCell sx={{ fontWeight: 'bold', minWidth: '10vw' }}>Lugar</TableCell>

                <TableCell sx={{ fontWeight: 'bold', minWidth: '10vw' }}>Equipo Local</TableCell>
                <TableCell sx={{ fontWeight: 'bold', minWidth: '10vw' }}>Equipo Visitante</TableCell>
                <TableCell sx={{ fontWeight: 'bold', minWidth: '10vw' }}>Categoría</TableCell>
                <TableCell sx={{ fontWeight: 'bold', minWidth: '2vw' }}>Jornada</TableCell>

                {/* Columna de acciones, con un ancho fijo para evitar problemas */}
                <TableCell sx={{ fontWeight: 'bold', minWidth: '2vw' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {partidosPaginados.map((partido) => (
                <TableRow key={partido.id} sx={{ '&:hover': { backgroundColor: '#e8e8e8' }, transition: '0.3s' }}>
                  <TableCell>{formatDate(partido.fecha)}</TableCell>
                  <TableCell>{formatTime(partido.hora)}</TableCell>
                  <TableCell>{partido.lugar ? partido.lugar : '-'}</TableCell>
                  <TableCell>{partido.equipoLocal}</TableCell>
                  <TableCell>{partido.equipoVisitante}</TableCell>
                  <TableCell>{partido.categoria}</TableCell>
                  <TableCell>{partido.jornada}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleModify(partido)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleOpenDeleteDialog(partido.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>


          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={partidos.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />} 
              onClick={handleAdd}
            >
              Crear Partido
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {selectedFile && (
                <>
                  <MuiTypography sx={{ marginRight: 2 }}>
                    {selectedFile.name}
                  </MuiTypography>
                  <IconButton onClick={handleRemoveFile}>
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
              <Tooltip title="Cargar archivo">
                <label htmlFor="upload-file">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<UploadFileIcon />}
                  disabled={selectedFile !== null} // Deshabilita el botón si hay un archivo cargado
                >
                  Importar partidos desde archivo Excel
                </Button>

                </label>
              </Tooltip>
              <input 
                id="upload-file" 
                type="file" 
                accept=".xlsx, .xls" 
                style={{ display: 'none' }} 
                onChange={handleFileUpload} 
              />
            </Box>
          </Box>
        </Container>
      </Box>

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
