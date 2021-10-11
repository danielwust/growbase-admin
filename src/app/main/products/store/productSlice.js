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
	// EM TESTES
	const usuario = { usuarioUid: JwtService.getUserAccess() };
	const req = Object.assign({ ...data }, 
		{ usuarioUid: JwtService.getUserAccess() });
	// const req = { ...data };
	// req.price = parseFloat(data.price);

	const res = await ApiService.doPost('/notas', req);
	if (!res.success) {
		dispatch(updateResponse(res.data));
		return data;
	}
	const { product } = await res.data;

	dispatch(getOne(product.uid));

	return { ...data, message: res.message, success: res.success };
});

export const updateOne = createAsyncThunk('nota/updateOne', async ({ data, uid }, { dispatch, getState }) => {
	const req = { ...data };

	const res = await ApiService.doPut(`/notas/${uid}`, req);
	const oldState = getState().product;

	if (!res.success) {
		dispatch(updateResponse(res.data));
		return { ...data, uid, loading: false };
	}

	dispatch(getOne(uid));

	return { ...oldState, message: res.message, success: res.success };
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
