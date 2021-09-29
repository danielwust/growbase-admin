import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import FusePageCarded from '@fuse/core/FusePageCarded';
import { Grid } from '@material-ui/core';

import PageCardedHeader from 'app/fuse-layouts/shared-components/page-carded-header/PageCardedHeader';
import Header from './Header';
import Content from './Content';

function Product() {
	const dispatch = useDispatch();

	return (
		<Grid container item xs={12}>
			<FusePageCarded
				classes={{
					root: 'pb-48',
					toolbar: 'p-0 bg-white',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
					contentCard: 'rounded-12'
				}}
				header={<Header />}
				content={
					<div className="p-16 sm:p-24">
						<Content />
					</div>
				}
				innerScroll
			/>
		</Grid>
	);
}

export default Product;
