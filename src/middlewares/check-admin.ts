import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const checkAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: '인증이 필요합니다' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    // Role이 enum이므로 string으로 직접 비교
    if (!user) {
      return res.status(403).json({ error: '사용자를 찾을 수 없습니다' });
    }

    // @ts-ignore
    if (user.role !== 'ADMIN') {
      return res.status(403).json({ error: '관리자 권한이 필요합니다' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: '서버 에러가 발생했습니다' });
  }
};