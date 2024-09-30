import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from "@ionic/react"
import { useParams } from "react-router"
import { useEffect, useState } from "react"
import { EPostType, IPost, ISiteInfo, WordPressApi } from "../api"
import { degubbins } from "../utils"
import { PostGrid } from "../components"

const pageAmount = 12

const SearchCollection: React.FC = () => {
	const { inputURL, searchTerms, pageNumber } = useParams<{
		inputURL: string
		searchTerms: string
		pageNumber: string
	}>()
	const wp = new WordPressApi({ endpoint: `https://${inputURL}/wp-json` })
	const [mainInfo, setMainInfo] = useState<ISiteInfo | undefined>()
	const [searchResults, setSearchResults] = useState<IPost[] | undefined>()

	useEffect(() => {
		setSearchResults(undefined)
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

		wp.searchPosts({ search: searchTerms ?? "", page: parseInt(pageNumber ?? "1"), perPage: pageAmount })
			.then((response) => {
				const collection: IPost[] = []
				response.results.forEach((e) => collection.push(e._embedded.self[0]))
				setSearchResults(collection)
			})
			.catch((err) => console.log(err))
	}, [inputURL])

	const title = `${degubbins(mainInfo?.name ?? "Loading...")} search`
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

				<PostGrid posts={searchResults} siteURL={inputURL} mockCount={pageAmount} />
			</IonContent>
		</IonPage>
	)
}

export default SearchCollection
