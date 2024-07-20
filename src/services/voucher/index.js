import { instance } from "../instance";

export const VoucherAPI = {
    fetchVouchers: async () => {
        try {
            const vouchers = await instance.get(`Voucher/GetAllVoucher`)
            return vouchers;
        }
        catch (err) {
            console.error(err);
        }
    },

    fetchVoucher: async (params) => {
        try {
            const voucher = await instance.get(`Voucher/GetVoucherByID/${params}`)
            return voucher;
        }
        catch (err) {
            console.error(err);
        }
    },

    createVoucher: async (data) => {
        try {
            const voucher = await instance.post(`Voucher/CreateVoucher`, data)
            return voucher;
        }
        catch (err) {
            console.error(err);
        }
    },

    updateVoucher: async (voucherId, data) => {
        try {
            console.log(`Sending PUT request to update voucher with ID: ${voucherId}`);
            const voucher = await instance.put(`Voucher/UpdateVoucherByID/${voucherId}`, data);
            return voucher;
        } catch (err) {
            console.error(`Failed to update voucher with ID: ${voucherId}`, err);
            throw err;
        }
    },

    deleteVoucher: async (params) => {
        try {
            const voucher = await instance.delete(`Voucher/DeleteVoucherById/${params}`)
            return voucher;
        }
        catch (err) {
            console.error(err);
        }
    },
    generateVoucher: async () => {
        try {
            const voucher = await instance.post(`Voucher/generateCode`)
            return voucher;
        }
        catch (err) {
            console.error(err);
        }
    },
    sendVoucher: async (email, voucherCode) => {
        try {
            const url = `Voucher/sendCodeByGmail?email=${encodeURIComponent(email)}&voucherCode=${encodeURIComponent(voucherCode)}`;
            console.log("Sending request to URL:", url);
            const response = await instance.post(url);
            return response.data;
        } catch (error) {
            console.error('Error sending voucher:', error);
            throw error;
        }
    },
    validateVoucher: async (voucherCode) => {
        try {
            const response = await instance.post(`Voucher/validateCode`, null, {
                params: {
                    voucherCode: voucherCode
                }
            });
            return response.data;
        } catch (err) {
            console.error("Failed to validate voucher:", err);
            throw err;
        }
    }
}