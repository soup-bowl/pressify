import {
	Button, TextField, Typography, Box, Grid, Link, Skeleton, Alert, AlertTitle, Stack, useMediaQuery, Theme
} from '@mui/material';
import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { CardDisplay, CardLoad, GeneralAPIError, SiteSelectorDialog, localStorageRefs } from '../components';
import { EPostType, IPost, ISiteInfo, IWPAPIError, WordPressApi } from '../api';
import { WordPressContext } from './_layout';
import { useLocalStorageJSON } from '../localStore';

import GitHubIcon from '@mui/icons-material/GitHub';
import "@fontsource/eb-garamond";

export const MainHome = () => {
	const navigate = useNavigate();
	const [searchValueValidated, setSearchValueValidated] = useState<string>('');
	const [searchValue, setSearchValue] = useState<string>('');
	const [isWP, setWP] = useState<boolean>(false);
	const [isChanging, setChanging] = useState<boolean>(false);
	const searchTimeout = useRef<NodeJS.Timeout | null>(null);

	const [historic, setHistoric] = useLocalStorageJSON<string[]>(localStorageRefs.history, []);

	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const saveSiteToHistory = (item: string) => {
		const updatedItems: string[] = [...historic.slice(-4), item];
		setHistoric(updatedItems);
	};

	const submitForm = (e: any) => {
		e.preventDefault();

		saveSiteToHistory(searchValue);

		return navigate('/' + searchValue);
	};

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		const parsedInput = event.target.value.match(/([^/,\s]+\.[^/,\s]+?)(?=\/|,|\s|$|\?|#)/g);
		setChanging(true);
		setSearchValue((parsedInput !== null) ? parsedInput[0] : '');
	};

	useEffect(() => {
		if (searchValue !== '') {
			if (searchTimeout.current) {
				clearTimeout(searchTimeout.current);
			}

			searchTimeout.current = setTimeout(() => {
				new WordPressApi({ endpoint: `https://${searchValue}/wp-json` }).fetchInfo()
					.then(() => {
						setWP(true);
						setSearchValueValidated(searchValue);
					})
					.catch(() => setWP(false))
					.finally(() => setChanging(false));
			}, 1000);
		}
	}, [searchValue]);

	useEffect(() => { document.title = `Choose a site - Pressify` }, []);

	return (
		<Grid
			container
			spacing={0}
			direction="column"
			alignItems="center"
			justifyContent="center"
			style={{ minHeight: '80vh' }}
		>
			<Grid item xs={3} textAlign="center">
				<Typography variant="h1" sx={{ fontFamily: '"EB Garamond", serif', fontSize: '6rem' }}>Pressify.</Typography>
				<Typography my={2}>
					If the URL you specify is a <strong>WordPress</strong> site with an exposed&nbsp;
					<Link href="https://developer.wordpress.org/rest-api/">WordPress REST API</Link>, we can generate a
					basic web application from the API contents.
				</Typography>
				<Box my={2} textAlign="left">
					<Alert severity="info">
						<AlertTitle>Beta</AlertTitle>
						This service is under active development. Please be aware that there may be bugs!
					</Alert>
				</Box>
				<form onSubmit={submitForm} noValidate>
					<TextField fullWidth
						id="url"
						type="url"
						label="URL"
						variant="outlined"
						error={(searchValueValidated !== '') ? !isWP : false}
						helperText={
							(!isChanging ?
								(isWP ? `${searchValueValidated} is a WordPress site!` : "No WordPress API detected.")
								: 'Analysing...')}
						onChange={handleInputChange}
					/>
					<Box my={2}>
						<Stack my={2} spacing={2} direction="row" justifyContent="center">
							<Button variant="contained" type="submit">Pressify!</Button>
							<Button variant="outlined" onClick={handleOpen}>Show Selector</Button>
						</Stack>
					</Box>
				</form>
				<SiteSelectorDialog open={open} onClose={handleClose} disableInput />
				<Typography my={2}>
					🧪 A <Link href="https://soupbowl.io">Soupbowl</Link> experiment&nbsp;
					<GitHubIcon fontSize='inherit' /> <Link href="https://github.com/soup-bowl/project-wordpress-pwa">
						source code</Link>
				</Typography>
			</Grid>
		</Grid>
	);
}

export const AppHome = () => {
	const [mainInfo] = useOutletContext<[ISiteInfo]>();
	const { inputURL } = useParams();
	const [apiError, setApiError] = useState<string>('');
	const [loadingContent, setLoadingContent] = useState<boolean>(true);
	const [postCollection, setPostCollection] = useState<IPost[]>([]);
	const [pageCollection, setPageCollection] = useState<IPost[]>([]);
	const wp = useContext(WordPressContext);

	const isSmallScreen: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

	useEffect(() => {
		Promise.all([
			wp.fetchPosts({ type: EPostType.Post, page: 1, perPage: 3 }),
			wp.fetchPosts({ type: EPostType.Page, page: 1, perPage: 3 }),
		]).then(values => {
			setPostCollection(values[0].posts);
			setPageCollection(values[1].posts);
			setLoadingContent(false);
		}).catch((err: IWPAPIError) => {
			setApiError(`[${err.code}] ${err.message}`);
			setLoadingContent(false);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inputURL]);

	useEffect(() => { document.title = `${mainInfo.name ?? 'Error'} - Pressify` }, [mainInfo]);

	return (
		<Box>
			<Grid container spacing={2} alignItems="center">
				{(!isSmallScreen && mainInfo.site_icon_url !== undefined) &&
					<Grid item>
						<img src={mainInfo.site_icon_url} alt="" style={{
							height: 100,
							borderRadius: 5
						}} />
					</Grid>
				}
				<Grid item>
					<Typography variant="h1">{mainInfo.name ?? <Skeleton variant="rounded" />}</Typography>
					<Typography my={2}>{mainInfo.description ?? <Skeleton variant="rounded" />}</Typography>
				</Grid>
			</Grid>
			{!loadingContent ?
				<>
					{apiError === '' ?
						<>
							{postCollection.length > 0 &&
								<>
									<Typography variant="h2">Posts</Typography>
									<CardDisplay posts={postCollection} />
								</>
							}

							{pageCollection.length > 0 &&
								<>
									<Typography variant="h2">Pages</Typography>
									<CardDisplay posts={pageCollection} />
								</>
							}
						</>
						:
						<GeneralAPIError endpoint="Posts/Pages" message={apiError} noheader />
					}
				</>
				:
				<>
					<Typography variant="h2">Posts</Typography>
					<CardLoad amount={3} />
					<Typography variant="h2">Pages</Typography>
					<CardLoad amount={3} />
				</>
			}
		</Box>
	);
}
