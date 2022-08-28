import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, Pagination, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { IPost, IWPIndexing } from "../interfaces";

interface Props {
	posts: IPost[];
	pagination?: IWPIndexing;
	page?: number;
	returnURI?: string;
}

export function degubbins(input:string) {
	return input.replace(/<[^>]*>?/gm, '').replace(/&hellip;/g, '...').replace(
		/&#[0-9]{1,5};/g, x => String.fromCharCode( parseInt( x.substring( 2, x.length - 1 ) ) )
	);
}

export function CardDisplay({posts, page = 1, pagination = undefined, returnURI = ''}:Props) {
	const navigate = useNavigate();
	const { inputURL } = useParams();
	const location = `${process.env.PUBLIC_URL}/#/${inputURL}`;

	return(
		<>
			<Grid container spacing={2} my={2}>
				{posts.map((post:IPost) => (
					<Grid key={post.id} item xs={12} sm={6} md={4}>
						<Card sx={{ maxWidth: 345 }}>
							<CardActionArea href={`${location}${((post.type === 'post') ? '/post' : '/page')}/${post.id}`}>
								{post._embedded !== undefined && post._embedded["wp:featuredmedia"] !== undefined  ?
								<CardMedia
									component="img"
									height="140"
									image={post._embedded?.["wp:featuredmedia"]?.[0].media_details.sizes.full.source_url ?? ''}
								/>
								: null }
								<CardContent>
									<Typography gutterBottom variant="h5" component="div">
										{degubbins(post.title.rendered)}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{degubbins(post.excerpt.rendered)}
									</Typography>
								</CardContent>
							</CardActionArea>
						</Card>
					</Grid>
				))}
			</Grid>
			{pagination !== undefined ?
			<Box display="flex" justifyContent="center">
				<Pagination
					page={page ?? 1}
					count={pagination.totalPages}
					onChange={(event: React.ChangeEvent<unknown>, value: number) => {
						navigate(`${returnURI}/${value}`);
					}}
				/>
			</Box>
			: null}
		</>
	);
}
