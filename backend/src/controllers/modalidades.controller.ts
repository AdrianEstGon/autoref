import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

// Obtener todas las modalidades
export const getModalidades = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const modalidades = await prisma.modalidad.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
      include: {
        categorias: {
          where: { activo: true },
          orderBy: { orden: 'asc' },
        },
      },
    });

    res.json({
      success: true,
      data: { modalidades },
    });
  } catch (error) {
    next(error);
  }
};

// Obtener modalidad por ID
export const getModalidadById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const modalidad = await prisma.modalidad.findUnique({
      where: { id },
      include: {
        categorias: {
          orderBy: { orden: 'asc' },
        },
      },
    });

    if (!modalidad) {
      return res.status(404).json({
        success: false,
        error: { message: 'Modalidad no encontrada' },
      });
    }

    res.json({
      success: true,
      data: { modalidad },
    });
  } catch (error) {
    next(error);
  }
};

// Crear modalidad
export const createModalidad = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre, descripcion, activo } = req.body;

    const modalidad = await prisma.modalidad.create({
      data: {
        nombre,
        descripcion,
        activo: activo !== false,
      },
    });

    res.status(201).json({
      success: true,
      data: { modalidad },
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar modalidad
export const updateModalidad = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, activo } = req.body;

    const modalidad = await prisma.modalidad.update({
      where: { id },
      data: {
        nombre,
        descripcion,
        activo,
      },
    });

    res.json({
      success: true,
      data: { modalidad },
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar modalidad
export const deleteModalidad = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.modalidad.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Modalidad eliminada correctamente',
    });
  } catch (error) {
    next(error);
  }
};
