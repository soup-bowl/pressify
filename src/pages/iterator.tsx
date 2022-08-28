import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { CardDisplay } from "../components/cards";
import { GeneralAPIError } from "../components/error";
import { IPost, ISiteInfo, ITag, IWPIndexing } from "../interfaces";
import { WordPressContext } from "./_layout";

interface PostProps {
	posts?: boolean;
	pages?: boolean;
	categories?: boolean;
	tax?: boolean;
}

export function PostListings({posts = false, pages = false, categories = false, tax = false}: PostProps) {
	const [mainInfo] = useOutletContext<[ISiteInfo]>();
	const { inputURL, searchID, pageID } = useParams();
	const [loadingContent, setLoadingContent] = useState<boolean>(true);
	const [iterDef, setIterDef] = useState<string>();
	const [postCollection, setPostCollection] = useState<IPost[]>([]);
	const [paging, setPaging] = useState<IWPIndexing>({} as IWPIndexing);
	const [pagingURL, setPagingURL] = useState<string>('');
	const [apiError, setApiError] = useState<string>('');
	const wp = useContext(WordPressContext);

	const CommonInterface = {
		posts: () => wp.posts().page(parseInt(pageID ?? '1')).embed().get(),
		postsByCategory: (cat:number) => wp.posts().categories(cat).page(parseInt(pageID ?? '1')).embed().get(),
		postsByTag: (cat:number) => wp.posts().tags(cat).page(parseInt(pageID ?? '1')).embed().get(),
		pages: () => wp.pages().page(parseInt(pageID ?? '1')).embed().get(),
		pagesByCategory: (cat:number) => wp.pages().categories(cat).page(parseInt(pageID ?? '1')).embed().get(),
		pagesByTag: (cat:number) => wp.pages().tags(cat).page(parseInt(pageID ?? '1')).embed().get(),
	}

	const saveResponse = (posts:any) => {
		setPaging(posts._paging);
		delete posts['_paging'];
		//console.log(posts as IPost[], paging);
		setPostCollection(posts);
		setLoadingContent(false);
	}

	const errResponse = (err:any) => {
		setApiError(`[${err.code}] ${err.message}`);
		setLoadingContent(false);
	}

	useEffect(() => {
		setLoadingContent(true);

		if (posts) {
			setIterDef('Posts');
			if (categories) {
				setPagingURL(`/${inputURL}/posts/category/${searchID}`);
				CommonInterface.postsByCategory(parseInt(searchID ?? '0'))
					.then((posts:any) => saveResponse(posts))
					.catch((err:any) => errResponse(err));
			} else if (tax) {
				setPagingURL(`/${inputURL}/posts/tag/${searchID}`);
				CommonInterface.postsByTag(parseInt(searchID ?? '0'))
					.then((posts:any) => saveResponse(posts))
					.catch((err:any) => errResponse(err));
			} else {
				setPagingURL(`/${inputURL}/posts`);
				CommonInterface.posts()
					.then((posts:any) => saveResponse(posts))
					.catch((err:any) => errResponse(err));
			}
		}

		if (pages) {
			setIterDef('Pages');
			if (categories) {
				setPagingURL(`/${inputURL}/pages/category/${searchID}`);
				CommonInterface.pagesByCategory(parseInt(searchID ?? '0'))
					.then((posts:any) => saveResponse(posts))
					.catch((err:any) => errResponse(err));
			} else if (tax) {
				setPagingURL(`/${inputURL}/pages/tag/${searchID}`);
				CommonInterface.pagesByTag(parseInt(searchID ?? '0'))
					.then((posts:any) => saveResponse(posts))
					.catch((err:any) => errResponse(err));
			} else {
				setPagingURL(`/${inputURL}/pages`);
				CommonInterface.pages()
					.then((posts:any) => saveResponse(posts))
					.catch((err:any) => errResponse(err));
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchID, pageID, categories, tax, posts, pages]);

	useEffect(() => {
		if (categories && searchID !== undefined) {
			wp.categories().id(parseInt(searchID)).get()
			.then((catdef:ITag) => (setIterDef(catdef.name ?? iterDef)));
		}

		if (tax && searchID !== undefined) {
			wp.tags().id(parseInt(searchID)).get()
			.then((catdef:ITag) => (setIterDef(catdef.name ?? iterDef)));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchID, iterDef, postCollection, categories, tax]);

	useEffect(() => {
		document.title = `${mainInfo.name ?? 'Error'} ${posts ? 'Posts' : 'Pages'} - Wapp`;
	}, [mainInfo, posts]);

	if (apiError !== '') {
		return( <GeneralAPIError endpoint={posts ? 'Posts' : 'Pages'} message={apiError} /> );
	}

	return(
		<Box>
			<Typography variant="h1">{iterDef}</Typography>
			{!loadingContent ?
				<CardDisplay posts={postCollection} page={parseInt(pageID ?? '1')} pagination={paging} returnURI={pagingURL} />
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
