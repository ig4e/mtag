import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsState, useSettings } from "@/store/settings";
import { AdjustmentsVerticalIcon } from "@heroicons/react/24/solid";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RSelect } from "./ui/r-select";
import { Switch } from "./ui/switch";

const censorOptions = [
	{ value: "off", name: "Off (HF <3)" },
	{ value: "soft", name: "Soft (GL :>)" },
	{ value: "overcensorship", name: "Overcensorship (Why?)" },
];

const mediaTypes = [
	{ value: "real", name: "Good stuff" },
	{ value: "hentai", name: "Creepy weeb" },
];

const sources = [
	{
		value: "reddit",
		name: "Reddit",
		mediaType: "all",
		categories: {
			support: false,
			values: undefined,
		},
		supportMediaType: true,
	},
	{
		value: "rule34",
		name: "Rule34",
		mediaType: "hentai",
		categories: {
			support: true,
			values: undefined,
		},
		supportMediaType: false,
	},
	{
		value: "gelbooru",
		name: "Gelbooru",
		mediaType: "hentai",
		categories: {
			support: true,
			values: undefined,
		},
		supportMediaType: false,
	},
	{
		value: "realbooru",
		name: "Realbooru (Real 34)",
		mediaType: "real",
		categories: {
			support: true,
			values: undefined,
		},
		supportMediaType: false,
	},
	{
		value: "hanimetv",
		name: "Hanime.tv",
		mediaType: "all",
		categories: {
			support: true,
			values: ["furry", "futa", "yaoi", "yuri", "traps", "irl-3d"],
		},
		supportMediaType: false,
	},
] as const;

const sourcesAsObject: { [index: string]: (typeof sources)[number] } = {};
sources.forEach((source) => {
	sourcesAsObject[source.value] = source;
});

function Footer() {
	const settings = useSettings();
	const [categories, setCategories] = useState<string>();
	const debouncedCategories = useDebounce(categories, 500);

	useEffect(() => {
		if (settings.source) {
			const sourceSettings = sourcesAsObject[settings.source];
			setCategories("");

			if (sourceSettings.mediaType !== "all") {
				settings.setMediaType(sourceSettings.mediaType);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [settings.source]);

	useEffect(() => {
		if (debouncedCategories) {
			settings.setCategories(debouncedCategories.split(","));
		} else {
			settings.setCategories([]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedCategories]);

	useEffect(() => {
		if (settings.categories.length >= 1) setCategories(settings.categories.join(","));
	}, [settings.categories]);

	useEffect(() => {
		window.scrollTo({ top: 0 });
	}, [settings.categories, settings.mediaType, settings.source, settings.sfw]);

	const sourceSettings = sourcesAsObject[settings.source];

	return (
		<>
			<footer className="z-[30] py-3 bg-background drop-shadow-md backdrop-blur-xl fixed bottom-0 inset-x-0 border-t border-border">
				<div className="container mx-auto flex items-center justify-between gap-4">
					<Tabs
						onValueChange={(value) => {
							settings.setSfw(value === "sfw");
						}}
						value={settings.sfw ? "sfw" : "nsfw"}
						className="w-full"
					>
						<TabsList className="w-full">
							<TabsTrigger value="sfw" className="w-full">
								SFW
							</TabsTrigger>
							<TabsTrigger value="nsfw" className="w-full">
								NSFW
							</TabsTrigger>
						</TabsList>
					</Tabs>

					<Drawer>
						<DrawerTrigger asChild>
							<Button variant={"accent"} size={"icon"}>
								<AdjustmentsVerticalIcon className="w-5 h-5" />
							</Button>
						</DrawerTrigger>
						<DrawerContent>
							<DrawerHeader>
								<DrawerTitle>Settings</DrawerTitle>
								<DrawerDescription>You can use filters here.</DrawerDescription>
							</DrawerHeader>

							<div className="p-4 space-y-4">
								<div className="space-y-2">
									<Label htmlFor="mediaType">Source</Label>
									<Select
										onValueChange={(value) => settings.setSource(value as SettingsState["source"])}
										value={settings.source}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Source" />
										</SelectTrigger>
										<SelectContent>
											{sources.map(({ name, value }) => {
												return (
													<SelectItem value={value} key={value}>
														{name}
													</SelectItem>
												);
											})}
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="mediaType">
										Media Type {sourceSettings.mediaType !== "all" ? "(Not supported)" : ""}
									</Label>
									<Select
										disabled={sourceSettings.mediaType !== "all"}
										onValueChange={(value) => settings.setMediaType(value as SettingsState["mediaType"])}
										value={settings.mediaType}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Media Type" />
										</SelectTrigger>
										<SelectContent>
											{mediaTypes.map(({ name, value }) => {
												return (
													<SelectItem value={value} key={value}>
														{name}
													</SelectItem>
												);
											})}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="category">Category {!sourceSettings.categories.support ? "(Not supported)" : ""}</Label>
									<div className="flex items-center gap-2">
										{sourceSettings.categories.values ? (
											<RSelect
												onChange={(n) => setCategories((n as { value: string }[]).map((c) => c.value).join(","))}
												className="w-full"
												isMulti
												options={sourceSettings.categories.values.map((value) => ({ label: value, value }))}
												value={settings.categories.map((value) => ({ label: value, value }))}
											></RSelect>
										) : (
											<Input
												disabled={!sourceSettings.categories.support}
												placeholder="anal,big boobs"
												onChange={(e) => setCategories(e.target.value!)}
												value={categories}
												type="text"
											></Input>
										)}

										<Button
											onClick={() => setCategories("")}
											size={"sm"}
											variant={"destructive"}
											disabled={!sourceSettings.categories.support}
										>
											Clear
										</Button>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="censor">Censor</Label>
									<Select
										onValueChange={(value) => settings.setBlurLevel(value as SettingsState["blur"])}
										value={settings.blur}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Censor" />
										</SelectTrigger>
										<SelectContent>
											{censorOptions.map(({ name, value }) => {
												return (
													<SelectItem value={value} key={value}>
														{name}
													</SelectItem>
												);
											})}
										</SelectContent>
									</Select>
								</div>

								<div className="flex flex-col gap-2">
									<div className="flex items-center justify-between gap-4">
										<Label htmlFor="image-optimizations">Use Image Optimizations</Label>
										<Switch
											checked={settings.imageOptimizations.enabled}
											onCheckedChange={(value) => settings.setImageOptimizations(value)}
										/>
									</div>

									{settings.imageOptimizations && (
										<div className="space-y-2">
											<Label htmlFor="image-optimizations" className="text-sm">
												Image Quality
											</Label>
											<Select
												onValueChange={(value) => settings.setImageOptimizationQuailty(Number(value))}
												value={String(settings.imageOptimizations.quailty)}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="95%" />
												</SelectTrigger>
												<SelectContent>
													{Array.from({ length: 10 }, (_v, i) => (i + 1) * 10).map((value) => {
														return (
															<SelectItem value={String(value)} key={value + "%%"}>
																{value}%
															</SelectItem>
														);
													})}
												</SelectContent>
											</Select>

											<div className="flex items-center justify-between gap-4 pt-2">
												<Label htmlFor="image-optimizations" className="text-sm">
													Allow Gifs
												</Label>
												<Switch
													checked={settings.imageOptimizations.allowGifs}
													onCheckedChange={(value) => settings.setImageOptimizationAllowGifs(value)}
												/>
											</div>
										</div>
									)}
								</div>
							</div>

							<DrawerFooter>
								<Button
									variant="destructive"
									onClick={() => {
										localStorage.clear();
										location.reload();
									}}
								>
									Reset
								</Button>
								<DrawerClose asChild>
									<Button variant="accent">Close</Button>
								</DrawerClose>
							</DrawerFooter>
						</DrawerContent>
					</Drawer>
				</div>
			</footer>
		</>
	);
}

export default Footer;
