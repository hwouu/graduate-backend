// src/services/credit.service.ts

import { PrismaClient } from "@prisma/client";
import type { Prisma, Enrollment, Course } from "@prisma/client";
import {
 GraduationRequirement,
 GraduationStatus,
 CreditSummary,
 MajorTrackType,
 MajorTrackRequirement,
} from "../types/credit.types";

type EnrollmentWithCourse = Enrollment & {
 course: Course;
};

export class CreditService {
 private prisma: PrismaClient;

 constructor() {
   this.prisma = new PrismaClient();
 }

 private getGraduationRequirement(admissionYear: number): GraduationRequirement {
   // 기본 전공 트랙 요구사항
   const majorTrackMinimum: MajorTrackRequirement = {
     singleMajor: 69,
     doubleMajor: 87,
     minorMajor: 69,
     integratedMajor: 81,
   };

   const baseRequirement = {
     liberalRequired: 30,
     liberalElective: 15,
     minimumGPA: 2.0,
     basicMajor: 45,
     seniorMajorElectiveMinimum: 6,
     majorTrackMinimum,
   };

   if (admissionYear <= 2012) {
     return {
       ...baseRequirement,
       totalCredits: 140,
       majorRequired: 70,
       majorElective: 70,
     };
   } else {
     // 2013학번 이후 
     return {
       ...baseRequirement,
       totalCredits: 130,
       majorRequired: 65,
       majorElective: 65,
     };
   }
 }

 async calculateCredits(userId: string): Promise<CreditSummary> {
   const enrollments = await this.prisma.enrollment.findMany({
     where: {
       userId,
       status: "COMPLETED",
     },
     include: {
       course: true,
     },
   });

   if (enrollments.length === 0) {
     throw new Error("수강 내역이 없습니다");
   }

   const summary: CreditSummary = {
     totalCredits: 0,
     majorRequired: 0,
     majorElective: 0,
     majorIntensive: 0,
     liberalRequired: 0,
     liberalElective: 0,
     generalElective: 0,
     seniorMajorElective: 0,
     basicMajor: 0,
     gpa: 0,
     majorTrack: {
       singleMajor: 0,
       doubleMajor: 0,
       minorMajor: 0,
       integratedMajor: 0,
     },
   };

   let totalGradePoints = 0;
   let totalCredits = 0;

   enrollments.forEach((enrollment: EnrollmentWithCourse) => {
     const { course, grade } = enrollment;
     const credits = course.credits;
     const gradePoint = this.convertGradeToPoint(grade);

     totalGradePoints += credits * gradePoint;
     totalCredits += credits;

     switch (course.courseType) {
       case "MAJOR_REQUIRED":
         summary.majorRequired += credits;
         summary.basicMajor += credits;
         summary.majorTrack.singleMajor += credits;
         break;
       case "MAJOR_ELECTIVE":
         summary.majorElective += credits;
         summary.basicMajor += credits;
         summary.majorTrack.singleMajor += credits;

         if (this.isSeniorCourse(course)) {
           summary.seniorMajorElective += credits;
         }
         break;
       case "MAJOR_INTENSIVE":
         summary.majorIntensive += credits;
         summary.majorTrack.singleMajor += credits;
         break;
       case "LIBERAL_REQUIRED":
         summary.liberalRequired += credits;
         break;
       case "LIBERAL_ELECTIVE":
         summary.liberalElective += credits;
         break;
       case "GENERAL_ELECTIVE":
         summary.generalElective += credits;
         break;
     }
   });

   summary.totalCredits = totalCredits;
   summary.gpa = totalCredits > 0 ? +(totalGradePoints / totalCredits).toFixed(2) : 0;

   return summary;
 }

 async checkGraduationStatus(userId: string): Promise<GraduationStatus> {
   const user = await this.prisma.user.findUnique({
     where: { id: userId },
     include: {
       majorTrack: true,
     },
   });

   if (!user) {
     throw new Error("사용자를 찾을 수 없습니다");
   }

   const requirement = this.getGraduationRequirement(user.admissionYear);
   const currentCredits = await this.calculateCredits(userId);
   const selectedTrack: MajorTrackType = 
     (user.majorTrack?.selectedTrack as MajorTrackType) ?? MajorTrackType.SINGLE;

   const status: GraduationStatus = {
     fulfilled: false,
     current: currentCredits,
     selectedTrack,
     remaining: {
       totalCredits: Math.max(
         0,
         requirement.totalCredits - currentCredits.totalCredits
       ),
       majorRequired: Math.max(
         0,
         requirement.majorRequired - currentCredits.majorRequired
       ),
       majorElective: Math.max(
         0,
         requirement.majorElective - currentCredits.majorElective
       ),
       liberalRequired: Math.max(
         0,
         requirement.liberalRequired - currentCredits.liberalRequired
       ),
       liberalElective: Math.max(
         0,
         requirement.liberalElective - currentCredits.liberalElective
       ),
       seniorMajorElective: Math.max(
         0,
         requirement.seniorMajorElectiveMinimum -
           currentCredits.seniorMajorElective
       ),
       basicMajor: Math.max(
         0,
         requirement.basicMajor - currentCredits.basicMajor
       ),
       majorTrack: {
         singleMajor: Math.max(
           0,
           requirement.majorTrackMinimum.singleMajor -
             currentCredits.majorTrack.singleMajor
         ),
         doubleMajor: Math.max(
           0,
           requirement.majorTrackMinimum.doubleMajor -
             currentCredits.majorTrack.doubleMajor
         ),
         minorMajor: Math.max(
           0,
           requirement.majorTrackMinimum.minorMajor -
             currentCredits.majorTrack.minorMajor
         ),
         integratedMajor: Math.max(
           0,
           requirement.majorTrackMinimum.integratedMajor -
             currentCredits.majorTrack.integratedMajor
         ),
       },
     },
     details: {
       isTotalCreditsFulfilled:
         currentCredits.totalCredits >= requirement.totalCredits,
       isMajorRequiredFulfilled:
         currentCredits.majorRequired >= requirement.majorRequired,
       isMajorElectiveFulfilled:
         currentCredits.majorElective >= requirement.majorElective,
       isLiberalRequiredFulfilled:
         currentCredits.liberalRequired >= requirement.liberalRequired,
       isLiberalElectiveFulfilled:
         currentCredits.liberalElective >= requirement.liberalElective,
       isGPAFulfilled: currentCredits.gpa >= requirement.minimumGPA,
       isSeniorMajorElectiveFulfilled:
         currentCredits.seniorMajorElective >=
         requirement.seniorMajorElectiveMinimum,
       isBasicMajorFulfilled:
         currentCredits.basicMajor >= requirement.basicMajor,
       majorTrackStatus: {
         singleMajor:
           currentCredits.majorTrack.singleMajor >=
           requirement.majorTrackMinimum.singleMajor,
         doubleMajor:
           currentCredits.majorTrack.doubleMajor >=
           requirement.majorTrackMinimum.doubleMajor,
         minorMajor:
           currentCredits.majorTrack.minorMajor >=
           requirement.majorTrackMinimum.minorMajor,
         integratedMajor:
           currentCredits.majorTrack.integratedMajor >=
           requirement.majorTrackMinimum.integratedMajor,
       },
     },
   };

   status.fulfilled = this.checkTrackRequirements(status, selectedTrack);

   return status;
 }

 private convertGradeToPoint(grade: string | null): number {
   if (!grade) return 0;

   const gradePoints: { [key: string]: number } = {
     "A+": 4.5,
     A0: 4.0,
     "B+": 3.5,
     B0: 3.0,
     "C+": 2.5,
     C0: 2.0,
     "D+": 1.5,
     D0: 1.0,
     F: 0.0,
   };

   return gradePoints[grade] || 0;
 }

 private isSeniorCourse(course: Course): boolean {
   return Boolean(course.code.startsWith("4") || course.semester?.startsWith("4"));
 }

 private checkTrackRequirements(
   status: GraduationStatus,
   track: MajorTrackType
 ): boolean {
   const basicRequirements =
     status.details.isTotalCreditsFulfilled &&
     status.details.isGPAFulfilled &&
     status.details.isBasicMajorFulfilled &&
     status.details.isSeniorMajorElectiveFulfilled;

   switch (track) {
     case MajorTrackType.SINGLE:
       return Boolean(basicRequirements && status.details.majorTrackStatus.singleMajor);
     case MajorTrackType.DOUBLE:
       return Boolean(basicRequirements && status.details.majorTrackStatus.doubleMajor);
     case MajorTrackType.MINOR:
       return Boolean(basicRequirements && status.details.majorTrackStatus.minorMajor);
     case MajorTrackType.INTEGRATED:
       return Boolean(basicRequirements && status.details.majorTrackStatus.integratedMajor);
     default:
       return false;
   }
 }
}