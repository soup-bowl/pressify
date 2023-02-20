import { Avatar, Link, Stack, styled, Typography } from "@mui/material";

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import ShareIcon from '@mui/icons-material/Share';

const StyledStack = styled(Stack)(({ theme }) => ({
	[theme.breakpoints.down('sm')]: {
		flexDirection: 'column',
	},
	flexDirection: 'row',
	justifyContent: 'center',
	alignItems: 'center',
	margin: '0 !important',
	p: {
		margin: '0 0 0 5px !important'
	}
}));

interface CreatedDateProps {
	date: Date;
}

export function CreatedDate({ date }: CreatedDateProps) {
	return (
		<StyledStack>
			<AccessTimeIcon fontSize="inherit" />
			<Typography>{date.toLocaleDateString()}</Typography>
		</StyledStack>
	);
}

interface AuthorProps {
	avatar?: string;
	name?: string;
}

export function Author({ avatar, name }: AuthorProps) {
	return (
		<StyledStack>
			{avatar !== undefined ?
				<Avatar
					alt={name ?? ''}
					src={avatar}
					sx={{ width: 18, height: 18, display: 'inline-block' }}
				/>
				:
				<AccountCircleIcon fontSize="inherit" />
			}
			<Typography>By {name ?? ''}</Typography>
		</StyledStack>
	);
}

interface OriginalContentProps {
	url: string;
}

export function OriginalContentLink({ url }: OriginalContentProps) {
	return (
		<StyledStack>
			<OpenInBrowserIcon fontSize="inherit" />
			<Typography>
				<Link color="inherit" href={url} target="_blank">Open Original</Link>
			</Typography>
		</StyledStack>
	);
}

interface NativeShareProps {
	title: string;
	url: string;
}

export function NativeShare({ title, url }: NativeShareProps) {
	return (
		<StyledStack>
			<ShareIcon fontSize="inherit" />
			<Typography>
				<Link color="inherit" onClick={() => navigator.share({
					title: title,
					url: url
				})} sx={{ cursor: 'pointer' }}>Share</Link>
			</Typography>
		</StyledStack>
	);
}
