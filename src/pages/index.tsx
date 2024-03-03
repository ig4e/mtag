/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ImageCard from "@/components/image-card";
import { Skeleton } from "@/components/ui/skeleton";
import { API_URL } from "@/config";
import { useSettings } from "@/store/settings";
import { Image } from "@/types/image";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { SearchIcon } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";

function HomePage() {
	const settings = useSettings();

	const { data, isLoading, isFetching, fetchNextPage } = useInfiniteQuery<{
		meta: object;
		data: Image[];
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
						return page?.data?.map((image, index) => <ImageCard image={image} key={`${image.id}-${index}`} />);
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
