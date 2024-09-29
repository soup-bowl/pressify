import DOMPurify from "dompurify"
import { IPost } from "../api"
import { IonSkeletonText } from "@ionic/react"
import "./Content.css"

const Content: React.FC<{
	post?: IPost
}> = ({ post = undefined }) => {
	if (!post) {
		return (
			<div className="ion-padding">
				{Array.from({ length: 8 }).map((_, index) => (
					<div className="wp-content-skeleton">
						<IonSkeletonText animated style={{ height: 16, width: "80%" }} />
						<IonSkeletonText animated style={{ height: 16, width: "80%" }} />
						<IonSkeletonText animated style={{ height: 16, width: "50%" }} />
					</div>
				))}
			</div>
		)
	}

	return (
		<div className="ion-padding">
			<div
				className="wp-content"
				dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content.rendered) }}
			/>
		</div>
	)
}

export default Content
