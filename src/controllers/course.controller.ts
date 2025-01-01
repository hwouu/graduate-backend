// src/controllers/course.controller.ts
import { Request, Response } from "express";
import { CourseService } from "../services/course.service";
import { CourseType } from "../types/course.types";

const courseService = new CourseService();

export class CourseController {
  async createCourse(req: Request, res: Response) {
    try {
      const result = await courseService.createCourse(req.body);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "서버 에러가 발생했습니다" });
      }
    }
  }

  async getCourses(req: Request, res: Response) {
    try {
      const filters = {
        courseType: req.query.courseType as CourseType | undefined,
        semester: req.query.semester as string | undefined,
        isRequired: req.query.isRequired === "true",
      };
      const result = await courseService.getCourses(filters);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "서버 에러가 발생했습니다" });
    }
  }

  async getCourseById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await courseService.getCourseById(id);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: "서버 에러가 발생했습니다" });
      }
    }
  }

  async updateCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await courseService.updateCourse(id, req.body);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "서버 에러가 발생했습니다" });
      }
    }
  }

  async deleteCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await courseService.deleteCourse(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "서버 에러가 발생했습니다" });
      }
    }
  }
}
