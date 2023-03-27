import { Avatar, Link, Stack, styled, Theme, Typography, useMediaQuery } from "@mui/material";

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import ShareIcon from '@mui/icons-material/Share';

const switchLimit = 'sm';

const StyledStack = styled(Stack)(({ theme }) => ({
	[theme.breakpoints.down(switchLimit)]: {
		flexDirection: 'column',
	},
	flexDirection: 'row',
	justifyContent: 'flex-start',
	alignItems: 'center',
	margin: '0 !important',
	p: {
		margin: '0 0 0 5px !important',
		textAlign: 'center'
	}
}));

interface CreatedDateProps {
	date: Date;
}

export const CreatedDate = ({ date }: CreatedDateProps) => {
	const isSmallScreen: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.down(switchLimit));

	return (
		<StyledStack>
			<AccessTimeIcon fontSize={(isSmallScreen ? 'large' : 'inherit')} />
			<Typography>{date.toLocaleDateString()}</Typography>
		</StyledStack>
	);
}

interface AuthorProps {
	avatar?: string;
	name?: string;
}

export const Author = ({ avatar, name }: AuthorProps) => {
	const isSmallScreen: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.down(switchLimit));

	return (
		<StyledStack>
			{avatar !== undefined ?
				<Avatar
					alt={name ?? ''}
					src={avatar}
					sx={{
						width: isSmallScreen ? 34 : 18,
						height: isSmallScreen ? 34 : 18,
						display: 'inline-block'
					}}
				/>
				:
				<AccountCircleIcon fontSize={(isSmallScreen ? 'large' : 'inherit')} />
			}
			<Typography>By {name ?? ''}</Typography>
		</StyledStack>
	);
}

interface OriginalContentProps {
	url: string;
}

export const OriginalContentLink = ({ url }: OriginalContentProps) => {
	const isSmallScreen: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.down(switchLimit));

	return (
		<StyledStack>
			<OpenInBrowserIcon fontSize={(isSmallScreen ? 'large' : 'inherit')} />
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

export const NativeShare = ({ title, url }: NativeShareProps) => {
	const isSmallScreen: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.down(switchLimit));

	return (
		<StyledStack>
			<ShareIcon fontSize={(isSmallScreen ? 'large' : 'inherit')} />
			<Typography>
				<Link color="inherit" onClick={() => navigator.share({
					title: title,
					url: url
				})} sx={{ cursor: 'pointer' }}>Share</Link>
			</Typography>
		</StyledStack>
	);
}
