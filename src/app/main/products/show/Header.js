import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import PageCardedHeader from 'app/fuse-layouts/shared-components/page-carded-header/PageCardedHeader';

import FuseAnimate from '@fuse/core/FuseAnimate';
import { Link, useHistory } from 'react-router-dom';
import { Typography, Grid } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

function Header() {
	const productRedux = useSelector(({ product }) => product);
	const [product, setProduct] = useState({});

	useEffect(() => {
		if (productRedux) {
			setProduct(productRedux);
		}
	}, [productRedux]);

	return <PageCardedHeader link="/notas" title={product?.nome || 'Nova nota'} textBack="Notas" />;
}

export default Header;
