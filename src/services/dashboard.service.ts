import { dashboardRepository } from '../repositories/dashboard.repository';

export const dashboardService = {
    getSummary() {
        return dashboardRepository.getSummary();
    },

    getCategoryBreakdown() {
        return dashboardRepository.getCategoryBreakdown();
    },

    getMonthlyTrends() {
        return dashboardRepository.getMonthlyTrends();
    },

    getRecentTransactions() {
        return dashboardRepository.getRecentTransactions();
    },
};
