import { PrismaClient, Role, TransactionType, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
    console.log('Starting seed process...');

    // Clean existing data
    await prisma.financialRecord.deleteMany();
    await prisma.user.deleteMany();

    // Create Users sequentially for Supabase stability
    const admin = await prisma.user.create({
        data: {
            email: 'admin@finance.dev',
            password: await bcrypt.hash('Admin@1234', SALT_ROUNDS),
            role: Role.ADMIN,
            status: UserStatus.ACTIVE,
        },
    });

    const analyst = await prisma.user.create({
        data: {
            email: 'analyst@finance.dev',
            password: await bcrypt.hash('Analyst@1234', SALT_ROUNDS),
            role: Role.ANALYST,
            status: UserStatus.ACTIVE,
        },
    });

    const viewer = await prisma.user.create({
        data: {
            email: 'viewer@finance.dev',
            password: await bcrypt.hash('Viewer@1234', SALT_ROUNDS),
            role: Role.VIEWER,
            status: UserStatus.ACTIVE,
        },
    });

    console.log(`Created users: ${admin.email}, ${analyst.email}, ${viewer.email}`);

    // Create Financial Records
    const categories = {
        INCOME: ['Salary', 'Freelance', 'Dividends', 'Gift'],
        EXPENSE: ['Rent', 'Groceries', 'Utilities', 'Entertainment', 'Travel', 'Health']
    };

    const records = [];
    const now = new Date();

    for (let i = 0; i < 6; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

        for (let j = 0; j < 32; j++) {
            const type = Math.random() > 0.4 ? TransactionType.EXPENSE : TransactionType.INCOME;
            const amount = type === TransactionType.INCOME
                ? Math.floor(Math.random() * 5000) + 1000
                : Math.floor(Math.random() * 1500) + 50;

            const recordDate = new Date(date);
            recordDate.setDate(j + 1);

            if (recordDate > now) continue;

            records.push({
                userId: admin.id,
                amount,
                type,
                category: categories[type][Math.floor(Math.random() * categories[type].length)],
                date: recordDate,
                notes: `Sample ${type.toLowerCase()} record for testing purposes.`
            });
        }
    }

    await prisma.financialRecord.createMany({ data: records });
    console.log(`Successfully created ${records.length} financial records`);
}

main()
    .catch((e) => {
        console.error('Seed process failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
