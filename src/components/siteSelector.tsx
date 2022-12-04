import {
	FormControl, Grid, IconButton, InputAdornment, InputLabel, Link, List,
	ListItemButton, ListItemText, OutlinedInput, Paper, Typography
} from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// import StarIcon from '@mui/icons-material/Star';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppDialog } from "./dialog";

export function saveSite(input: string) {
	let history:string[] = JSON.parse(localStorage.getItem('URLHistory') ?? '[]');
	if (!(history.indexOf(input) > -1)) {
		history.push(input);

		if (history.length > 6) {
			history.shift();
		}

		localStorage.setItem('URLHistory', JSON.stringify(history));
	}
}

export function SiteSelector() {
	const navigate = useNavigate();

	let historic = JSON.parse(localStorage.getItem('URLHistory') ?? '[]').reverse();

	return(
		<Paper sx={{ padding: 2, my: 1, mx: 8 }}>
			{historic.length > 0 ?
				<>
				{historic.map((item:string, index:number) => (
					<Typography key={index} textAlign="left" my={1}>
						<Link onClick={() => navigate(`/${item}`)} sx={{ cursor: 'pointer' }}>{item}</Link>
					</Typography>
				))}
				</>
			: 
				<Typography textAlign="left" >No recent URLs.</Typography>
			}
		</Paper>
	);
}

interface SiteSelectorProps {
	open: boolean;
	onClose: () => void;
}

export function SiteSelectorDialog({open, onClose}:SiteSelectorProps) {
	const navigate = useNavigate();
	const [inputURL, setInputURL] = useState('');

	const submitForm = (e:any) => {
		e.preventDefault();
		saveSite(inputURL);
		navigate('/' + inputURL);
		onClose();
	};

	const changeForm = (e:any) => {
		// Thanks to https://stackoverflow.com/a/31941978.
		setInputURL(e.target.value.match(/([^/,\s]+\.[^/,\s]+?)(?=\/|,|\s|$|\?|#)/g)[0]);
	};

	let historic = JSON.parse(localStorage.getItem('URLHistory') ?? '[]').reverse();
	let saved    = JSON.parse(localStorage.getItem('URLSaved') ?? '[]').reverse();

	function selectSite(site:string) {
		navigate(`/${site}`);
		onClose();
	}

	return(
		<AppDialog title="Select Site" open={open} onClose={onClose} size="sm">
			<form onSubmit={submitForm} noValidate>
				<FormControl sx={{ width: '100%' }} variant="outlined">
					<InputLabel htmlFor="url">URL</InputLabel>
					<OutlinedInput fullWidth
						id="url"
						type="url"
						label="URL"
						onChange={changeForm}
						endAdornment={
							<InputAdornment position="end">
								<IconButton aria-label="submit" onClick={submitForm} edge="end">
									<ArrowForwardIosIcon />
								</IconButton>
							</InputAdornment>
						}
					/>
				</FormControl>
			</form>
			<Grid container sx={{ paddingTop: 2 }}>
				<Grid item xs={12} sm={6}>
					<Typography variant="h5" component="h2">History</Typography>
					{historic.length > 0 ?
						<List component="nav">
							{historic.map((item:string, index:number) => (
								<ListItemButton key={index} onClick={() => selectSite(item)}>
									<ListItemText primary={item} />
								</ListItemButton>
							))}
						</List>
					: 
						<Typography>No recent URLs.</Typography>
					}
				</Grid>
				<Grid item xs={12} sm={6}>
					<Typography variant="h5" component="h2">Saved</Typography>
					{saved.length > 0 ?
						<List component="nav">
							{saved.map((item:string, index:number) => (
								<ListItemButton key={index} onClick={() => selectSite(item)}>
									<ListItemText primary={item} />
								</ListItemButton>
							))}
						</List>
					: 
						<Typography>No saved URLs.</Typography>
					}
				</Grid>
			</Grid>
		</AppDialog>
	);
}
