import { useEffect } from "react"
import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonCol,
	IonContent,
	IonGrid,
	IonHeader,
	IonIcon,
	IonListHeader,
	IonMenuButton,
	IonPage,
	IonRow,
	IonTitle,
	IonToolbar,
} from "@ionic/react"
import { shareOutline, shareSharp } from "ionicons/icons"
import { useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { EPostType, fetchContent, IPost, WordPressApi } from "@/api"
import { degubbins } from "@/utils"
import { Content, TagGrid } from "@/components"

const Post: React.FC<{
	type: EPostType
}> = ({ type }) => {
	const { inputURL, postID } = useParams<{ inputURL: string; postID: string }>()
	const wp = new WordPressApi({ endpoint: `https://${inputURL}/wp-json` })

	const postData = useQuery<IPost>({
		queryKey: [inputURL, "page", postID],
		queryFn: async () => fetchContent(wp, parseInt(postID), type),
	})

	const shareArticle = () => {
		if (postData.data) {
			navigator.share({
				title: degubbins(postData.data.title.rendered),
				url: postData.data.link,
			})
		}
	}

	useEffect(() => {
		if (postData.data !== undefined && postData.data.title !== undefined) {
			document.title = `${degubbins(postData.data.title.rendered) ?? "Loading"} - Pressify`
		}
	}, [postData.data])

	const ShareButton = () => (
		<IonButton>
			<IonIcon onClick={shareArticle} ios={shareOutline} md={shareSharp} />
		</IonButton>
	)

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start" collapse={true}>
						<IonBackButton />
						<IonMenuButton />
					</IonButtons>
					<IonTitle>{degubbins(postData.data?.title.rendered ?? "Loading content")}</IonTitle>
					<IonButtons slot="end" collapse={true}>
						<ShareButton />
					</IonButtons>
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen>
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonButtons slot="start" collapse={true}>
							<IonBackButton />
							<IonMenuButton />
						</IonButtons>
						<IonTitle size="large">
							{degubbins(postData.data?.title.rendered ?? "Loading content")}
						</IonTitle>
						<IonButtons slot="end" collapse={true}>
							<ShareButton />
						</IonButtons>
					</IonToolbar>
				</IonHeader>

				<Content post={postData.data} />

				<IonGrid>
					<IonRow>
						<IonCol size="6">
							<IonListHeader>Categories</IonListHeader>
							<TagGrid
								prelink={`${inputURL}/${postData.data?.type}s/category`}
								tags={postData.data?._embedded?.["wp:term"]?.[0]}
							/>
						</IonCol>
						<IonCol size="6">
							<IonListHeader>Tags</IonListHeader>
							<TagGrid
								prelink={`${inputURL}/${postData.data?.type}s/tag`}
								tags={postData.data?._embedded?.["wp:term"]?.[1]}
							/>
						</IonCol>
					</IonRow>
				</IonGrid>
			</IonContent>
		</IonPage>
	)
}

export default Post
