import { Button, Grid, Link, Paper, TextField, Typography } from "@mui/material";
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

	function selectSite(site:string) {
		navigate(`/${site}`);
		onClose();
	}

	return(
		<AppDialog title="Select Site" open={open} onClose={onClose} size="sm">
			<form onSubmit={submitForm} noValidate>
				<Grid container rowSpacing={1}>
					<Grid item xs={12} sm={10}>
						<TextField fullWidth
							id="url"
							type="url"
							label="URL"
							variant="outlined"
							onChange={changeForm}
						/>
					</Grid>
					<Grid item xs={12} sm={2} textAlign="center">
						<Button type="submit" variant="contained">Pressify!</Button>
					</Grid>
				</Grid>
			</form>
			<div>
				{historic.length > 0 ?
					<>
					{historic.map((item:string, index:number) => (
						<Typography key={index} my={1}>
							<Link onClick={() => selectSite(item)} sx={{ cursor: 'pointer' }}>
								{item}
							</Link>
						</Typography>
					))}
					</>
				: 
					<Typography>No recent URLs.</Typography>
				}
			</div>
		</AppDialog>
	);
}
