import { Role, UserStatus } from '@prisma/client';
import { userRepository, SafeUser } from '../repositories/user.repository';
import { NotFoundError, BadRequestError } from '../utils/errors.util';

export const userService = {
    async getAllUsers(): Promise<SafeUser[]> {
        return userRepository.findAll();
    },

    async getUserById(id: string): Promise<SafeUser> {
        const user = await userRepository.findById(id);
        if (!user) throw new NotFoundError(`User with id '${id}' not found`);
        return user;
    },

    async updateRole(id: string, role: Role): Promise<SafeUser> {
        const user = await userRepository.findById(id);
        if (!user) throw new NotFoundError(`User with id '${id}' not found`);

        if (user.role === role) {
            throw new BadRequestError(`User already has the role '${role}'`);
        }

        return userRepository.updateRole(id, role);
    },

    async updateStatus(id: string, status: UserStatus): Promise<SafeUser> {
        const user = await userRepository.findById(id);
        if (!user) throw new NotFoundError(`User with id '${id}' not found`);

        if (user.status === status) {
            throw new BadRequestError(`User is already '${status}'`);
        }

        return userRepository.updateStatus(id, status);
    },
};
