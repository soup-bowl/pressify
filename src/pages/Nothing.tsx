import { useEffect } from "react"
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from "@ionic/react"
import { Placeholder } from "@/components"

const Nothing: React.FC = () => {
	useEffect(() => {
		document.title = "Pressify"
	}, [])

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>No site</IonTitle>
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

export default Nothing
