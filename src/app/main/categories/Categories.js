import DemoContent from '@fuse/core/DemoContent';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
	layoutRoot: {}
}));

function Categories(props) {
	const classes = useStyles(props);

	return (
		<FusePageSimple
			classes={{
				root: classes.layoutRoot
			}}
			header={
				<div className="p-24">
					<h4>Categorias</h4>
				</div>
			}
			contentToolbar={
				<div className="px-24">
					<h4>Categorias</h4>
				</div>
			}
			content={
				<div className="p-24">
					<h4>Minhas categorias</h4>
					<Card sx={{ maxWidth: 345 }}>
						<CardContent>
							<Typography gutterBottom variant="h5" component="div">
								Lizard
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
								across all continents except Antarctica
							</Typography>
						</CardContent>
						<CardActions>
							<Button size="small">Share</Button>
							<Button size="small">Learn More</Button>
						</CardActions>
					</Card>
				</div>
			}
		/>
	);
}

export default Categories;
