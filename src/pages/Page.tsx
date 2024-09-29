import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from "@ionic/react"
import { useParams } from "react-router"
import { createContext, useEffect, useState } from "react"
import { ISiteInfo, WordPressApi } from "../api"
import { Overview } from "."
import "./Page.css"

export const WordPressContext = createContext(new WordPressApi({ endpoint: "" }))

const Page: React.FC = () => {
	const { inputURL } = useParams<{ inputURL: string }>()
	const wp = new WordPressApi({ endpoint: `https://${inputURL}/wp-json` })
	const [mainInfo, setMainInfo] = useState<ISiteInfo | undefined>()

	useEffect(() => {
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
	}, [inputURL])

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>{inputURL}</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen>
				{/* <ExploreContainer name={inputURL} /> */}
				<Overview siteInfo={mainInfo} />
			</IonContent>
		</IonPage>
	)
}

export default Page
