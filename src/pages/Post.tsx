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
import { useParams } from "react-router"
import { useEffect, useState } from "react"
import { EPostType, IPost, ISiteInfo, WordPressApi } from "../api"
import { degubbins } from "../utils"
import { Content, TagGrid } from "../components"
import { shareOutline, shareSharp } from "ionicons/icons"

const Post: React.FC<{
	type: EPostType
}> = ({ type }) => {
	const { inputURL, postID } = useParams<{ inputURL: string; postID: string }>()
	const wp = new WordPressApi({ endpoint: `https://${inputURL}/wp-json` })
	const [mainInfo, setMainInfo] = useState<ISiteInfo | undefined>()
	const [post, setPost] = useState<IPost | undefined>()

	useEffect(() => {
		setPost(undefined)
		setMainInfo(undefined)

		wp.fetchInfo()
			.then((response: ISiteInfo) => {
				setMainInfo({
					name: response.name ?? "N/A",
					description: response.description ?? "",
					site_icon_url: response.site_icon_url,
					url: response.url,
					namespaces: response.namespaces,
				})
			})
			.catch((err) => {
				console.log(err)
			})

		if (type === EPostType.Post && postID !== undefined) {
			wp.fetchPost(parseInt(postID), EPostType.Post)
				.then((post: IPost) => setPost(post))
				.catch((err: Error) => console.log(err))
		}

		if (type === EPostType.Page && postID !== undefined) {
			wp.fetchPost(parseInt(postID), EPostType.Page)
				.then((post: IPost) => setPost(post))
				.catch((err: Error) => console.log(err))
		}
	}, [inputURL])

	const shareArticle = () => {
		if (post) {
			navigator.share({
				title: degubbins(post.title.rendered),
				url: post.link,
			})
		}
	}

	useEffect(() => {
		if (post !== undefined && post.title !== undefined) {
			document.title = `${degubbins(post.title.rendered) ?? "Loading"} - Pressify`
		}
	}, [post])

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
					<IonTitle>{degubbins(post?.title.rendered ?? "Loading content")}</IonTitle>
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
						<IonTitle size="large">{degubbins(post?.title.rendered ?? "Loading content")}</IonTitle>
						<IonButtons slot="end" collapse={true}>
							<ShareButton />
						</IonButtons>
					</IonToolbar>
				</IonHeader>

				<Content post={post} />

				<IonGrid>
					<IonRow>
						<IonCol size="6">
							<IonListHeader>Categories</IonListHeader>
							<TagGrid
								prelink={`${inputURL}/${post?.type}s/category`}
								tags={post?._embedded?.["wp:term"]?.[0]}
							/>
						</IonCol>
						<IonCol size="6">
							<IonListHeader>Tags</IonListHeader>
							<TagGrid
								prelink={`${inputURL}/${post?.type}s/tag`}
								tags={post?._embedded?.["wp:term"]?.[1]}
							/>
						</IonCol>
					</IonRow>
				</IonGrid>
			</IonContent>
		</IonPage>
	)
}

export default Post
