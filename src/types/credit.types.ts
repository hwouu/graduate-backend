// src/types/credit.types.ts


export enum MajorTrackType {
  SINGLE = "SINGLE",       // 심화전공
  DOUBLE = "DOUBLE",       // 복수전공
  MINOR = "MINOR",        // 부전공
  INTEGRATED = "INTEGRATED" // 연계융합전공
}

export interface MajorTrackRequirement {
  singleMajor: number;     // 69학점
  doubleMajor: number;     // 87학점
  minorMajor: number;      // 69학점
  integratedMajor: number; // 81학점
}

export interface CreditSummary {
  totalCredits: number;
  majorRequired: number;
  majorElective: number;
  majorIntensive: number;
  liberalRequired: number;
  liberalElective: number;
  generalElective: number;
  seniorMajorElective: number;  // 4학년 전공선택 학점
  basicMajor: number;           // 기본전공 학점 (45학점)
  gpa: number;
  majorTrack: {
    singleMajor: number;
    doubleMajor: number;
    minorMajor: number;
    integratedMajor: number;
  };
}

export interface GraduationRequirement {
  totalCredits: number;              // 130학점
  majorRequired: number;             // 65학점
  majorElective: number;
  liberalRequired: number;
  liberalElective: number;
  minimumGPA: number;                // 2.0
  basicMajor: number;                // 45학점
  seniorMajorElectiveMinimum: number; // 6학점
  majorTrackMinimum: MajorTrackRequirement;
}

export interface GraduationStatus {
  fulfilled: boolean;
  current: CreditSummary;
  selectedTrack: MajorTrackType;
  remaining: {
    totalCredits: number;
    majorRequired: number;
    majorElective: number;
    liberalRequired: number;
    liberalElective: number;
    seniorMajorElective: number;
    basicMajor: number;
    majorTrack: {
      singleMajor: number;
      doubleMajor: number;
      minorMajor: number;
      integratedMajor: number;
    };
  };
  details: {
    isTotalCreditsFulfilled: boolean;
    isMajorRequiredFulfilled: boolean;
    isMajorElectiveFulfilled: boolean;
    isLiberalRequiredFulfilled: boolean;
    isLiberalElectiveFulfilled: boolean;
    isGPAFulfilled: boolean;
    isSeniorMajorElectiveFulfilled: boolean;
    isBasicMajorFulfilled: boolean;
    majorTrackStatus: {
      singleMajor: boolean;
      doubleMajor: boolean;
      minorMajor: boolean;
      integratedMajor: boolean;
    };
  };
}

// 사용자 스키마에 추가할 필드
export interface UserMajorTrack {
  selectedTrack: MajorTrackType;
  updatedAt: Date;
}