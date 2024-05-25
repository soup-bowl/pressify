import { Chip, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { ITag } from "@/api"

interface TagProps {
	tags: ITag[]
	title: string
	urlFormat: string
}

export const TagGrid = ({ tags, title, urlFormat }: TagProps) => {
	const navigate = useNavigate()

	return (
		<>
			<Typography variant="h4">{title}</Typography>
			{tags.map((cat: ITag) => (
				<Chip
					key={cat.id}
					label={cat.name}
					color="secondary"
					onClick={() => navigate(`${urlFormat}/${cat.id}`)}
					sx={{ margin: 1 }}
				/>
			))}
		</>
	)
}
