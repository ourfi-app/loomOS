/**
 * Mock Prisma Client for Testing
 */

export const prisma = {
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  message: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  messageRecipient: {
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
};
