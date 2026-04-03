import { prisma } from '../database/prisma.client';
import { Role, UserStatus, User } from '@prisma/client';

export type SafeUser = Omit<User, 'password'>;

const SELECT_SAFE_USER = {
    id: true,
    email: true,
    role: true,
    status: true,
    createdAt: true,
    updatedAt: true,
} as const;

export const userRepository = {
    async findAll(): Promise<SafeUser[]> {
        return prisma.user.findMany({
            select: SELECT_SAFE_USER,
            orderBy: { createdAt: 'desc' },
        });
    },

    async findById(id: string): Promise<SafeUser | null> {
        return prisma.user.findUnique({
            where: { id },
            select: SELECT_SAFE_USER,
        });
    },

    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { email } });
    },

    async create(data: { email: string; password: string; role?: Role }): Promise<SafeUser> {
        return prisma.user.create({
            data,
            select: SELECT_SAFE_USER,
        });
    },

    async updateRole(id: string, role: Role): Promise<SafeUser> {
        return prisma.user.update({
            where: { id },
            data: { role },
            select: SELECT_SAFE_USER,
        });
    },

    async updateStatus(id: string, status: UserStatus): Promise<SafeUser> {
        return prisma.user.update({
            where: { id },
            data: { status },
            select: SELECT_SAFE_USER,
        });
    },

    async existsByEmail(email: string): Promise<boolean> {
        const count = await prisma.user.count({ where: { email } });
        return count > 0;
    },
};
