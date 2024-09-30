import {
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonLabel,
	IonListHeader,
	IonMenuButton,
	IonPage,
	IonTitle,
	IonToolbar,
} from "@ionic/react"
import { arrowForward, chevronForward, searchOutline } from "ionicons/icons"
import { useParams } from "react-router"
import { useEffect, useState } from "react"
import { EPostType, IArticleCollection, ISiteInfo, IWPAPIError, WordPressApi } from "../api"
import { Headline, PostGrid } from "../components"

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

	useEffect(() => {
		document.title = `${mainInfo?.name ?? "Sites"} - Pressify`
	}, [])

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>{inputURL}</IonTitle>
					<IonButtons slot="end">
						<IonButton routerLink={`/${inputURL}/search`}>
							<IonIcon slot="icon-only" ios={searchOutline}></IonIcon>
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen>
				<Headline siteInfo={mainInfo} />
				<IonListHeader>
					<IonLabel>Posts</IonLabel>
					<IonButton routerLink={`/${inputURL}/posts`}>
						More
						<IonIcon slot="end" ios={chevronForward} md={arrowForward}></IonIcon>
					</IonButton>
				</IonListHeader>
				<PostGrid posts={postCollection?.posts} siteURL={inputURL} mockCount={3} />
				<IonListHeader>
					<IonLabel>Pages</IonLabel>
					<IonButton routerLink={`/${inputURL}/pages`}>
						More
						<IonIcon slot="end" ios={chevronForward} md={arrowForward}></IonIcon>
					</IonButton>
				</IonListHeader>
				<PostGrid posts={postCollection?.pages} siteURL={inputURL} mockCount={3} />
			</IonContent>
		</IonPage>
	)
}

export default Overview
