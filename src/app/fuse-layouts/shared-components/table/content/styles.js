import { makeStyles } from '@material-ui/core/styles';
import { rowCountSelector } from '@material-ui/data-grid';

const useStyles = makeStyles(theme => ({
	root: {
		marginTop: '0px',
		width: '95%',
		alignSelf: 'center',
		fontFamily: 'roboto',
		background: theme.palette.background.default,
		'& .nameInformation': {
			color: theme.palette.primary.main,
			fontWeight: '800'
		},
		'& .OtherInformation': {
			color: '#999999',
			fontWeight: '500'
		},
		'& .arrow': {
			color: '#999999',
			fontWeight: '500'
		}
	},
	headerContent: {
		display: 'flex',
		padding: '5px',
		flexDirection: 'row'
	},
	styledContainer: {
		borderRadius: '10px',
		background: theme.palette.background.default,
		color: theme.palette.primary.main,
		'@media (max-width:768px)': {
			margin: '20px 0',
			fontSize: '1.9em'
		},
		'@media (max-width:420px)': {
			fontSize: '0.6em'
		},
		flex: 1
	},
	title: {
		fontSize: '1.5em',
		fontWeight: 800,
		color: theme.palette.primary.main,
		marginTop: '30px',
		'@media (max-width:768px)': {
			margin: '20px 0',
			fontSize: '2.2em'
		},
		'@media (max-width:420px)': {
			fontSize: '1.9em'
		}
	},
	searchRoot: {
		padding: '10px',
		display: 'flex',
		borderRadius: '4px',
		background: theme.palette.background.default,
		height: '100px',
		width: '100%'
	},
	input: {
		marginLeft: theme.spacing(1),
		height: '10px',
		alignSelf: 'left',
		flex: 1
	},
	iconButton: {
		display: 'flex',
		alignSelf: 'right',
		padding: '10px',
		fontWeight: 800,
		height: '0px',
		color: theme.palette.primary.main,
		width: '20%',
		flex: 1
	}
}));

export default useStyles;
