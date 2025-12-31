import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

// Obtener todas las habilitaciones
export const getHabilitaciones = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { personaId, aprobado } = req.query;

    const where: any = {};
    if (personaId) where.personaId = personaId as string;
    if (aprobado !== undefined) where.aprobado = aprobado === 'true';

    const habilitaciones = await prisma.habilitacion.findMany({
      where,
      include: {
        persona: true,
        categoria: {
          include: {
            modalidad: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: { habilitaciones },
    });
  } catch (error) {
    next(error);
  }
};

// Obtener habilitación por ID
export const getHabilitacionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const habilitacion = await prisma.habilitacion.findUnique({
      where: { id },
      include: {
        persona: true,
        categoria: {
          include: {
            modalidad: true,
          },
        },
      },
    });

    if (!habilitacion) {
      return res.status(404).json({
        success: false,
        error: { message: 'Habilitación no encontrada' },
      });
    }

    res.json({
      success: true,
      data: { habilitacion },
    });
  } catch (error) {
    next(error);
  }
};

// Crear habilitación
export const createHabilitacion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { personaId, categoriaId, motivo, fechaInicio, fechaFin, aprobado } = req.body;

    const habilitacion = await prisma.habilitacion.create({
      data: {
        personaId,
        categoriaId,
        motivo,
        fechaInicio: new Date(fechaInicio),
        fechaFin: fechaFin ? new Date(fechaFin) : null,
        aprobado: aprobado || false,
      },
      include: {
        persona: true,
        categoria: {
          include: {
            modalidad: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: { habilitacion },
    });
  } catch (error) {
    next(error);
  }
};

// Aprobar habilitación
export const aprobarHabilitacion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const habilitacion = await prisma.habilitacion.update({
      where: { id },
      data: {
        aprobado: true,
      },
      include: {
        persona: true,
        categoria: {
          include: {
            modalidad: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: { habilitacion },
      message: 'Habilitación aprobada correctamente',
    });
  } catch (error) {
    next(error);
  }
};

// Rechazar habilitación
export const rechazarHabilitacion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.habilitacion.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Habilitación rechazada y eliminada',
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar habilitación
export const deleteHabilitacion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.habilitacion.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Habilitación eliminada correctamente',
    });
  } catch (error) {
    next(error);
  }
};
