import { recordRepository, RecordFilters, PaginationOptions } from '../repositories/record.repository';
import { userRepository } from '../repositories/user.repository';
import { NotFoundError, BadRequestError } from '../utils/errors.util';
import type { CreateRecordInput, UpdateRecordInput } from '../utils/validation.schemas';

export const recordService = {
    async getRecords(filters: RecordFilters, pagination: PaginationOptions) {
        return recordRepository.findAll(filters, pagination);
    },

    async getRecordById(id: string) {
        const record = await recordRepository.findById(id);
        if (!record) throw new NotFoundError(`Record with id '${id}' not found`);
        return record;
    },

    async createRecord(input: CreateRecordInput) {
        // Validate user exists
        const user = await userRepository.findById(input.userId);
        if (!user) throw new BadRequestError(`User with id '${input.userId}' not found`);
        if (user.status === 'INACTIVE') {
            throw new BadRequestError('Cannot create record for an inactive user');
        }

        return recordRepository.create(input);
    },

    async updateRecord(id: string, input: UpdateRecordInput) {
        const exists = await recordRepository.exists(id);
        if (!exists) throw new NotFoundError(`Record with id '${id}' not found`);

        return recordRepository.update(id, input);
    },

    async deleteRecord(id: string): Promise<void> {
        const exists = await recordRepository.exists(id);
        if (!exists) throw new NotFoundError(`Record with id '${id}' not found`);

        await recordRepository.softDelete(id);
    },
};
