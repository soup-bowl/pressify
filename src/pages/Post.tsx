import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from "@ionic/react"
import { useParams } from "react-router"
import { useEffect, useState } from "react"
import { EPostType, IPost, ISiteInfo, WordPressApi } from "../api"
import { degubbins } from "../utils"
import { Content } from "../components"

const Post: React.FC<{
	posts?: boolean
	pages?: boolean
}> = ({ posts, pages }) => {
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

		if (posts && postID !== undefined) {
			wp.fetchPost(parseInt(postID), EPostType.Post)
				.then((post: IPost) => setPost(post))
				.catch((err: Error) => console.log(err))
		}

		if (pages && postID !== undefined) {
			wp.fetchPost(parseInt(postID), EPostType.Page)
				.then((post: IPost) => setPost(post))
				.catch((err: Error) => console.log(err))
		}
	}, [inputURL])

	useEffect(() => {
		if (post !== undefined && post.title !== undefined) {
			document.title = `${degubbins(post.title.rendered) ?? "Loading"} - Pressify`
		}
	}, [post])

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>{degubbins(post?.title.rendered ?? "Loading content")}</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen>
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">{degubbins(post?.title.rendered ?? "Loading content")}</IonTitle>
					</IonToolbar>
				</IonHeader>

				<Content post={post} />
			</IonContent>
		</IonPage>
	)
}

export default Post
