import { useEffect, useState } from "react"
import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonInfiniteScroll,
	IonInfiniteScrollContent,
	IonMenuButton,
	IonPage,
	IonTitle,
	IonToolbar,
} from "@ionic/react"
import { useParams } from "react-router"
import { EPostType, IPost, ISiteInfo, WordPressApi } from "@/api"
import { degubbins, getLayoutIcon } from "@/utils"
import { PostGrid, PostList } from "@/components"
import { useSettings } from "@/hooks"

const pageAmount = 12

const PostCollection: React.FC<{
	type: EPostType
}> = ({ type }) => {
	const { inputURL } = useParams<{ inputURL: string }>()
	const [layout, setLayout] = useSettings<"grid" | "list">("displayLayout", "grid")
	const wp = new WordPressApi({ endpoint: `https://${inputURL}/wp-json` })
	const [mainInfo, setMainInfo] = useState<ISiteInfo | undefined>()
	const [posts, setPosts] = useState<IPost[] | undefined>()
	const [scrollCount, setScrollCount] = useState<number>(1)

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

		loadContent()
	}, [inputURL])

	const loadContent = () => {
		setScrollCount(scrollCount + 1)
		wp.fetchPosts({ type: type, page: scrollCount, perPage: pageAmount })
			.then((post) => setPosts([...(posts ?? []), ...post.posts]))
			.catch((err: Error) => console.log(err))
	}

	const toggleLayout = () => {
		if (layout === "grid") {
			setLayout("list")
		} else {
			setLayout("grid")
		}
	}

	const title = `${degubbins(mainInfo?.name ?? "Loading...")} ${type === EPostType.Post ? "posts" : "pages"}`
	useEffect(() => {
		document.title = `${title} - Pressify`
	}, [mainInfo])

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start" collapse={true}>
						<IonBackButton />
						<IonMenuButton />
					</IonButtons>
					<IonTitle>{title}</IonTitle>
					<IonButtons slot="primary" collapse={true}>
						<IonButton onClick={toggleLayout}>
							<IonIcon slot="icon-only" md={getLayoutIcon(layout)}></IonIcon>
						</IonButton>
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
						<IonTitle size="large">{title}</IonTitle>
						<IonButtons slot="primary" collapse={true}>
							<IonButton onClick={toggleLayout}>
								<IonIcon slot="icon-only" md={getLayoutIcon(layout)}></IonIcon>
							</IonButton>
						</IonButtons>
					</IonToolbar>
				</IonHeader>

				{layout === "grid" ? (
					<PostGrid posts={posts} siteURL={inputURL} mockCount={pageAmount} />
				) : (
					<PostList posts={posts} siteURL={inputURL} mockCount={pageAmount} />
				)}

				<IonInfiniteScroll
					onIonInfinite={(ev) => {
						loadContent()
						setTimeout(() => ev.target.complete(), 500)
					}}
				>
					<IonInfiniteScrollContent />
				</IonInfiniteScroll>
			</IonContent>
		</IonPage>
	)
}

export default PostCollection
