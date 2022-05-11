import { Grid, Button, TextField, Typography } from '@mui/material';
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

	return(
		<form onSubmit={submitForm} noValidate>
			<Grid container direction="column" alignItems="center" spacing={2}>
				<Grid item>
					<Typography my={2}>We will try to pick details out of the URL you specify.</Typography>
				</Grid>
				<Grid item>
					<TextField fullWidth id="url" type="url" label="URL" variant="outlined" sx={{width: 560}} onChange={changeForm} />
				</Grid>
				<Grid item>
					<Button type="submit" variant="contained">Appify!</Button>
				</Grid>
			</Grid>
		</form>
	)
}
