"use client";

import Image from "next/image";
import { mediaTypesObject, sourcesObject } from "~/config";
import { useShow } from "~/hooks/use-show";
import { cn } from "~/lib/utils";
import { useSettings } from "~/store/settings";

function Navbar() {
  const settings = useSettings();
  const source = sourcesObject[settings.source];
  const show = useShow();

  return (
    <nav
      className={cn(
        "sticky top-0 z-40 border-b border-border bg-background/50 py-2 drop-shadow-md backdrop-blur-xl transition-all will-change-auto",
        {
          "-translate-y-16":
            !show && ["navbar", "all"].includes(settings.hideOnScroll),
        },
      )}
    >
      <div className="container mx-auto flex items-center justify-between gap-4">
        <a href="/" className="relative flex items-center gap-2">
          <Image
            src={"/logo.png"}
            className="h-8 w-28 rounded object-cover object-center"
            priority
            width={128}
            height={128}
            alt={"Logo"}
          />
        </a>

        <div className="flex items-center gap-2">
          <Image
            src={source.iconURL}
            alt={source.name}
            className="h-6 w-6 rounded"
            width={64}
            height={64}
          />
          <span>{mediaTypesObject[settings.mediaType]?.name}</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
