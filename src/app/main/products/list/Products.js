import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FusePageCarded from '@fuse/core/FusePageCarded';
import TableComponent from 'app/fuse-layouts/shared-components/table';
import PageCardedHeader from 'app/fuse-layouts/shared-components/page-carded-header/PageCardedHeader';

import { getAll, selectAll } from '../store/productsSlice';
import Datetime from 'app/services/datetime';

const columns = [
	{
		id: 'descricao',
		align: 'left',
		disablePadding: false,
		label: 'Descrição',
		sort: true
	},
	{
		id: 'detalhamento',
		align: 'left',
		disablePadding: false,
		label: 'Detalhamento',
		sort: false
	},
	{
		id: 'updatedAt',
		align: 'left',
		disablePadding: false,
		label: 'Ultima atualização',
		sort: true
	}
];

export default function Products() {
	const history = useHistory();
	const dispatch = useDispatch();
	const productsRedux = useSelector(selectAll);
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);

	function handleClick(n) {
		history.push(`/notas/${n.uid}`);
	}

	function handleClickNew() {
		history.push(`/notas/new`);
	}

	useEffect(() => {
		setLoading(true);
		dispatch(getAll());
	}, []);

	useEffect(() => {
		if (productsRedux) {
			setLoading(false);
			if (productsRedux.length) {
				const parseProducts = productsRedux.map(item => {
					return {
						...item,
						updatedAt: Datetime(item.updatedAt)
					};
				});
				setData(parseProducts);
			}
		}
	}, [productsRedux]);

	return (
		<FusePageCarded
			classes={{
				content: 'flex',
				contentCard: 'overflow-hidden rounded-t-12',
				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136 white'
			}}
			header={<PageCardedHeader title="Notas" buttonTitle="Adicionar Nota" buttonAction={handleClickNew} />}
			content={<TableComponent columns={columns} data={data} action={handleClick} />}
			innerScroll
		/>
	);
}
