import { env } from './env.config';

export const swaggerConfig = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Finance Dashboard API',
            version: '1.0.0',
            description:
                'Production-quality Finance Dashboard backend with Role-Based Access Control (RBAC)',
            contact: {
                name: 'API Support',
                email: 'support@financedashboard.com',
            },
        },
        servers: [
            {
                url: process.env.RENDER
                    ? 'https://finance-dashboard-backend-g732.onrender.com'
                    : `http://localhost:${env.PORT}`,
                description: process.env.RENDER ? 'Production' : 'Development',
            },
            {
                url: `http://localhost:${env.PORT}`,
                description: 'Local development server',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token',
                },
            },
            schemas: {
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        statusCode: { type: 'number' },
                    },
                },
                PaginationMeta: {
                    type: 'object',
                    properties: {
                        total: { type: 'number' },
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        totalPages: { type: 'number' },
                    },
                },
            },
        },
        security: [{ BearerAuth: [] }],
    },
    apis: ['./src/routes/*.{ts,js}', './src/controllers/*.{ts,js}'],
};
