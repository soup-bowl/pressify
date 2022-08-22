import { Button, TextField, Typography, Box, Grid, Link, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { IPost, ISiteInformation } from '../interfaces';

import GitHubIcon from '@mui/icons-material/GitHub';
import agent from '../agent';
import { CardDisplay } from '../components/cards';

export function MainHome() {
	const [inputURL, setInputURL] = useState('');
	const navigate = useNavigate();

	const submitForm = (e:any) => {
		e.preventDefault();
		return navigate('/' + inputURL);
	};

	const changeForm = (e:any) => {
		setInputURL(e.target.value);
	};

	useEffect(() => {
		document.title = `Choose a site - Wapp`;
	}, []);

	return(
		<Grid
			container
			spacing={0}
			direction="column"
			alignItems="center"
			justifyContent="center"
			style={{ minHeight: '50vh' }}
		>
			<Grid item xs={3} textAlign="center">
				<Typography variant="h1">WordPress App Generator</Typography>
				<Typography my={2}>
					If the URL you specify is a WordPress site with an exposed&nbsp;
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
						<Button type="submit" variant="contained">Appify!</Button>
					</Box>
				</form>
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
	const [mainInfo] = useOutletContext<[ISiteInformation]>();
	const { inputURL } = useParams();
	const [loadingContent, setLoadingContent] = useState<boolean>(true);
	const [postCollection, setPostCollection] = useState<IPost[]>([]);
	const [pageCollection, setPageCollection] = useState<IPost[]>([]);

	useEffect(() => {
		Promise.all([
			agent.Posts.list(`https://${inputURL}`, false, 3),
			agent.Posts.list(`https://${inputURL}`, true, 3),
		]).then(values => {
			setPostCollection(values[0]);
			setPageCollection(values[1]);
			setLoadingContent(false);
		});
    }, [inputURL]);

	useEffect(() => { document.title = `${mainInfo.name ?? 'Error'} - Wapp` }, [mainInfo]);

	return(
		<Box>
			<Typography variant="h1">{mainInfo.name}</Typography>
			<Typography my={2}>{mainInfo.description}</Typography>
			{!loadingContent ?
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
				<CircularProgress />
			}
		</Box>
	);
}
