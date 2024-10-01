import WordPressApi from "./wordpress"
import { EPostType, ETagType } from "./enums"
import { IArticleCollection, IPost, ISiteInfo } from "./interfaces"

export const fetchSiteInfo = async (wp: WordPressApi): Promise<ISiteInfo> => {
	const response = await wp.fetchInfo()
	return {
		name: response.name ?? "N/A",
		description: response.description ?? "",
		site_icon_url: response.site_icon_url,
		url: response.url,
		namespaces: response.namespaces,
	}
}

export const fetchOverview = async (wp: WordPressApi): Promise<IArticleCollection> => {
	const [postsResponse, pagesResponse] = await Promise.all([
		wp.fetchPosts({ type: EPostType.Post, page: 1, perPage: 3 }),
		wp.fetchPosts({ type: EPostType.Page, page: 1, perPage: 3 }),
	])
	return {
		posts: postsResponse.posts,
		pages: pagesResponse.posts,
	}
}

export const fetchPosts = async (
	wp: WordPressApi,
	type: EPostType,
	page: number,
	per: number,
	existing: IPost[] = []
): Promise<IPost[]> => {
	const data = await wp.fetchPosts({ type: type, page: page, perPage: per })
	return [...existing, ...data.posts]
}

export const fetchTaxes = async (
	wp: WordPressApi,
	type: EPostType,
	tagType: ETagType,
	taxID: number,
	page: number,
	per: number,
	existing: IPost[] = []
): Promise<IPost[]> => {
	const data = await wp.fetchPosts({
		type: type,
		page: page,
		perPage: per,
		byCategory: tagType === ETagType.Category ? taxID : undefined,
		byTag: tagType === ETagType.Tag ? taxID : undefined,
	})
	return [...existing, ...data.posts]
}

export const searchPosts = async (wp: WordPressApi, searchString: string, per: number): Promise<IPost[]> => {
	const data = await wp.searchPosts({ search: searchString, page: 1, perPage: per })
	const collection: IPost[] = []
	data.results.forEach((e) => collection.push(e._embedded.self[0]))
	return collection
}

export const fetchContent = async (wp: WordPressApi, postID: number, type: EPostType): Promise<IPost> => {
	return await wp.fetchPost(postID, type)
}
