import {
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardTitle,
	IonCol,
	IonGrid,
	IonRow,
	IonSkeletonText,
} from "@ionic/react"
import { IPost } from "../api"
import { degubbins } from "../utils"

const PostGrid: React.FC<{
	posts?: IPost[]
	siteURL?: string
	mockCount?: number
}> = ({ posts, siteURL, mockCount = 0 }) => {
	// 450
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
				{posts.map((post, index) => (
					<IonCol key={index} size="12" sizeMd="4">
						<IonCard routerLink={`/${siteURL}/${post.type}/${post.id}`}>
							<img
								alt=""
								src={
									post._embedded?.["wp:featuredmedia"]?.[0].media_details?.sizes?.full?.source_url ??
									"https://ionicframework.com/docs/img/demos/card-media.png"
								}
							/>
							<IonCardHeader>
								<IonCardTitle>{degubbins(post.title.rendered)}</IonCardTitle>
							</IonCardHeader>
							<IonCardContent>{degubbins(post.excerpt.rendered)}</IonCardContent>
						</IonCard>
					</IonCol>
				))}
			</IonRow>
		</IonGrid>
	)
}

export default PostGrid
