import { CssBaseline, ThemeProvider, Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import theme from '../theme';

export default function Layout() {
	return(
		<ThemeProvider theme={theme}>
			<Box sx={{ display: 'flex' }}>
				<CssBaseline />
				<div>
					<Container maxWidth="md">
						<Outlet />
					</Container>
				</div>
			</Box>
		</ThemeProvider>
	);
}
