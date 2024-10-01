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
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { EPostType, ETagType, fetchSiteInfo, fetchTaxes, IPost, ISiteInfo, WordPressApi } from "@/api"
import { degubbins, getLayoutIcon } from "@/utils"
import { PostGrid, PostList } from "@/components"
import { useSettings } from "@/hooks"

const pageAmount = 12

const TaxCollection: React.FC<{
	type: EPostType
	tagType: ETagType
}> = ({ type, tagType }) => {
	const { inputURL, searchID } = useParams<{ inputURL: string; searchID: string }>()
	const [layout, setLayout] = useSettings<"grid" | "list">("displayLayout", "grid")
	const wp = new WordPressApi({ endpoint: `https://${inputURL}/wp-json` })
	const [scrollCount, setScrollCount] = useState<number>(1)

	const siteInfo = useQuery<ISiteInfo>({
		queryKey: [inputURL, "info"],
		queryFn: async () => fetchSiteInfo(wp),
	})

	const postData = useQuery<IPost[]>({
		queryKey: [inputURL, tagType.toString(), type.toString(), searchID, scrollCount],
		queryFn: async (): Promise<IPost[]> =>
			fetchTaxes(wp, type, tagType, parseInt(searchID ?? "0"), scrollCount, pageAmount, postData.data),
		placeholderData: keepPreviousData,
	})

	const toggleLayout = () => {
		if (layout === "grid") {
			setLayout("list")
		} else {
			setLayout("grid")
		}
	}

	const title = `${degubbins(siteInfo.data?.name ?? "Loading...")} ${tagType === ETagType.Category ? "category" : "tag"}`
	useEffect(() => {
		document.title = `${title} - Pressify`
	}, [siteInfo.data])

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
					<PostGrid posts={postData.data} siteURL={inputURL} mockCount={pageAmount} />
				) : (
					<PostList posts={postData.data} siteURL={inputURL} mockCount={pageAmount} />
				)}

				<IonInfiniteScroll
					onIonInfinite={(ev) => {
						setScrollCount(scrollCount + 1)
						setTimeout(() => ev.target.complete(), 500)
					}}
				>
					<IonInfiniteScrollContent />
				</IonInfiniteScroll>
			</IonContent>
		</IonPage>
	)
}

export default TaxCollection
