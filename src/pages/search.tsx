import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CardDisplay } from "../components/cards";
import { GeneralAPIError } from "../components/error";
import { IPost, ISearch } from "../interfaces";
import { WordPressContext } from "./_layout";

export default function Search() {
	const { inputURL, seachTerms } = useParams();
	const [loadingContent, setLoadingContent] = useState<boolean>(true);
	const [searchResults, setSearchResults] = useState<IPost[]>([]);
	const [apiError, setApiError] = useState<string>('');
	const wp = useContext(WordPressContext);

	useEffect(() => {
		setLoadingContent(true);
		wp.search().search(seachTerms ?? '').embed().get()
		.then((response:any) => {
			delete response['_paging'];
			//console.log('Search Result', response);
			let collection:IPost[] = [];
			response.forEach((e:ISearch) => {
				collection.push(e._embedded.self[0]);
			});
			setSearchResults(collection);
			setLoadingContent(false);
		})
		.catch((err:any) => {
			setApiError(`[${err.code}] ${err.message}`);
			setLoadingContent(false);
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inputURL, seachTerms]);

	useEffect(() => { document.title = `Search: ${seachTerms} - Wapp` }, [seachTerms]);

	if (apiError !== '') {
		return( <GeneralAPIError endpoint="Search" message={apiError} /> );
	}

	return(
		<Box>
			<Typography variant="h1">Search Results: {seachTerms}</Typography>
			{!loadingContent ?
				<CardDisplay posts={searchResults} />
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
