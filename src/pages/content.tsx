import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import WPAPI from "wpapi";
import { degubbins } from "../components/cards";
import { GeneralAPIError } from "../components/error";
import { IPost } from "../interfaces";
import "./content.css";

interface Props {
	posts?: boolean;
	pages?: boolean;
}

export default function Content({posts, pages}: Props) {
	const { inputURL, postID } = useParams();
	const [loadingContent, setLoadingContent] = useState<boolean>(true);
	const [post, setPost] = useState<IPost>({} as IPost);
	const [apiError, setApiError] = useState<string>('');
	const wp = new WPAPI({ endpoint: `https://${inputURL}/wp-json` });

	useEffect(() => {
		setLoadingContent(true);

		if (posts && postID !== undefined) {
			wp.posts().id(parseInt(postID)).get()
			.then(post => {
				//console.log(post as IPost);
				setPost(post as IPost);
				setLoadingContent(false);
			})
			.catch((err) => {
				setApiError(`${err}`);
				setLoadingContent(false);
			});
		}

		if (pages && postID !== undefined) {
			wp.pages().id(parseInt(postID)).get()
			.then(page => {
				//console.log(page as IPost);
				setPost(page as IPost);
				setLoadingContent(false);
			})
			.catch((err) => {
				setApiError(`${err}`);
				setLoadingContent(false);
			});
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [postID, posts, pages]);

	useEffect(() => {
		if (post !== undefined && post.title !== undefined) {
			document.title = `${post.title.rendered ?? 'Error'} - Wapp`;
		}
	}, [post]);

	if (apiError !== '') {
		return( <GeneralAPIError endpoint={posts ? 'Posts' : 'Pages'} message={apiError} /> );
	}

	return(
		<Box>
			{!loadingContent ?
				<Box>
					<Typography variant="h1">
						{degubbins(post.title.rendered)}
					</Typography>
					<div dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(post.content.rendered)}}></div>
				</Box>
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