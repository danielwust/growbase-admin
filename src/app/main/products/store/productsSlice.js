import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import ApiService from 'app/services/api';

import JwtService from 'app/services/jwtService';

export const getAll = createAsyncThunk('products/getProducts', async () => {
	const response = await ApiService.doGet('/products');

	// const response = await ApiService.doGet(
	// 	`${process.env.PUBLIC_URL}
	// 	/notas/ce14d304-17bf-4c7b-85f6-0e7a8267042d/todas`
	// );
	
	const data = await response.data;

	// 	headers:
	//	 {
	// 		Authorization: 'Bearer ' + JwtService.getAccessToken()
	// 	}

	//debugar oq ta vindo, se vem as notas e mudar estrutura de produto, tbm salvar em uma variavel local provavelmente
	console.log(response);

	return data.products;
});

const adapter = createEntityAdapter({
	selectId: product => product.id
});

export const { selectAll, selectById } = adapter.getSelectors(state => state.products);

const productsSlice = createSlice({
	name: 'products',
	initialState: adapter.getInitialState(),
	reducers: {},
	extraReducers: {
		[getAll.fulfilled]: adapter.setAll
	}
});

export default productsSlice.reducer;
