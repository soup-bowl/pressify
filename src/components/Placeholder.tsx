import React from "react"
import "./Placeholder.css"

interface ContainerProps {
	name?: string
	children: React.ReactNode
}

const ExploreContainer: React.FC<ContainerProps> = ({ name = undefined, children }) => {
	return (
		<div id="container">
			{name && <strong>{name}</strong>}
			{children}
		</div>
	)
}

export default ExploreContainer
