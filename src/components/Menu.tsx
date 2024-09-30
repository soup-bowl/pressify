import { ChangeEvent, useEffect, useRef, useState } from "react"
import {
	InputCustomEvent,
	InputInputEventDetail,
	IonAlert,
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonItemOption,
	IonItemOptions,
	IonItemSliding,
	IonLabel,
	IonList,
	IonListHeader,
	IonMenu,
	IonMenuToggle,
	IonModal,
	IonNote,
	IonTitle,
	IonToolbar,
} from "@ionic/react"
import { earthOutline, earthSharp } from "ionicons/icons"
import { useLocation } from "react-router-dom"
import { useSettings } from "../hooks"
import { ESelectorState } from "../enum"
import "./Menu.css"
import { WordPressApi } from "../api"
import ReadyState from "./ReadyState"

const Menu: React.FC = () => {
	const location = useLocation()
	const [sites, setSites] = useSettings<string[]>("SitesAvailable", [])
	const [isOpen, setIsOpen] = useState(false)
	const [siteInputValue, setSiteInputValue] = useState<string>("")
	const [detectionState, setDetectionState] = useState<ESelectorState>(ESelectorState.Ready)
	const searchTimeout = useRef<NodeJS.Timeout | null>(null)

	const changeForm = (event: InputCustomEvent<InputInputEventDetail>) => {
		if (event.detail.value) {
			// Thanks to https://stackoverflow.com/a/31941978.
			const parsedInput = event.detail.value.toString().match(/([^/,\s]+\.[^/,\s]+?)(?=\/|,|\s|$|\?|#)/g)
			setDetectionState(ESelectorState.Detecting)
			setSiteInputValue(parsedInput !== null ? parsedInput[0] : "")
		} else {
			setDetectionState(ESelectorState.Ready)
			setSiteInputValue("")
		}
	}

	useEffect(() => {
		if (siteInputValue !== "") {
			if (searchTimeout.current) {
				clearTimeout(searchTimeout.current)
			}

			searchTimeout.current = setTimeout(() => {
				new WordPressApi({ endpoint: `https://${siteInputValue}/wp-json` })
					.fetchInfo()
					.then(() => setDetectionState(ESelectorState.Confirmed))
					.catch(() => setDetectionState(ESelectorState.Denied))
			}, 1000)
		}
	}, [siteInputValue])

	return (
		<IonMenu contentId="main" type="overlay">
			<IonContent>
				<IonList id="inbox-list">
					<IonListHeader>
						<IonLabel>Pressify</IonLabel>
						<IonButton onClick={() => setIsOpen(true)}>Add</IonButton>
					</IonListHeader>
					<IonNote>WordPress App Simulator</IonNote>
					{sites.map((site, index) => {
						return (
							<IonMenuToggle key={index} autoHide={false}>
								<IonItemSliding>
									<IonItem
										className={location.pathname.includes(site) ? "selected" : ""}
										routerLink={`/${site}`}
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

				<IonModal isOpen={isOpen}>
					<IonHeader>
						<IonToolbar>
							<IonButtons slot="start">
								<IonButton onClick={() => setIsOpen(false)}>Close</IonButton>
							</IonButtons>
							<IonTitle>Add Site</IonTitle>
							<IonButtons slot="end">
								<IonButton
									strong
									onClick={() => {
										setSites([...sites, siteInputValue])
										setSiteInputValue("")
										setIsOpen(false)
									}}
									disabled={detectionState !== ESelectorState.Confirmed}
								>
									Save
								</IonButton>
							</IonButtons>
						</IonToolbar>
					</IonHeader>
					<IonContent className="ion-padding">
						<p>
							Add a WordPress site to the list. We will try to detect if the site has a valid and open
							WordPress REST API that we can use.
						</p>
						<IonList inset={true}>
							<IonItem>
								<IonInput
									type="url"
									label="URL"
									placeholder="https://wordpress.com"
									onIonInput={changeForm}
								/>
							</IonItem>
						</IonList>
						<ReadyState state={detectionState} />
					</IonContent>
				</IonModal>
			</IonContent>
		</IonMenu>
	)
}

export default Menu
