import { IonButton, IonChip } from "@ionic/react"
import { ITag } from "../api"

const TagGrid: React.FC<{
	tags?: ITag[]
	prelink: string
}> = ({ tags, prelink }) => {
	if (!tags) {
		return <></>
	}

	return (
		<>
			{tags.map((tag, index) => (
				<IonButton size="small" key={index} routerLink={`/${prelink}/${tag.id}`}>
					{tag.name}
				</IonButton>
			))}
		</>
	)
}

export default TagGrid
