import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

// Obtener todas las licencias
export const getLicencias = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { personaId, temporadaId, estado } = req.query;

    const where: any = {};
    if (personaId) where.personaId = personaId as string;
    if (temporadaId) where.temporadaId = temporadaId as string;
    if (estado) where.estado = estado as string;

    const licencias = await prisma.licencia.findMany({
      where,
      include: {
        persona: true,
        temporada: true,
        modalidad: true,
        categoria: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: { licencias },
    });
  } catch (error) {
    next(error);
  }
};

// Obtener licencia por ID
export const getLicenciaById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const licencia = await prisma.licencia.findUnique({
      where: { id },
      include: {
        persona: true,
        temporada: true,
        modalidad: true,
        categoria: true,
      },
    });

    if (!licencia) {
      return res.status(404).json({
        success: false,
        error: { message: 'Licencia no encontrada' },
      });
    }

    res.json({
      success: true,
      data: { licencia },
    });
  } catch (error) {
    next(error);
  }
};

// Crear licencia
export const createLicencia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { personaId, temporadaId, modalidadId, categoriaId, numero, estado } = req.body;

    // Generar número si no se proporciona
    let numeroFinal = numero;
    if (!numeroFinal) {
      const count = await prisma.licencia.count();
      numeroFinal = `LIC-${(count + 1).toString().padStart(6, '0')}`;
    }

    const licencia = await prisma.licencia.create({
      data: {
        personaId,
        temporadaId,
        modalidadId,
        categoriaId,
        numero: numeroFinal,
        estado: estado || 'PENDIENTE',
      },
      include: {
        persona: true,
        temporada: true,
        modalidad: true,
        categoria: true,
      },
    });

    res.status(201).json({
      success: true,
      data: { licencia },
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        error: { message: 'Ya existe una licencia para esta persona en esta temporada, modalidad y categoría' },
      });
    }
    next(error);
  }
};

// Actualizar licencia
export const updateLicencia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { estado, observaciones, fechaEmision, fechaVencimiento } = req.body;

    const licencia = await prisma.licencia.update({
      where: { id },
      data: {
        estado,
        observaciones,
        fechaEmision: fechaEmision ? new Date(fechaEmision) : undefined,
        fechaVencimiento: fechaVencimiento ? new Date(fechaVencimiento) : undefined,
      },
      include: {
        persona: true,
        temporada: true,
        modalidad: true,
        categoria: true,
      },
    });

    res.json({
      success: true,
      data: { licencia },
    });
  } catch (error) {
    next(error);
  }
};

// Validar licencia
export const validarLicencia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const licencia = await prisma.licencia.update({
      where: { id },
      data: {
        estado: 'VALIDADA',
        fechaEmision: new Date(),
      },
      include: {
        persona: true,
        temporada: true,
        modalidad: true,
        categoria: true,
      },
    });

    res.json({
      success: true,
      data: { licencia },
      message: 'Licencia validada correctamente',
    });
  } catch (error) {
    next(error);
  }
};

// Rechazar licencia
export const rechazarLicencia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;

    const licencia = await prisma.licencia.update({
      where: { id },
      data: {
        estado: 'RECHAZADA',
        observaciones: motivo,
      },
      include: {
        persona: true,
        temporada: true,
        modalidad: true,
        categoria: true,
      },
    });

    res.json({
      success: true,
      data: { licencia },
      message: 'Licencia rechazada',
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar licencia
export const deleteLicencia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.licencia.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Licencia eliminada correctamente',
    });
  } catch (error) {
    next(error);
  }
};
