/* eslint-disable camelcase */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from 'app/services/api/';
import { currencyString } from 'app/utils/formatter/currencyBrl';

export const getOne = createAsyncThunk('nota/getOne', async (id, { dispatch }) => {
	const response = await ApiService.doGet(`/notas/${id}`);
	if (!response.success) {
		return response.data;
	}

	// const res = await ApiService.doGet(`${process.env.PUBLIC_URL}/notas/${id}`);

	const { product } = await response.data;
	const { price } = product;

	// const parsePrice = `${currencyString.format(price)}`;
	const parsePrice = price;

	return { ...product, price: parsePrice };
});

export const saveOne = createAsyncThunk('nota/saveOne', async (data, { dispatch }) => {
	const request = { ...data };
	request.price = parseFloat(data.price);

	const response = await ApiService.doPost('/notas', request);
	if (!response.success) {
		dispatch(updateResponse(response.data));
		return data;
	}
	const { product } = await response.data;

	dispatch(getOne(product.id));

	return { ...data, message: response.message, success: response.success };
});

export const updateOne = createAsyncThunk('nota/updateOne', async ({ data, id }, { dispatch, getState }) => {
	const request = { ...data };
	request.price = parseFloat(data.price);

	const response = await ApiService.doPut(`/notas/${id}`, request);
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
					id: 'new',
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
