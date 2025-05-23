// DisponibilidadView.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DisponibilidadView from '../app/components/disponibilidad/DisponibilidadView';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

// Mock de servicios necesarios
jest.mock('../app/services/DisponibilidadService', () => ({
  getDisponibilidadByUserAndDate: jest.fn().mockResolvedValue(null),
  actualizarDisponibilidad: jest.fn(),
  crearDisponibilidad: jest.fn(),
}));

// Mock de localStorage
beforeEach(() => {
  Storage.prototype.getItem = jest.fn(() => '123'); // Mock userId
});

describe('DisponibilidadView', () => {
  it('debe abrir el diálogo al seleccionar un día válido del calendario (más de 7 días en el futuro)', async () => {
    render( 
    <MemoryRouter> <DisponibilidadView /> </MemoryRouter>);
    
    const user = userEvent.setup();

    // Esperar a que el calendario esté presente
    await screen.findByText(/mi disponibilidad/i);

    // Obtener una fecha válida (10 días en el futuro desde hoy)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    const targetDay = futureDate.getDate();

    // Simular click en un día válido del calendario
    const dayButton = await screen.findByText(targetDay.toString());
    await user.click(dayButton);

    // Esperar a que el cuadro de diálogo se abra
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(/seleccionar disponibilidad/i)).toBeInTheDocument();
    });
  });
});
