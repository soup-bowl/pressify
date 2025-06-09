import {
	IonAvatar,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardTitle,
	IonChip,
	IonCol,
	IonGrid,
	IonLabel,
	IonRow,
	IonSkeletonText,
} from "@ionic/react"
import { IPost } from "@/api"
import { degubbins, isPostExtended } from "@/utils"
import { IPostExtended } from "@/interface"

const PostGrid: React.FC<{
	posts?: IPost[] | IPostExtended[]
	siteURL?: string
	mockCount?: number
}> = ({ posts, siteURL, mockCount = 0 }) => {
	if (!posts) {
		return (
			<IonGrid>
				<IonRow>
					{Array.from({ length: mockCount }).map((_, index) => (
						<IonCol key={index} size="12" sizeMd="4">
							<IonCard style={{ minWidth: 200 }}>
								<IonSkeletonText animated style={{ width: "100%", height: 200, marginTop: 0 }} />
								<IonCardContent>
									<IonSkeletonText animated style={{ width: "60%" }} />
									<IonSkeletonText animated style={{ width: "40%", marginTop: "10px" }} />
									<IonSkeletonText animated style={{ width: "80%", marginTop: "10px" }} />
								</IonCardContent>
							</IonCard>
						</IonCol>
					))}
				</IonRow>
			</IonGrid>
		)
	}

	return (
		<IonGrid>
			<IonRow>
				{posts.map((post) => (
					<IonCol key={post.id} size="12" sizeMd="4">
						<IonCard routerLink={`/${isPostExtended(post) ? post.url : siteURL}/${post.type}/${post.id}`}>
							{post._embedded?.["wp:featuredmedia"]?.[0].media_details?.sizes?.full?.source_url && (
								<img
									alt=""
									src={post._embedded?.["wp:featuredmedia"][0].media_details.sizes.full.source_url}
								/>
							)}
							<IonCardHeader>
								<IonCardTitle>{degubbins(post.title.rendered)}</IonCardTitle>
							</IonCardHeader>
							<IonCardContent>
								{isPostExtended(post) && (
									<>
										<IonChip>
											<IonAvatar>
												<img alt="" src={post.image} />
											</IonAvatar>
											<IonLabel>{post.name}</IonLabel>
										</IonChip>
										<br />
									</>
								)}
								{degubbins(post.excerpt.rendered)}
							</IonCardContent>
						</IonCard>
					</IonCol>
				))}
			</IonRow>
		</IonGrid>
	)
}

export default PostGrid
