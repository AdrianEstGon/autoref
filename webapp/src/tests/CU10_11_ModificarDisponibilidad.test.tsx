import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { act, createRef } from 'react';
import { MemoryRouter } from 'react-router-dom';
import DisponibilidadView from '../app/components/disponibilidad/DisponibilidadView';
import disponibilidadService from '../app/services/DisponibilidadService';
import userEvent from '@testing-library/user-event';

// ⏱️ Setea una fecha controlada para consistencia
jest.useFakeTimers().setSystemTime(new Date('2025-06-25'));

jest.mock('../app/services/DisponibilidadService', () => ({
  getDisponibilidadByUserAndDate: jest.fn(),
  actualizarDisponibilidad: jest.fn(),
  crearDisponibilidad: jest.fn(),
}));

// 🔑 Simula que el usuario está logueado
beforeEach(() => {
  Storage.prototype.getItem = jest.fn(() => '123'); // userId
});

test('debe abrir el diálogo al seleccionar una fecha', async () => {
  const testRef = createRef<any>();
  (disponibilidadService.getDisponibilidadByUserAndDate as jest.Mock).mockResolvedValue(null);

  render(
    <MemoryRouter>
      <DisponibilidadView ref={testRef} />
    </MemoryRouter>
  );

  // Forzar evento desde el ref como haría react-big-calendar
  const testDate = new Date('2025-07-10'); // fecha válida (más de 7 días)
  await act(async () => {
    testRef.current?.handleSelectSlot?.({ start: testDate });
  });

  // Esperar a que se abra el diálogo
  const dialog = await screen.findByTestId('availability-dialog');
  expect(dialog).toBeInTheDocument();
  expect(screen.getByText(/seleccionar disponibilidad/i)).toBeInTheDocument();
});

test('debe crear disponibilidad al guardar en un día sin disponibilidad previa', async () => {
  const user = userEvent.setup();
  const ref = createRef<any>();

  // Simula que no hay disponibilidad previa
  (disponibilidadService.getDisponibilidadByUserAndDate as jest.Mock).mockResolvedValueOnce(null);

  render(
    <MemoryRouter>
      <DisponibilidadView ref={ref} />
    </MemoryRouter>
  );

  // Forzar selección de un día válido
  const testDate = new Date('2025-07-05');
  await act(async () => {
    await ref.current?.handleSelectSlot?.({ start: testDate });
  });

  const dialog = await screen.findByTestId('availability-dialog');
  expect(dialog).toBeInTheDocument();

  // Seleccionar valores del Select
  await user.click(screen.getByTestId('select-franja1'));
  await user.click(await screen.findByText('Disponible con transporte'));

  await user.click(screen.getByTestId('select-franja2'));
  await user.click(await screen.findByText('Disponible sin transporte'));

  // Rellenar comentario
  const comentariosInput = screen.getByLabelText(/comentarios/i);
  await user.clear(comentariosInput);
  await user.type(comentariosInput, 'Disponible por la mañana');

  // Mock para verificar la llamada
  (disponibilidadService.crearDisponibilidad as jest.Mock).mockResolvedValue({});

  // Guardar
  await user.click(screen.getByRole('button', { name: /guardar/i }));

  // Validación
  await waitFor(() => {
    expect(disponibilidadService.crearDisponibilidad).toHaveBeenCalledTimes(1);
    expect(disponibilidadService.crearDisponibilidad).toHaveBeenCalledWith(
      expect.objectContaining({
        usuarioId: '123',
        fecha: '2025-07-05',
        franja1: 1,
        franja2: 2,
        franja3: 0,
        franja4: 0,
        comentarios: 'Disponible por la mañana',
      })
    );
  });
}, 15000); // ⏱️ aumenta el timeout

