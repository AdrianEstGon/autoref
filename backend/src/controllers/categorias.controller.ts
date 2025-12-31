import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

// Obtener todas las categorías
export const getCategorias = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { modalidadId } = req.query;

    const where: any = { activo: true };
    if (modalidadId) {
      where.modalidadId = modalidadId as string;
    }

    const categorias = await prisma.categoria.findMany({
      where,
      orderBy: { orden: 'asc' },
      include: {
        modalidad: true,
      },
    });

    res.json({
      success: true,
      data: { categorias },
    });
  } catch (error) {
    next(error);
  }
};

// Obtener categoría por ID
export const getCategoriaById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const categoria = await prisma.categoria.findUnique({
      where: { id },
      include: {
        modalidad: true,
      },
    });

    if (!categoria) {
      return res.status(404).json({
        success: false,
        error: { message: 'Categoría no encontrada' },
      });
    }

    res.json({
      success: true,
      data: { categoria },
    });
  } catch (error) {
    next(error);
  }
};

// Crear categoría
export const createCategoria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nombre, modalidadId, edadMinima, edadMaxima, orden, activo } = req.body;

    const categoria = await prisma.categoria.create({
      data: {
        nombre,
        modalidadId,
        edadMinima,
        edadMaxima,
        orden: orden || 0,
        activo: activo !== false,
      },
    });

    res.status(201).json({
      success: true,
      data: { categoria },
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar categoría
export const updateCategoria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { nombre, edadMinima, edadMaxima, orden, activo } = req.body;

    const categoria = await prisma.categoria.update({
      where: { id },
      data: {
        nombre,
        edadMinima,
        edadMaxima,
        orden,
        activo,
      },
    });

    res.json({
      success: true,
      data: { categoria },
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar categoría
export const deleteCategoria = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.categoria.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Categoría eliminada correctamente',
    });
  } catch (error) {
    next(error);
  }
};
