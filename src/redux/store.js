import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './features/admin/auth/authSlice';
import messageReducer from './features/messagesSlice';
import userReducer, { logout } from './features/admin/auth/userSlice';
import pointsReducer from './features/points/pointsSlice';
import cartReducer from '../redux/features/cart/cartSlice';

import storage from 'redux-persist/lib/storage';
import persistReducer from 'redux-persist/es/persistReducer';
import persistStore from 'redux-persist/es/persistStore';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

const persistConfig = {
    key: 'root',
    storage,
};

const rootReducer = combineReducers({
    auth: authReducer,
    message: messageReducer,
    points: pointsReducer,
    cart: cartReducer,
    user: userReducer,
});



const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    devTools: true,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);
