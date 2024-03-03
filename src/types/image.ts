export interface Image {
	id: string | number;
	urls: string[];
	category?: string;
	sub?: string;
	wsrvSupport: boolean;
	isVideo?: boolean;
	aspectRatio?: number;
	url: string;
}
