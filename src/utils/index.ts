import { IPost } from "@/api"
import { IPostExtended } from "@/interface"

export { degubbins, getLayoutIcon } from "./stringUtils"

export const isPostExtended = (post: IPost | IPostExtended): post is IPostExtended => {
	return (post as IPostExtended).image !== undefined
}
