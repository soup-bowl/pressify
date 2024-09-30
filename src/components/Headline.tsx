import { IonCol, IonGrid, IonRow, IonSkeletonText, IonText } from "@ionic/react"
import { ISiteInfo } from "../api"
import "./Headline.css"

const Headline: React.FC<{
	siteInfo?: ISiteInfo
}> = ({ siteInfo = undefined }) => {
	if (!siteInfo) {
		return (
			<>
				<IonGrid>
					<IonRow>
						<IonCol size="auto">
							<IonSkeletonText
								animated={true}
								style={{ width: "100px", height: "100px", borderRadius: 5 }}
							></IonSkeletonText>
						</IonCol>
						<IonCol>
							<IonRow>
								<IonSkeletonText
									animated={true}
									style={{ height: 30, marginTop: 20, width: "60%" }}
								></IonSkeletonText>
							</IonRow>
							<IonRow>
								<IonSkeletonText animated={true} style={{ height: 20, width: "40%" }}></IonSkeletonText>
							</IonRow>
						</IonCol>
					</IonRow>
				</IonGrid>
			</>
		)
	}

	return (
		<>
			<IonGrid>
				<IonRow>
					<IonCol size="auto">
						<img className="wp-favicon-loc" src={siteInfo.site_icon_url} />
					</IonCol>
					<IonCol>
						<IonRow>
							<h2>{siteInfo.name}</h2>
						</IonRow>
						<IonRow>
							<IonText color="medium">{siteInfo.description}</IonText>
						</IonRow>
					</IonCol>
				</IonRow>
			</IonGrid>
		</>
	)
}

export default Headline
