import { Button, TextField, Typography, Container, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import agent from '../agent';

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

	useEffect(() => {
        agent.Info.full('https://labour.org.uk')
        .then((response:any) => {
            console.log(response);
        });
    }, []);

	return(
		<Box sx={{ display: 'flex' }}>
			<Container maxWidth="lg">
				<Typography my={2}>We will try to pick details out of the URL you specify.</Typography>
				<form onSubmit={submitForm} noValidate>
					<TextField fullWidth
						id="url"
						type="url"
						label="URL"
						variant="outlined"
						onChange={changeForm}
						onBlur={scanURL}
					/>
					<Button type="submit" variant="contained">Appify!</Button>
				</form>
			</Container>
		</Box>
	)
}
