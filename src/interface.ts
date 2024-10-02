import { IPost } from "@/api"

export interface ISite {
	name: string
	description?: string
	url: string
	image?: string
}

export type IPostExtended = IPost & ISite
