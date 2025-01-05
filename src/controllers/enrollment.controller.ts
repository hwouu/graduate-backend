// src/controllers/enrollment.controller.ts
import { Request, Response } from 'express';
import { PrismaClient, EnrollmentStatus } from '@prisma/client';
import { authenticateJwt } from '../middlewares/authenticate';

const prisma = new PrismaClient();

export class EnrollmentController {
 async createEnrollment(req: Request, res: Response) {
   try {
     const { courseId, semester, grade } = req.body;
     const userId = (req as any).user.id;

     const enrollment = await prisma.enrollment.create({
       data: {
         userId,
         courseId,
         semester,
         grade,
         status: 'PLANNED' as EnrollmentStatus
       },
       include: {
         course: true
       }
     });

     res.status(201).json(enrollment);
   } catch (error) {
     if (error instanceof Error) {
       if ((error as any).code === 'P2002') {
         res.status(400).json({ message: '이미 수강신청된 과목입니다.' });
       } else {
         res.status(500).json({ message: error.message });
       }
     } else {
       res.status(500).json({ message: 'An unknown error occurred' });
     }
   }
 }

 async getEnrollments(req: Request, res: Response) {
   try {
     const userId = (req as any).user.id;
     const semester = req.query.semester as string | undefined;
     const status = req.query.status as EnrollmentStatus | undefined;

     const enrollments = await prisma.enrollment.findMany({
       where: {
         userId,
         ...(semester && { semester }),
         ...(status && { status })
       },
       include: {
         course: true
       }
     });

     res.json(enrollments);
   } catch (error) {
     if (error instanceof Error) {
       res.status(500).json({ message: error.message });
     } else {
       res.status(500).json({ message: 'An unknown error occurred' });
     }
   }
 }

 async updateEnrollment(req: Request, res: Response) {
   try {
     const { id } = req.params;
     const { grade, status } = req.body;
     const userId = (req as any).user.id;

     const enrollment = await prisma.enrollment.findFirst({
       where: {
         id,
         userId
       }
     });

     if (!enrollment) {
       return res.status(404).json({ message: '수강신청 정보를 찾을 수 없습니다.' });
     }

     const updatedEnrollment = await prisma.enrollment.update({
       where: { id },
       data: {
         grade,
         status: status as EnrollmentStatus,
       },
       include: {
         course: true
       }
     });

     res.json(updatedEnrollment);
   } catch (error) {
     if (error instanceof Error) {
       res.status(500).json({ message: error.message });
     } else {
       res.status(500).json({ message: 'An unknown error occurred' });
     }
   }
 }

 async deleteEnrollment(req: Request, res: Response) {
   try {
     const { id } = req.params;
     const userId = (req as any).user.id;

     const enrollment = await prisma.enrollment.findFirst({
       where: {
         id,
         userId
       }
     });

     if (!enrollment) {
       return res.status(404).json({ message: '수강신청 정보를 찾을 수 없습니다.' });
     }

     await prisma.enrollment.delete({
       where: { id }
     });

     res.json({ message: '수강신청이 취소되었습니다.' });
   } catch (error) {
     if (error instanceof Error) {
       res.status(500).json({ message: error.message });
     } else {
       res.status(500).json({ message: 'An unknown error occurred' });
     }
   }
 }
}