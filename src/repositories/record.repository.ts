import { prisma } from '../database/prisma.client';
import { RecordType, Prisma } from '@prisma/client';

export interface RecordFilters {
    type?: RecordType;
    category?: string;
    from?: string;
    to?: string;
    userId?: string;
}

export interface PaginationOptions {
    page: number;
    limit: number;
}

export interface PaginatedResult<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

function buildWhereClause(filters: RecordFilters): Prisma.FinancialRecordWhereInput {
    const where: Prisma.FinancialRecordWhereInput = {
        deletedAt: null, // Soft-delete filter always applied
    };

    if (filters.type) where.type = filters.type;
    if (filters.category) where.category = { equals: filters.category, mode: 'insensitive' };
    if (filters.userId) where.userId = filters.userId;
    if (filters.from || filters.to) {
        where.date = {
            ...(filters.from && { gte: new Date(filters.from) }),
            ...(filters.to && { lte: new Date(filters.to) }),
        };
    }

    return where;
}

export const recordRepository = {
    async findAll(
        filters: RecordFilters,
        pagination: PaginationOptions,
    ): Promise<PaginatedResult<Prisma.FinancialRecordGetPayload<{ include: { user: { select: { id: true; email: true } } } }>>> {
        const where = buildWhereClause(filters);
        const skip = (pagination.page - 1) * pagination.limit;

        const [data, total] = await prisma.$transaction([
            prisma.financialRecord.findMany({
                where,
                orderBy: { date: 'desc' },
                skip,
                take: pagination.limit,
                include: { user: { select: { id: true, email: true } } },
            }),
            prisma.financialRecord.count({ where }),
        ]);

        return {
            data,
            meta: {
                total,
                page: pagination.page,
                limit: pagination.limit,
                totalPages: Math.ceil(total / pagination.limit),
            },
        };
    },

    async findById(id: string) {
        return prisma.financialRecord.findFirst({
            where: { id, deletedAt: null },
            include: { user: { select: { id: true, email: true } } },
        });
    },

    async create(data: {
        userId: string;
        amount: number;
        type: RecordType;
        category: string;
        date: string;
        notes?: string;
    }) {
        return prisma.financialRecord.create({
            data: {
                ...data,
                amount: new Prisma.Decimal(data.amount),
                date: new Date(data.date),
            },
            include: { user: { select: { id: true, email: true } } },
        });
    },

    async update(
        id: string,
        data: Partial<{
            amount: number;
            type: RecordType;
            category: string;
            date: string;
            notes: string;
        }>,
    ) {
        return prisma.financialRecord.update({
            where: { id },
            data: {
                ...data,
                ...(data.amount !== undefined && { amount: new Prisma.Decimal(data.amount) }),
                ...(data.date !== undefined && { date: new Date(data.date) }),
            },
            include: { user: { select: { id: true, email: true } } },
        });
    },

    /** Soft delete — sets deletedAt timestamp */
    async softDelete(id: string): Promise<void> {
        await prisma.financialRecord.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    },

    async exists(id: string): Promise<boolean> {
        const count = await prisma.financialRecord.count({
            where: { id, deletedAt: null },
        });
        return count > 0;
    },
};
