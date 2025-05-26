import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
	PersistConfig
} from 'redux-persist';
import { authReducer } from './slices/auth-slice';
import { cartReducer } from './slices/cart-slice';
import { dabbaPointsReducer } from './slices/dabba-points-slice';
import type { AuthState } from './slices/auth-slice';
import type { CartState } from './slices/cart-slice';
import type { DabbaPointsState } from './slices/dabba-points-slice';
import companyReducer from './slices/company-slice';
import type { CompanyState } from './slices/company-slice';

const noopStorage = {
	getItem: (_key: string) => Promise.resolve(null),
	setItem: (_key: string, value: string) => Promise.resolve(value),
	removeItem: (_key: string) => Promise.resolve()
};

const storage = typeof window !== 'undefined' ? require('redux-persist/lib/storage').default : noopStorage;

const authPersistConfig: PersistConfig<AuthState> = {
	key: 'auth',
	storage,
	whitelist: ['user']
};

const cartPersistConfig: PersistConfig<CartState> = {
	key: 'cart',
	storage,
	whitelist: ['days', 'totalQuantity', 'totalPrice', 'discount', 'promoCode', 'isCartEmpty']
};

const dabbaPersistConfig: PersistConfig<DabbaPointsState> = {
	key: 'dabbaPoints',
	storage,
	whitelist: ['dabbaPoints', 'redeemedPoints', 'isPointsApplied', 'status']
};

const companyPersistConfig: PersistConfig<CompanyState> = {
	key: 'company',
	storage,
	whitelist: ['companyName', 'discountPercentage', 'domain', 'menuItemPrice']
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedDabbaPointsReducer = persistReducer(dabbaPersistConfig, dabbaPointsReducer);
const persistedCompanyReducer = persistReducer(companyPersistConfig, companyReducer);

export const store = configureStore({
	reducer: {
		auth: persistedAuthReducer,
		cart: persistedCartReducer,
		dabbaPoints: persistedDabbaPointsReducer,
		company: persistedCompanyReducer
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
			}
		})
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
