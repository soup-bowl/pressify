import {
	Box,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Grid,
	Pagination,
	Skeleton,
	Typography,
} from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import { IPost, IWPIndexing } from "@/api"
import { degubbins } from "@/utils/stringUtils"

interface Props {
	posts: IPost[]
	pagination?: IWPIndexing
	page?: number
	returnURI?: string
	listView?: boolean
}

export const CardDisplay = ({ posts, page = 1, pagination = undefined, returnURI = "", listView = false }: Props) => {
	const navigate = useNavigate()
	const { inputURL } = useParams()
	const location = `/#/${inputURL}`

	return (
		<>
			<Grid container spacing={2} my={2}>
				{posts.map((post: IPost) => (
					<Grid key={post.id} item xs={12} sm={listView ? 12 : 6} md={listView ? 12 : 4}>
						<Card sx={{ maxWidth: listView ? "inherit" : 345 }}>
							<CardActionArea href={`${location}${post.type === "post" ? "/post" : "/page"}/${post.id}`}>
								{post._embedded !== undefined && post._embedded["wp:featuredmedia"] !== undefined && (
									<CardMedia
										component="img"
										height="140"
										image={post._embedded?.["wp:featuredmedia"]?.[0].media_details?.sizes?.full?.source_url ?? ""}
									/>
								)}
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
			{pagination !== undefined && (
				<Box display="flex" justifyContent="center">
					<Pagination
						page={page ?? 1}
						count={pagination.totalPages}
						onChange={(event: React.ChangeEvent<unknown>, value: number) => navigate(`${returnURI}/${value}`)}
					/>
				</Box>
			)}
		</>
	)
}

interface LoadProps {
	amount: number
	listView?: boolean
}

export const CardLoad = ({ amount, listView = false }: LoadProps) => {
	const collection = Array(amount).fill("")

	return (
		<Grid container spacing={2} my={2}>
			{collection.map((content: string, i: number) => (
				<Grid key={i} item xs={12} sm={listView ? 12 : 6} md={listView ? 12 : 4}>
					<Card sx={{ maxWidth: listView ? "inherit" : 345 }}>
						<CardActionArea>
							{!listView && <Skeleton sx={{ height: 140 }} variant="rectangular" />}
							<CardContent>
								<Typography gutterBottom variant="h5" component="div">
									<Skeleton variant="rounded" />
								</Typography>
								<Typography variant="body2" color="text.secondary">
									<Skeleton variant="rounded" />
								</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				</Grid>
			))}
		</Grid>
	)
}
