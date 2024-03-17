import { HTMLProps, useEffect, useState } from "react";

export function BlurImage({ preview, src: image = "", ...props }: HTMLProps<HTMLImageElement> & { preview: string; loading: "lazy" }) {
	const [currentImage, setCurrentImage] = useState(preview);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setCurrentImage(preview);
		setLoading(false);
	}, [preview]);

	const fetchImage = (src: string) => {
		const loadingImage = new Image();
		loadingImage.src = src;
		loadingImage.onload = () => {
			setCurrentImage(loadingImage.src);
			setLoading(false);
		};
	};

	return (
		<div style={{ overflow: "hidden", width: "100%", height: "100%" }} className={props.className}>
			<img
				{...props}
				style={{
					filter: `${loading ? "blur(20px)" : ""}`,
					transition: "0.1s filter linear",
					width: "100%",
					height: "100%",
				}}
				src={currentImage}
				onLoadCapture={() => fetchImage(image)}
			/>
		</div>
	);
}
