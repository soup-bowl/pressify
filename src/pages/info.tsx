import { Box, Button, Link, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { IStorage } from "../interfaces";

import GitHubIcon from '@mui/icons-material/GitHub';
import CachedIcon from '@mui/icons-material/Cached';

// https://stackoverflow.com/a/35696506
function formatBytes(bytes: number, decimals: number = 2) {
	if (bytes === 0) return '0 Bytes';

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function AboutPage() {
	const siteTitle = "About";

	const [storageInfo, setStorageInfo] = useState<IStorage>({} as IStorage);

	useEffect(() => { document.title = `${siteTitle} - Wapp` });

	useEffect(() => {
		if ('storage' in navigator && 'estimate' in navigator.storage) {
			navigator.storage.estimate().then(({usage, quota}) => {
				setStorageInfo({ usage: usage ?? 0, quota: quota ?? 0 });
			});
		}
	}, []);

	return(
		<Box textAlign="center">
			<Typography variant="h1" my={2}>WordPress App Generator</Typography>
			<Typography my={2}>
				Developed by <Link style={{fontWeight: 'bold'}} href="https://soupbowl.io">soup-bowl</Link> and hosted
				on <Link style={{fontWeight: 'bold'}} href="https://pages.github.com/">GitHub Pages</Link>.
			</Typography>
			<Stack my={2}>
				<Typography>App Version: <Box component="span" fontWeight='700'>{process.env.REACT_APP_VERSION}</Box></Typography>

				{ storageInfo.quota !== undefined && storageInfo.quota !== 0 ?
					<Typography>
						Using <Box component="span" fontWeight='700'>{formatBytes(storageInfo.usage)}</Box> of&nbsp;
						<Box component="span" fontWeight='700'>{formatBytes(storageInfo.quota)}</Box> available local storage.
					</Typography>
				:
					<Typography color="darkgrey">Storage API is not supported.</Typography>
				}
			</Stack>
			<Stack my={2} spacing={2} direction="row" justifyContent="center">
				<Button onClick={() => (window.location.reload())} variant="outlined" color="error"><CachedIcon />&nbsp;Reload</Button>
				<Button href="https://github.com/soup-bowl/whatsth.is" variant="outlined"><GitHubIcon />&nbsp;Source Code</Button>
			</Stack>
		</Box>
	);
}