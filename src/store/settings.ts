import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface SettingsState {
	hideOnScroll: "none" | "navbar" | "footer" | "all";
	sfw: boolean;
	source: "rule34" | "reddit" | "realbooru" | "gelbooru" | "hanimetv";
	mediaType: "hentai" | "real";
	categories: string[];
	blur: "off" | "soft" | "overcensorship";
	imageOptimizations: {
		sharpness: number;
		enabled: boolean;
		enabledInPreview: boolean;
		quailty: number;
		previewQuailty: number;
		allowGifs: boolean;
	};
	videoOptimizations: {
		autoplay: boolean;
		muted: boolean;
	};
}

interface SettingsStateActions {
	setSfw: (sfw: SettingsState["sfw"]) => void;
	setHideOnScroll: (hideOnScroll: SettingsState["hideOnScroll"]) => void;
	setMediaType: (mediaType: SettingsState["mediaType"]) => void;
	setCategories: (source: SettingsState["categories"]) => void;
	addCategory: (category: string) => void;
	removeCategory: (category: string) => void;
	clearCategories: () => void;
	setBlurLevel: (level: SettingsState["blur"]) => void;
	setSource: (source: SettingsState["source"]) => void;
	setImageOptimizationAllowGifs: (enable: boolean) => void;
	setImageOptimizations: (enable: boolean) => void;
	setImageOptimizationQuailty: (quality: number) => void;
	setImageOptimizationSharpness: (sharpness: number) => void;
	setImageOptimizationsInPreview: (enable: boolean) => void;
	setImageOptimizationQuailtyInPreview: (quality: number) => void;
	setVideoOptimizations: (options: Partial<SettingsState["videoOptimizations"]>) => void;
}

type SettingsStateWActions = SettingsState & SettingsStateActions;

export const useSettings = create<SettingsStateWActions>()(
	persist(
		immer((set) => ({
			sfw: true,
			hideOnScroll: "all",
			source: "realbooru",
			mediaType: "real",
			categories: [],
			blur: "soft",

			videoOptimizations: {
				autoplay: false,
				muted: true,
			},

			imageOptimizations: {
				enabled: true,
				enabledInPreview: true,
				allowGifs: true,
				quailty: 50,
				previewQuailty: 80,
				sharpness: 1,
			},

			setVideoOptimizations(options) {
				set((state) => {
					state.videoOptimizations = { ...state.videoOptimizations, ...options };
				});
			},

			setImageOptimizationAllowGifs(allow) {
				set((state) => {
					state.imageOptimizations.allowGifs = allow;
				});
			},

			setHideOnScroll(hideOnScroll) {
				set((state) => {
					state.hideOnScroll = hideOnScroll;
				});
			},

			setImageOptimizationQuailty(quality) {
				if (quality > 100) quality = 100;
				if (quality < 1) quality = 1;

				set((state) => {
					state.imageOptimizations.quailty = quality;
				});
			},

			setImageOptimizationSharpness(sharpness) {
				set((state) => {
					state.imageOptimizations.sharpness = sharpness;
				});
			},

			setImageOptimizationQuailtyInPreview(quality) {
				if (quality > 100) quality = 100;
				if (quality < 1) quality = 1;

				set((state) => {
					state.imageOptimizations.previewQuailty = quality;
				});
			},

			setImageOptimizations(enable) {
				set((state) => {
					state.imageOptimizations.enabled = enable;
				});
			},

			setImageOptimizationsInPreview(enable) {
				set((state) => {
					state.imageOptimizations.enabledInPreview = enable;
				});
			},

			setCategories(categories) {
				set((state) => {
					state.categories = categories;
				});
			},

			addCategory(category) {
				set((state) => {
					state.categories = Array.from(new Set([...state.categories, category]));
				});
			},

			removeCategory(category) {
				set((state) => {
					state.categories = state.categories.filter((cate) => cate !== category);
				});
			},

			clearCategories() {
				set((state) => {
					state.categories = [];
				});
			},

			setMediaType(mediaType) {
				set((state) => {
					state.mediaType = mediaType;
				});
			},
			setSfw(sfw) {
				set((state) => {
					state.sfw = sfw;
				});
			},
			setBlurLevel(level) {
				set((state) => {
					state.blur = level;
				});
			},

			setSource(source) {
				set((state) => {
					state.source = source;
				});
			},
		})),
		{
			name: "settings-v3",
		},
	),
);
