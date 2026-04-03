import { prisma } from '../database/prisma.client';
import { Prisma } from '@prisma/client';

// ─── Types ────────────────────────────────────────────────────

export interface DashboardSummary {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
}

export interface CategoryBreakdownItem {
    category: string;
    total: number;
    count: number;
}

export interface TrendItem {
    year: number;
    month: number;
    totalIncome: number;
    totalExpense: number;
}

// ─── Repository ───────────────────────────────────────────────

export const dashboardRepository = {
    /**
     * Aggregates total income/expense at DB level using GROUP BY type.
     * Returns netBalance = totalIncome - totalExpense.
     */
    async getSummary(): Promise<DashboardSummary> {
        const result = await prisma.financialRecord.groupBy({
            by: ['type'],
            where: { deletedAt: null },
            _sum: { amount: true },
        });

        const income =
            result.find((r) => r.type === 'INCOME')?._sum.amount ?? new Prisma.Decimal(0);
        const expense =
            result.find((r) => r.type === 'EXPENSE')?._sum.amount ?? new Prisma.Decimal(0);

        const totalIncome = Number(income);
        const totalExpense = Number(expense);

        return {
            totalIncome,
            totalExpense,
            netBalance: totalIncome - totalExpense,
        };
    },

    /**
     * Aggregates totals per category using DB GROUP BY.
     * Handles INCOME and EXPENSE separately per category.
     */
    async getCategoryBreakdown(): Promise<CategoryBreakdownItem[]> {
        const result = await prisma.financialRecord.groupBy({
            by: ['category', 'type'],
            where: { deletedAt: null },
            _sum: { amount: true },
            _count: { id: true },
            orderBy: { _sum: { amount: 'desc' } },
        });

        // Merge income/expense into a single category entry
        const categoryMap = new Map<
            string,
            { category: string; total: number; count: number }
        >();

        for (const row of result) {
            const existing = categoryMap.get(row.category) ?? {
                category: row.category,
                total: 0,
                count: 0,
            };

            const amount = Number(row._sum.amount ?? 0);

            // Income adds to total, expense subtracts net
            existing.total += row.type === 'INCOME' ? amount : -amount;
            existing.count += row._count.id;
            categoryMap.set(row.category, existing);
        }

        return Array.from(categoryMap.values()).sort((a, b) => b.total - a.total);
    },

    /**
     * Monthly aggregation using raw SQL for year/month extraction.
     * Avoids in-memory grouping; pure DB-level aggregation.
     */
    async getMonthlyTrends(): Promise<TrendItem[]> {
        const rows = await prisma.$queryRaw<
            Array<{
                year: bigint;
                month: bigint;
                total_income: Prisma.Decimal;
                total_expense: Prisma.Decimal;
            }>
        >`
      SELECT
        EXTRACT(YEAR  FROM date)::int AS year,
        EXTRACT(MONTH FROM date)::int AS month,
        COALESCE(SUM(CASE WHEN type = 'INCOME'  THEN amount ELSE 0 END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) AS total_expense
      FROM financial_records
      WHERE "deletedAt" IS NULL
      GROUP BY year, month
      ORDER BY year ASC, month ASC
    `;

        return rows.map((row) => ({
            year: Number(row.year),
            month: Number(row.month),
            totalIncome: Number(row.total_income),
            totalExpense: Number(row.total_expense),
        }));
    },

    /**
     * Returns last 5 active records sorted by date descending.
     */
    async getRecentTransactions() {
        return prisma.financialRecord.findMany({
            where: { deletedAt: null },
            orderBy: { date: 'desc' },
            take: 5,
            include: { user: { select: { id: true, email: true } } },
        });
    },
};
