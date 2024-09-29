import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { EPostType, IArticleCollection, ISiteInfo, IWPAPIError, WordPressApi } from "../api"
import { Headline, PostGrid } from "../components"
import { IonListHeader } from "@ionic/react"
import "./Overview.css"

const Overview: React.FC<{
	siteInfo?: ISiteInfo
}> = ({ siteInfo }) => {
	const { inputURL } = useParams<{ inputURL: string }>()
	const wp = new WordPressApi({ endpoint: `https://${inputURL}/wp-json` })
	const [postCollection, setPostCollection] = useState<IArticleCollection | undefined>()

	useEffect(() => {
		setPostCollection(undefined)
		Promise.all([
			wp.fetchPosts({ type: EPostType.Post, page: 1, perPage: 3 }),
			wp.fetchPosts({ type: EPostType.Page, page: 1, perPage: 3 }),
		])
			.then((values) => {
				setPostCollection({
					posts: values[0].posts,
					pages: values[1].posts,
				})
			})
			.catch((err: IWPAPIError) => {
				console.log(err)
			})
	}, [inputURL])

	return (
		<>
			<Headline siteInfo={siteInfo} />
			<IonListHeader>Posts</IonListHeader>
			<PostGrid posts={postCollection?.posts} mockCount={3} />
			<IonListHeader>Pages</IonListHeader>
			<PostGrid posts={postCollection?.pages} mockCount={3} />
		</>
	)
}

export default Overview
