import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../../../services/instance";

export const adminLogin = createAsyncThunk(
    'auth/adminLogin',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }

            const response = await instance.post('AdminLogin/login',
                { email, password },
                config
            );
            localStorage.setItem('userToken', response.token)
            return response
        } catch (error) {
            if (error.response && error.response.message) {
                return rejectWithValue(error.response.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)
