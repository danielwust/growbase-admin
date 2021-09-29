import React from 'react';
import FuseAnimate from '@fuse/core/FuseAnimate';
import { Link } from 'react-router-dom';
import { Grid, Typography } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';

import ButtonDefault from 'app/fuse-layouts/shared-components/button-default/ButtonDeafault';

export default function PageCardedHeader({ link, textBack, title, buttonTitle, buttonAction }) {
	return (
		<Grid container>
			<Grid item container xs={12} className="flex flex-1 w-full items-center justify-between">
				<Grid item container xs={8}>
					{link && (
						<FuseAnimate animation="transition.slideLeftIn" delay={300}>
							<Typography
								className="flex items-center sm:mb-12"
								component={Link}
								role="button"
								to={link}
								color="inherit"
							>
								<ArrowBack color="secondary" className="text-32" />
								<Typography color="secondary" className="text-20 font-600 mx-8">
									{textBack}
								</Typography>
							</Typography>
						</FuseAnimate>
					)}
					<Grid container item xs={12} className="flex items-center max-w-full">
						<Grid item className="flex flex-col min-w-0 mx-8 sm:mc-16">
							<FuseAnimate animation="transition.slideLeftIn" delay={300}>
								<Typography className="font-600 text-20 sm:text-28 truncate">{title}</Typography>
							</FuseAnimate>
						</Grid>
					</Grid>
				</Grid>
				{buttonTitle && (
					<Grid item container xs={4}>
						<FuseAnimate animation="transition.slideDownIn" delay={300}>
							<ButtonDefault title={buttonTitle} action={buttonAction} fullWidth />
						</FuseAnimate>
					</Grid>
				)}
			</Grid>
		</Grid>
	);
}
