import axios, { AxiosResponse } from 'axios';
import { IPost, ISearch, ISiteInfo } from './interfaces';

const responseBody = <T> ( response: AxiosResponse<T> ) => response.data;

const requests = {
	get: <T>(url: string) => axios.get<T>(url).then(responseBody)
};

export const WPMain = {
	info: (url: string) => requests.get<ISiteInfo>(url + '/wp-json'),
	search: (url: string, search: string) => requests.get<ISearch[]>(
		`${url}/wp-json/wp/v2/search?search=${search}&_embed=self`
	)
};

export const WPPosts = {
	getOne: (url: string, page:number, pages:boolean = false) => requests.get<IPost>(
		url + '/wp-json/wp/v2/' + ((pages) ? 'pages' : 'posts') + '/' + page
		+ '?_embed=author,wp:featuredmedia'
		//+ '&_fields=id,title,content,author,link,categories,tags,embedded'
	),
	getMany: (url: string, pages:boolean = false, no_per_page:number = -1) => requests.get<IPost[]>(
		url + '/wp-json/wp/v2/' + ((pages) ? 'pages' : 'posts')
		+ '?_embed=wp:featuredmedia'
		+ ((no_per_page >= 0) ? `&per_page=${no_per_page}` : '')
		//+ '&_fields=id,title,excerpt,author,link,embedded'
	)
}
