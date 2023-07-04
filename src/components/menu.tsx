import { Divider, List, ListItemButton, ListItemIcon, ListItemText, Theme } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { SiteSelectorDialog } from ".";

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HomeIcon from '@mui/icons-material/Home';
import PushPinIcon from '@mui/icons-material/PushPin';
import DescriptionIcon from '@mui/icons-material/Description';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

interface Props {
	onClose: () => void;
	theme: Theme;
	colorMode: { toggleColorMode: () => void };
}

const MenuItems = ({ onClose, theme, colorMode }: Props) => {
	const navigate = useNavigate();
	const { inputURL } = useParams();

	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		setOpen(false);
		onClose();
	}

	const nav = (site: string) => {
		navigate(site);
		onClose();
	}

	return (
		<>
			<SiteSelectorDialog open={open} onClose={handleClose} />
			<List>
				<ListItemButton
					onClick={() => nav(`/${inputURL}`)}
					selected={(window.location.hash.replace(`/${inputURL}`, '') === "#")}
				>
					<ListItemIcon><HomeIcon /></ListItemIcon>
					<ListItemText primary="Home" />
				</ListItemButton>
			</List>
			<Divider />
			<List>
				<ListItemButton
					onClick={() => nav(`/${inputURL}/posts`)}
					selected={window.location.hash.includes("/post")}
				>
					<ListItemIcon><PushPinIcon /></ListItemIcon>
					<ListItemText primary="Posts" />
				</ListItemButton>
				<ListItemButton
					onClick={() => nav(`/${inputURL}/pages`)}
					selected={window.location.hash.includes("/page")}
				>
					<ListItemIcon><DescriptionIcon /></ListItemIcon>
					<ListItemText primary="Pages" />
				</ListItemButton>
			</List>
			<Divider />
			<List>
				<ListItemButton onClick={handleOpen}>
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
					onClick={() => nav(`/${inputURL}/about`)}
					selected={window.location.hash.includes("/about")}
				>
					<ListItemIcon><CoPresentIcon /></ListItemIcon>
					<ListItemText primary="About" />
				</ListItemButton>
			</List>
		</>
	);
}

export default MenuItems;