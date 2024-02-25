/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { API_URL, IMAGE_PROXY } from "@/config";
import { cn } from "@/lib/utils";
import { useSettings } from "@/store/settings";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { SearchIcon } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";

function HomePage() {
	const settings = useSettings();

	const { data, isLoading, isFetching, fetchNextPage } = useInfiniteQuery<{
		meta: object;
		data: {
			id: string | number;
			urls: string[];
			category?: string;
			sub?: string;
			wsrvSupport: boolean;
			isVideo?: boolean;
			aspectRatio?: number;
		}[];
		pagination: {
			reddit?: {
				[index: string]: string;
			};
			pages?: {
				next: number;
				prev: number;
			};
		};
	}>({
		queryKey: ["images", settings.source, settings.mediaType, settings.categories, settings.sfw],
		initialPageParam: {},
		getNextPageParam: (lastPage) => (lastPage.pagination?.pages?.next === null ? null : lastPage.pagination),
		getPreviousPageParam: (firstPage) => firstPage.pagination,
		queryFn: async ({ pageParam, signal }) => {
			const params = pageParam as {
				reddit?: {
					[index: string]: string;
				};
				pages?: {
					next: number;
					prev: number;
				};
			};

			return await fetch(
				`${API_URL}/api/images?source=${settings.source}&page=${params.pages?.next || 1}&categories=${JSON.stringify(
					settings.categories,
				)}&mediaType=${settings.mediaType}&sfw=${settings.sfw}&redditAfter=${JSON.stringify(params.reddit || {})}`,
				{ signal },
			).then((res) => {
				if (res.status !== 200) throw new Error("Something went wrong");
				return res.json();
			});
		},
		retryDelay: 500,
	});

	const handleNewPageFetch = useCallback(() => {
		if (isLoading || isFetching) return;

		console.log("End of page reached! Fetching a new page");

		fetchNextPage();
	}, [isLoading, isFetching, fetchNextPage]);

	const [endOfPageRef, entry] = useIntersectionObserver({
		threshold: 0.1,
		rootMargin: "0px",
	});

	useEffect(() => {
		if (entry?.isIntersecting) {
			handleNewPageFetch();
		}
	}, [entry, handleNewPageFetch]);

	const isEmpty = useMemo(() => data?.pages?.every((page) => page?.data?.length === 0), [data]);

	return (
		<div className="container pt-4">
			<div className="flex flex-wrap md:grid md:grid-cols-3 grid-flow-row-dense gap-4" id="images-container">
				{isEmpty && (
					<h1 className="w-full text-center col-span-3 text-3xl flex items-center justify-center gap-4 min-h-[60vh]">
						<SearchIcon className="w-6 h-6"></SearchIcon>
						<span>No Results</span>
					</h1>
				)}
				{data?.pages
					?.map((page) => {
						return page?.data?.map((image, index) => {
							const [url] = image.urls;

							return (
								<div key={`${image.id}-${index}`} className="relative w-full overflow-hidden">
									<Dialog>
										<DialogTrigger asChild>
											<AspectRatio ratio={image.aspectRatio} className="bg-secondary rounded-md">
												{image.isVideo ? (
													<video controls className="object-cover object-center rounded-md h-full w-full">
														<source src={`${IMAGE_PROXY}/fetch?url=${url}&referer=${url}`} />
													</video>
												) : (
													<img
														key={image.id}
														className="object-cover object-center rounded-md w-full"
														src={
															settings.imageOptimizations
																? image.wsrvSupport
																	? `https://wsrv.nl/?url=${url}&w=300&q=${settings.imageOptimizationQuailty}&output=jpg`
																	: `https://wsrv.nl/?url=${encodeURIComponent(
																			`${IMAGE_PROXY}/fetch?url=${url}&referer=${url}`,
																	  )}&w=300&q=${settings.imageOptimizationQuailty}&output=jpg`
																: url
														}
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
												<AspectRatio ratio={image.aspectRatio} className="bg-accent w-full rounded-md">
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
												</AspectRatio>

												<div className="pb-2 px-4 space-y-1">
													<Label className="text-lg">Info</Label>
													{image.category && (
														<p>
															Category: <span className="text-muted-foreground text-sm">{image.category}</span>
														</p>
													)}
													{image.sub && (
														<p>
															Sub Reddit: <span className="text-muted-foreground text-sm">{image.sub}</span>
														</p>
													)}
												</div>
											</div>
										</DialogContent>
									</Dialog>
								</div>
							);
						});
					})
					.flat()}

				{(isLoading || isFetching) &&
					Array.from({ length: 20 })
						.fill("")
						.map((_value, index) => {
							const highet = Math.random() * 500 + 100;

							return (
								<Skeleton
									className="w-full rounded-md"
									style={{ height: `${highet}px` }}
									key={`skeleton-${index}`}
								></Skeleton>
							);
						})}
			</div>

			<div className="h-24 w-full" ref={endOfPageRef}></div>
		</div>
	);
}

export default HomePage;
