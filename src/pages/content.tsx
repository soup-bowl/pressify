import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import agent from "../agent";
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

	useEffect(() => {
		if (postID !== undefined) {
			agent.Posts.individual(`https://${inputURL}`, parseInt(postID), (pages) ? true : false)
			.then((response:IPost) => {
				console.log((pages) ? 'Page' : 'Post', response);
				setPost(response);
				setLoadingContent(false);
			})
			.catch((err:AxiosError) => {
				setApiError(`[${err.code}] ${err.message}`);
				setLoadingContent(false);
			});
		}
    }, [inputURL, postID, posts, pages]);

	useEffect(() => {
		if (post !== undefined && post.title !== undefined) {
			document.title = `${post.title.rendered ?? 'Error'} - Wapp`;
		}
	}, [post]);

	return(
		<Box>
			{!loadingContent ?
			<>
			{apiError === '' ?
				<Box>
					<Typography variant="h1">
						<div dangerouslySetInnerHTML={{__html:post.title.rendered}}></div>
					</Typography>
					<div dangerouslySetInnerHTML={{__html:post.content.rendered}}></div>
				</Box>
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