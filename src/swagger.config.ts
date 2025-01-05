// src/swagger.config.ts
import { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '졸업하자 API Documentation',
      version: '1.0.0',
      description: '졸업 요건 관리 웹서비스 API 문서'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        RegisterDTO: {
          type: 'object',
          required: ['email', 'password', 'name', 'studentId', 'department', 'admissionYear', 'targetYear'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            name: { type: 'string' },
            studentId: { type: 'string' },
            department: { type: 'string' },
            admissionYear: { type: 'integer', minimum: 1900 },
            targetYear: { type: 'integer', minimum: 1900 }
          }
        },
        LoginDTO: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                email: { type: 'string', format: 'email' },
                name: { type: 'string' },
                studentId: { type: 'string' },
                department: { type: 'string' },
                admissionYear: { type: 'integer' },
                targetYear: { type: 'integer' },
                role: { type: 'string', enum: ['ADMIN', 'STUDENT'] }
              }
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        },
        Course: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            code: { type: 'string' },
            name: { type: 'string' },
            credits: { type: 'integer', minimum: 1 },
            courseType: {
              type: 'string',
              enum: ['MAJOR_REQUIRED', 'MAJOR_ELECTIVE', 'MAJOR_INTENSIVE', 'LIBERAL_REQUIRED', 'LIBERAL_ELECTIVE', 'GENERAL_ELECTIVE']
            },
            prerequisiteId: { type: 'string', format: 'uuid', nullable: true },
            semester: { type: 'string', nullable: true },
            isRequired: { type: 'boolean' }
          }
        },
        Enrollment: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            courseId: { type: 'string', format: 'uuid' },
            grade: { type: 'string', nullable: true },
            semester: { type: 'string' },
            status: {
              type: 'string',
              enum: ['PLANNED', 'ENROLLED', 'COMPLETED', 'RETAKING']
            },
            course: { $ref: '#/components/schemas/Course' }
          }
        },
        CreditSummary: {
          type: 'object',
          properties: {
            totalCredits: { type: 'integer' },
            majorRequired: { type: 'integer' },
            majorElective: { type: 'integer' },
            majorIntensive: { type: 'integer' },
            liberalRequired: { type: 'integer' },
            liberalElective: { type: 'integer' },
            generalElective: { type: 'integer' },
            seniorMajorElective: { type: 'integer' },
            basicMajor: { type: 'integer' },
            gpa: { type: 'number', format: 'float' },
            majorTrack: {
              type: 'object',
              properties: {
                singleMajor: { type: 'integer' },
                doubleMajor: { type: 'integer' },
                minorMajor: { type: 'integer' },
                integratedMajor: { type: 'integer' }
              }
            }
          }
        },
        GraduationStatus: {
          type: 'object',
          properties: {
            fulfilled: { type: 'boolean' },
            current: { $ref: '#/components/schemas/CreditSummary' },
            selectedTrack: {
              type: 'string',
              enum: ['SINGLE', 'DOUBLE', 'MINOR', 'INTEGRATED']
            },
            remaining: {
              type: 'object',
              properties: {
                totalCredits: { type: 'integer' },
                majorRequired: { type: 'integer' },
                majorElective: { type: 'integer' },
                liberalRequired: { type: 'integer' },
                liberalElective: { type: 'integer' },
                seniorMajorElective: { type: 'integer' },
                basicMajor: { type: 'integer' },
                majorTrack: {
                  type: 'object',
                  properties: {
                    singleMajor: { type: 'integer' },
                    doubleMajor: { type: 'integer' },
                    minorMajor: { type: 'integer' },
                    integratedMajor: { type: 'integer' }
                  }
                }
              }
            },
            details: {
              type: 'object',
              properties: {
                isTotalCreditsFulfilled: { type: 'boolean' },
                isMajorRequiredFulfilled: { type: 'boolean' },
                isMajorElectiveFulfilled: { type: 'boolean' },
                isLiberalRequiredFulfilled: { type: 'boolean' },
                isLiberalElectiveFulfilled: { type: 'boolean' },
                isGPAFulfilled: { type: 'boolean' },
                isSeniorMajorElectiveFulfilled: { type: 'boolean' },
                isBasicMajorFulfilled: { type: 'boolean' },
                majorTrackStatus: {
                  type: 'object',
                  properties: {
                    singleMajor: { type: 'boolean' },
                    doubleMajor: { type: 'boolean' },
                    minorMajor: { type: 'boolean' },
                    integratedMajor: { type: 'boolean' }
                  }
                }
              }
            }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.ts']
};

export default swaggerOptions;