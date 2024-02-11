import { Box, Grid, Skeleton, Stack, styled, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
	Author, CardDisplay, CreatedDate, GeneralAPIError, NativeShare, OriginalContentLink, TagGrid
} from "@/components";
import { EPostType, IPost, IPostCollection } from "@/api";
import { WordPressContext } from "@/pages/_layout";
import { degubbins } from "../utils/stringUtils";

const StyledStack = styled(Stack)(({ theme }) => ({
	[theme.breakpoints.down('sm')]: {
		justifyContent: 'space-around',
	},
	flexDirection: 'row',
	gap: 10
}));

interface Props {
	posts?: boolean;
	pages?: boolean;
}

const Content = ({ posts, pages }: Props) => {
	const { inputURL, postID } = useParams();
	const [loadingContent, setLoadingContent] = useState<boolean>(true);
	const [post, setPost] = useState<IPost>({} as IPost);
	const [children, setChildren] = useState<IPost[]>([]);
	const [parent, setParent] = useState<IPost | undefined>(undefined);
	const [apiError, setApiError] = useState<string>('');
	const wp = useContext(WordPressContext);

	const saveResponse = (p: IPost) => {
		setPost(p);

		if (p.type === 'page') {
			wp.fetchPosts({ type: EPostType.Page, parent: p.id })
				.then((c: IPostCollection) => setChildren(c.posts));

			if (p.parent !== undefined && p.parent !== 0) {
				wp.fetchPost(p.parent, EPostType.Page)
					.then((c: IPost) => setParent(c));
			}
		}

		setLoadingContent(false);
	}

	const errResponse = (err: Error) => {
		setApiError(err.message);
		setLoadingContent(false);
	}

	useEffect(() => {
		setLoadingContent(true);

		if (posts && postID !== undefined) {
			wp.fetchPost(parseInt(postID), EPostType.Post)
				.then((post: IPost) => saveResponse(post))
				.catch((err: Error) => errResponse(err));
		}

		if (pages && postID !== undefined) {
			wp.fetchPost(parseInt(postID), EPostType.Page)
				.then((post: IPost) => saveResponse(post))
				.catch((err: Error) => errResponse(err));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [postID, posts, pages]);

	useEffect(() => {
		if (post !== undefined && post.title !== undefined) {
			document.title = `${degubbins(post.title.rendered) ?? 'Error'} - Pressify`;
		}
	}, [post]);

	if (apiError !== '') {
		return (<GeneralAPIError endpoint={posts ? 'Posts' : 'Pages'} message={apiError} />);
	}

	const postDate = new Date(post.modified);

	if (loadingContent) {
		const mockLines = Array(25).fill("");

		return (
			<Box>
				<Typography variant="h1"><Skeleton height={120} /></Typography>
				<Grid container spacing={2} my={2}>
					<Grid item md={2}><Skeleton /></Grid>
					<Grid item md={2}><Skeleton /></Grid>
					<Grid item md={2}><Skeleton /></Grid>
					<Grid item md={2}><Skeleton /></Grid>
					<Grid item md={4}></Grid>
				</Grid>
				<div>
					{mockLines.map((content: string, i: number) => (
						<Box key={i} sx={{ marginBottom: 1 }}>
							<Skeleton />
							<Skeleton />
							<Skeleton width="40%" />
						</Box>
					))}
				</div>
			</Box>
		);
	}

	return (
		<Box>
			<Typography variant="h1">
				{degubbins(post.title.rendered)}
			</Typography>
			<StyledStack my={2} spacing={2} color="darkgrey">
				<CreatedDate date={postDate} />
				{(post._embedded !== undefined && post._embedded["author"] !== undefined
					&& post._embedded["author"][0].name !== undefined) &&
					<Author avatar={post._embedded.author[0].avatar_urls?.[24]} name={post._embedded["author"][0].name} />
				}
				{post.link !== undefined &&
					<OriginalContentLink url={post.link} />
				}
				{(post.link !== undefined && navigator.share !== undefined) &&
					<NativeShare title={degubbins(post.title.rendered)} url={post.link} />
				}
			</StyledStack>

			<div className="wp-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content.rendered) }}></div>

			{parent !== undefined &&
				<>
					<Typography variant="h4">Parent</Typography>
					<CardDisplay posts={[parent]} />
				</>
			}
			{children.length > 0 &&
				<>
					<Typography variant="h4">Sub-pages</Typography>
					<CardDisplay posts={children} />
				</>
			}

			<Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
				{(post._embedded !== undefined && post._embedded["wp:term"] !== undefined
					&& post._embedded["wp:term"][0] !== undefined) &&
					<Grid item xs={12} sm={6}>
						<TagGrid
							title="Categories"
							tags={post._embedded["wp:term"][0]}
							urlFormat={`/${inputURL}/posts/category`}
						/>
					</Grid>
				}
				{(post._embedded !== undefined && post._embedded["wp:term"] !== undefined
					&& post._embedded["wp:term"][1] !== undefined) &&
					<Grid item xs={12} sm={6}>
						<TagGrid
							title="Tags"
							tags={post._embedded["wp:term"][1]}
							urlFormat={`/${inputURL}/posts/tag`}
						/>
					</Grid>
				}
			</Grid>
		</Box>
	);
}

export default Content;