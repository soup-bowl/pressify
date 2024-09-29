import {
	IonAlert,
	IonButton,
	IonContent,
	IonIcon,
	IonItem,
	IonItemOption,
	IonItemOptions,
	IonItemSliding,
	IonLabel,
	IonList,
	IonListHeader,
	IonMenu,
	IonMenuToggle,
	IonNote,
} from "@ionic/react"
import { earthOutline, earthSharp } from "ionicons/icons"
import { useLocation } from "react-router-dom"
import { useSettings } from "../hooks"
import "./Menu.css"

const Menu: React.FC = () => {
	const location = useLocation()
	const [sites, setSites] = useSettings<string[]>("SitesAvailable", [])

	return (
		<IonMenu contentId="main" type="overlay">
			<IonContent>
				<IonList id="inbox-list">
					<IonListHeader>
						<IonLabel>Pressify</IonLabel>
						<IonButton id="add-site">Add</IonButton>
					</IonListHeader>
					<IonNote>WordPress App Simulator</IonNote>
					{sites.map((site, index) => {
						return (
							<IonMenuToggle key={index} autoHide={false}>
								<IonItemSliding>
									<IonItem
										className={location.pathname === site ? "selected" : ""}
										routerLink={site}
										routerDirection="none"
										lines="none"
										detail={false}
									>
										<IonIcon aria-hidden="true" slot="start" ios={earthOutline} md={earthSharp} />
										<IonLabel>{site}</IonLabel>
									</IonItem>
									<IonItemOptions>
										<IonItemOption
											color="danger"
											onClick={() => setSites(sites.filter((item) => item !== site))}
										>
											Delete
										</IonItemOption>
									</IonItemOptions>
								</IonItemSliding>
							</IonMenuToggle>
						)
					})}
				</IonList>
				<IonAlert
					trigger="add-site"
					header="Add"
					buttons={[
						{
							text: "Cancel",
							role: "cancel",
						},
						{
							text: "OK",
							role: "confirm",
							handler: (e) => {
								let newSites = sites
								newSites.push(e[0])
								setSites(newSites)
							},
						},
					]}
					inputs={[{ placeholder: "Site URL" }]}
				/>
			</IonContent>
		</IonMenu>
	)
}

export default Menu
