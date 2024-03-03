const dev = false;

export const API_URL = dev ? "http://localhost:3006" : "https://mtag-api.onrender.com";
export const IMAGE_PROXY = "https://easymangaproxy.sekai966.workers.dev";
export const wsrvTemplate = ({ url, q, w, s }: { url: string; q: number; w: number; s: number }) =>
	`https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${w}&q=${q}&output=webp&sharp=${s}`;
