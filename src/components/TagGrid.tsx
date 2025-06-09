import { IonButton } from "@ionic/react"
import { ITag } from "@/api"

const TagGrid: React.FC<{
	tags?: ITag[]
	prelink: string
}> = ({ tags, prelink }) => {
	if (!tags) {
		return <></>
	}

	return (
		<>
			{tags.map((tag) => (
				<IonButton size="small" key={tag.id} routerLink={`/${prelink}/${tag.id}`}>
					{tag.name}
				</IonButton>
			))}
		</>
	)
}

export default TagGrid
