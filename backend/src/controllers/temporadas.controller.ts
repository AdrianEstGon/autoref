import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

// Obtener todas las temporadas
export const getTemporadas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const temporadas = await prisma.temporada.findMany({
      orderBy: { fechaInicio: 'desc' },
    });

    res.json({
      success: true,
      data: { temporadas },
    });
  } catch (error) {
    next(error);
  }
};

// Obtener temporada por ID
export const getTemporadaById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const temporada = await prisma.temporada.findUnique({
      where: { id },
      include: {
        licencias: {
          include: {
            persona: true,
            modalidad: true,
            categoria: true,
          },
        },
      },
    });

    if (!temporada) {
      return res.status(404).json({
        success: false,
        error: { message: 'Temporada no encontrada' },
      });
    }

    res.json({
      success: true,
      data: { temporada },
    });
  } catch (error) {
    next(error);
  }
};

// Crear temporada
export const createTemporada = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre, fechaInicio, fechaFin, activa } = req.body;

    // Si se marca como activa, desactivar las demás
    if (activa) {
      await prisma.temporada.updateMany({
        where: { activa: true },
        data: { activa: false },
      });
    }

    const temporada = await prisma.temporada.create({
      data: {
        nombre,
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin),
        activa: activa || false,
      },
    });

    res.status(201).json({
      success: true,
      data: { temporada },
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar temporada
export const updateTemporada = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { nombre, fechaInicio, fechaFin, activa } = req.body;

    // Si se marca como activa, desactivar las demás
    if (activa) {
      await prisma.temporada.updateMany({
        where: { activa: true, id: { not: id } },
        data: { activa: false },
      });
    }

    const temporada = await prisma.temporada.update({
      where: { id },
      data: {
        nombre,
        fechaInicio: fechaInicio ? new Date(fechaInicio) : undefined,
        fechaFin: fechaFin ? new Date(fechaFin) : undefined,
        activa,
      },
    });

    res.json({
      success: true,
      data: { temporada },
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar temporada
export const deleteTemporada = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.temporada.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Temporada eliminada correctamente',
    });
  } catch (error) {
    next(error);
  }
};
