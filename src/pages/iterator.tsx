import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { CardDisplay } from "../components/cards";
import { GeneralAPIError } from "../components/error";
import { IPost, ISiteInfo, ITag } from "../interfaces";
import { WordPressContext } from "./_layout";

interface PostProps {
	posts?: boolean;
	pages?: boolean;
	categories?: boolean;
	tax?: boolean;
}

export function PostListings({posts = false, pages = false, categories = false, tax = false}: PostProps) {
	const [mainInfo] = useOutletContext<[ISiteInfo]>();
	const { searchID } = useParams();
	const [loadingContent, setLoadingContent] = useState<boolean>(true);
	const [iterDef, setIterDef] = useState<string>();
	const [postCollection, setPostCollection] = useState<IPost[]>([]);
	const [apiError, setApiError] = useState<string>('');
	const wp = useContext(WordPressContext);

	const CommonInterface = {
		posts: () => wp.posts().embed().get(),
		postsByCategory: (cat:number) => wp.posts().categories(cat).embed().get(),
		postsByTag: (cat:number) => wp.posts().tags(cat).embed().get(),
		pages: () => wp.pages().embed().get(),
		pagesByCategory: (cat:number) => wp.pages().categories(cat).embed().get(),
		pagesByTag: (cat:number) => wp.pages().tags(cat).embed().get(),
	}

	const saveResponse = (posts:any) => {
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
				CommonInterface.postsByCategory(parseInt(searchID ?? '0'))
					.then((posts:any) => saveResponse(posts))
					.catch((err:any) => errResponse(err));
			} else if (tax) {
				CommonInterface.postsByTag(parseInt(searchID ?? '0'))
					.then((posts:any) => saveResponse(posts))
					.catch((err:any) => errResponse(err));
			} else {
				CommonInterface.posts()
					.then((posts:any) => saveResponse(posts))
					.catch((err:any) => errResponse(err));
			}
		}

		if (pages) {
			setIterDef('Pages');
			if (categories) {
				CommonInterface.pagesByCategory(parseInt(searchID ?? '0'))
					.then((posts:any) => saveResponse(posts))
					.catch((err:any) => errResponse(err));
			} else if (tax) {
				CommonInterface.pagesByTag(parseInt(searchID ?? '0'))
					.then((posts:any) => saveResponse(posts))
					.catch((err:any) => errResponse(err));
			} else {
				CommonInterface.pages()
					.then((posts:any) => saveResponse(posts))
					.catch((err:any) => errResponse(err));
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchID, categories, tax, posts, pages]);

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
				<CardDisplay posts={postCollection} />
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
