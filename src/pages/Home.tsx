import { useEffect } from "react"
import {
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonMenuButton,
	IonPage,
	IonTitle,
	IonToolbar,
} from "@ionic/react"
import { Placeholder, PostGrid, PostList } from "@/components"
import { useSettings } from "@/hooks"
import { ISite } from "@/interface"
import { useQuery } from "@tanstack/react-query"
import { EPostType, fetchPosts, fetchSiteInfo, IPost, WordPressApi } from "@/api"
import { getLayoutIcon } from "@/utils"

const Home: React.FC = () => {
	const [sites, setSites] = useSettings<ISite[]>("SitesAvailable", [])
	const [layout, setLayout] = useSettings<"grid" | "list">("displayLayout", "grid")

	useEffect(() => {
		document.title = "Pressify"
	}, [])

	const toggleLayout = () => {
		if (layout === "grid") {
			setLayout("list")
		} else {
			setLayout("grid")
		}
	}

	if (sites.length < 1) {
		return (
			<IonPage>
				<IonHeader>
					<IonToolbar>
						<IonButtons slot="start">
							<IonMenuButton />
						</IonButtons>
						<IonTitle>Home</IonTitle>
					</IonToolbar>
				</IonHeader>

				<IonContent fullscreen>
					<Placeholder name="No site selected">
						<p>Please select a site, or add a new one</p>
					</Placeholder>
				</IonContent>
			</IonPage>
		)
	}

	const postData = useQuery<IPost[]>({
		queryKey: ["summary", sites.length],
		queryFn: async () => {
			const postCollectionPromises = sites.map(async (site) => {
				const wp = new WordPressApi({ endpoint: `https://${site.url}/wp-json` })
				//const details = await fetchSiteInfo(wp)
				const posts = await fetchPosts(wp, EPostType.Post, 1, 10)
				return posts
			})

			const postCollections = await Promise.all(postCollectionPromises)
			return postCollections.flat()
		},
	})

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Home</IonTitle>
					<IonButtons slot="primary" collapse={true}>
						<IonButton onClick={toggleLayout}>
							<IonIcon slot="icon-only" md={getLayoutIcon(layout)}></IonIcon>
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen>
				{layout === "grid" ? (
					<PostGrid posts={postData.data} siteURL={""} mockCount={10} />
				) : (
					<PostList posts={postData.data} siteURL={""} mockCount={10} />
				)}
			</IonContent>
		</IonPage>
	)
}

export default Home
