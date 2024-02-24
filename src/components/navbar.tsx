function Navbar() {
	return (
		<nav className="z-[100] py-4 bg-background/50 drop-shadow-md backdrop-blur-xl sticky top-0 border-b border-border">
			<div className="container mx-auto flex items-center justify-between">
				<a href="/" className="flex items-center gap-2">
					<img src={"/logo.jpg"} className="w-6 h-6 rounded" />

					<span className="text-lg font-bold">Rule 69</span>
				</a>
			</div>
		</nav>
	);
}

export default Navbar;
