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



