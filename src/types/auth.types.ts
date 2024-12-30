export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
  studentId: string;
  department: string;
  admissionYear: number;
  targetYear: number;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
}