import { cn } from "@/lib/utils";
import { useSettings } from "@/store/settings";
import { useCallback, useEffect, useState } from "react";

const mediaTypes = {
	real: "Real",
	hentai: "Hentai",
};

function Navbar() {
	const settings = useSettings();
	const [show, setShow] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);

	const controlNavbar = useCallback(() => {
		if (window.scrollY > lastScrollY) {
			setShow(false);
		} else {
			setShow(true);
		}

		setLastScrollY(window.scrollY);
	}, [lastScrollY]);

	useEffect(() => {
		window.addEventListener("scroll", controlNavbar);

		return () => {
			window.removeEventListener("scroll", controlNavbar);
		};
	}, [lastScrollY, controlNavbar]);

	return (
		<nav
			className={cn(
				"z-[20] py-2 bg-background/50 drop-shadow-md backdrop-blur-xl sticky top-0 border-b border-border transition-all",
				{
					"-translate-y-16": !show,
				},
			)}
		>
			<div className="container mx-auto flex items-center justify-between">
				<a href="/" className="flex items-center gap-2">
					<img src={"/logo.png"} className="w-7 h-7 rounded" />
					<span className="text-lg font-semibold">Rule 69</span>
				</a>

				<div className="flex items-center gap-2">
					<div className="rounded overflow-hidden w-5 h-5 aspect-square">
						{settings.source === "reddit" ? (
							<img src="/reddit.png" className="w-full h-full object-cover"></img>
						) : settings.source === "rule34" ? (
							<img src="/rule34.ico" className="w-full h-full object-cover"></img>
						) : settings.source === "realbooru" ? (
							<img src="/rb.ico" className="w-full h-full object-cover"></img>
						) : settings.source === "hanimetv" ? (
							<img src="/hanimetv.png" className="w-full h-full object-cover"></img>
						) : settings.source === "gelbooru" ? (
							<img src="/gelbooru.png" className="w-full h-full object-cover"></img>
						) : null}
					</div>

					<span>{mediaTypes[settings.mediaType]}</span>
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
