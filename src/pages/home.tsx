import { Grid, Button, TextField, Typography, Container, ThemeProvider, CssBaseline, Box } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
	const [inputURL, setInputURL] = useState('');
	const navigate = useNavigate();

	const submitForm = (e:any) => {
		e.preventDefault();
		return navigate('/app/' + inputURL);
	};

	const changeForm = (e:any) => {
		setInputURL(e.target.value);
	};

	const scanURL = (e:any) => {
		console.log("hello!");
	};

	return(
		<Box sx={{ display: 'flex' }}>
			<Container maxWidth="lg">
				<form onSubmit={submitForm} noValidate>
					<Grid container direction="column" alignItems="center" spacing={2}>
						<Grid item>
							<Typography my={2}>We will try to pick details out of the URL you specify.</Typography>
						</Grid>
						<Grid item>
							<TextField fullWidth
								id="url"
								type="url"
								label="URL"
								variant="outlined"
								onChange={changeForm}
								onBlur={scanURL}
							/>
						</Grid>
						<Grid item>
							<Button type="submit" variant="contained">Appify!</Button>
						</Grid>
					</Grid>
				</form>
			</Container>
		</Box>
	)
}
