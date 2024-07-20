import { instance } from "../instance";

const UserAPI = {
    fetchAccounts: async () => {
        try {
            const account = await instance.get("Admin/get-users")
            return account;
        } catch (error) {
            console.error(error);
        }
    },
    fetchAccount: async (params) => {
        try {
            const account = await instance.get(`Admin/get-user/${params}`);
            return account;
        }
        catch (error) {
            console.error(error);
        }
    },
    createAccount: async (data) => {
        try {
            const account = await instance.post(`Admin/create-user`, data)
            return account;
        }
        catch (error) {
            console.error(error);
        }
    },
    updateAccount: async (params, data) => {
        try {
            const account = await instance.put(`Admin/update-user/${params}`, data);
            return account
        }
        catch (error) {
            console.error(error);
        }
    },
    deleteAccount: async (params) => {
        try {
            const account = await instance.delete(`Admin/delete-user/${params}`)
            return account
        }
        catch (error) {
            console.error(error);
        }
    },
    uploadUserData: async (userId, userData) => {
        try {
            const response = await instance.post(`/User/upload/${userId}`, userData);
            return response;
        } catch (error) {
            console.error("Error uploading user data:", error);
            throw error;
        }
    }
}

export default UserAPI;
