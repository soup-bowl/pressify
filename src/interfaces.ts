export interface ISiteInformation {
	name: string;
	url: string;
	hasPages: boolean;
	hasPosts: boolean;
}

export interface IPost {
	id: number;
	title: IPostRendered;
	excerpt: IPostRendered;
	content: IPostRendered;
	author: number;
	modified: Date;
	created: Date;
	link: string;
	categories: number[];
	tags: number[];
}

export interface IPostRendered {
	rendered: string;
	protected?: boolean;
}

export interface IStorage {
	quota: number;
	usage: number;
}
