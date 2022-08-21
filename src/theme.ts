import { createTheme } from '@mui/material';
import { green } from '@mui/material/colors';

declare module '@mui/material/styles' {
	interface Theme {
		status: {
			danger: string;
		};
	}

	interface ThemeOptions {
		status?: {
			danger?: string;
		};
	}
}

const theme = createTheme({
	palette: {
		primary: green,
		mode: 'dark'
	},
	typography: {
		button: {
			textTransform: 'none'
		},
		h1: {
			fontSize: '3.25rem'
		},
		h2: {
			fontSize: '2.75rem'
		},
		h3: {
			fontSize: '2rem'
		}
	}
});

export default theme;
