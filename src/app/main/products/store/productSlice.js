/* eslint-disable camelcase */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import JwtService from 'app/services/jwtService';
import ApiService from 'app/services/api/';

function autentication() {
	const usuario = JwtService.getUserAccess();
	const token = 'Bearer ' + JwtService.getAccessToken();
	return {
		Authorization: token,
		userUid: usuario
	};
}

export const getOne = createAsyncThunk('nota/getOne', async (uid, { dispatch }) => {
	const res = await ApiService.doGet(`/notas/${uid}`, autentication());
	if (!res.success) {
		return res.data;
	}
	
	const { product } = await res.data;
	const { price } = product;

	// const parsePrice = `${currencyString.format(price)}`;
	const parsePrice = price;

	return { ...product, price: parsePrice };
});

export const saveOne = createAsyncThunk('nota/saveOne', async (data, { dispatch }) => {
	const request = { ...data };
	// request.price = parseFloat(data.price);
	request.price = data.updatedAt;

	const response = await ApiService.doPost('/notas', request);
	if (!response.success) {
		dispatch(updateResponse(response.data));
		return data;
	}
	const { product } = await response.data;

	dispatch(getOne(product.uid));

	return { ...data, message: response.message, success: response.success };
});

export const updateOne = createAsyncThunk('nota/updateOne', async ({ data, uid }, { dispatch, getState }) => {
	const request = { ...data };
	request.price = parseFloat(data.price);

	const response = await ApiService.doPut(`/notas/${uid}`, request);
	const oldState = getState().product;

	if (!response.success) {
		dispatch(updateResponse(response.data));
		return { ...data, uid, loading: false };
	}

	dispatch(getOne(uid));

	return { ...oldState, message: response.message, success: response.success };
});

const initialState = {
	success: false,
	loading: false,
	message: '',
	errorCode: '',
	detalhamento: '',
	descricao: '',
	updatedAt: ''
};

const productSlice = createSlice({
	name: 'nota',
	initialState,
	reducers: {
		newData: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					uid: 'new',
					detalhamento: '',
					descricao: '',
					updatedAt: '',
					success: false,
					loading: false,
					message: '',
					errorCode: ''
				}
			})
		},
		clearState: (state, action) => initialState,
		updateState: (state, action) => {
			return { ...state, ...action.payload };
		},
		updateResponse: (state, action) => {
			state.success = action.payload.success;
			state.message = action.payload.message;
		},
		updateLoading: (state, action) => {
			state.loading = action.payload;
		}
	},
	extraReducers: {
		[getOne.fulfilled]: (state, action) => action.payload,
		[saveOne.fulfilled]: (state, action) => action.payload,
		[updateOne.fulfilled]: (state, action) => action.payload
	}
});

export const { newData, updateResponse, updateLoading } = productSlice.actions;

export default productSlice.reducer;
