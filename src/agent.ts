import axios, { AxiosResponse } from 'axios';
import { IPost } from './interfaces';

const responseBody = <T> ( response: AxiosResponse<T> ) => response.data;

const requests = {
	get: <T>(url: string) => axios.get<T>(url).then(responseBody)
};

const Info = {
	full: (url: string) => requests.get(url + '/wp-json')
};

const Posts = {
	list: (url: string, pages:boolean = false) => requests.get<IPost[]>(url + '/wp-json/wp/v2/' + ((pages) ? 'pages' : 'posts')),
	individual: (url: string, page:number, pages:boolean = false) => requests.get<IPost>(url + '/wp-json/wp/v2/' + ((pages) ? 'pages' : 'posts') + '/' + page)
}

const agent = {
	Info,
	Posts
};

export default agent;
