import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import WPAPI from "wpapi";
import { CardDisplay } from "../components/cards";
import { GeneralAPIError } from "../components/error";
import { IPost, ISiteInfo } from "../interfaces";

interface Props {
	posts?: boolean;
	pages?: boolean;
}

export default function Directory({posts, pages}: Props) {
	const [mainInfo] = useOutletContext<[ISiteInfo]>();
	const { inputURL } = useParams();
	const [loadingContent, setLoadingContent] = useState<boolean>(true);
	const [postCollection, setPostCollection] = useState<IPost[]>([]);
	const [apiError, setApiError] = useState<string>('');
	const wp = new WPAPI({ endpoint: `https://${inputURL}/wp-json` });

	useEffect(() => {
		setLoadingContent(true);

		if (posts) {
			wp.posts().embed().get()
			.then(posts => {
				delete posts['_paging'];
				//console.log(posts as IPost[], paging);
				setPostCollection(posts);
				setLoadingContent(false);
			})
			.catch((err) => {
				setApiError(`[${err.code}] ${err.message}`);
				setLoadingContent(false);
			});
		}

		if (pages) {
			wp.pages().embed().get()
			.then(pages => {
				delete pages['_paging'];
				//console.log(pages as IPost[], paging);
				setPostCollection(pages);
				setLoadingContent(false);
			})
			.catch((err) => {
				setApiError(`[${err.code}] ${err.message}`);
				setLoadingContent(false);
			});
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [posts, pages]);

	useEffect(() => {
		document.title = `${mainInfo.name ?? 'Error'} ${posts ? 'Posts' : 'Pages'} - Wapp`;
	}, [mainInfo, posts]);

	if (apiError !== '') {
		return( <GeneralAPIError endpoint={posts ? 'Posts' : 'Pages'} message={apiError} /> );
	}

	return(
		<Box>
			<Typography variant="h1">{posts ? 'Posts' : 'Pages'}</Typography>
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
