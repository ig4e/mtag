const dev = false;

export const API_URL = dev ? "http://localhost:3006" : "https://mtag-api.onrender.com";
export const IMAGE_PROXY = "https://rule69-proxy.mohamed-saeed-elghamazy.workers.dev";
export const wsrvTemplate = ({ url, q, w, s, n }: { url: string; q: number; w: number; s: number; n: 1 | -1 }) =>
	`https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${w}&q=${q}&output=webp&sharp=${s}&n=${n}`;
export const proxyTemplate = ({ url, referer }: { url: string; referer: string }) =>
	`${IMAGE_PROXY}/?url=${encodeURIComponent(url)}&referer=${referer}`;
