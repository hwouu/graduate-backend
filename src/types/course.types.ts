import { Prisma } from '@prisma/client';

// CourseType enum 정의
export type CourseType = 'MAJOR_REQUIRED' | 'MAJOR_ELECTIVE' | 'MAJOR_INTENSIVE' | 
                        'LIBERAL_REQUIRED' | 'LIBERAL_ELECTIVE' | 'GENERAL_ELECTIVE';

export interface CreateCourseDTO {
  code: string;
  name: string;
  credits: number;
  courseType: CourseType;
  prerequisiteId?: string;
  semester?: string;
  isRequired: boolean;
}

export interface UpdateCourseDTO extends Partial<CreateCourseDTO> {}

export interface CourseFilters {
  courseType?: CourseType;
  semester?: string;
  isRequired?: boolean;
}