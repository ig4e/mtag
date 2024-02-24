/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { API_URL, BANDWIDTH_HERO_URL } from "@/config";
import { cn } from "@/lib/utils";
import { useSettings } from "@/store/settings";
import { useInfiniteQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useEffect, useMemo } from "react";

function HomePage() {
	const settings = useSettings();

	const { data, isLoading, isFetching, fetchNextPage } = useInfiniteQuery<{
		meta: object;
		data: { id: string | number; urls: string[]; category?: string; sub?: string; wsrvSupport: boolean }[];
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
		getNextPageParam: (lastPage) => lastPage.pagination,
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

	useEffect(() => {
		const handleScroll = () => {
			if (
				window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight ||
				isLoading ||
				isFetching
			)
				return;

			fetchNextPage();
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [isLoading, isFetching]);

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
						return page?.data?.map((image) => {
							const [url] = image.urls;

							return (
								<div key={image.id} className="relative w-full">
									<Dialog>
										<DialogTrigger asChild>
											<div className="w-full">
												<img
													key={image.id}
													className="object-cover object-center rounded-md bg-secondary w-full min-h-52"
													src={
														settings.imageOptimizations
															? image.wsrvSupport
																? `https://wsrv.nl/?url=${url}&w=300&q=${settings.imageOptimizationQuailty}&output=jpg`
																: `${BANDWIDTH_HERO_URL}?url=${url}&jpeg=true&l=${settings.imageOptimizationQuailty}&bw=0`
															: url
													}
													onError={(e) => ((e.target as unknown as any).src = url)}
												/>
												<div
													className={cn("absolute inset-0 w-full h-full rounded-md", {
														"backdrop-blur-3xl bg-gray-500/25": settings.blur === "overcensorship",
														"backdrop-blur bg-gray-500/10": settings.blur === "soft",
													})}
												></div>
											</div>
										</DialogTrigger>
										<DialogContent className="p-0">
											<div className="container">
												<img
													className="object-cover object-center rounded-md bg-slate-900"
													src={url}
													loading="lazy"
												></img>
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
		</div>
	);
}

export default HomePage;
