import axios, { AxiosResponse } from 'axios';

const responseBody = <T> ( response: AxiosResponse<T> ) => response.data;

const requests = {
	get: <T>(url: string) => axios.get<T>(url).then(responseBody)
};

const Info = {
	full: (url: string) => requests.get(url + '/wp-json')
};

const agent = {
	Info
};

export default agent;
