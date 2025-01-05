// src/controllers/credit.controller.ts
import { Request, Response } from 'express';
import { CreditService } from '../services/credit.service';

export class CreditController {
  private creditService: CreditService;

  constructor() {
    this.creditService = new CreditService();
  }

  async getCreditsSummary(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const currentUserId = (req as any).user.id;

      // 본인의 정보만 조회 가능
      if (userId !== currentUserId) {
        return res.status(403).json({ 
          message: '다른 사용자의 학점 정보를 조회할 수 없습니다.' 
        });
      }
      
      const summary = await this.creditService.calculateCredits(userId);
      res.json(summary);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  }

  async getGraduationStatus(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const currentUserId = (req as any).user.id;

      // 본인의 정보만 조회 가능
      if (userId !== currentUserId) {
        return res.status(403).json({ 
          message: '다른 사용자의 졸업요건 정보를 조회할 수 없습니다.' 
        });
      }

      const status = await this.creditService.checkGraduationStatus(userId);
      res.json(status);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  }

  // 추후 필요한 기능 추가 가능
  // - 전공 트랙 변경
  // - 시뮬레이션 (가상의 과목 추가/제거 후 졸업요건 확인)
  // - 학기별 성적 통계
  // - 등등...
}