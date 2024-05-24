import { mediaTypesObject, sourcesObject } from "@/config";
import { useShow } from "@/hooks/use-show";
import { cn } from "@/lib/utils";
import { useSettings } from "@/store/settings";

function Navbar() {
	const settings = useSettings();
	const source = sourcesObject[settings.source];
	const show = useShow();

	return (
		<nav
			className={cn(
				"z-40 py-2 bg-background/50 drop-shadow-md sticky top-0 border-b border-border will-change-auto transition-all",
				{
					"-translate-y-16": !show && ["navbar", "all"].includes(settings.hideOnScroll),
				},
			)}
		>
			<div className="container mx-auto flex items-center justify-between gap-4">
				<a href="/" className="flex items-center gap-2 relative">
					<img src={"/logo.png"} className="w-28 h-8 object-cover object-center rounded" />
				</a>

				<div className="flex items-center gap-2">
					<img src={source.iconURL} className="w-6 h-6 rounded" />
					<span>{mediaTypesObject[settings.mediaType].name}</span>
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
