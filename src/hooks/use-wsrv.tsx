import { proxyTemplate, wsrvTemplate } from "@/config";
import { useSettings } from "@/store/settings";
import React, { useCallback } from "react";

export function useWsrv() {
	const imageSettings = useSettings((settings) => settings.imageOptimizations);
	const [screenWidth, setScreenWidth] = React.useState(300);

	React.useEffect(() => {
		window.addEventListener("resize", () => setScreenWidth(window.innerWidth));
		return () => window.removeEventListener("resize", () => setScreenWidth(window.innerWidth));
	}, []);

	const callback = useCallback(
		({
			url,
			wsrvBlock,
			isVideo,
			isPreview,
			isPlaceholder,
			raw,
		}: {
			url: string;
			wsrvBlock?: boolean;
			isVideo?: boolean;
			isPreview?: boolean;
			raw?: boolean;
			isPlaceholder?: boolean;
		}) => {
			if (isVideo || raw || !imageSettings.enabled) return proxyTemplate({ url, referer: url });

			if (isPlaceholder)
				return wsrvTemplate({
					url: wsrvBlock ? proxyTemplate({ url, referer: url }) : url,
					q: 50,
					w: 10,
					n: 1,
					out: "jpg",
					s: 0,
				});

			return wsrvTemplate({
				url: wsrvBlock ? proxyTemplate({ url, referer: url }) : url,
				q: isPreview ? imageSettings.previewQuailty : imageSettings.quailty,
				w: screenWidth + (isPreview ? screenWidth : screenWidth / 2),
				s: imageSettings.sharpness,
				n: imageSettings.allowGifs ? -1 : 1,
				out: "webp",
			});
		},
		[screenWidth, imageSettings],
	);

	return callback;
}

