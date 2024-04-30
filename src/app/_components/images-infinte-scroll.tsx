"use client";

import { useIntersectionObserver } from "@uidotdev/usehooks";
import { AlertCircle, SearchIcon } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import ImageCard from "~/components/image-card";
import { Skeleton } from "~/components/ui/skeleton";
import { useSettings } from "~/store/settings";
import { api } from "~/trpc/react";

function ImagesInfinteScroll() {
  const settings = useSettings();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" }), 1000);
  }, [settings.categories, settings.mediaType, settings.source, settings.sfw]);

  const { data, isLoading, isFetching, fetchNextPage, error, isError } =
    api.images.page.useInfiniteQuery(
      {
        categories: settings.categories,
        mediaType: settings.mediaType,
        source: settings.source,
        sfw: settings.sfw,
        limit: 30,
      },
      {
        getNextPageParam: (lastPage) => lastPage.pagination.next,
        refetchOnWindowFocus: false,
      },
    );

  const handleNewPageFetch = useCallback(() => {
    if (isLoading || isFetching) return;

    void fetchNextPage();
  }, [isLoading, isFetching, fetchNextPage]);

  const [endOfPageRef, entry] = useIntersectionObserver({
    threshold: 0.01,
    rootMargin: "0px",
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      handleNewPageFetch();
    }
  }, [entry, handleNewPageFetch]);

  const isEmpty = useMemo(
    () => data?.pages?.every((page) => page?.data?.length === 0),
    [data],
  );

  return (
    <div className="container pt-4">
      <div
        className="flex grid-flow-row-dense flex-wrap gap-4 md:grid md:grid-cols-3"
        id="images-container"
      >
        {isEmpty && (
          <h1 className="col-span-3 flex min-h-[60vh] w-full items-center justify-center gap-4 text-center text-3xl">
            <SearchIcon className="h-6 w-6"></SearchIcon>
            <span>No Results</span>
          </h1>
        )}

        {isError && (
          <h1 className="col-span-3 flex min-h-[60vh] w-full items-center justify-center gap-4 text-center text-3xl">
            <AlertCircle className="h-6 w-6"></AlertCircle>
            <span>Something gone wrong</span>
            <p>{error.message}</p>
          </h1>
        )}

        {data?.pages
          ?.map((page) => {
            return page?.data?.map((image, index) => (
              <ImageCard image={image} key={`${image.id}-${index}`} />
            ));
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

export default ImagesInfinteScroll;
