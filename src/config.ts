const dev = process.env.NODE_ENV === "development";
const cluster = true ? "cyclic" : "render";

export const API_URL = dev ? "http://localhost:3006" : cluster === "render" ? "https://mtag-api.onrender.com" : "https://good-jade-chimpanzee-tutu.cyclic.app";
export const IMAGE_PROXY = "https://rule69-proxy.mohamed-saeed-elghamazy.workers.dev";
export const wsrvTemplate = ({ url, q, w, s, n, out }: { url: string; q: number; w: number; s: number; n: 1 | -1; out: "webp" | "jpg" | "png" }) =>
	`https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${w}&q=${q}&output=${out}${s > 0 ? `&sharp=${s}` : ``}&n=${n}`;
export const proxyTemplate = ({ url, referer }: { url: string; referer: string }) =>
	`${IMAGE_PROXY}/?url=${encodeURIComponent(url)}&referer=${referer}`;

export const hideOnScrollOptions = [
	{ value: "none", name: "None" },
	{ value: "navbar", name: "Navbar only" },
	{ value: "footer", name: "Footer only" },
	{ value: "all", name: "Navbar & Footer" },
];

export const censorOptions = [
	{ value: "off", name: "Off (HF <3)" },
	{ value: "soft", name: "Soft (GL :>)" },
	{ value: "overcensorship", name: "Overcensorship (Why?)" },
];

export const sharpnessOptions = [
	{ value: "0", name: "Off" },
	{ value: "1", name: "Soft" },
	{ value: "2", name: "Meduim" },
	{ value: "3", name: "Sharp" },
	{ value: "4", name: "Overdrive" },
];

export const mediaTypes = [
	{ value: "real", name: "Real" },
	{ value: "hentai", name: "Hentai" },
];

export const sources = [
	{
		name: "Reddit",
		iconURL: "/reddit.png",
		value: "reddit",
		mediaType: "all",
		categories: {
			support: false,
			values: undefined,
		},
		subs: {
			support: true,
			values: [
				"hentai",
				"FemboyHentai",
				"FemboysAndHentai",
				"CuteTraps",
				"fubukiNSFW",
				"thighhighs",
				"boobs",
				"SchoolGirlSkirts",
				"ThickThighs",
				"Nudes",
				"BustyPetite",
				"PUBLICNUDITY",
				"ArianaGrandeLewd",
				"femboy",
				"RealGirls_SFW",
				"Hentai_SFW",
				"gymgirlsSFW",
				"OpenShirtSFW",
				"Bikini_BabesSFW",
				"Nekomimi",
				"CuteAsianGirlsSFW",
				"sfwpetite",
				"SFW_CF_BoobsTogether",
				"SFWsoftcore",
				"SFWButts",
				"CatgirlSFW",
				"SFWcurvy",
				"ClothedForPrejacs",
				"GirlsfrontlineSFW",
			],
		},
		supportMediaType: true,
	},
	{
		name: "Rule34",
		iconURL: "/rule34.ico",
		value: "rule34",
		mediaType: "hentai",
		categories: {
			support: true,
			values: undefined,
		},
		subs: {
			support: false,
			values: undefined,
		},
		supportMediaType: false,
	},
	{
		name: "Gelbooru",
		iconURL: "/gelbooru.png",
		value: "gelbooru",
		mediaType: "hentai",
		categories: {
			support: true,
			values: undefined,
		},
		subs: {
			support: false,
			values: undefined,
		},
		supportMediaType: false,
	},
	{
		value: "pornhub",
		iconURL: "/pornhub.png",
		name: "Pornhub",
		mediaType: "real",
		categories: {
			support: true,
			values: undefined,
		},
		subs: {
			support: false,
			values: undefined,
		},
		supportMediaType: false,
	},
	{
		value: "realbooru",
		iconURL: "/rb.ico",
		name: "Realbooru (Real 34)",
		mediaType: "real",
		categories: {
			support: true,
			values: undefined,
		},
		subs: {
			support: false,
			values: undefined,
		},
		supportMediaType: false,
	},
	{
		name: "Hanime.tv",
		iconURL: "/hanimetv.png",
		value: "hanimetv",
		mediaType: "all",
		categories: {
			support: true,
			values: ["furry", "futa", "yaoi", "yuri", "traps", "irl-3d", "nsfw-general"],
		},
		subs: {
			support: false,
			values: undefined,
		},
		supportMediaType: false,
	},
] as const;

const sourcesObject: { [index: string]: (typeof sources)[number] } = {};
sources.forEach((source) => {
	sourcesObject[source.value] = source;
});

const mediaTypesObject: { [index: string]: (typeof mediaTypes)[number] } = {};
mediaTypes.forEach((type) => {
	mediaTypesObject[type.value] = type;
});

export { sourcesObject, mediaTypesObject };
