import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';

import JwtService from 'app/services/jwtService';
import ApiService from 'app/services/api';

export const getAll = createAsyncThunk('notas/getNotas', async () => {
	const usuario = JwtService.getUserAccess();
	const token = 'Bearer ' + JwtService.getAccessToken();

	return await ApiService.doGet(
		`${process.env.PUBLIC_URL}
		/notas/${usuario}/todas`,
		{
			Authorization: token,
			userUid: usuario
		}
	);
});

const adapter = createEntityAdapter({
	selectId: product => product.uid
});

export const { selectAll, selectById } = adapter.getSelectors(state => state.products);

const productsSlice = createSlice({
	name: 'notas',
	initialState: adapter.getInitialState(),
	reducers: {},
	extraReducers: {
		[getAll.fulfilled]: adapter.setAll
	}
});

export default productsSlice.reducer;
