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

function TableHeadComponent(props) {
	const classes = useStyles(props);
	const [loading, setLoading] = useState(false);

	const createSortHandler = property => event => {
		props.onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow className="h-64">
				{props.columns.map(column => {
					return (
						<TableCell
							className={clsx(classes.textColor, 'p-4 md:p-16')}
							key={column.id}
							align={column.align}
							padding={column.disablePadding ? 'none' : 'default'}
							sortDirection={props?.order?.id === column?.id ? props?.order?.direction : false}
						>
							{column.sort ? (
								<Tooltip
									title="Ordenar"
									placement={column.align === 'right' ? 'bottom-end' : 'bottom-start'}
									enterDelay={300}
								>
									<TableSortLabel
										active={props?.order?.id === column?.id}
										direction={props?.order?.direction}
										onClick={createSortHandler(column.id)}
									>
										{column.label}
									</TableSortLabel>
								</Tooltip>
							) : (
								column.label
							)}
						</TableCell>
					);
				}, this)}
				<TableCell className={clsx(classes.textColor, 'p-4 md:p-16')} padding="default" sortDirection={false} />
			</TableRow>
		</TableHead>
	);
}

export default TableHeadComponent;
