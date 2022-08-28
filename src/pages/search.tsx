import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CardDisplay } from "../components/cards";
import { GeneralAPIError } from "../components/error";
import { IPost, ISearch, IWPIndexing } from "../interfaces";
import { WordPressContext } from "./_layout";

export default function Search() {
	const { inputURL, seachTerms, pageID } = useParams();
	const [loadingContent, setLoadingContent] = useState<boolean>(true);
	const [searchResults, setSearchResults] = useState<IPost[]>([]);
	const [paging, setPaging] = useState<IWPIndexing>({} as IWPIndexing);
	const [pagingURL, setPagingURL] = useState<string>('');
	const [apiError, setApiError] = useState<string>('');
	const wp = useContext(WordPressContext);

	useEffect(() => {
		setLoadingContent(true);
		wp.search().search(seachTerms ?? '').page(parseInt(pageID ?? '1')).embed().get()
		.then((response:any) => {
			setPaging(response._paging);
			delete response['_paging'];
			//console.log('Search Result', response);
			let collection:IPost[] = [];
			response.forEach((e:ISearch) => {
				collection.push(e._embedded.self[0]);
			});
			setPagingURL(`/${inputURL}/search/${seachTerms}`);
			setSearchResults(collection);
			setLoadingContent(false);
		})
		.catch((err:any) => {
			setApiError(`[${err.code}] ${err.message}`);
			setLoadingContent(false);
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inputURL, seachTerms, pageID]);

	useEffect(() => { document.title = `Search: ${seachTerms} - Wapp` }, [seachTerms]);

	if (apiError !== '') {
		return( <GeneralAPIError endpoint="Search" message={apiError} /> );
	}

	return(
		<Box>
			<Typography variant="h1">Search Results: {seachTerms}</Typography>
			{!loadingContent ?
				<CardDisplay posts={searchResults} page={parseInt(pageID ?? '1')} pagination={paging} returnURI={pagingURL} />
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
