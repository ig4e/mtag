export const IMAGE_PROXY =
  "https://rule69-proxy.mohamed-saeed-elghamazy.workers.dev";

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
  // {
  //   value: "pornhub",
  //   iconURL: "/pornhub.png",
  //   name: "Pornhub",
  //   mediaType: "real",
  //   categories: {
  //     support: true,
  //     values: undefined,
  //   },
  //   subs: {
  //     support: false,
  //     values: undefined,
  //   },
  //   supportMediaType: false,
  // },
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
      values: [
        "furry",
        "futa",
        "yaoi",
        "yuri",
        "traps",
        "irl-3d",
        "nsfw-general",
      ],
    },
    subs: {
      support: false,
      values: undefined,
    },
    supportMediaType: false,
  },
] as const;

const sourcesObject: Record<
  (typeof sources)[number]["value"],
  (typeof sources)[number]
> = {} as never;
sources.forEach((source) => {
  sourcesObject[source.value] = source;
});

const mediaTypesObject: Record<
  (typeof mediaTypes)[number]["value"],
  (typeof mediaTypes)[number]
> = {} as never;
mediaTypes.forEach((type) => {
  mediaTypesObject[type.value] = type;
});

export { mediaTypesObject, sourcesObject };
export { proxyTemplate, wsrvTemplate } from "~/config/templates";
