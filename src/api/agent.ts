import { EPostType, ETagType } from "../enums";
import { IPost, IPostCollection, ISearch, ISearchCollection, ISiteInfo, ITag } from "../interfaces";

interface Construct {
	endpoint: string;
}

class WordPressApi {
	private baseUrl: string;

	constructor({ endpoint }: Construct) {
		this.baseUrl = endpoint;
	}

	async fetchInfo(): Promise<ISiteInfo> {
		const url = this.baseUrl;

		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();

			return data as ISiteInfo;
		} catch (error) {
			console.error('Error fetching info:', error);
			throw error;
		}
	}

	async fetchPosts(type: EPostType, page: number = 1, perPage: number = 12, byCategory: number = 0, byTag: number = 0): Promise<IPostCollection> {
		const arg = (byCategory > 0) ? `&categories=${byTag}` : (byTag > 0) ? `&tags=${byTag}` : '';
		const url = `${this.baseUrl}/wp/v2/${(type === EPostType.Post ? 'posts' : 'pages')}?_embed=true&page=${page}&per_page=${perPage}${arg}`;

		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const headers = response.headers;
			const data = await response.json();

			return {
				posts: data as IPost[],
				pagination: {
					total: parseInt(headers.get('X-Wp-Total') ?? '0'),
					totalPages: parseInt(headers.get('X-Wp-Totalpages') ?? '0'),
				}
			};
		} catch (error) {
			console.error('Error fetching posts:', error);
			throw error;
		}
	}

	async fetchPost(id: number, type: EPostType): Promise<IPost> {
		const url = `${this.baseUrl}/wp/v2/${(type === EPostType.Post ? 'posts' : 'pages')}/${id}?_embed=true`;

		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();

			return data as IPost;
		} catch (error) {
			console.error('Error fetching post:', error);
			throw error;
		}
	}

	async searchPosts(search: string, page: number = 1, perPage: number = 12): Promise<ISearchCollection> {
		const url = `${this.baseUrl}/wp/v2/search?_embed=true&page=${page}&per_page=${perPage}&search=${search}`;

		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const headers = response.headers;
			const data = await response.json();

			return {
				results: data as ISearch[],
				pagination: {
					total: parseInt(headers.get('X-Wp-Total') ?? '0'),
					totalPages: parseInt(headers.get('X-Wp-Totalpages') ?? '0'),
				}
			};
		} catch (error) {
			console.error('Error searching posts:', error);
			throw error;
		}
	}

	async fetchTag(id: number, type: ETagType): Promise<ITag> {
		const url = `${this.baseUrl}/wp/v2/${(type === ETagType.Category ? 'categories' : 'tags')}/${id}`;

		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();

			return data as ITag;
		} catch (error) {
			console.error('Error fetching post:', error);
			throw error;
		}
	}
}

export default WordPressApi;
