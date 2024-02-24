import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface SettingsState {
	sfw: boolean;
	source: "reddit" | "rule34";
	mediaType: "hentai" | "real";
	categories: string[];
	blur: "off" | "soft" | "overcensorship";
	imageOptimizations: boolean;
	imageOptimizationQuailty: number;
}

interface SettingsStateActions {
	setSfw: (sfw: SettingsState["sfw"]) => void;
	setMediaType: (mediaType: SettingsState["mediaType"]) => void;
	setCategories: (source: SettingsState["categories"]) => void;
	addCategory: (category: string) => void;
	removeCategory: (category: string) => void;
	clearCategories: () => void;
	setBlurLevel: (level: SettingsState["blur"]) => void;
	setSource: (source: SettingsState["source"]) => void;
	setImageOptimizations: (enable: boolean) => void;
	setImageOptimizationQuailty: (quality: number) => void;
}

type SettingsStateWActions = SettingsState & SettingsStateActions;

export const useSettings = create<SettingsStateWActions>()(
	persist(
		immer((set) => ({
			sfw: true,
			source: "reddit",
			mediaType: "real",
			categories: [],
			blur: "off",
			imageOptimizations: true,
			imageOptimizationQuailty: 50,

			setImageOptimizationQuailty(quality) {
				if (quality > 100) quality = 100;
				if (quality < 1) quality = 1;

				set((state) => {
					state.imageOptimizationQuailty = quality;
				});
			},

			setImageOptimizations(enable) {
				set((state) => {
					state.imageOptimizations = enable;
				});
			},

			setCategories(categories) {
				set((state) => {
					state.categories = categories;
				});
			},

			addCategory(category) {
				set((state) => {
					state.categories = Array.from(new Set(...state.categories, category));
				});
			},

			removeCategory(category) {
				set((state) => {
					state.categories = state.categories.filter((cate) => cate === category);
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
			name: "settings",
		},
	),
);
