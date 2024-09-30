import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from "@ionic/react"
import { useParams } from "react-router"
import { useEffect, useState } from "react"
import { EPostType, IPostCollection, ISiteInfo, WordPressApi } from "../api"
import { degubbins } from "../utils"
import { PostGrid } from "../components"

const pageAmount = 12

const PostCollection: React.FC<{
	type: EPostType
}> = ({ type }) => {
	const { inputURL, pageNumber } = useParams<{ inputURL: string; pageNumber: string }>()
	const wp = new WordPressApi({ endpoint: `https://${inputURL}/wp-json` })
	const [mainInfo, setMainInfo] = useState<ISiteInfo | undefined>()
	const [posts, setPosts] = useState<IPostCollection | undefined>()

	useEffect(() => {
		setPosts(undefined)
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

		if (type === EPostType.Post) {
			wp.fetchPosts({ type: EPostType.Post, page: parseInt(pageNumber ?? "1"), perPage: pageAmount })
				.then((post) => setPosts(post))
				.catch((err: Error) => console.log(err))
		}

		if (type === EPostType.Page) {
			wp.fetchPosts({ type: EPostType.Page, page: parseInt(pageNumber ?? "1"), perPage: pageAmount })
				.then((post) => setPosts(post))
				.catch((err: Error) => console.log(err))
		}
	}, [inputURL])

	const title = `${degubbins(mainInfo?.name ?? "Loading...")} ${type === EPostType.Post ? "posts" : "pages"}`
	useEffect(() => {
		document.title = `${title} - Pressify`
	}, [mainInfo])

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>{title}</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen>
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">{title}</IonTitle>
					</IonToolbar>
				</IonHeader>

				<PostGrid posts={posts?.posts} siteURL={inputURL} mockCount={pageAmount} />
			</IonContent>
		</IonPage>
	)
}

export default PostCollection