import { useEffect, useRef, useState } from "react"
import {
	InputCustomEvent,
	InputInputEventDetail,
	IonAlert,
	IonAvatar,
	IonButton,
	IonButtons,
	IonChip,
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
	IonText,
	IonTitle,
	IonToolbar,
} from "@ionic/react"
import { earthOutline, earthSharp, homeOutline, homeSharp } from "ionicons/icons"
import { useLocation } from "react-router-dom"
import { useSettings } from "@/hooks"
import { ESelectorState } from "@/enum"
import { WordPressApi } from "@/api"
import { ReadyState } from "@/components"
import { ISite } from "@/interface"
import "@fontsource/eb-garamond"
import "./Menu.css"

const Menu: React.FC = () => {
	const location = useLocation()
	const [sites, setSites] = useSettings<ISite[]>("SitesAvailable", [])
	const [isOpen, setIsOpen] = useState(false)
	const [siteInputValue, setSiteInputValue] = useState<string>("")
	const [siteInputDetails, setSiteInputDetails] = useState<ISite | undefined>()
	const [detectionState, setDetectionState] = useState<ESelectorState>(ESelectorState.Ready)
	const searchTimeout = useRef<NodeJS.Timeout | null>(null)

	const changeForm = (event: InputCustomEvent<InputInputEventDetail>) => {
		if (event.detail.value) {
			let input = event.detail.value.toString().trim()
			try {
				// Ensure protocol for URL parsing
				if (!/^https?:\/\//i.test(input)) {
					input = "https://" + input
				}
				const url = new URL(input)
				setDetectionState(ESelectorState.Detecting)
				setSiteInputValue(url.host)
			} catch {
				setDetectionState(ESelectorState.Ready)
				setSiteInputValue("")
			}
		} else {
			setDetectionState(ESelectorState.Ready)
			setSiteInputValue("")
		}
	}

	useEffect(() => {
		if (siteInputValue !== "") {
			setSiteInputDetails(undefined)

			if (searchTimeout.current) {
				clearTimeout(searchTimeout.current)
			}

			searchTimeout.current = setTimeout(() => {
				new WordPressApi({ endpoint: `https://${siteInputValue}/wp-json` })
					.fetchInfo()
					.then((response) => {
						setDetectionState(ESelectorState.Confirmed)
						setSiteInputDetails({
							name: response.name ?? siteInputValue,
							description: response.description,
							url: siteInputValue,
							image: response.site_icon_url,
						})
					})
					.catch(() => setDetectionState(ESelectorState.Denied))
			}, 1000)
		}
	}, [siteInputValue])

	return (
		<IonMenu contentId="main" type="overlay">
			<IonContent>
				<IonList id="inbox-list">
					<IonListHeader>
						<IonLabel>
							<IonText style={{ fontFamily: '"EB Garamond", serif', fontSize: 32 }}>Pressify.</IonText>
							<IonChip color="primary" id="is-beta">
								Beta
							</IonChip>
						</IonLabel>
						<IonButton onClick={() => setIsOpen(true)}>Add</IonButton>
					</IonListHeader>
					<IonNote>WordPress App Simulator</IonNote>
					<IonItem
						className={location.pathname === "/" ? "selected" : ""}
						routerLink="/"
						routerDirection="none"
						lines="none"
						detail={false}
					>
						<IonIcon
							aria-hidden="true"
							slot="start"
							ios={homeOutline}
							md={homeSharp}
							style={{ minWidth: 36 }}
						/>
						<IonLabel>Home</IonLabel>
					</IonItem>
					{sites.map((site) => {
						return (
							<IonMenuToggle key={site.url} autoHide={false}>
								<IonItemSliding>
									<IonItem
										className={location.pathname.includes(site.url) ? "selected" : ""}
										routerLink={`/${site.url}`}
										routerDirection="none"
										lines="none"
										detail={false}
									>
										{site.image ? (
											<IonAvatar aria-hidden="true" slot="start">
												<img alt="" src={site.image} />
											</IonAvatar>
										) : (
											<IonIcon
												aria-hidden="true"
												slot="start"
												ios={earthOutline}
												md={earthSharp}
												style={{ minWidth: 36 }}
											/>
										)}
										<IonLabel>{site.name}</IonLabel>
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
										if (detectionState === ESelectorState.Confirmed && siteInputDetails) {
											setSites([...sites, siteInputDetails])
											setSiteInputValue("")
											setIsOpen(false)
										}
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
				<IonAlert
					trigger="is-beta"
					header={`Version ${process.env.REACT_APP_VERSION?.replace(/"/g, "")}`}
					message="This service is under active development. Please be aware that there may be bugs!"
					buttons={[
						"Close",
						{
							text: "Visit",
							handler: () => window?.open("https://github.com/soup-bowl/pressify", "_blank")?.focus(),
						},
					]}
				/>
			</IonContent>
		</IonMenu>
	)
}

export default Menu
