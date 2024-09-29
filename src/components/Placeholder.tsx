import React from "react"
import "./Placeholder.css"

interface ContainerProps {
	name: string
	children: React.ReactNode
}

const ExploreContainer: React.FC<ContainerProps> = ({ name, children }) => {
	return (
		<div id="container">
			<strong>{name}</strong>
			{children}
		</div>
	)
}

export default ExploreContainer
