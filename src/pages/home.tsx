import { Button, TextField, Typography, Box, Grid, Link } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ISiteInformation } from '../interfaces';

import GitHubIcon from '@mui/icons-material/GitHub';

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

	/*useEffect(() => {
        console.log(mainInfo);
    }, [mainInfo]);*/

	useEffect(() => { document.title = `${mainInfo.name ?? 'Error'} - Wapp` }, [mainInfo]);

	return( <Typography my={2}>Not implemented.</Typography> );
}
