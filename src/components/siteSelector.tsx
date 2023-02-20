import {
	FormControl, Grid, IconButton, InputAdornment, InputLabel, List, ListItem,
	ListItemButton, OutlinedInput, Typography
} from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppDialog } from "./dialog";
import WPAPI from "wpapi";

const localStorageRefs = {
	history: 'URLHistory',
	saved: 'URLSaved',
};

export function saveSiteToHistory(input: string) {
	let history: string[] = JSON.parse(localStorage.getItem(localStorageRefs.history) ?? '[]');
	if (!(history.indexOf(input) > -1)) {
		history.push(input);

		if (history.length > 6) {
			history.shift();
		}

		localStorage.setItem(localStorageRefs.history, JSON.stringify(history));
	}
}

interface SiteSelectorProps {
	open: boolean;
	onClose: () => void;
	disableInput?: boolean;
}

export function SiteSelectorDialog({ open, onClose, disableInput = false }: SiteSelectorProps) {
	const navigate = useNavigate();
	const [searchValueValidated, setSearchValueValidated] = useState<string>('');
	const [searchValue, setSearchValue] = useState<string>('');
	const [isWP, setWP] = useState<boolean>(false);
	const [isChanging, setChanging] = useState<boolean>(false);
	const searchTimeout = useRef<NodeJS.Timeout | null>(null);

	const [historic, setHistoric] = useState<string[]>(
		JSON.parse(localStorage.getItem(localStorageRefs.history) ?? '[]').reverse()
	);
	const [saved, setSaved] = useState<string[]>(
		JSON.parse(localStorage.getItem(localStorageRefs.saved) ?? '[]').reverse()
	);

	const submitForm = (e: any) => {
		e.preventDefault();
		saveSiteToHistory(searchValue);
		navigate('/' + searchValue);
		onClose();
	};

	const changeForm = (event: ChangeEvent<HTMLInputElement>) => {
		// Thanks to https://stackoverflow.com/a/31941978.
		let parsedInput = event.target.value.match(/([^/,\s]+\.[^/,\s]+?)(?=\/|,|\s|$|\?|#)/g);
		setChanging(true);
		setSearchValue((parsedInput !== null) ? parsedInput[0] : '');
	};

	useEffect(() => {
		if (searchValue !== '') {
			if (searchTimeout.current) {
				clearTimeout(searchTimeout.current);
			}

			searchTimeout.current = setTimeout(() => {
				new WPAPI({ endpoint: `https://${searchValue}/wp-json` }).root().get()
					.then((response: any) => {
						setWP(true);
						setSearchValueValidated(searchValue);
					})
					.catch((err) => setWP(false))
					.finally(() => setChanging(false));
			}, 1000);
		}
	}, [searchValue]);

	function saveSiteToSaved(input: string) {
		let saved: string[] = JSON.parse(localStorage.getItem(localStorageRefs.saved) ?? '[]');
		saved.push(input);
		localStorage.setItem(localStorageRefs.saved, JSON.stringify(saved));
		updateStores();
	}

	function removeSiteFromSaved(input: string) {
		let saved: string[] = JSON.parse(localStorage.getItem(localStorageRefs.saved) ?? '[]');
		saved.splice(saved.indexOf(input), 1);
		localStorage.setItem(localStorageRefs.saved, JSON.stringify(saved));
		updateStores();
	}

	function updateStores() {
		setHistoric(JSON.parse(localStorage.getItem(localStorageRefs.history) ?? '[]').reverse());
		setSaved(JSON.parse(localStorage.getItem(localStorageRefs.saved) ?? '[]').reverse());
	}

	function selectSite(site: string) {
		navigate(`/${site}`);
		onClose();
	}

	return (
		<AppDialog title="Select Site" open={open} onClose={onClose} size="md">
			{!disableInput &&
				<form onSubmit={submitForm} noValidate>
					<FormControl sx={{ width: '100%', marginTop: 1 }} variant="outlined">
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
						<Typography color="darkgrey" mx={2}>
							{(!isChanging ?
								<>
									{(isWP ?
										<>{searchValueValidated} is a WordPress site!</>
										:
										<>No WordPress API detected.</>)}
								</>
								: <>Analysing...</>)}
						</Typography>
					</FormControl>
				</form>}
			<Grid container sx={{ paddingTop: 2 }}>
				<Grid item xs={12} sm={6} sx={{ padding: 2 }}>
					<Typography variant="h5" component="h2">History</Typography>
					{historic.length > 0 ?
						<List component="nav">
							{historic.map((item: string, index: number) => (
								<ListItem key={index} disablePadding secondaryAction={
									<IconButton onClick={() => saveSiteToSaved(item)}>
										<StarIcon />
									</IconButton>
								}>
									<ListItemButton onClick={() => selectSite(item)}>
										<Typography variant="inherit" noWrap>
											{item}
										</Typography>
									</ListItemButton>
								</ListItem>
							))}
						</List>
						:
						<Typography>No recent URLs.</Typography>
					}
				</Grid>
				<Grid item xs={12} sm={6} sx={{ padding: 2 }}>
					<Typography variant="h5" component="h2">Saved</Typography>
					{saved.length > 0 ?
						<List component="nav">
							{saved.map((item: string, index: number) => (
								<ListItem key={index} disablePadding secondaryAction={
									<IconButton onClick={() => removeSiteFromSaved(item)}>
										<DeleteIcon />
									</IconButton>
								}>
									<ListItemButton onClick={() => selectSite(item)}>
										<Typography variant="inherit" noWrap>
											{item}
										</Typography>
									</ListItemButton>
								</ListItem>
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
