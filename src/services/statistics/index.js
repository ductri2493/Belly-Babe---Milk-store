import { instance } from "../instance";

const StatisticsAPI = {
    salesByCategory: async () => {
        try {
            const response = await instance.get('Statistics/SalesByCategory');
            return response;
        } catch (error) {
            console.error('Error during sales by category processing:', error);
            throw error;
        }
    },
    ordersByDateRange: async (fromDate, toDate) => {
        try {
            const response = await instance.get('Statistics/OrdersByDateRange', null, {
                params: {
                    fromDate,
                    toDate
                }
            });
            return response;
        } catch (error) {
            console.error('Error during orders by date range processing:', error);
            throw error;
        }
    },

    weeklyStatistics: async (startDate) => {
        try {
            const response = await instance.get('Statistics/WeeklyStatistics'.null, {
                params: {
                    startDate,
                }
            });
            return response;
        } catch (error) {
            console.error('Error during weekly statistics processing:', error);
            throw error;
        }
    },
    monthlyStatistics: async (month, year) => {
        try {
            const response = await instance.get('Statistics/MonthlyStatistics', null, {
                params: {
                    month,
                    year,
                }
            });
            return response;
        } catch (error) {
            console.error('Error during monthly statistics processing:', error);
            throw error;
        }
    },
    yearlyStatistics: async (year) => {
        try {
            const response = await instance.get('Statistics/YearlyStatistics', null, {
                params: {
                    year,
                }
            });
            return response;
        } catch (error) {
            console.error('Error during yearly statistics processing:', error);
            throw error;
        }
    },
}

export default StatisticsAPI