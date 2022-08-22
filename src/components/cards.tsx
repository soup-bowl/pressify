import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { IPost } from "../interfaces";

interface Props {
	posts: IPost[];
	page?: boolean;
}

export function descriptionSanitiser(input:string) {
	return input.replace(/<[^>]*>?/gm, '') // Remove HTML tags.
		.replaceAll('&#8220;', '"')
		.replaceAll('&#8221;', '"')
		.replaceAll('&#8216;', '\'')
		.replaceAll('&#8217;', '\'')
		.replaceAll('&hellip;', '...');
}

export function CardDisplay({posts, page}:Props) {
	const location = useLocation().pathname.replace('/posts', '').replace('/pages', '');

	return(
		<Grid container spacing={2} my={2}>
			{posts.map((post:IPost) => (
				<Grid key={post.id} item xs={12} sm={6} md={4}>
					<Card sx={{ maxWidth: 345 }}>
						<CardActionArea href={process.env.PUBLIC_URL + '/#' + location + ((page) ? '/pages' : '/posts') + '/' + post.id}>
							{post._embedded !== undefined && post._embedded["wp:featuredmedia"] !== undefined  ?
							<CardMedia
								component="img"
								height="140"
								image={post._embedded?.["wp:featuredmedia"]?.[0].media_details.sizes.full.source_url ?? ''}
							/>
							: null }
							<CardContent>
								<Typography gutterBottom variant="h5" component="div">
									{descriptionSanitiser(post.title.rendered)}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{descriptionSanitiser(post.excerpt.rendered)}
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				</Grid>
			))}
		</Grid>
	);
}
