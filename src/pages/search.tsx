import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { WPMain } from "../agent";
import { CardDisplay } from "../components/cards";
import { IPost, ISearch } from "../interfaces";

export default function Search() {
	const { inputURL, seachTerms } = useParams();
	const [loadingContent, setLoadingContent] = useState<boolean>(true);
	const [searchResults, setSearchResults] = useState<IPost[]>([]);
	const [apiError, setApiError] = useState<string>('');

	useEffect(() => {
		setLoadingContent(true);
		WPMain.search(`https://${inputURL}`, seachTerms ?? '')
        .then((response:ISearch[]) => {
			//console.log('Search Result', response);
			let collection:IPost[] = [];
			response.forEach(e => {
				collection.push(e._embedded.self[0]);
			});
			setSearchResults(collection);
			setLoadingContent(false);
        })
		.catch((err:AxiosError) => {
			setApiError(`[${err.code}] ${err.message}`);
			setLoadingContent(false);
		});
    }, [inputURL, seachTerms]);

	useEffect(() => { document.title = `Search: ${seachTerms} - Wapp` }, [seachTerms]);

	return(
		<Box>
			<Typography variant="h1">Search Results: {seachTerms}</Typography>
			{!loadingContent ?
				<>
				{apiError === '' ?
					<CardDisplay posts={searchResults} />
				:
					<>
						<Typography my={2}>
							We were unable to access the requested content. The website owner may have blocked access
							to the search endpoint, or required authentication to access the search API.
						</Typography>
						<Typography my={2} sx={{fontFamily: 'monospace'}}>{apiError}</Typography>
					</>
				}
				</>
			:
			<Grid container spacing={0} my={2} direction="column" alignItems="center">
				<Grid item xs={3}>
					<CircularProgress />
				</Grid>
				<Grid item xs={3}>
					<Typography>Loading content</Typography>
				</Grid>
			</Grid>
			}
		</Box>
	);
}
