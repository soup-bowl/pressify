import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import agent from "../agent";
import { CardDisplay } from "../components/cards";
import { IPost, ISiteInformation } from "../interfaces";

interface Props {
	posts?: boolean;
	pages?: boolean;
}

function descriptionSanitiser(input:string) {
	return input.replace(/<[^>]*>?/gm, '') // Remove HTML tags.
		.replaceAll('&#8220;', '"')
		.replaceAll('&#8221;', '"')
		.replaceAll('&#8216;', '\'')
		.replaceAll('&#8217;', '\'')
		.replaceAll('&hellip;', '...');
}

export default function Directory({posts, pages}: Props) {
	const [mainInfo] = useOutletContext<[ISiteInformation]>();
	const { inputURL } = useParams();
	const [loadingContent, setLoadingContent] = useState<boolean>(true);
	const [postCollection, setPostCollection] = useState<IPost[]>([]);
	const [apiError, setApiError] = useState<string>('');

	useEffect(() => {
		setLoadingContent(true);
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
