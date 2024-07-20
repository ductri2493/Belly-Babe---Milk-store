export const selectAccounts = (state) => (state.account ? state.account.accounts : []);
export const selectAccount = (state) => (state.account ? state.account.account : null);
export const selectAccountHttpStatus = (state) => (state.account ? state.account.status : null);