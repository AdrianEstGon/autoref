import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import partidosService from '../app/services/PartidoService';
import notificacionesService from '../app/services/NotificacionService';
import usuariosService from '../app/services/UserService';
import categoriaService from '../app/services/CategoriaService';
import polideportivoService from '../app/services/PolideportivoService';
import disponibilidadService from '../app/services/DisponibilidadService';
import equipoService from '../app/services/EquipoService';

import DesignacionesView from '../app/components/gestion_designaciones/PanelDesignacionesView';

jest.mock('../app/services/PartidoService');
jest.mock('../app/services/NotificacionService');
jest.mock('../app/services/UserService');
jest.mock('../app/services/CategoriaService');
jest.mock('../app/services/PolideportivoService');
jest.mock('../app/services/DisponibilidadService');
jest.mock('../app/services/EquipoService');

describe('CU02 - Publicar Designaciones', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debería publicar las designaciones de los partidos y notificar a cada árbitro asignado', async () => {
    const partido1 = {
      id: 1,
      equipoLocal: 'Equipo A',
      equipoVisitante: 'Equipo B',
      fecha: '2025-07-10',
      hora: '18:00:00',
      lugar: 'Polideportivo Central',
      lugarId: 1,
      categoria: 'Senior',
      categoriaId: 1,
      arbitro1Id: 10,
      arbitro2Id: 20,
      anotadorId: 30,
      estadoArbitro1: 0,
      estadoArbitro2: 0,
      estadoAnotador: 0,
    };

    const partido2 = {
      id: 2,
      equipoLocal: 'Equipo C',
      equipoVisitante: 'Equipo D',
      fecha: '2025-07-11',
      hora: '19:00:00',
      lugar: 'Polideportivo Norte',
      lugarId: 2,
      categoria: 'Juvenil',
      categoriaId: 2,
      arbitro1Id: 40,
      arbitro2Id: 50,
      anotadorId: 60,
      estadoArbitro1: 0,
      estadoArbitro2: 0,
      estadoAnotador: 0,
    };

    const arbitros = [
      { id: 10, nombre: 'Árbitro Uno', primerApellido: '', segundoApellido: '' },
      { id: 20, nombre: 'Árbitro Dos', primerApellido: '', segundoApellido: '' },
      { id: 30, nombre: 'Árbitro Tres', primerApellido: '', segundoApellido: '' },
      { id: 40, nombre: 'Árbitro Cuatro', primerApellido: '', segundoApellido: '' },
      { id: 50, nombre: 'Árbitro Cinco', primerApellido: '', segundoApellido: '' },
      { id: 60, nombre: 'Árbitro Seis', primerApellido: '', segundoApellido: '' },
    ];

    // Mock de servicios
    (partidosService.getPartidos as jest.Mock).mockResolvedValue([partido1, partido2]);
    (usuariosService.getUsuarios as jest.Mock).mockResolvedValue(arbitros);
    (categoriaService.getCategorias as jest.Mock).mockResolvedValue([]);
    (polideportivoService.getPolideportivos as jest.Mock).mockResolvedValue([]);
    (disponibilidadService.getDisponibilidades as jest.Mock).mockResolvedValue([]);
    (equipoService.getEquipos as jest.Mock).mockResolvedValue([]);

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <DesignacionesView />
      </MemoryRouter>
    );

    // Esperar a que se muestre el panel
    expect(await screen.findByText(/Panel de Designaciones/i)).toBeInTheDocument();

    // Clic en botón publicar
    await user.click(screen.getByRole('button', { name: /Publicar Designaciones/i }));

    // Confirmar en el diálogo
    const confirmar = await screen.findByRole('button', { name: /Confirmar/i });
    await user.click(confirmar);

    // Verificar llamadas a servicios
    await waitFor(() => {
      expect(partidosService.actualizarPartido).toHaveBeenCalledTimes(2);
      expect(notificacionesService.crearNotificacion).toHaveBeenCalledTimes(6);
    });

    const llamadas = (notificacionesService.crearNotificacion as jest.Mock).mock.calls;
    const ids = llamadas.map(([params]) => params.usuarioId);
    expect(ids).toEqual(expect.arrayContaining([10, 20, 30, 40, 50, 60]));
  });
});
