import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getDB, User } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'restaurante_secret_key_super_segura_2026';

export interface AuthRequest extends Request {
  user?: Omit<User, 'passwordHash'>;
}

export function generateToken(user: Omit<User, 'passwordHash'>): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acesso não autorizado. Token ausente.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const db = getDB();
    const foundUser = db.users.find(u => u.id === decoded.id && u.isActive);

    if (!foundUser) {
      return res.status(401).json({ error: 'Usuário não encontrado ou inativo.' });
    }

    const { passwordHash, ...userWithoutPassword } = foundUser;
    req.user = userWithoutPassword;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido ou expirado.' });
  }
}

export function authorizeRoles(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado.' });
    }

    if (req.user.role === 'admin') {
      return next(); // Admin always bypasses role checks
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acesso negado para este perfil.' });
    }

    next();
  };
}
