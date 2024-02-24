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
	{ value: "reddit", name: "Reddit" },
	{ value: "rule34", name: "Rule34" },
];

function Footer() {
	const settings = useSettings();
	const [categories, setCategories] = useState<string>();
	const debouncedCategories = useDebounce(categories, 500);

	useEffect(() => {
		if (debouncedCategories) {
			settings.setCategories(debouncedCategories.split(","));
		} else {
			settings.setCategories([]);
		}
	}, [debouncedCategories]);

	useEffect(() => {
		setCategories(settings.categories.join(","));
	}, []);

	return (
		<>
			<div className="h-24"></div>
			<footer className="z-[30] py-4 bg-background drop-shadow-md backdrop-blur-xl fixed bottom-0 inset-x-0 border-t border-border">
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
							<Button variant={"secondary"} size={"icon"}>
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
									<Label htmlFor="mediaType">Media Type</Label>
									<Select
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
									<Label htmlFor="category">Category</Label>
									<Input
										placeholder="anal,big boobs"
										onChange={(e) => setCategories(e.target.value!)}
										value={categories}
										type="text"
									></Input>
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
											checked={settings.imageOptimizations}
											onCheckedChange={(value) => settings.setImageOptimizations(value)}
										/>
									</div>

									{settings.imageOptimizations && (
										<Input
											type="number"
											min={1}
											max={100}
											onChange={(e) => settings.setImageOptimizationQuailty(Number(e.target.value || 1))}
											placeholder="Image Quality (1-100)"
											value={settings.imageOptimizationQuailty}
										></Input>
									)}
								</div>
							</div>

							<DrawerFooter>
								<DrawerClose asChild>
									<Button variant="outline">Close</Button>
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
