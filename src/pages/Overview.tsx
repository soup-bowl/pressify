import {
	IonButtons,
	IonContent,
	IonHeader,
	IonListHeader,
	IonMenuButton,
	IonPage,
	IonTitle,
	IonToolbar,
} from "@ionic/react"
import { useParams } from "react-router"
import { useEffect, useState } from "react"
import { EPostType, IArticleCollection, ISiteInfo, IWPAPIError, WordPressApi } from "../api"
import { Headline, PostGrid } from "../components"
import "./Overview.css"

const Overview: React.FC = () => {
	const { inputURL } = useParams<{ inputURL: string }>()
	const wp = new WordPressApi({ endpoint: `https://${inputURL}/wp-json` })
	const [mainInfo, setMainInfo] = useState<ISiteInfo | undefined>()
	const [postCollection, setPostCollection] = useState<IArticleCollection | undefined>()

	useEffect(() => {
		setPostCollection(undefined)
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
				setMainInfo(undefined)
			})

		Promise.all([
			wp.fetchPosts({ type: EPostType.Post, page: 1, perPage: 3 }),
			wp.fetchPosts({ type: EPostType.Page, page: 1, perPage: 3 }),
		])
			.then((values) => {
				setPostCollection({
					posts: values[0].posts,
					pages: values[1].posts,
				})
			})
			.catch((err: IWPAPIError) => {
				console.log(err)
			})
	}, [inputURL])

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>{inputURL}</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen>
				<Headline siteInfo={mainInfo} />
				<IonListHeader>Posts</IonListHeader>
				<PostGrid posts={postCollection?.posts} mockCount={3} />
				<IonListHeader>Pages</IonListHeader>
				<PostGrid posts={postCollection?.pages} mockCount={3} />
			</IonContent>
		</IonPage>
	)
}

export default Overview
