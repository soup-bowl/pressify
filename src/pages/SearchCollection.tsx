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
import { useQuery } from "@tanstack/react-query"
import { fetchSiteInfo, IPost, ISiteInfo, searchPosts, WordPressApi } from "@/api"
import { getLayoutIcon } from "@/utils"
import { PostGrid, PostList } from "@/components"
import { useSettings } from "@/hooks"

const pageAmount = 12

const SearchCollection: React.FC = () => {
	const { inputURL } = useParams<{ inputURL: string }>()
	const [layout, setLayout] = useSettings<"grid" | "list">("displayLayout", "grid")
	const wp = new WordPressApi({ endpoint: `https://${inputURL}/wp-json` })
	const [searchTerms, setSearchTerms] = useState<string>("")

	const siteInfo = useQuery<ISiteInfo>({
		queryKey: [`${inputURL}Info`],
		queryFn: async () => fetchSiteInfo(wp),
	})

	const postData = useQuery<IPost[]>({
		queryKey: [`${inputURL}search`, searchTerms],
		queryFn: async () => searchPosts(wp, searchTerms, pageAmount),
	})

	const toggleLayout = () => {
		if (layout === "grid") {
			setLayout("list")
		} else {
			setLayout("grid")
		}
	}

	const title = `Searching ${siteInfo.data?.name} for "${searchTerms}"`
	useEffect(() => {
		document.title = `${title} - Pressify`
	}, [siteInfo.data])

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
					<PostGrid posts={postData.data} siteURL={inputURL} mockCount={pageAmount} />
				) : (
					<PostList posts={postData.data} siteURL={inputURL} mockCount={pageAmount} />
				)}
			</IonContent>
		</IonPage>
	)
}

export default SearchCollection
