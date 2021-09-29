import { combineReducers } from '@reduxjs/toolkit';
import auth from 'app/auth/store';
import product from 'app/main/products/store/productSlice';
import products from 'app/main/products/store/productsSlice';
import fuse from './fuse';
import i18n from './i18nSlice';

const createReducer = asyncReducers => (state, action) => {
	const combinedReducer = combineReducers({
		auth,
		fuse,
		i18n,
		product,
		products,
		...asyncReducers
	});

	/*
	Reset the redux store when user logged out
	 */
	if (action.type === 'auth/user/userLoggedOut') {
		state = undefined;
	}

	return combinedReducer(state, action);
};

export default createReducer;
