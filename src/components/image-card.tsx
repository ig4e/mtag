import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Badge } from "~/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { useWsrv } from "~/hooks/use-wsrv";
import { cn } from "~/lib/utils";
import { useSettings } from "~/store/settings";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Video } from "lucide-react";
import { useState } from "react";
import { useImageSize } from "react-image-size";
import { BlurImage } from "./blur-image";

export interface Image {
  id: string | number;
  urls: string[];
  category?: string;
  sub?: string;
  wsrvSupport: boolean;
  isVideo?: boolean;
  aspectRatio?: number;
  url: string;
}

function ImageCard({ image }: { image: Image }) {
  const settings = useSettings();
  const wsrv = useWsrv();

  const [url] = image.urls as [string];
  const [addedCategories, setAddedCategories] = useState<string[]>([]);
  const [removedCategories, setRemovedCategories] = useState<string[]>([]);

  const [dimensions] = image.aspectRatio
    ? [undefined]
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useImageSize(wsrv({ url, raw: true }));

  const aspectRatio = dimensions
    ? dimensions.width / dimensions.height
    : image.aspectRatio;

  return (
    <div className="relative w-full overflow-hidden rounded-md">
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
          <AspectRatio
            ratio={aspectRatio}
            className={cn("relative overflow-hidden bg-accent", {
              blur: settings.blur === "soft",
              "blur-3xl": settings.blur === "overcensorship",
            })}
          >
            {image.isVideo ? (
              <>
                <Video className="absolute left-2 top-2 z-20 h-8 w-8"></Video>
                <video
                  muted={settings.videoOptimizations.muted}
                  autoPlay={settings.videoOptimizations.autoplay}
                  className="h-full w-full rounded-md object-cover object-center"
                >
                  <source src={wsrv({ url, isVideo: true })} />
                </video>
              </>
            ) : (
              <BlurImage
                src={wsrv({ url, wsrvBlock: !image.wsrvSupport })}
                preview={wsrv({
                  url,
                  wsrvBlock: !image.wsrvSupport,
                  isPlaceholder: true,
                })}
                className="w-full rounded-md object-cover object-center"
                loading="lazy"
              />
            )}
          </AspectRatio>
        </DialogTrigger>
        <DialogContent className="border-none bg-transparent p-0">
          <div className="mx-4 h-full max-h-[80vh] space-y-2 overflow-y-scroll rounded-lg bg-secondary p-0.5">
            <AspectRatio
              ratio={aspectRatio}
              className={cn("relative w-full rounded-md bg-primary/5", {
                blur: settings.blur === "soft",
                "blur-3xl": settings.blur === "overcensorship",
              })}
            >
              {image.isVideo ? (
                <video
                  controls
                  className="h-full w-full rounded-md object-cover object-center"
                  autoFocus
                >
                  <source src={wsrv({ url, isVideo: true })} />
                </video>
              ) : (
                <BlurImage
                  src={wsrv({
                    url,
                    raw: settings.imageOptimizations.enabledInPreview
                      ? false
                      : true,
                    wsrvBlock: !image.wsrvSupport,
                    isPreview: true,
                  })}
                  preview={wsrv({
                    url,
                    wsrvBlock: !image.wsrvSupport,
                    isPlaceholder: true,
                  })}
                  className="w-full rounded-md object-cover object-center"
                  autoFocus
                  loading="lazy"
                />
              )}
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 h-full w-full rounded-md",
                  {
                    "bg-gray-500/25 backdrop-blur-3xl":
                      settings.blur === "overcensorship",
                    "bg-gray-500/10 backdrop-blur": settings.blur === "soft",
                  },
                )}
              ></div>
            </AspectRatio>

            <div className="space-y-2 px-4 pb-2">
              <Label className="text-lg">Info</Label>
              {image.category && (
                <p className="flex flex-col gap-2">
                  Categories:{" "}
                  <div className="flex flex-wrap gap-1 rounded-md bg-background p-2">
                    {image.category.split(",").map((category) => {
                      const isInFilter =
                        addedCategories.includes(category) ||
                        (settings.categories.includes(category) &&
                          !removedCategories.includes(category));

                      return (
                        <Badge
                          key={category}
                          variant={isInFilter ? "default" : "secondary"}
                          className="cursor-pointer overflow-hidden text-ellipsis"
                          onClick={() => {
                            if (isInFilter) {
                              setAddedCategories((state) =>
                                state.filter((c) => c !== category),
                              );
                              setRemovedCategories((state) => [
                                ...state,
                                category,
                              ]);
                            } else {
                              setRemovedCategories((state) =>
                                state.filter((c) => c !== category),
                              );
                              setAddedCategories((state) => [
                                ...state,
                                category,
                              ]);
                            }
                          }}
                        >
                          {category}
                          {isInFilter && (
                            <XMarkIcon className="ms-1 h-4 w-4"></XMarkIcon>
                          )}
                        </Badge>
                      );
                    })}
                  </div>
                </p>
              )}

              {image.sub && (
                <p>
                  Sub Reddit:{" "}
                  <span className="text-sm text-muted-foreground">
                    {image.sub}
                  </span>
                </p>
              )}

              {image.url && (
                <p>
                  Source:{" "}
                  <a
                    href={image.url}
                    className="text-sm text-primary underline"
                  >
                    {image.url}
                  </a>
                </p>
              )}

              {!image.url && !image.sub && !image.category && (
                <p>There&apos;s no data ¯\_(ツ)_/¯</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ImageCard;
