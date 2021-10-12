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

	if (!res) {
		return { ...{}, message: 'Nota inexistente', success: false };
	} else {
		const product = res;
		return { ...product };
	}
});

export const saveOne = createAsyncThunk('nota/saveOne', async (data, { dispatch }) => {
	const req = Object.assign(data, { usuarioUid: JwtService.getUserAccess() });
	const res = await ApiService.doPost('/notas', req);
	if (res) {
		return { ...data, message: 'Criada com sucesso!', success: true };
	}
});

export const updateOne = createAsyncThunk('nota/updateOne', async ({ data, uid }, { dispatch, getState }) => {
	const req = Object.assign(data, { usuarioUid: JwtService.getUserAccess() });
	const res = await ApiService.doPut(`/notas/${uid}`, req);
	const oldState = getState().product;

	if (res) {
		dispatch(updateResponse(res));
		return { ...data, uid, loading: false };
	}

	dispatch(getOne(uid));
	return { ...oldState, message: 'Criada com sucesso!', success: true };
});

export const deleteOne = createAsyncThunk('nota/deleteOne', async (uid, { dispatch }) => {
	const res = await ApiService.doDelete(`/notas/${uid}`, { userUid: JwtService.getUserAccess() });
	if (res) {
		const { data } = res.data;
		return { ...data, message: 'Nota Deletada!', success: true };
	}
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
		[deleteOne.fulfilled]: (state, action) => action.payload,
		[updateOne.fulfilled]: (state, action) => action.payload
	}
});

export const { newData, updateResponse, updateLoading } = productSlice.actions;

export default productSlice.reducer;
