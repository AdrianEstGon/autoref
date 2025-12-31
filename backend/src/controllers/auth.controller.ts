import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rol: z.enum(['FEDERACION', 'COMITE_ARBITROS', 'CLUB', 'ARBITRO'])
});

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida')
});

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, rol } = registerSchema.parse(req.body);

    // Verificar si el usuario ya existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new AppError(400, 'El email ya está registrado');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.usuario.create({
      data: {
        email,
        password: hashedPassword,
        rol
      },
      select: {
        id: true,
        email: true,
        rol: true,
        activo: true,
        createdAt: true
      }
    });

    res.status(201).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(400, error.errors[0].message));
    }
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Buscar usuario
    const user = await prisma.usuario.findUnique({
      where: { email },
      include: {
        persona: {
          select: {
            id: true,
            nombre: true,
            apellidos: true
          }
        }
      }
    });

    if (!user || !user.activo) {
      throw new AppError(401, 'Usuario o contraseña incorrectos');
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new AppError(401, 'Usuario o contraseña incorrectos');
    }

    // Generar token
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      status: 'success',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          rol: user.rol,
          persona: user.persona
        }
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError(400, error.errors[0].message));
    }
    next(error);
  }
};

export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.usuario.findUnique({
      where: { id: req.user!.id },
      include: {
        persona: true
      },
      select: {
        id: true,
        email: true,
        rol: true,
        activo: true,
        persona: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new AppError(404, 'Usuario no encontrado');
    }

    res.json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};
