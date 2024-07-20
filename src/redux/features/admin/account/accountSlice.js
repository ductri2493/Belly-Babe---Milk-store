import { createSlice } from '@reduxjs/toolkit'
import { accountThunkReducers } from './account.thunk'

const initialAccountState = {
    accounts: [],
    account: null,
    selectedAccountId: null,
    status: "idle",
    error: null,
}

export const accountSlice = createSlice({
    name: 'account',
    initialAccountState,
    reducers: {},
    extraReducers: accountThunkReducers,
})

// Action creators are generated for each case reducer function
// export const { increment, decrement, incrementByAmount } = accountSlice.actions

export default accountSlice.reducer