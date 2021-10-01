/* eslint-disable camelcase */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from 'app/services/api/';
import { currencyString } from 'app/utils/formatter/currencyBrl';

export const getOne = createAsyncThunk('product/getOne', async (id, { dispatch }) => {
	const response = await ApiService.doGet(`/products/${id}`);
	if (!response.success) {
		return response.data;
	}

	// const res = await ApiService.doGet(`${process.env.PUBLIC_URL}/products/${id}`);

	const { product } = await response.data;
	const { price } = product;

	const parsePrice = `${currencyString.format(price)}`;

	return { ...product, price: parsePrice };
});

export const saveOne = createAsyncThunk('product/saveOne', async (data, { dispatch }) => {
	const request = { ...data };
	request.price = parseFloat(data.price);

	const response = await ApiService.doPost('/products', request);
	if (!response.success) {
		dispatch(updateResponse(response.data));
		return data;
	}
	const { product } = await response.data;

	dispatch(getOne(product.id));

	return { ...data, message: response.message, success: response.success };
});

export const updateOne = createAsyncThunk('product/updateOne', async ({ data, id }, { dispatch, getState }) => {
	const request = { ...data };
	request.price = parseFloat(data.price);

	const response = await ApiService.doPut(`/products/${id}`, request);
	const oldState = getState().product;

	if (!response.success) {
		dispatch(updateResponse(response.data));
		return { ...data, id, loading: false };
	}

	dispatch(getOne(id));

	return { ...oldState, message: response.message, success: response.success };
});

const initialState = {
	success: false,
	message: '',
	errorCode: '',
	loading: false,
	title: '',
	description: '',
	price: ''
};

const productSlice = createSlice({
	name: 'product',
	initialState,
	reducers: {
		newData: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					id: 'new',
					title: '',
					description: '',
					price: '',
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
