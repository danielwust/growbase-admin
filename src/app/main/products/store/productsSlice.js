import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import ApiService from 'app/services/api';

import JwtService from 'app/services/jwtService';

export const getAll = createAsyncThunk('notas/getNotas', async () => {
	return await ApiService.doGet(
		`${process.env.PUBLIC_URL}
		/notas/ce14d304-17bf-4c7b-85f6-0e7a8267042d/todas`
		// const response = await ApiService.doGet('/notas');
		// 	headers:
		//	 {
		// 		Authorization: 'Bearer ' + JwtService.getAccessToken()
		// 	}
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
