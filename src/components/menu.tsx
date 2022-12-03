import { Divider, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HomeIcon from '@mui/icons-material/Home';
import PushPinIcon from '@mui/icons-material/PushPin';
import DescriptionIcon from '@mui/icons-material/Description';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { useState } from "react";
import { SiteSelectorDialog } from "./siteSelector";

interface Props {
	onClose: any;
	theme: any;
	colorMode: any;
}

export default function MenuItems({onClose, theme, colorMode}:Props) {
	const navigate = useNavigate();
	const { inputURL } = useParams();

	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return(
		<>
		<SiteSelectorDialog open={open} onClose={handleClose}/>
		<List>
			<ListItemButton
				onClick={() => {navigate(`/${inputURL}`);onClose();}}
				selected={(window.location.hash.replace(`/${inputURL}`, '') === "#")}
			>
				<ListItemIcon><HomeIcon /></ListItemIcon>
				<ListItemText primary="Home" />
			</ListItemButton>
		</List>
		<Divider />
		<List>
			<ListItemButton
				onClick={() => {navigate(`/${inputURL}/posts`);onClose();}}
				selected={window.location.hash.includes("/posts")}
			>
				<ListItemIcon><PushPinIcon /></ListItemIcon>
				<ListItemText primary="Posts" />
			</ListItemButton>
			<ListItemButton
				onClick={() => {navigate(`/${inputURL}/pages`);onClose();}}
				selected={window.location.hash.includes("/pages")}
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
				onClick={() => {navigate(`/${inputURL}/about`);onClose();}}
				selected={window.location.hash.includes("/about")}
			>
				<ListItemIcon><CoPresentIcon /></ListItemIcon>
				<ListItemText primary="About" />
			</ListItemButton>
		</List>
		</>
	);
}
