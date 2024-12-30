import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(express.json());

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Graduate Backend API' });
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Prisma 에러 핸들링
process.on('beforeExit', () => {
  prisma.$disconnect();
});
