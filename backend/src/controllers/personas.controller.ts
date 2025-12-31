import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const createPersonaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  apellidos: z.string().min(1, 'Los apellidos son requeridos'),
  dni: z.string().min(1, 'El DNI es requerido'),
  fechaNacimiento: z.string().datetime(),
  telefono: z.string().optional(),
  email: z.string().email('Email inválido').optional(),
  direccion: z.string().optional(),
  ciudad: z.string().optional(),
  codigoPostal: z.string().optional(),
  tipo: z.enum(['JUGADOR', 'TECNICO', 'ARBITRO', 'DIRECTIVO'])
});

const updatePersonaSchema = createPersonaSchema.partial();

export const getPersonas = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search, tipo, page = '1', limit = '10' } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = { activo: true };

    if (search) {
      where.OR = [
        { nombre: { contains: search as string, mode: 'insensitive' } },
        { apellidos: { contains: search as string, mode: 'insensitive' } },
        { dni: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (tipo) {
      where.tipo = tipo;
    }

    const [personas, total] = await Promise.all([
      prisma.persona.findMany({
        where,
        skip,
        take,
        orderBy: { apellidos: 'asc' }
      }),
      prisma.persona.count({ where })
    ]);

    res.json({
      status: 'success',
      data: {
        personas,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getPersonaById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const persona = await prisma.persona.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            email: true,
            rol: true,
            activo: true
          }
        },
        licencias: {
          include: {
            temporada: true,
            modalidad: true,
            categoria: true
          }
        },
        habilitaciones: {
          include: {
            categoria: true
          }
        }
      }
    });

    if (!persona) {
      throw new AppError(404, 'Persona no encontrada');
    }

    res.json({
      status: 'success',
      data: { persona }
    });
  } catch (error) {
    next(error);
  }
};

export const createPersona = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = createPersonaSchema.parse(req.body);

    // Verificar si el DNI ya existe
    const existingPersona = await prisma.persona.findUnique({
      where: { dni: data.dni }
    });

    if (existingPersona) {
      throw new AppError(400, 'Ya existe una persona con ese DNI');
    }

    const persona = await prisma.persona.create({
      data: {
        ...data,
        fechaNacimiento: new Date(data.fechaNacimiento)
      }
    });

    res.status(201).json({
      status: 'success',
      data: { persona }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(400, error.errors[0].message));
    }
    next(error);
  }
};

export const updatePersona = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = updatePersonaSchema.parse(req.body);

    // Verificar si la persona existe
    const existingPersona = await prisma.persona.findUnique({
      where: { id }
    });

    if (!existingPersona) {
      throw new AppError(404, 'Persona no encontrada');
    }

    // Si se actualiza el DNI, verificar que no esté en uso
    if (data.dni && data.dni !== existingPersona.dni) {
      const dniInUse = await prisma.persona.findUnique({
        where: { dni: data.dni }
      });

      if (dniInUse) {
        throw new AppError(400, 'Ya existe una persona con ese DNI');
      }
    }

    const updateData: any = { ...data };
    if (data.fechaNacimiento) {
      updateData.fechaNacimiento = new Date(data.fechaNacimiento);
    }

    const persona = await prisma.persona.update({
      where: { id },
      data: updateData
    });

    res.json({
      status: 'success',
      data: { persona }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(400, error.errors[0].message));
    }
    next(error);
  }
};

export const deletePersona = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Verificar si la persona existe
    const existingPersona = await prisma.persona.findUnique({
      where: { id }
    });

    if (!existingPersona) {
      throw new AppError(404, 'Persona no encontrada');
    }

    // Soft delete
    await prisma.persona.update({
      where: { id },
      data: { activo: false }
    });

    res.json({
      status: 'success',
      message: 'Persona eliminada correctamente'
    });
  } catch (error) {
    next(error);
  }
};
