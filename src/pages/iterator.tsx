import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import WPAPI from "wpapi";
import { CardDisplay } from "../components/cards";
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
				setApiError(`${err}`);
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
				setApiError(`${err}`);
				setLoadingContent(false);
			});
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [posts, pages]);

	useEffect(() => {
		document.title = `${mainInfo.name ?? 'Error'} ${posts ? 'Posts' : 'Pages'} - Wapp`;
	}, [mainInfo, posts]);

	return(
		<Box>
			<Typography variant="h1">{posts ? 'Posts' : 'Pages'}</Typography>
			{!loadingContent ?
				<>
				{apiError === '' ?
					<CardDisplay posts={postCollection} />
				:
					<>
						<Typography my={2}>
							We were unable to access the requested content. The website owner may have blocked access
							to the {posts ? 'Posts' : 'Pages'} endpoint, or required authentication to access
							the {posts ? 'Posts' : 'Pages'} API.
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
