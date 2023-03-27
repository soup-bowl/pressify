import { Outlet, useNavigate, useParams } from "react-router-dom";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import {
	CssBaseline, ThemeProvider, Toolbar, IconButton, Typography,
	Container, styled, Drawer, Divider, Box, useMediaQuery, alpha, InputBase,
	createTheme, PaletteMode, Chip, Avatar, Badge
} from '@mui/material';
import { createContext, FormEvent, useEffect, useMemo, useState } from "react";
import { ISiteInfo } from "../interfaces";
import WPAPI from "wpapi";
import MenuItems from "../components/menu";
import { PrincipalAPIError } from "../components/error";

import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { EStatus } from "../enums";
import { Loading } from "../components/loading";
import { useLocalStorage } from "../localStore";
import ColorThief from "colorthief";

const drawerWidth = 240;

export const ColorModeContext = createContext({ toggleColorMode: () => { } });
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

export function Layout({ simple = false }: Props) {
	const navigate = useNavigate();
	const { inputURL } = useParams();
	const [open, setOpen] = useState(false);
	const desktop = useMediaQuery("(min-width: 961px)");
	const [mainInfo, setMainInfo] = useState<ISiteInfo>({} as ISiteInfo);
	const [apiState, setApiState] = useState<EStatus>(EStatus.Loading);
	const [apiError, setApiError] = useState<string>('');
	const [primaryColor, setPrimaryColor] = useState('#3858e9');
	const wp = new WPAPI({ endpoint: `https://${inputURL}/wp-json` });

	const [mode, setMode] = useLocalStorage('ColourPref', 'dark');
	const colorMode = useMemo(() => ({
		toggleColorMode: () => {
			setMode((prevMode: string) => {
				let cmode = prevMode === 'light' ? 'dark' : 'light';
				setMode(cmode);
				return cmode;
			});
		},
	}), [setMode]);

	const theme = useMemo(() => createTheme({
		palette: {
			primary: {
				main: primaryColor
			},
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
			},
			body1: {
				'& .wp-content a': {
					color: primaryColor,
				},
				'& .wp-content img, & .wp-content video': {
					maxWidth: '100%',
					height: 'inherit',
				}
			},
		}
	}), [mode, primaryColor]);

	useEffect(() => {
		if (mainInfo.site_icon_url === undefined) { return; }

		const image = new Image();
		image.crossOrigin = 'anonymous';
		image.src = mainInfo.site_icon_url;

		image.onload = () => {
			const colorThief = new ColorThief();
			const [r, g, b] = colorThief.getColor(image);
			const primaryColor = `rgb(${r}, ${g}, ${b})`;
			setPrimaryColor(primaryColor);
		};

		image.onerror = (error) => {
			console.error(error);
		};
	}, [mainInfo]);

	const submitForm = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		return navigate(`/${inputURL}/search/${(e.currentTarget[0] as HTMLInputElement).value}`);
	};

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		setApiState(EStatus.Loading);
		wp.root().get()
			.then((response: any) => {
				//console.log('Info Reply', response);
				setApiError('');
				setMainInfo({
					name: response.name ?? 'N/A',
					description: response.description ?? '',
					site_icon_url: response.site_icon_url,
					url: response.url,
					namespaces: response.namespaces,
				});
				setApiState(EStatus.Complete);
			})
			.catch((err) => {
				setApiError(`[${err.code}] ${err.message}`);
				setMainInfo({} as ISiteInfo);
				setApiState(EStatus.Error);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inputURL]);

	return (
		<WordPressContext.Provider value={wp}>
			<ThemeProvider theme={theme}>
				<Box sx={{ display: 'flex' }}>
					<CssBaseline enableColorScheme />
					{!simple &&
						<>
							<AppBar
								enableColorOnDark
								position="fixed"
								open={open}
								sx={{ zIndex: (theme) => (desktop ? theme.zIndex.drawer + 1 : 1) }}>
								<Toolbar>
									{!desktop &&
										<IconButton
											color="inherit"
											aria-label="open drawer"
											onClick={handleDrawerOpen}
											edge="start"
											sx={{ mr: 2, ...(open && { display: 'none' }) }}
										>
											<MenuIcon />
										</IconButton>
									}
									<Badge
										overlap="circular"
										anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
										badgeContent={
											<Chip label="Beta" color="info" size="small" sx={{
												fontSize: '0.6rem',
												height: 16
											}} />
										}
									>
										<Avatar
											src={mainInfo.site_icon_url}
											sx={{ marginRight: 2 }}
										/>
									</Badge>
									<Typography
										variant="h6"
										noWrap
										component="div"
										sx={{ flexGrow: 1, display: { xs: 'block', sm: 'block' } }}
									>
										{mainInfo.name ?? 'Site'}
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
								<MenuItems onClose={handleDrawerClose} colorMode={colorMode} theme={theme} />
							</Drawer>
						</>
					}
					{!simple ?
						<Main open={open}>
							<DrawerHeader />
							<Container maxWidth="md">
								{apiState === EStatus.Complete && <Outlet context={[mainInfo]} />}
								{apiState === EStatus.Error && <PrincipalAPIError message={apiError} />}
								{apiState === EStatus.Loading && <Loading />}
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
