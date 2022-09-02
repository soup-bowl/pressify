import { Button, TextField, Typography, Box, Grid, Link, Paper, Skeleton, Chip } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { IPost, ISiteInfo } from '../interfaces';

import GitHubIcon from '@mui/icons-material/GitHub';
import { CardDisplay, CardLoad } from '../components/cards';
import { GeneralAPIError } from '../components/error';
import { WordPressContext } from './_layout';

export function MainHome() {
	const navigate = useNavigate();
	const [inputURL, setInputURL] = useState('');

	const submitForm = (e:any) => {
		e.preventDefault();

		let history:string[] = JSON.parse(localStorage.getItem('URLHistory') ?? '[]');
		if (!(history.indexOf(inputURL) > -1)) {
			history.push(inputURL);

			if (history.length > 6) {
				history.shift();
			}

			localStorage.setItem('URLHistory', JSON.stringify(history));
		}
		

		return navigate('/' + inputURL);
	};

	const changeForm = (e:any) => {
		// Thanks to https://stackoverflow.com/a/31941978.
		setInputURL(e.target.value.match(/([^/,\s]+\.[^/,\s]+?)(?=\/|,|\s|$|\?|#)/g)[0]);
	};

	useEffect(() => { document.title = `Choose a site - Pressify` }, []);

	let historic = JSON.parse(localStorage.getItem('URLHistory') ?? '[]').reverse();

	return(
		<Grid
			container
			spacing={0}
			direction="column"
			alignItems="center"
			justifyContent="center"
			style={{ minHeight: '80vh' }}
		>
			<Grid item xs={3} textAlign="center">
				<Typography variant="h1">Pressify That Site! <Chip label="Beta" color="primary" /></Typography>
				<Typography my={2}>
					If the URL you specify is a <strong>WordPress</strong> site with an exposed&nbsp;
					<Link href="https://developer.wordpress.org/rest-api/">WordPress REST API</Link>, we can generate a
					basic web application from the API contents.
				</Typography>
				<form onSubmit={submitForm} noValidate>
					<TextField fullWidth
						id="url"
						type="url"
						label="URL"
						variant="outlined"
						onChange={changeForm}
					/>
					<Box my={2}>
						<Button type="submit" variant="contained">Pressify!</Button>
					</Box>
				</form>
				<Box>
					<Typography variant="h2">Recent History</Typography>
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
				</Box>
				<Typography my={2}>
					🧪 A <Link href="https://soupbowl.io">Soupbowl</Link> experiment&nbsp;
					<GitHubIcon fontSize='inherit' /> <Link href="https://github.com/soup-bowl/project-wordpress-pwa">
					source code</Link>
				</Typography>
			</Grid>
		</Grid>
	);
}

export function AppHome() {
	const [mainInfo] = useOutletContext<[ISiteInfo]>();
	const { inputURL } = useParams();
	const [apiError, setApiError] = useState<string>('');
	const [loadingContent, setLoadingContent] = useState<boolean>(true);
	const [postCollection, setPostCollection] = useState<IPost[]>([]);
	const [pageCollection, setPageCollection] = useState<IPost[]>([]);
	const wp = useContext(WordPressContext);

	useEffect(() => {
		Promise.all([
			wp.posts().perPage(3).embed().get(),
			wp.pages().perPage(3).embed().get(),
		]).then(values => {
			delete values[0]['_paging'];
			delete values[1]['_paging'];
			setPostCollection(values[0]);
			setPageCollection(values[1]);
			setLoadingContent(false);
		}).catch((err) => {
			setApiError(`[${err.code}] ${err.message}`);
			setLoadingContent(false);
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inputURL]);

	useEffect(() => { document.title = `${mainInfo.name ?? 'Error'} - Pressify` }, [mainInfo]);

	return(
		<Box>
			<Typography variant="h1">{mainInfo.name ?? <Skeleton variant="rounded" />}</Typography>
			<Typography my={2}>{mainInfo.description ?? <Skeleton variant="rounded" />}</Typography>
			{!loadingContent ?
				<>
				{apiError === '' ?
					<>
					{postCollection.length > 0 ?
						<>
						<Typography variant="h2">Posts</Typography>
						<CardDisplay posts={postCollection} />
						</>
						: null}

					{pageCollection.length > 0 ?
						<>
						<Typography variant="h2">Pages</Typography>
						<CardDisplay posts={pageCollection} />
						</>
						: null}
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
