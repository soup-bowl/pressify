import { useEffect, useState } from "react"
import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonMenuButton,
	IonPage,
	IonSearchbar,
	IonTitle,
	IonToolbar,
} from "@ionic/react"
import { useParams } from "react-router"
import { IPost, ISiteInfo, WordPressApi } from "@/api"
import { getLayoutIcon } from "@/utils"
import { PostGrid, PostList } from "@/components"
import { useSettings } from "@/hooks"

const pageAmount = 12

const SearchCollection: React.FC = () => {
	const { inputURL } = useParams<{ inputURL: string }>()
	const [layout, setLayout] = useSettings<"grid" | "list">("displayLayout", "grid")
	const wp = new WordPressApi({ endpoint: `https://${inputURL}/wp-json` })
	const [mainInfo, setMainInfo] = useState<ISiteInfo | undefined>()
	const [searchTerms, setSearchTerms] = useState<string>("")
	const [searchResults, setSearchResults] = useState<IPost[] | undefined>()

	useEffect(() => {
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
	}, [inputURL])

	useEffect(() => {
		wp.searchPosts({ search: searchTerms ?? "", page: 1, perPage: pageAmount })
			.then((response) => {
				const collection: IPost[] = []
				response.results.forEach((e) => collection.push(e._embedded.self[0]))
				setSearchResults(collection)
			})
			.catch((err) => console.log(err))
	}, [searchTerms])

	const toggleLayout = () => {
		if (layout === "grid") {
			setLayout("list")
		} else {
			setLayout("grid")
		}
	}

	const title = `Searching ${mainInfo?.name} for "${searchTerms}"`
	useEffect(() => {
		document.title = `${title} - Pressify`
	}, [mainInfo])

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonBackButton />
						<IonMenuButton />
					</IonButtons>
					<IonTitle>{title}</IonTitle>
					<IonButtons slot="primary">
						<IonButton onClick={toggleLayout}>
							<IonIcon slot="icon-only" md={getLayoutIcon(layout)}></IonIcon>
						</IonButton>
					</IonButtons>
				</IonToolbar>
				<IonToolbar>
					<IonSearchbar
						value={searchTerms}
						debounce={1000}
						onIonInput={(ev) => setSearchTerms(ev.target.value?.toLowerCase() ?? "")}
					/>
				</IonToolbar>
			</IonHeader>

			<IonContent>
				{layout === "grid" ? (
					<PostGrid posts={searchResults} siteURL={inputURL} mockCount={pageAmount} />
				) : (
					<PostList posts={searchResults} siteURL={inputURL} mockCount={pageAmount} />
				)}
			</IonContent>
		</IonPage>
	)
}

export default SearchCollection
