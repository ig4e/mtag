import { useSettings } from "@/store/settings";

const mediaTypes = {
	real: "Real",
	hentai: "Hentai",
};

function Navbar() {
	const settings = useSettings();

	return (
		<nav className="z-[100] py-2 bg-background/50 drop-shadow-md backdrop-blur-xl sticky top-0 border-b border-border">
			<div className="container mx-auto flex items-center justify-between">
				<a href="/" className="flex items-center gap-2">
					<img src={"/logo.png"} className="w-7 h-7 rounded" />
					<span className="text-lg font-semibold">Rule 69</span>
				</a>

				<div className="flex items-center gap-2">
					{settings.source === "reddit" ? (
						<img src="/reddit.png" className="w-5 h-5"></img>
					) : settings.source === "rule34" ? (
						<img src="/rule34.ico" className="w-5 h-5"></img>
					) : settings.source === "realbooru" ? (
						<img src="/rb.ico" className="w-5 h-5"></img>
					) : null}

					<span>{mediaTypes[settings.mediaType]}</span>
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
