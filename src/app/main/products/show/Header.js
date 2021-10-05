import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import FuseAnimate from '@fuse/core/FuseAnimate';

import { Link, useHistory } from 'react-router-dom';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { Typography, Grid } from '@material-ui/core';
import PageCardedHeader from 'app/fuse-layouts/shared-components/page-carded-header/PageCardedHeader';

function Header() {
	const productRedux = useSelector(({ product }) => product);
	const [product, setProduct] = useState({});

	useEffect(() => {
		if (productRedux) {
			setProduct(productRedux);
		}
	}, [productRedux]);

	return <PageCardedHeader link="/products" title={product?.nome || 'Novo produto'} textBack="Produtos" />;
}

export default Header;
