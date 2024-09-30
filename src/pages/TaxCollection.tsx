import {
	IonBackButton,
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
import { useParams } from "react-router"
import { useEffect, useState } from "react"
import { EPostType, ETagType, IPostCollection, ISiteInfo, WordPressApi } from "../api"
import { degubbins, getLayoutIcon } from "../utils"
import { PostGrid, PostList } from "../components"
import { useSettings } from "../hooks"

const pageAmount = 12

const TaxCollection: React.FC<{
	type: EPostType
	tagType: ETagType
}> = ({ type, tagType }) => {
	const { inputURL, searchID, pageNumber } = useParams<{ inputURL: string; searchID: string; pageNumber: string }>()
	const [layout, setLayout] = useSettings<"grid" | "list">("displayLayout", "grid")
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

		if (tagType === ETagType.Tag) {
			wp.fetchPosts({
				type: type,
				page: parseInt(pageNumber ?? "1"),
				perPage: pageAmount,
				byTag: parseInt(searchID ?? "0"),
			})
				.then((post) => setPosts(post))
				.catch((err: Error) => console.log(err))
		} else {
			wp.fetchPosts({
				type: type,
				page: parseInt(pageNumber ?? "1"),
				perPage: pageAmount,
				byCategory: parseInt(searchID ?? "0"),
			})
				.then((post) => setPosts(post))
				.catch((err: Error) => console.log(err))
		}
	}, [inputURL])

	const toggleLayout = () => {
		if (layout === "grid") {
			setLayout("list")
		} else {
			setLayout("grid")
		}
	}

	const title = `${degubbins(mainInfo?.name ?? "Loading...")} ${tagType === ETagType.Category ? "category" : "tag"}`
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
					<PostGrid posts={posts?.posts} siteURL={inputURL} mockCount={pageAmount} />
				) : (
					<PostList posts={posts?.posts} siteURL={inputURL} mockCount={pageAmount} />
				)}
			</IonContent>
		</IonPage>
	)
}

export default TaxCollection
