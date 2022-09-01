import { Avatar, Box, Chip, Grid, Link, Skeleton, Stack, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CardDisplay, degubbins } from "../components/cards";
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
	const [children, setChildren] = useState<IPost[]>([]);
	const [parent, setParent] = useState<IPost|undefined>(undefined);
	const [apiError, setApiError] = useState<string>('');
	const wp = useContext(WordPressContext);

	const saveResponse = (p:any) => {
		//console.log(p as IPost);
		setPost(p as IPost);
	
		if (p.type === 'page') {
			wp.pages().param('parent', p.id).embed().get()
				.then((c:any) => {
					delete c['_paging'];
					setChildren(c);
				});
			
			if (p.parent !== undefined && p.parent !== 0) {
				wp.pages().id(p.parent).embed().get()
				.then((c:any) => {
					setParent(c as IPost);
				});
			}
		}

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
			document.title = `${degubbins(post.title.rendered) ?? 'Error'} - Pressify`;
		}
	}, [post]);

	if (apiError !== '') {
		return( <GeneralAPIError endpoint={posts ? 'Posts' : 'Pages'} message={apiError} /> );
	}

	const postDate = new Date(post.modified);

	const mockLines = Array(25).fill("");

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

					{parent !== undefined ?
						<>
							<Typography variant="h4">Parent</Typography>
							<CardDisplay posts={[parent]} />
						</>
					: null}
					{children.length > 0 ?
						<>
							<Typography variant="h4">Sub-pages</Typography>
							<CardDisplay posts={children} />
						</>
					: null}

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
				<Box>
					<Typography variant="h1"><Skeleton /></Typography>
					<div>
						{mockLines.map((content:string, i:number) => (
							<Skeleton height={120} />
						))}
					</div>
				</Box>
			}
		</Box>
	);
}