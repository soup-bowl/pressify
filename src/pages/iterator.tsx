import { Box, Card, CardActionArea, CardContent, CardMedia, CircularProgress, Grid, Typography } from "@mui/material";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import agent from "../agent";
import { IPost, ISiteInformation } from "../interfaces";

interface Props {
	posts?: boolean;
	pages?: boolean;
}

export default function Directory({posts, pages}: Props) {
	const [mainInfo] = useOutletContext<[ISiteInformation]>();
	const { inputURL } = useParams();
	const [loadingContent, setLoadingContent] = useState<boolean>(true);
	const [postCollection, setPostCollection] = useState<IPost[]>([]);
	const [apiError, setApiError] = useState<string>('');

	useEffect(() => {
		agent.Posts.list(`https://${inputURL}`, (pages) ? true : false)
        .then((response:IPost[]) => {
			//console.log((pages) ? 'Pages' : 'Posts', response);
			setPostCollection(response);
			setLoadingContent(false);
        })
		.catch((err:AxiosError) => {
			setApiError(`[${err.code}] ${err.message}`);
			setLoadingContent(false);
		});
    }, [inputURL, posts, pages]);

	useEffect(() => {
		document.title = `${mainInfo.name ?? 'Error'} ${posts ? 'Posts' : 'Pages'} - Wapp`;
	}, [mainInfo, posts]);

	return(
		<Box>
			<Typography variant="h1">{posts ? 'Posts' : 'Pages'}</Typography>
			{!loadingContent ?
				<>
				{apiError === '' ?
					<Grid container spacing={2} my={2}>
						{postCollection.map((post:IPost) => (
							<Grid key={post.id} item xs={12} sm={6} md={4}>
								<Card sx={{ maxWidth: 345 }}>
									<CardActionArea href={window.location.hash + '/' + post.id}>
										<CardMedia
											component="img"
											height="140"
											image="https://source.unsplash.com/featured/?face,person"
										/>
										<CardContent>
											<Typography gutterBottom variant="h5" component="div">
												{post.title.rendered}
											</Typography>
											<Typography variant="body2" color="text.secondary">
												{post.excerpt.rendered}
											</Typography>
										</CardContent>
									</CardActionArea>
								</Card>
							</Grid>
						))}
					</Grid>
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
