import { Outlet, useNavigate } from "react-router-dom";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { CssBaseline, ThemeProvider, Toolbar, IconButton, Typography,
	Container, styled, Drawer, Divider, Box, List, ListItemIcon,
	ListItemText, useMediaQuery, ListItemButton} from '@mui/material';
import { useEffect, useState } from "react";
import theme from '../theme';
import agent from "../agent";
import { ISiteInformation } from "../interfaces";

import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PushPinIcon from '@mui/icons-material/PushPin';
import DescriptionIcon from '@mui/icons-material/Description';

const drawerWidth = 240;

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

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
	justifyContent: 'flex-end',
}));

export default function Layout() {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const desktop = useMediaQuery("(min-width: 961px)");
	const [mainInfo, setMainInfo] = useState<ISiteInformation>({} as ISiteInformation);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	useEffect(() => {
        agent.Info.full('https://labour.org.uk')
        .then((response:any) => {
			console.log('Info Reply', response);
			setMainInfo({
				name: response.name ?? 'N/A',
				url: response.url,
				hasPages: false,
				hasPosts: false
			});
        });
    }, []);

	useEffect(() => { document.title = `${mainInfo.name} - Wapp` }, [mainInfo]);

	return(
		<ThemeProvider theme={theme}>
			<Box sx={{ display: 'flex' }}>
				<CssBaseline />
				<AppBar
					position="fixed"
					open={open}
					sx={{zIndex: (theme) => ( desktop ? theme.zIndex.drawer + 1 : 0)}}>
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
						<Typography variant="h6" noWrap component="div">{mainInfo.name}</Typography>
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
							onClick={() => {navigate('/');handleDrawerClose();}}
							selected={window.location.hash.includes("/")}
						>
							<ListItemIcon><HomeIcon /></ListItemIcon>
							<ListItemText primary="Home" />
						</ListItemButton>
						<ListItemButton
							onClick={() => {navigate('/');handleDrawerClose();}}
							selected={window.location.hash.includes("/")}
						>
							<ListItemIcon><PushPinIcon /></ListItemIcon>
							<ListItemText primary="Posts" />
						</ListItemButton>
						<ListItemButton
							onClick={() => {navigate('/');handleDrawerClose();}}
							selected={window.location.hash.includes("/")}
						>
							<ListItemIcon><DescriptionIcon /></ListItemIcon>
							<ListItemText primary="Pages" />
						</ListItemButton>
					</List>
				</Drawer>
				<Main open={open}>
					<Container maxWidth="md">
						<Outlet context={[mainInfo]}  />
					</Container>
				</Main>
			</Box>
		</ThemeProvider>
	);
}
