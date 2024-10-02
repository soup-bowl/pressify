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
import { IPostExtended, ISite } from "@/interface"
import { useQuery } from "@tanstack/react-query"
import { EPostType, fetchPosts, IPost, WordPressApi } from "@/api"
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

	const postData = useQuery<IPostExtended[]>({
		queryKey: ["summary", sites.length],
		queryFn: async () => {
			const extendPosts = (posts: IPost[], info: ISite): IPostExtended[] => {
				return posts.map((post) => ({
					...post,
					name: info.name,
					description: info.description,
					url: info.url,
					image: info.image,
				}))
			}

			const postCollectionPromises = sites.map(async (site) => {
				const wp = new WordPressApi({ endpoint: `https://${site.url}/wp-json` })
				const posts = extendPosts(await fetchPosts(wp, EPostType.Post, 1, 10), site)
				return posts
			})

			const postCollections = await Promise.all(postCollectionPromises)
			return postCollections
				.flat()
				.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
				.slice(0, 15)
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
					<PostGrid posts={postData.data} mockCount={10} />
				) : (
					<PostList posts={postData.data} mockCount={10} />
				)}
			</IonContent>
		</IonPage>
	)
}

export default Home
