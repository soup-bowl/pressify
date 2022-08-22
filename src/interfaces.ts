export interface ISiteInformation {
	name: string;
	description?: string;
	url: string;
	hasPages: boolean;
	hasPosts: boolean;
}

export interface IEmbed {
	author?: IUser[];
	'wp:featuredmedia'?: IMedia[];
}

export interface IPost {
	id: number;
	title: IPostRendered;
	excerpt: IPostRendered;
	content: IPostRendered;
	author: number;
	type: string;
	modified: Date;
	created: Date;
	link?: string;
	categories?: number[];
	tags?: number[];
	_embedded?: IEmbed; 
}

export interface ISearch {
	id: number;
	title: string;
	url: string;
	type: string;
	subtype: string;
	_embedded: ISearchEmbed;
}

export interface ISearchEmbed {
	self: IPost[];
}

export interface IUser {
	id: number;
	name: string;
	description: string;
	link: string;
}

export interface IMedia {
	id: number;
	title: IPostRendered;
	mime_type: string;
	media_details: IMediaDetails;
}

export interface IMediaDetails {
	file: string;
	sizes: IMediaSizes;
}

export interface IMediaSizes {
	small?: IMediaSize;
	medium?: IMediaSize;
	large?: IMediaSize;
	full: IMediaSize;
}

export interface IMediaSize {
	file: string;
	mime_type: string;
	source_url: string;
}

export interface IPostRendered {
	rendered: string;
	protected?: boolean;
}

export interface IStorage {
	quota: number;
	usage: number;
}
