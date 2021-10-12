import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import _ from '@lodash';

import Formsy from 'formsy-react';
import FuseChipSelect from '@fuse/core/FuseChipSelect';
import { TextFieldFormsy, SelectFormsy } from '@fuse/core/formsy';
import FuseLoading from '@fuse/core/FuseLoading';
import { useDeepCompareEffect } from '@fuse/hooks';

import { showMessage } from 'app/store/fuse/messageSlice';

import objectsKeysEquals from 'app/utils/validations/objectsKeysEquals';
import ButtonDefault from 'app/fuse-layouts/shared-components/button-default/ButtonDeafault';
import { Grid, InputAdornment, MenuItem } from '@material-ui/core';

import { newData, saveOne, getOne, updateOne, deleteOne, updateResponse, updateLoading } from '../store/productSlice';
import Datetime from 'app/services/datetime';

function Content() {
	const dispatch = useDispatch();
	const routeParams = useParams();
	const history = useHistory();
	const productRedux = useSelector(({ product }) => product);

	const [contents, setContents] = useState([]);
	const [selectedContents, setSelectedContents] = useState([]);
	const [isFormValid, setIsFormValid] = useState(false);
	const [loading, setLoading] = useState(false);

	useDeepCompareEffect(() => {
		function updateState() {
			const { uid } = routeParams;
			if (uid === 'new') {
				dispatch(newData());
			} else if (uid.includes('recycle:')) {
				dispatch(deleteOne(uid.replace('recycle:', '')));
			} else {
				setLoading(true);
				dispatch(getOne(uid.replace('recycle:', '')));
			}
		}

		updateState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (productRedux) {
			if (loading) {
				setLoading(productRedux.loading);
			}
		}
	}, [productRedux]);

	useEffect(() => {
		function clear() {
			const { uid } = routeParams;
			setIsFormValid(false);

			if (uid === 'new') {
				dispatch(newData());
				history.push('/notas/new');
			} else {
				dispatch(updateResponse({ message: '', success: false }));
			}
		}

		if (productRedux?.message && !productRedux?.success) {
			dispatch(
				showMessage({
					message: productRedux?.message,
					autoHideDuration: 6000,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'right'
					},
					variant: 'error'
				})
			);

			clear();
		}
		if (productRedux?.message && productRedux?.success) {
			dispatch(
				showMessage({
					message: productRedux?.message,
					autoHideDuration: 6000,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'right'
					},
					variant: 'success'
				})
			);

			clear();
		}
	}, [productRedux.success, productRedux.message]);

	function canBeSubmitted(modal) {
		if (modal) {
			let diff = false;

			if (modal === true) {
				diff = isFormValid;
			} else {
				diff = objectsKeysEquals(modal, productRedux);
			}
			const diffContents = productRedux?.contents?.length !== selectedContents.length;

			if ((diff || diffContents) && !isFormValid) {
				setIsFormValid(true);
			}

			if (!diff && !diffContents && isFormValid) {
				setIsFormValid(false);
			}

			if ((diff && !diffContents) || (!diff && diffContents && !isFormValid)) {
				setIsFormValid(true);
			}
		}
	}

	function handleSubmit(modal) {
		setLoading(true);
		dispatch(updateLoading(true));

		if (productRedux?.uid !== 'new') {
			dispatch(updateOne({ data: modal, uid: productRedux?.uid }));
		} else {
			dispatch(saveOne(modal));
		}
	}

	function handleSelect(value) {
		setSelectedContents(value);
	}
	function disableButton() {
		setIsFormValid(false);
	}

	function enableButton() {
		setIsFormValid(true);
	}

	if (!productRedux?.uid && loading) {
		return <FuseLoading />;
	}

	return (
		<Grid container item xs={12}>
			<Grid item xs={12}>
				<Formsy
					onValidSubmit={handleSubmit}
					onChange={canBeSubmitted}
					onValid={enableButton}
					onInvalid={disableButton}
				>
					<TextFieldFormsy
						className="mb-16 w-full"
						label="Descrição"
						type="text"
						name="descricao"
						value={productRedux.descricao}
						variant="outlined"
						validations={{ minLength: 3 }}
						validationErrors={{ minLength: 'Preencha o campo com a descrição' }}
						fullWidth
						autoFocus
						required
					/>
					<TextFieldFormsy
						className="mb-16 w-full"
						label="Detalhamento"
						type="text"
						name="detalhamento"
						value={productRedux.detalhamento}
						variant="outlined"
						validations={{ minLength: 3 }}
						validationErrors={{ minLength: 'Preencha o campo com o detalhamento' }}
						fullWidth
						required
					/>

					<Grid container item className="flex justify-end items-end">
						<Grid item xs={7} sm={5} md={4} lg={3} xl={2}>
							<ButtonDefault
								fullWidth
								type="submit"
								title="Salvar"
								loading={loading}
								disabled={!isFormValid}
							/>
						</Grid>
					</Grid>
				</Formsy>
			</Grid>
		</Grid>
	);
}

export default Content;
