import {
	Typography, Box, Grid, Link, Skeleton, Alert, AlertTitle, useMediaQuery, Theme, styled
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { EPostType, IPost, ISiteInfo, IWPAPIError } from '../api';
import { CardDisplay, CardLoad, GeneralAPIError, SiteSelector } from '../components';
import { WordPressContext } from './_layout';

import GitHubIcon from '@mui/icons-material/GitHub';
import "@fontsource/eb-garamond";

const FixedPostion = styled('div')({
	position: 'fixed',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	zIndex: 2000,
	backdropFilter: 'blur(10px)'
});

interface HomeProps {
	theme: Theme;
}

export const MainHome = ({ theme }: HomeProps) => {
	useEffect(() => { document.title = `Choose a site - Pressify` }, []);

	const backdropColour = theme.palette.background.default === '#fff' ? '#ffffffd1' : `${theme.palette.background.default}d1`;

	return (
		<FixedPostion style={{ backgroundColor: backdropColour }}>
			<Grid container spacing={0} direction="column" alignItems="center" justifyContent="center" style={{ minHeight: '80vh' }}>
				<Grid item xs={3} textAlign="center">
					<Typography variant="h1" sx={{ fontFamily: '"EB Garamond", serif', fontSize: '6rem' }}>Pressify.</Typography>
					<Typography my={2}>
						If the URL you specify is a <strong>WordPress</strong> site with an exposed&nbsp;
						<Link href="https://developer.wordpress.org/rest-api/">WordPress REST API</Link>, we can generate a
						basic web application from the API contents.
					</Typography>
					<Box my={2} textAlign="left">
						<Alert severity="info">
							<AlertTitle>Beta</AlertTitle>
							This service is under active development. Please be aware that there may be bugs!
						</Alert>
					</Box>
					<SiteSelector />
					<Typography my={2}>
						🧪 A <Link href="https://soupbowl.io">Soupbowl</Link> experiment&nbsp;
						<GitHubIcon fontSize='inherit' /> <Link href="https://github.com/soup-bowl/project-wordpress-pwa">
							source code</Link>
					</Typography>
				</Grid>
			</Grid>
		</FixedPostion>
	);
}

export const AppHome = () => {
	const [mainInfo] = useOutletContext<[ISiteInfo]>();
	const { inputURL } = useParams();
	const [apiError, setApiError] = useState<string>('');
	const [loadingContent, setLoadingContent] = useState<boolean>(true);
	const [postCollection, setPostCollection] = useState<IPost[]>([]);
	const [pageCollection, setPageCollection] = useState<IPost[]>([]);
	const wp = useContext(WordPressContext);

	const isSmallScreen: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

	useEffect(() => {
		Promise.all([
			wp.fetchPosts({ type: EPostType.Post, page: 1, perPage: 3 }),
			wp.fetchPosts({ type: EPostType.Page, page: 1, perPage: 3 }),
		]).then(values => {
			setPostCollection(values[0].posts);
			setPageCollection(values[1].posts);
			setLoadingContent(false);
		}).catch((err: IWPAPIError) => {
			setApiError(`[${err.code}] ${err.message}`);
			setLoadingContent(false);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inputURL]);

	useEffect(() => { document.title = `${mainInfo.name ?? 'Error'} - Pressify` }, [mainInfo]);

	return (
		<Box>
			<Grid container spacing={2} alignItems="center">
				{(!isSmallScreen && mainInfo.site_icon_url !== undefined) &&
					<Grid item>
						<img src={mainInfo.site_icon_url} alt="" style={{
							height: 100,
							borderRadius: 5
						}} />
					</Grid>
				}
				<Grid item>
					<Typography variant="h1">{mainInfo.name ?? <Skeleton variant="rounded" />}</Typography>
					<Typography my={2}>{mainInfo.description ?? <Skeleton variant="rounded" />}</Typography>
				</Grid>
			</Grid>
			{!loadingContent ?
				<>
					{apiError === '' ?
						<>
							{postCollection.length > 0 &&
								<>
									<Typography variant="h2">Posts</Typography>
									<CardDisplay posts={postCollection} />
								</>
							}

							{pageCollection.length > 0 &&
								<>
									<Typography variant="h2">Pages</Typography>
									<CardDisplay posts={pageCollection} />
								</>
							}
						</>
						:
						<GeneralAPIError endpoint="Posts/Pages" message={apiError} noheader />
					}
				</>
				:
				<>
					<Typography variant="h2">Posts</Typography>
					<CardLoad amount={3} />
					<Typography variant="h2">Pages</Typography>
					<CardLoad amount={3} />
				</>
			}
		</Box>
	);
}
