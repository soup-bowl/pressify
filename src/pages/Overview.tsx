import { useEffect } from "react"
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
import { useQuery } from "@tanstack/react-query"
import { fetchOverview, fetchSiteInfo, IArticleCollection, ISiteInfo, WordPressApi } from "@/api"
import { Headline, PostGrid } from "@/components"

const Overview: React.FC = () => {
	const { inputURL } = useParams<{ inputURL: string }>()
	const wp = new WordPressApi({ endpoint: `https://${inputURL}/wp-json` })

	const siteInfo = useQuery<ISiteInfo>({
		queryKey: [`${inputURL}Info`],
		queryFn: async () => fetchSiteInfo(wp),
	})

	const overviewInfo = useQuery<IArticleCollection>({
		queryKey: [`${inputURL}Overview`],
		queryFn: async () => fetchOverview(wp),
	})

	useEffect(() => {
		document.title = `${siteInfo.data?.name ?? "Sites"} - Pressify`
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
				<Headline siteInfo={siteInfo.data} />
				<IonListHeader>
					<IonLabel>Posts</IonLabel>
					<IonButton routerLink={`/${inputURL}/posts`}>
						More
						<IonIcon slot="end" ios={chevronForward} md={arrowForward}></IonIcon>
					</IonButton>
				</IonListHeader>
				<PostGrid posts={overviewInfo.data?.posts} siteURL={inputURL} mockCount={3} />
				<IonListHeader>
					<IonLabel>Pages</IonLabel>
					<IonButton routerLink={`/${inputURL}/pages`}>
						More
						<IonIcon slot="end" ios={chevronForward} md={arrowForward}></IonIcon>
					</IonButton>
				</IonListHeader>
				<PostGrid posts={overviewInfo.data?.pages} siteURL={inputURL} mockCount={3} />
			</IonContent>
		</IonPage>
	)
}

export default Overview
