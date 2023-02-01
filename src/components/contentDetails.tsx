import { Avatar, Link, Typography } from "@mui/material";

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import ShareIcon from '@mui/icons-material/Share';


interface CreatedDateProps {
	date: Date;
}

export function CreatedDate({ date }: CreatedDateProps) {
	return (
		<Typography>
			<AccessTimeIcon fontSize="inherit" />&nbsp;{date.toLocaleDateString()}
		</Typography>
	);
}

interface AuthorProps {
	avatar?: string;
	name?: string;
}

export function Author({ avatar, name }: AuthorProps) {
	return (
		<Typography>
			{avatar !== undefined ?
				<Avatar
					alt={name ?? ''}
					src={avatar}
					sx={{ width: 18, height: 18, display: 'inline-block' }}
				/>
				:
				<AccountCircleIcon fontSize="inherit" />
			}&nbsp;By {name ?? ''}
		</Typography>
	);
}

interface OriginalContentProps {
	url: string;
}

export function OriginalContentLink({ url }: OriginalContentProps) {
	return (
		<Typography>
			<OpenInBrowserIcon fontSize="inherit" />&nbsp;
			<Link color="inherit" href={url} target="_blank">Open Original</Link>
		</Typography>
	);
}

interface NativeShareProps {
	title: string;
	url: string;
}

export function NativeShare({ title, url }: NativeShareProps) {
	return (
		<Typography>
			<ShareIcon fontSize="inherit" />&nbsp;
			<Link color="inherit" onClick={() => navigator.share({
				title: title,
				url: url
			})} sx={{ cursor: 'pointer' }}>Share</Link>
		</Typography>
	);
}
