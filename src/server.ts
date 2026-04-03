import { env } from './config/env.config';
import { logger } from './utils/logger';
import { prisma } from './database/prisma.client';
import { createApp } from './app';

const app = createApp();

const startServer = async () => {
    try {
        await prisma.$connect();
        logger.info('Database connected successfully');

        const server = app.listen(env.PORT, () => {
            logger.info({
                port: env.PORT,
                env: env.NODE_ENV,
                docs: `http://localhost:${env.PORT}/api-docs`
            }, 'Server running');
        });

        const gracefulShutdown = async () => {
            logger.info('Starting graceful shutdown');
            server.close(async () => {
                await prisma.$disconnect();
                logger.info('Server closed and database disconnected');
                process.exit(0);
            });
        };

        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);

    } catch (error) {
        logger.fatal(error, 'Server failed to start');
        process.exit(1);
    }
};

startServer();
