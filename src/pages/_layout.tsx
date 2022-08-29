import { Outlet, useNavigate, useParams } from "react-router-dom";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { CssBaseline, ThemeProvider, Toolbar, IconButton, Typography,
	Container, styled, Drawer, Divider, Box, List, ListItemIcon,
	ListItemText, useMediaQuery, ListItemButton, alpha, InputBase,
	createTheme, PaletteMode } from '@mui/material';
import { createContext, useEffect, useMemo, useState } from "react";
import { green } from '@mui/material/colors';
import { ISiteInfo } from "../interfaces";
import WPAPI from "wpapi";
import { PrincipalAPIError } from "../components/error";

import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HomeIcon from '@mui/icons-material/Home';
import PushPinIcon from '@mui/icons-material/PushPin';
import DescriptionIcon from '@mui/icons-material/Description';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

const drawerWidth = 240;

export const ColorModeContext = createContext({ toggleColorMode: () => {} });
export const WordPressContext = createContext(new WPAPI({ endpoint: '' }));

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

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
	open?: boolean;
}>(({ theme, open }) => ({
	flexGrow: 1,
	padding: theme.spacing(3),
	transition: theme.transitions.create('margin', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
	transition: theme.transitions.create(['margin', 'width'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const Search = styled('div')(({ theme }) => ({
	position: 'relative',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	'&:hover': {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	[theme.breakpoints.up('sm')]: {
		marginLeft: theme.spacing(1),
		width: 'auto',
	},
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}));

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
	justifyContent: 'flex-end',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('xs')]: {
			width: '0ch',
			'&:focus': {
				width: '20ch',
			},
		},
		[theme.breakpoints.up('sm')]: {
			width: '24ch',
			'&:focus': {
				width: '40ch',
			},
		},
	},
}));

interface Props {
	simple?: boolean;
}

export default function Layout({simple = false}:Props) {
	const navigate = useNavigate();
	const { inputURL } = useParams();
	const [open, setOpen] = useState(false);
	const desktop = useMediaQuery("(min-width: 961px)");
	const [mainInfo, setMainInfo] = useState<ISiteInfo>({} as ISiteInfo);
	const [apiError, setApiError] = useState<string>('');
	const wp = new WPAPI({ endpoint: `https://${inputURL}/wp-json` });

	const [mode, setMode] = useState<string>(localStorage.getItem('ColourPref') ?? 'dark');
	const colorMode = useMemo(() => ({
		toggleColorMode: () => {
			setMode((prevMode:string) => {
				let cmode = (prevMode === 'light') ? 'dark' : 'light';
				localStorage.setItem('ColourPref', cmode);
				return cmode;
			});
		},
	}), []);

	const theme = useMemo(() => createTheme({
		palette: {
			primary: green,
			mode: mode as PaletteMode
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
	}), [mode]);

	const submitForm = (e:any) => {
		e.preventDefault();
		return navigate(`/${inputURL}/search/${e.target[0].value}`);
	};

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		wp.root().get()
		.then((response:any) => {
			//console.log('Info Reply', response);
			setApiError('');
			setMainInfo({
				name: response.name ?? 'N/A',
				description: response.description ?? '',
				url: response.url,
				namespaces: response.namespaces,
			});
		})
		.catch((err) => {
			setApiError(`[${err.code}] ${err.message}`);
			setMainInfo({} as ISiteInfo);
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inputURL]);

	return(
		<WordPressContext.Provider value={wp}>
			<ThemeProvider theme={theme}>
				<Box sx={{ display: 'flex' }}>
					<CssBaseline />
					{!simple ?
					<>
					<AppBar
						position="fixed"
						open={open}
						sx={{zIndex: (theme) => ( desktop ? theme.zIndex.drawer + 1 : 1)}}>
						<Toolbar>
							{ ! desktop ?
							<IconButton
								color="inherit"
								aria-label="open drawer"
								onClick={handleDrawerOpen}
								edge="start"
								sx={{ mr: 2, ...(open && { display: 'none' }) }}
							>
								<MenuIcon />
							</IconButton>
							: null }
							<Typography
								variant="h6"
								noWrap
								component="div"
								sx={{ flexGrow: 1, display: { xs: 'block', sm: 'block' } }}
							>
								{mainInfo.name}
							</Typography>
							<form onSubmit={submitForm}>
								<Search>
									<SearchIconWrapper>
										<SearchIcon />
									</SearchIconWrapper>
									<StyledInputBase
										placeholder="Search…"
										inputProps={{ 'aria-label': 'search' }}
									/>
								</Search>
							</form>
						</Toolbar>
					</AppBar>
					<Drawer
						sx={{
						width: drawerWidth,
						flexShrink: 0,
						'& .MuiDrawer-paper': {
							width: drawerWidth,
							boxSizing: 'border-box',
						},
						}}
						variant={(desktop) ? "permanent" : "temporary"}
						anchor="left"
						open={open}
						onClose={handleDrawerClose}
					>
						<DrawerHeader>
							<IconButton onClick={handleDrawerClose}>
								<MenuIcon />
							</IconButton>
						</DrawerHeader>
						<Divider />
						<List>
							<ListItemButton
								onClick={() => {navigate(`/${inputURL}`);handleDrawerClose();}}
								selected={(window.location.hash.replace(`/${inputURL}`, '') === "#")}
							>
								<ListItemIcon><HomeIcon /></ListItemIcon>
								<ListItemText primary="Home" />
							</ListItemButton>
						</List>
						<Divider />
						<List>
							<ListItemButton
								onClick={() => {navigate(`/${inputURL}/posts`);handleDrawerClose();}}
								selected={window.location.hash.includes("/posts")}
							>
								<ListItemIcon><PushPinIcon /></ListItemIcon>
								<ListItemText primary="Posts" />
							</ListItemButton>
							<ListItemButton
								onClick={() => {navigate(`/${inputURL}/pages`);handleDrawerClose();}}
								selected={window.location.hash.includes("/pages")}
							>
								<ListItemIcon><DescriptionIcon /></ListItemIcon>
								<ListItemText primary="Pages" />
							</ListItemButton>
						</List>
						<Divider />
						<List>
							<ListItemButton onClick={() => {navigate('/');handleDrawerClose();}}>
								<ListItemIcon><KeyboardReturnIcon /></ListItemIcon>
								<ListItemText primary="Change Site" />
							</ListItemButton>
							<ListItemButton onClick={colorMode.toggleColorMode}>
								<ListItemIcon>
									{theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
								</ListItemIcon>
								<ListItemText primary={theme.palette.mode === 'dark' ? 'Light Mode' : 'Dark Mode'} />
							</ListItemButton>
							<ListItemButton
								onClick={() => {navigate(`/${inputURL}/about`);handleDrawerClose();}}
								selected={window.location.hash.includes("/about")}
							>
								<ListItemIcon><CoPresentIcon /></ListItemIcon>
								<ListItemText primary="About" />
							</ListItemButton>
						</List>
					</Drawer>
					</>
					: null }
					{!simple ?
					<Main open={open}>
						<DrawerHeader />
						<Container maxWidth="md">
							{apiError === '' ?
							<Outlet context={[mainInfo]}  />
							:
							<PrincipalAPIError message={apiError} />
							}
						</Container>
					</Main>
					:
					<Container maxWidth="md">
						<Outlet />
					</Container>
					}
				</Box>
			</ThemeProvider>
		</WordPressContext.Provider>
	);
}
