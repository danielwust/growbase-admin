import React, { useState } from 'react';
import { Backdrop, CircularProgress, TableCell, TableHead, TableRow, TableSortLabel, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { ClosedCaption } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
	actionsButtonWrapper: {
		background: theme.palette.background.paper
	},
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff'
	},
	textColor: {
		color: theme.palette.primary.main
	}
}));

function PaymentsTableHead(props) {
	const classes = useStyles(props);
	const [loading, setLoading] = useState(false);

	const createSortHandler = property => event => {
		props.onRequestSort(event, property);
	};

	return (
		<TableHead>
			<Backdrop className={classes.backdrop} open={loading}>
				<CircularProgress color="inherit" />
			</Backdrop>
			<TableRow className="h-0.5">
				{props.column.map(row => {
					return (
						<TableCell
							className={clsx(classes.textColor, 'p-4 md:p-16')}
							key={row.id}
							align={row.align}
							padding={row.disablePadding ? 'none' : 'default'}
							sortDirection={props?.order?.id === row?.id ? props?.order?.direction : false}
						>
							{row.sort ? (
								<Tooltip
									title="Ordenar"
									placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
									enterDelay={300}
								>
									<TableSortLabel
										active={props?.order?.id === row?.id}
										direction={props?.order?.direction}
										onClick={createSortHandler(row.id)}
									>
										{row.label}
									</TableSortLabel>
								</Tooltip>
							) : (
								row.label
							)}
						</TableCell>
					);
				}, this)}
				<TableCell className={clsx(classes.textColor, 'p-4 md:p-16')} padding="default" sortDirection={false} />
			</TableRow>
		</TableHead>
	);
}

export default PaymentsTableHead;
