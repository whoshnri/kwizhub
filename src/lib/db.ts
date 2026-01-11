
import { mockDeep, mockReset } from 'jest-mock-extended'
import { PrismaClient } from '@prisma/client'

const prisma = mockDeep<PrismaClient>()

export const mockPrisma = prisma
export const resetPrisma = () => mockReset(prisma)

export default prisma
