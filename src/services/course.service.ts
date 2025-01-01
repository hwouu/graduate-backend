// src/services/course.service.ts
import { PrismaClient } from '@prisma/client';
import { CreateCourseDTO, UpdateCourseDTO, CourseFilters } from '../types/course.types';

const prisma = new PrismaClient();

export class CourseService {
  async createCourse(data: CreateCourseDTO) {
    const existingCourse = await prisma.course.findUnique({
      where: { code: data.code }
    });

    if (existingCourse) {
      throw new Error('이미 존재하는 과목 코드입니다');
    }

    return prisma.course.create({ data });
  }

  async getCourses(filters?: CourseFilters) {
    return prisma.course.findMany({
      where: filters,
      include: {
        prerequisite: true,
        nextCourses: true
      }
    });

  }

  async getCourseById(id: string) {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        prerequisite: true,
        nextCourses: true,
        enrollments: {
          include: {
            user: true
          }
        }
      }
    });

    if (!course) {
      throw new Error('과목을 찾을 수 없습니다');
    }

    return course;
  }

  async updateCourse(id: string, data: UpdateCourseDTO) {
    const course = await prisma.course.findUnique({
      where: { id }
    });

    if (!course) {
      throw new Error('과목을 찾을 수 없습니다');
    }

    return prisma.course.update({
      where: { id },
      data
    });
  }

  async deleteCourse(id: string) {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        enrollments: true,
        nextCourses: true
      }
    });

    if (!course) {
      throw new Error('과목을 찾을 수 없습니다');
    }

    if (course.enrollments.length > 0) {
      throw new Error('수강 내역이 있는 과목은 삭제할 수 없습니다');
    }

    if (course.nextCourses.length > 0) {
      throw new Error('선수과목으로 지정된 과목은 삭제할 수 없습니다');
    }

    return prisma.course.delete({
      where: { id }
    });
  }
}