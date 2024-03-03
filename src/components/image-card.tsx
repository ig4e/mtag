import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { IMAGE_PROXY } from "@/config";
import useWsrv from "@/hooks/use-wsrv";
import { cn } from "@/lib/utils";
import { useSettings } from "@/store/settings";
import { Image } from "@/types/image";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

function ImageCard({ image }: { image: Image }) {
	const settings = useSettings();
	const wsrv = useWsrv();

	const [url] = image.urls;
	const [addedCategories, setAddedCategories] = useState<string[]>([]);
	const [removedCategories, setRemovedCategories] = useState<string[]>([]);

	return (
		<div className="relative w-full overflow-hidden">
			<Dialog
				onOpenChange={(open) => {
					if (!open) {
						addedCategories.forEach((category) => {
							settings.addCategory(category);
						});
						removedCategories.forEach((category) => {
							settings.removeCategory(category);
						});

						setAddedCategories([]);
						setRemovedCategories([]);
					}
				}}
			>
				<DialogTrigger asChild>
					<AspectRatio ratio={image.aspectRatio} className="bg-accent rounded-md">
						{image.isVideo ? (
							<video muted={true} autoPlay={false} className="object-cover object-center rounded-md h-full w-full">
								<source src={`${IMAGE_PROXY}/fetch?url=${url}&referer=${url}`} />
							</video>
						) : (
							<img
								loading="lazy"
								key={image.id}
								className="object-cover object-center rounded-md w-full"
								src={wsrv({ url, wsrvBlock: !image.wsrvSupport })}
							/>
						)}

						<div
							className={cn("absolute inset-0 w-full h-full rounded-md", {
								"backdrop-blur-3xl bg-gray-500/25": settings.blur === "overcensorship",
								"backdrop-blur bg-gray-500/10": settings.blur === "soft",
							})}
						></div>
					</AspectRatio>
				</DialogTrigger>
				<DialogContent className="p-0 bg-transparent border-none">
					<div className="mx-4 h-full max-h-[80vh] overflow-y-scroll space-y-2 bg-secondary p-0.5 rounded-md">
						<AspectRatio ratio={image.aspectRatio} className="bg-primary/5 w-full rounded-md relative">
							{image.isVideo ? (
								<video controls className="object-cover object-center rounded-md h-full w-full">
									<source src={`${IMAGE_PROXY}/fetch?url=${url}&referer=${url}`} />
								</video>
							) : (
								<img
									className="object-cover object-center rounded-md w-full"
									src={`${IMAGE_PROXY}/fetch?url=${url}&referer=${url}`}
									loading="lazy"
								></img>
							)}
							<div
								className={cn("absolute inset-0 w-full h-full rounded-md", {
									"backdrop-blur-3xl bg-gray-500/25": settings.blur === "overcensorship",
									"backdrop-blur bg-gray-500/10": settings.blur === "soft",
								})}
							></div>
						</AspectRatio>

						<div className="pb-2 px-4 space-y-2">
							<Label className="text-lg">Info</Label>
							{image.category && (
								<p className="flex flex-col gap-2">
									Categories:{" "}
									<div className="flex flex-wrap gap-1 bg-background p-2 rounded-md">
										{image.category.split(" ").map((category) => {
											const isInFilter =
												addedCategories.includes(category) ||
												(settings.categories.includes(category) && !removedCategories.includes(category));

											return (
												<Badge
													key={category}
													variant={isInFilter ? "default" : "secondary"}
													className="cursor-pointer"
													onClick={() => {
														if (isInFilter) {
															setAddedCategories((state) => state.filter((c) => c !== category));
															setRemovedCategories((state) => [...state, category]);
														} else {
															setRemovedCategories((state) => state.filter((c) => c !== category));
															setAddedCategories((state) => [...state, category]);
														}
													}}
												>
													{category}
													{isInFilter && <XMarkIcon className="w-4 h-4 ms-1"></XMarkIcon>}
												</Badge>
											);
										})}
									</div>
								</p>
							)}
							{image.sub && (
								<p>
									Sub Reddit: <span className="text-muted-foreground text-sm">{image.sub}</span>
								</p>
							)}
							{image.url && (
								<p>
									Source:{" "}
									<a href={image.url} className="text-sm underline text-primary">
										{image.url}
									</a>
								</p>
							)}

							{!image.url && !image.sub && !image.category && <p>There's no data ¯\_(ツ)_/¯</p>}
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default ImageCard;
