import axios, { AxiosResponse } from 'axios';
import { IPost, ISearch } from './interfaces';

const responseBody = <T> ( response: AxiosResponse<T> ) => response.data;

const requests = {
	get: <T>(url: string) => axios.get<T>(url).then(responseBody)
};

const Info = {
	full: (url: string) => requests.get(url + '/wp-json')
};

const Posts = {
	list: (url: string, pages:boolean = false, no_per_page:number = -1) => requests.get<IPost[]>(
		url + '/wp-json/wp/v2/' + ((pages) ? 'pages' : 'posts')
		+ '?_embed=wp:featuredmedia'
		+ ((no_per_page >= 0) ? `&per_page=${no_per_page}` : '')
		//+ '&_fields=id,title,excerpt,author,link,embedded'
	),
	individual: (url: string, page:number, pages:boolean = false) => requests.get<IPost>(
		url + '/wp-json/wp/v2/' + ((pages) ? 'pages' : 'posts') + '/' + page
		+ '?_embed=author,wp:featuredmedia'
		//+ '&_fields=id,title,content,author,link,categories,tags,embedded'
	),
	search: (url: string, search: string) => requests.get<ISearch[]>(
		`${url}/wp-json/wp/v2/search?search=${search}&_embed=self`
	)
}

const agent = {
	Info,
	Posts
};

export default agent;
