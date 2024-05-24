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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsState, useSettings } from "@/store/settings";
import { AdjustmentsVerticalIcon } from "@heroicons/react/24/solid";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RSelect } from "./ui/r-select";
import { Switch } from "./ui/switch";
import { censorOptions, hideOnScrollOptions, mediaTypes, sharpnessOptions, sources, sourcesObject } from "@/config";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useShow } from "@/hooks/use-show";
import { cn } from "@/lib/utils";

function Footer() {
	const settings = useSettings();
	const [categories, setCategories] = useState<string>();
	const debouncedCategories = useDebounce(categories, 250);
	const show = useShow();

	useEffect(() => {
		if (settings.source) {
			const sourceSettings = sourcesObject[settings.source];
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

	const sourceSettings = sourcesObject[settings.source];

	return (
		<>
			<footer
				className={cn(
					"z-40 py-3 bg-background/50 drop-shadow-md fixed bottom-0 inset-x-0 border-t border-border will-change-auto transition-all",
					{
						"translate-y-16": !show && ["footer", "all"].includes(settings.hideOnScroll),
					},
				)}
			>
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
							<DrawerHeader className="flex items-center flex-col">
								<DrawerTitle className="flex items-center justify-center gap-2">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 59.14 31.921" className="h-4">
										<g transform="translate(-327.29 -1352)">
											<path
												d="M40.812-25.291,27-2.021Q25.246.921,22.888.921q-3.347,0-3.347-4.2L19.182-18.4q0-4.11-.708-5.537a2.752,2.752,0,0,0-2.729-1.426,5.071,5.071,0,0,0-3.65,1.92,5.772,5.772,0,0,0-1.786,3.919A3.451,3.451,0,0,0,11.332-16.9a3.784,3.784,0,0,0,2.729.977q.4,0,.809-.022.472-.022.562-.022,2.718,0,2.718,2.269a2.929,2.929,0,0,1-1.539,2.5,6.978,6.978,0,0,1-3.875,1A8.03,8.03,0,0,1,6.66-12.679,8.785,8.785,0,0,1,4.29-19a11.3,11.3,0,0,1,3.785-8.3,11.992,11.992,0,0,1,8.569-3.672q4.627,0,6.851,3.167a7.761,7.761,0,0,1,1.157,3.234,42.781,42.781,0,0,1,.326,6.177V-9.5L35.87-28.031,36.432-29a3.228,3.228,0,0,1,1.213-1.3,4.468,4.468,0,0,1,1.977-.337l.876-.022H44.45q3.122,0,3.122,2.156a2.819,2.819,0,0,1-1.1,2.358,4.875,4.875,0,0,1-3.055.854Zm16.374,8.445a7.258,7.258,0,0,1,3.459,6.356,11.475,11.475,0,0,1-1.752,6.02A9.583,9.583,0,0,1,50.155.449a8.783,8.783,0,0,1-6.008-2,6.678,6.678,0,0,1-2.28-5.278,6.586,6.586,0,0,1,1.146-3.908,3.329,3.329,0,0,1,2.763-1.617,2.3,2.3,0,0,1,1.64.663,2.087,2.087,0,0,1,.7,1.561,7.423,7.423,0,0,1-.359,1.707,5.806,5.806,0,0,0-.292,1.415,2.267,2.267,0,0,0,.752,1.774,2.8,2.8,0,0,0,1.943.674,4.358,4.358,0,0,0,3.392-1.819,6.219,6.219,0,0,0,1.5-4.065,3.616,3.616,0,0,0-2.74-3.661q-1.887-.629-1.887-2.156a2.615,2.615,0,0,1,.719-1.774l.449-.494,3.751-4.155h-5.1q-2.853,0-2.853-2a2.686,2.686,0,0,1,.943-2.066,3.323,3.323,0,0,1,2.313-.854h9.209q3.571,0,3.571,2.7a3.16,3.16,0,0,1-.876,2.224Z"
												transform="translate(323 1383)"
												fill="#fff"
											/>
											<circle cx="10" cy="10" r="10" transform="translate(329 1352)" fill="#e11d48" />
										</g>
									</svg>
									<span>Settings</span>
								</DrawerTitle>

								<DrawerDescription>You can change the app settings here.</DrawerDescription>
							</DrawerHeader>

							<div className="p-4">
								<Tabs className="w-full" defaultValue="source">
									<TabsList className="w-full">
										<TabsTrigger value="source" className="w-full">
											Source
										</TabsTrigger>
										<TabsTrigger value="settings" className="w-full">
											Settings
										</TabsTrigger>
									</TabsList>
									<TabsContent value="source" className="space-y-4">
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

										<div className="space-y-2" hidden={!sourceSettings.categories.support}>
											<Label htmlFor="category">Category</Label>
											<div className="flex items-center gap-2">
												{sourceSettings.categories.values ? (
													<RSelect
														onChange={(n) =>
															setCategories((n as { value: string }[]).map((c) => c.value).join(","))
														}
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

												<Button onClick={() => setCategories("")} size={"sm"} variant={"destructive"}>
													Clear
												</Button>
											</div>
										</div>

										<div className="space-y-2" hidden={!sourceSettings.subs.support}>
											<Label htmlFor="category">Subs</Label>
											<div className="flex items-center gap-2">
												<RSelect
													onChange={(n) =>
														setCategories((n as { value: string }[]).map((c) => c.value).join(","))
													}
													className="w-full"
													isMulti
													options={sourceSettings.subs.values?.map((value) => ({ label: value, value }))}
													value={settings.categories.map((value) => ({ label: value, value }))}
												></RSelect>

												<Button onClick={() => setCategories("")} size={"sm"} variant={"destructive"}>
													Clear
												</Button>
											</div>
											<p className="text-muted-foreground text-sm">
												When using Subs the following options are ignored: SFW, Media Type
											</p>
										</div>
									</TabsContent>

									<TabsContent value="settings" className="space-y-4">
										<div className="space-y-2">
											<Label htmlFor="hide-on-scroll">Hide on scroll</Label>
											<Select
												onValueChange={(value) => settings.setHideOnScroll(value as SettingsState["hideOnScroll"])}
												value={settings.hideOnScroll}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Hide" />
												</SelectTrigger>
												<SelectContent>
													{hideOnScrollOptions.map(({ name, value }) => {
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
											<Label htmlFor="censor">Censor (Blur)</Label>
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

										<Collapsible>
											<div className="flex items-center justify-between space-x-4 mb-4">
												<h4 className="font-semibold">Video Optimizations</h4>
												<CollapsibleTrigger asChild>
													<Button variant="ghost" size="sm">
														<CaretSortIcon className="h-4 w-4" />
														<span className="sr-only">Toggle</span>
													</Button>
												</CollapsibleTrigger>
											</div>

											<div className="flex items-center justify-between gap-4 pt-2">
												<Label htmlFor="image-optimizations" className="text-sm">
													Autoplay
												</Label>
												<Switch
													checked={settings.videoOptimizations.autoplay}
													onCheckedChange={(value) => settings.setVideoOptimizations({ autoplay: value })}
												/>
											</div>

											<CollapsibleContent className="space-y-2">
												<div className="flex items-center justify-between gap-4 pt-2">
													<Label htmlFor="image-optimizations" className="text-sm">
														Mute
													</Label>
													<Switch
														checked={settings.videoOptimizations.muted}
														onCheckedChange={(value) => settings.setVideoOptimizations({ muted: value })}
													/>
												</div>
											</CollapsibleContent>
										</Collapsible>

										<Collapsible>
											<div className="flex items-center justify-between space-x-4 mb-4">
												<h4 className="font-semibold">Image Optimizations</h4>
												<CollapsibleTrigger asChild>
													<Button variant="ghost" size="sm">
														<CaretSortIcon className="h-4 w-4" />
														<span className="sr-only">Toggle</span>
													</Button>
												</CollapsibleTrigger>
											</div>

											<div className="flex items-center justify-between gap-4 mb-2">
												<Label htmlFor="image-optimizations">Enabled</Label>
												<Switch
													checked={settings.imageOptimizations.enabled}
													onCheckedChange={(value) => settings.setImageOptimizations(value)}
												/>
											</div>

											<div className="flex items-center justify-between gap-4 mb-2">
												<Label htmlFor="image-optimizations">Enabled in preview</Label>
												<Switch
													checked={settings.imageOptimizations.enabledInPreview}
													onCheckedChange={(value) => settings.setImageOptimizationsInPreview(value)}
												/>
											</div>

											<CollapsibleContent className="space-y-2">
												<div className="space-y-2">
													<Label htmlFor="image-optimizations" className="text-sm">
														Quality
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
												</div>

												<div className="space-y-2" hidden={!settings.imageOptimizations.enabledInPreview}>
													<Label htmlFor="image-optimizations" className="text-sm">
														Preview Quality
													</Label>
													<Select
														onValueChange={(value) =>
															settings.setImageOptimizationQuailtyInPreview(Number(value))
														}
														value={String(settings.imageOptimizations.previewQuailty)}
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
												</div>

												<div className="space-y-2">
													<Label htmlFor="image-optimizations" className="text-sm">
														Sharpness
													</Label>
													<Select
														onValueChange={(value) => settings.setImageOptimizationSharpness(Number(value))}
														value={String(settings.imageOptimizations.sharpness)}
													>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="95%" />
														</SelectTrigger>
														<SelectContent>
															{sharpnessOptions.map(({ name, value }) => {
																return (
																	<SelectItem value={value} key={value}>
																		{name}
																	</SelectItem>
																);
															})}
														</SelectContent>
													</Select>
												</div>

												<div className="flex items-center justify-between gap-4 pt-2">
													<Label htmlFor="image-optimizations" className="text-sm">
														Allow Gifs
													</Label>
													<Switch
														checked={settings.imageOptimizations.allowGifs}
														onCheckedChange={(value) => settings.setImageOptimizationAllowGifs(value)}
													/>
												</div>
											</CollapsibleContent>
										</Collapsible>
									</TabsContent>
								</Tabs>
							</div>

							<DrawerFooter>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button variant="destructive">Reset</Button>
									</AlertDialogTrigger>
									<AlertDialogContent className="max-w-xs">
										<AlertDialogHeader>
											<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone. This will permanently reset your settings.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction asChild>
												<Button
													variant="destructive"
													onClick={() => {
														localStorage.clear();
														location.reload();
													}}
												>
													Reset
												</Button>
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>

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
