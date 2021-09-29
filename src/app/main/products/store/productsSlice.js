import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import ApiService from 'app/services/api';

export const getAll = createAsyncThunk('products/getProducts', async () => {
	const response = await ApiService.doGet('/products');
	const data = await response.data;

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
