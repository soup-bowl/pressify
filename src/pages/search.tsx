import { Box, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CardDisplay, CardLoad, GeneralAPIError } from "../components";
import { IPost, ISearch, ISearchCollection, IWPAPIError, IWPIndexing } from "../interfaces";
import { WordPressContext } from "./_layout";

const displayedLimit: number = 12;

const Search = () => {
	const { inputURL, seachTerms, pageID } = useParams();
	const [loadingContent, setLoadingContent] = useState<boolean>(true);
	const [searchResults, setSearchResults] = useState<IPost[]>([]);
	const [paging, setPaging] = useState<IWPIndexing>({} as IWPIndexing);
	const [pagingURL, setPagingURL] = useState<string>('');
	const [apiError, setApiError] = useState<string>('');
	const wp = useContext(WordPressContext);

	useEffect(() => {
		setLoadingContent(true);
		wp.searchPosts(seachTerms ?? '', parseInt(pageID ?? '1'), displayedLimit)
			.then((response: ISearchCollection) => {
				setPaging(response.pagination);
				const collection: IPost[] = [];
				response.results.forEach((e: ISearch) => collection.push(e._embedded.self[0]));
				setPagingURL(`/${inputURL}/search/${seachTerms}`);
				setSearchResults(collection);
				setLoadingContent(false);
			})
			.catch((err: IWPAPIError) => {
				setApiError(`[${err.code}] ${err.message}`);
				setLoadingContent(false);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inputURL, seachTerms, pageID]);

	useEffect(() => { document.title = `Search: ${seachTerms} - Pressify` }, [seachTerms]);

	if (apiError !== '') {
		return (<GeneralAPIError endpoint="Search" message={apiError} />);
	}

	return (
		<Box>
			<Typography variant="h1">Search Results: {seachTerms}</Typography>
			{!loadingContent ?
				<CardDisplay listView posts={searchResults} page={parseInt(pageID ?? '1')} pagination={paging} returnURI={pagingURL} />
				:
				<CardLoad listView amount={displayedLimit} />
			}
		</Box>
	);
}

export default Search;