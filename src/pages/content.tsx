import { Avatar, Box, Chip, CircularProgress, Grid, Link, Stack, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { degubbins } from "../components/cards";
import { GeneralAPIError } from "../components/error";
import { IPost, ITag } from "../interfaces";
import "./content.css";
import { WordPressContext } from "./_layout";

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import ShareIcon from '@mui/icons-material/Share';

interface Props {
	posts?: boolean;
	pages?: boolean;
}

export default function Content({posts, pages}: Props) {
	const navigate = useNavigate();
	const { inputURL, postID } = useParams();
	const [loadingContent, setLoadingContent] = useState<boolean>(true);
	const [post, setPost] = useState<IPost>({} as IPost);
	const [apiError, setApiError] = useState<string>('');
	const wp = useContext(WordPressContext);

	const saveResponse = (post:any) => {
		//console.log(post as IPost);
		setPost(post as IPost);
		setLoadingContent(false);
	}

	const errResponse = (err:any) => {
		setApiError(`${err}`);
		setLoadingContent(false);
	}

	useEffect(() => {
		setLoadingContent(true);

		if (posts && postID !== undefined) {
			wp.posts().embed().id(parseInt(postID)).get()
				.then((post:any) => saveResponse(post))
				.catch((err:any) => errResponse(err));
		}

		if (pages && postID !== undefined) {
			wp.pages().embed().id(parseInt(postID)).get()
				.then((post:any) => saveResponse(post))
				.catch((err:any) => errResponse(err));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [postID, posts, pages]);

	useEffect(() => {
		if (post !== undefined && post.title !== undefined) {
			document.title = `${degubbins(post.title.rendered) ?? 'Error'} - Wapp`;
		}
	}, [post]);

	if (apiError !== '') {
		return( <GeneralAPIError endpoint={posts ? 'Posts' : 'Pages'} message={apiError} /> );
	}

	const postDate = new Date(post.modified);console.log(post._embedded?.author?.[0] ?? '');

	return(
		<Box>
			{!loadingContent ?
				<Box>
					<Typography variant="h1">
						{degubbins(post.title.rendered)}
					</Typography>
					<Stack my={2} spacing={2} color="darkgrey" direction="row">
						<Typography>
							<AccessTimeIcon fontSize="inherit" />&nbsp;{postDate.toLocaleDateString()}
						</Typography>
						{post._embedded !== undefined && post._embedded["author"] !== undefined
						&& post._embedded["author"][0].name !== undefined ?
							<Typography>
								{post._embedded.author[0].avatar_urls?.[24] !== undefined ?
								<Avatar
									alt={post._embedded["author"][0].name}
									src={post._embedded.author[0].avatar_urls[24]}
									sx={{ width: 18, height: 18, display: 'inline-block' }}
								/>
								:
								<AccountCircleIcon fontSize="inherit" />
								}&nbsp;By {post._embedded["author"][0].name}
							</Typography>
						: null}
						{post.link !== undefined ?
							<>
								<Typography>
									<OpenInBrowserIcon fontSize="inherit" />&nbsp;
									<Link color="inherit" href={post.link} target="_blank">Open Original</Link>
								</Typography>
								{navigator.share !== undefined ?
									<Typography>
										<ShareIcon fontSize="inherit" />&nbsp;
										<Link color="inherit" onClick={() => navigator.share({
											title: degubbins(post.title.rendered),
											url: post.link
										})} sx={{ cursor: 'pointer' }}>Share</Link>
									</Typography>
								: null}
							</>
						: null}
					</Stack>
					<div dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(post.content.rendered)}}></div>
					<Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
						{post._embedded !== undefined && post._embedded["wp:term"] !== undefined
						&& post._embedded["wp:term"][0] !== undefined  ?
							<Grid item xs={12} sm={6}>
								<Typography variant="h4">Categories</Typography>
								{post._embedded?.["wp:term"]?.[0].map((cat:ITag) => (
									<Chip
										key={cat.id}
										label={cat.name}
										onClick={() => navigate(`/${inputURL}/posts/category/${cat.id}`)}
										sx={{ margin: 1 }}
									/>
								))}
							</Grid>
						: null}
						{post._embedded !== undefined && post._embedded["wp:term"] !== undefined
						&& post._embedded["wp:term"][1] !== undefined  ?
							<Grid item xs={12} sm={6}>
								<Typography variant="h4">Tags</Typography>
								{post._embedded?.["wp:term"]?.[1].map((cat:ITag) => (
									<Chip
										key={cat.id}
										label={cat.name}
										onClick={() => navigate(`/${inputURL}/posts/tag/${cat.id}`)}
										sx={{ margin: 1 }}
									/>
								))}
							</Grid>
						: null}
					</Grid>
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