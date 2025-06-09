import { IonAvatar, IonChip, IonItem, IonLabel, IonList, IonSkeletonText, IonThumbnail } from "@ionic/react"
import { IPost } from "@/api"
import { degubbins, isPostExtended } from "@/utils"
import { IPostExtended } from "@/interface"

const PostList: React.FC<{
	posts?: IPost[] | IPostExtended[]
	siteURL?: string
	mockCount?: number
}> = ({ posts, siteURL, mockCount = 0 }) => {
	// 450
	if (!posts) {
		return (
			<IonList>
				{Array.from({ length: mockCount }).map((_, index) => (
					<IonItem key={index}>
						<IonLabel>
							<IonSkeletonText animated style={{ height: 16, width: "50%" }} />
							<IonSkeletonText animated style={{ width: "60%" }} />
							<IonSkeletonText animated style={{ width: "40%" }} />
						</IonLabel>
					</IonItem>
				))}
			</IonList>
		)
	}

	return (
		<IonList>
			{posts.map((post) => (
				<IonItem
					key={post.id}
					button
					routerLink={`/${isPostExtended(post) ? post.url : siteURL}/${post.type}/${post.id}`}
				>
					{post._embedded?.["wp:featuredmedia"]?.[0].media_details?.sizes?.full?.source_url && (
						<IonThumbnail slot="start">
							<img
								alt=""
								src={post._embedded?.["wp:featuredmedia"][0].media_details.sizes.full.source_url}
							/>
						</IonThumbnail>
					)}
					<IonLabel>
						<h2>{degubbins(post.title.rendered)}</h2>
						<p>{degubbins(post.excerpt.rendered)}</p>
					</IonLabel>
					{isPostExtended(post) && (
						<IonChip slot="end">
							<IonAvatar>
								<img alt="" src={post.image} />
							</IonAvatar>
							<IonLabel>{post.name}</IonLabel>
						</IonChip>
					)}
				</IonItem>
			))}
		</IonList>
	)
}

export default PostList
