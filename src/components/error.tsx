import { Box, Typography } from "@mui/material";

interface Props {
	endpoint?: string;
	message?: string;
	noheader?: boolean;
}

interface PrinciProps {
	message?: string;
}

export const GeneralAPIError = ({ endpoint = 'Unspecified', message = '', noheader = false }: Props) => {
	return (
		<Box>
			{noheader ? null : <Typography variant="h1">Error Talking to the {endpoint} API</Typography>}
			<Typography my={2}>
				We were unable to access the requested content. The website owner may have blocked access to the
				{endpoint} endpoint, or required authentication to access the {endpoint} API.
			</Typography>
			<Typography my={2} sx={{ fontFamily: 'monospace' }}>{message}</Typography>
		</Box>
	);
}

export const PrincipalAPIError = ({ message = '' }: PrinciProps) => {
	return (
		<Box>
			<Typography variant="h1">Unable to Display Website</Typography>
			<Typography my={2}>
				We've made a request to the website's JSON API (if it exists), and have not had the expected response
				returned.
			</Typography>
			<Typography my={2}>
				This can be due to the following reasons:
			</Typography>
			<ul>
				<li>The website you requested is not a WordPress site.</li>
				<li>The website has blocked or disabled their REST API endpoint(s).</li>
				<li>The API is behind a strict CORS policy disabling us from seeing it.</li>
			</ul>
			<Typography variant="h5" component="h2">Technical Details</Typography>
			<Typography my={2} sx={{ fontFamily: 'monospace' }}>{message}</Typography>
		</Box>
	);
}
