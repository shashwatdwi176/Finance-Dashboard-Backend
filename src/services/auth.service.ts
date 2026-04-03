import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.config';
import { userRepository, SafeUser } from '../repositories/user.repository';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors.util';
import type { RegisterInput, LoginInput } from '../utils/validation.schemas';

const SALT_ROUNDS = 12;

export interface AuthTokenPayload {
    user: SafeUser;
    accessToken: string;
}

export const authService = {
    async register(input: RegisterInput): Promise<SafeUser> {
        const exists = await userRepository.existsByEmail(input.email);
        if (exists) {
            throw new ConflictError('An account with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

        return userRepository.create({
            email: input.email,
            password: hashedPassword,
        });
    },

    async login(input: LoginInput): Promise<AuthTokenPayload> {
        const user = await userRepository.findByEmail(input.email);

        if (!user) {
            // Use generic message to prevent user enumeration
            throw new UnauthorizedError('Invalid email or password');
        }

        if (user.status === 'INACTIVE') {
            throw new UnauthorizedError('Account is disabled. Contact your administrator.');
        }

        const passwordValid = await bcrypt.compare(input.password, user.password);
        if (!passwordValid) {
            throw new UnauthorizedError('Invalid email or password');
        }

        const accessToken = jwt.sign(
            { sub: user.id, email: user.email, role: user.role },
            env.JWT_SECRET,
            { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions,
        );

        // Never return the hashed password
        const { password: _password, ...safeUser } = user;

        return { user: safeUser, accessToken };
    },

    async getUserById(id: string): Promise<SafeUser> {
        const user = await userRepository.findById(id);
        if (!user) throw new NotFoundError('User not found');
        return user;
    },
};
