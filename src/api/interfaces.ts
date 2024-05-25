// Interaction Interfaces

import { EPostType } from "."

export interface IInnnerConstruct {
	endpoint: string
}

export interface IndexableInput {
	page?: number
	perPage?: number
	byCategory?: number
	byTag?: number
}

export interface FetchInput extends IndexableInput {
	type: EPostType
	parent?: number
}

export interface SearchInput extends IndexableInput {
	search: string
}

// Data Interfaces

export interface IWPAPIError {
	code: string
	message: string
}

export interface ISiteInfo {
	name: string
	description: string
	url: string
	namespaces: string[]
	site_logo?: string
	site_icon?: string
	site_icon_url?: string
	_embedded?: IEmbed
}

export interface IEmbed {
	author?: IUser[]
	"wp:featuredmedia"?: IMedia[]
	"wp:term"?: ITag[][]
}

export interface IPost {
	id: number
	title: IPostRendered
	excerpt: IPostRendered
	content: IPostRendered
	author: number
	type: string
	modified: string
	created: string
	parent?: number
	link?: string
	categories?: number[]
	tags?: number[]
	_embedded?: IEmbed
}

export interface ITag {
	id: number
	name: string
	slug: string
	link: string
	taxonomy: string
}

export interface ISearch {
	id: number
	title: string
	url: string
	type: string
	subtype: string
	_embedded: ISearchEmbed
}

export interface ISearchEmbed {
	self: IPost[]
}

export interface IUser {
	id: number
	name: string
	description: string
	avatar_urls?: IAvatar
	link: string
}

export interface IAvatar {
	"24"?: string
	"48"?: string
	"96"?: string
}

export interface IMedia {
	id: number
	title: IPostRendered
	mime_type: string
	media_details: IMediaDetails
}

export interface IMediaDetails {
	file: string
	sizes: IMediaSizes
}

export interface IMediaSizes {
	small?: IMediaSize
	medium?: IMediaSize
	large?: IMediaSize
	full: IMediaSize
}

export interface IMediaSize {
	file: string
	mime_type: string
	source_url: string
}

export interface IPostRendered {
	rendered: string
	protected?: boolean
}

export interface IStorage {
	quota: number
	usage: number
}

export interface IWPIndexing {
	total: number
	totalPages: number
}

export interface IWPIndexingLinks {
	next: string
}

export interface IPostCollection {
	posts: IPost[]
	pagination: IWPIndexing
}

export interface ISearchCollection {
	results: ISearch[]
	pagination: IWPIndexing
}

export interface IArticleCollection {
	posts: IPost[]
	pages: IPost[]
}
