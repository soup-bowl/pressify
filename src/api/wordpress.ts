import {
	EPostType,
	ETagType,
	FetchInput,
	IInnnerConstruct,
	IPost,
	IPostCollection,
	ISearch,
	ISearchCollection,
	ISiteInfo,
	ITag,
	SearchInput,
} from "."

class WordPressApi {
	/**
	 * The base URL of the WordPress REST API.
	 */
	private readonly baseUrl: string

	/**
	 * Creates an instance of the WordPressApi.
	 * @constructor
	 * @param {Construct} options - The options to configure the WordPressApi.
	 * @param {string} options.endpoint - The base URL of the WordPress REST API.
	 */
	constructor({ endpoint }: IInnnerConstruct) {
		this.baseUrl = endpoint
	}

	/**
	 * Fetches site information from the WordPress site.
	 * @async
	 * @function
	 * @returns {Promise<ISiteInfo>} A Promise that resolves to the site information.
	 * @throws {Error} If the network response is not ok or an error occurs during the fetch.
	 */
	async fetchInfo(): Promise<ISiteInfo> {
		const url = this.baseUrl

		try {
			const response = await fetch(url)
			if (!response.ok) {
				throw new Error("Network response was not ok")
			}

			const data = await response.json()

			return data as ISiteInfo
		} catch (error) {
			console.error("Error fetching info:", error)
			throw error
		}
	}

	/**
	 * Fetches a collection of posts or pages from the WordPress site.
	 * @async
	 * @function
	 * @param {FetchInput} options - The options to configure the fetch.
	 * @param {EPostType} options.type - The type of the content to fetch (post or page).
	 * @param {number} [options.page] - The page number for pagination (default is 1).
	 * @param {number} [options.perPage] - The number of results per page (default is 12).
	 * @param {number} [options.byCategory] - The ID of the category to filter by (default is 0, no filter).
	 * @param {number} [options.byTag] - The ID of the tag to filter by (default is 0, no filter).
	 * @param {number} [options.parent] - The ID of the parent page (for hierarchical content, default is 0, no filter).
	 * @returns {Promise<IPostCollection>} A Promise that resolves to the collection of posts or pages.
	 * @throws {Error} If the network response is not ok or an error occurs during the fetch.
	 */
	async fetchPosts({
		type,
		page = 1,
		perPage = 12,
		byCategory = 0,
		byTag = 0,
		parent = 0,
	}: FetchInput): Promise<IPostCollection> {
		let arg = ""
		if (byCategory > 0) {
			arg = `&categories=${byCategory}`
		} else if (byTag > 0) {
			arg = `&tags=${byTag}`
		}
		const pnt = parent > 0 ? `&parent=${parent}` : ""
		const url = `${this.baseUrl}/wp/v2/${type === EPostType.Post ? "posts" : "pages"}?_embed=true&page=${page}&per_page=${perPage}${arg}${pnt}`

		try {
			const response = await fetch(url)
			if (!response.ok) {
				throw new Error("Network response was not ok")
			}

			const headers = response.headers
			const data = await response.json()

			return {
				posts: data as IPost[],
				pagination: {
					total: parseInt(headers.get("X-Wp-Total") ?? "0"),
					totalPages: parseInt(headers.get("X-Wp-Totalpages") ?? "0"),
				},
			}
		} catch (error) {
			console.error("Error fetching posts:", error)
			throw error
		}
	}

	/**
	 * Fetches a single post or page from the WordPress site.
	 * @async
	 * @function
	 * @param {number} id - The ID of the post or page to fetch.
	 * @param {EPostType} type - The type of the content to fetch (post or page).
	 * @returns {Promise<IPost>} A Promise that resolves to the fetched post or page.
	 * @throws {Error} If the network response is not ok or an error occurs during the fetch.
	 */
	async fetchPost(id: number, type: EPostType): Promise<IPost> {
		const url = `${this.baseUrl}/wp/v2/${type === EPostType.Post ? "posts" : "pages"}/${id}?_embed=true`

		try {
			const response = await fetch(url)
			if (!response.ok) {
				throw new Error("Network response was not ok")
			}

			const data = await response.json()

			return data as IPost
		} catch (error) {
			console.error("Error fetching post:", error)
			throw error
		}
	}

	/**
	 * Searches for posts or pages on the WordPress site based on the given search query.
	 * @async
	 * @function
	 * @param {SearchInput} options - The options to configure the search.
	 * @param {string} options.search - The search query to look for in the posts/pages.
	 * @param {number} [options.page] - The page number for pagination (default is 1).
	 * @param {number} [options.perPage] - The number of results per page (default is 12).
	 * @returns {Promise<ISearchCollection>} A Promise that resolves to the search results and pagination info.
	 * @throws {Error} If the network response is not ok or an error occurs during the fetch.
	 */
	async searchPosts({ search, page = 1, perPage = 12 }: SearchInput): Promise<ISearchCollection> {
		const url = `${this.baseUrl}/wp/v2/search?_embed=true&page=${page}&per_page=${perPage}&search=${search}`

		try {
			const response = await fetch(url)
			if (!response.ok) {
				throw new Error("Network response was not ok")
			}

			const headers = response.headers
			const data = await response.json()

			return {
				results: data as ISearch[],
				pagination: {
					total: parseInt(headers.get("X-Wp-Total") ?? "0"),
					totalPages: parseInt(headers.get("X-Wp-Totalpages") ?? "0"),
				},
			}
		} catch (error) {
			console.error("Error searching posts:", error)
			throw error
		}
	}

	/**
	 * Fetches a single tag or category from the WordPress site.
	 * @async
	 * @function
	 * @param {number} id - The ID of the tag or category to fetch.
	 * @param {ETagType} type - The type of the taxonomy term to fetch (category or tag).
	 * @returns {Promise<ITag>} A Promise that resolves to the fetched tag or category.
	 * @throws {Error} If the network response is not ok or an error occurs during the fetch.
	 */
	async fetchTag(id: number, type: ETagType): Promise<ITag> {
		const url = `${this.baseUrl}/wp/v2/${type === ETagType.Category ? "categories" : "tags"}/${id}`

		try {
			const response = await fetch(url)
			if (!response.ok) {
				throw new Error("Network response was not ok")
			}

			const data = await response.json()

			return data as ITag
		} catch (error) {
			console.error("Error fetching post:", error)
			throw error
		}
	}
}

export default WordPressApi
