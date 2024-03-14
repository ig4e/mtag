import { proxyTemplate, wsrvTemplate } from "@/config";
import { useSettings } from "@/store/settings";
import React, { useCallback } from "react";

function useWsrv() {
	const imageSettings = useSettings((settings) => settings.imageOptimizations);

	const [screenWidth, setScreenWidth] = React.useState(300);

	React.useEffect(() => {
		window.addEventListener("resize", () => setScreenWidth(window.innerWidth));
		return () => window.removeEventListener("resize", () => setScreenWidth(window.innerWidth));
	}, []);

	const callback = useCallback(
		({ url, wsrvBlock, isVideo, raw }: { url: string; wsrvBlock?: boolean; isVideo?: boolean; raw?: boolean }) => {
			if (isVideo || raw || !imageSettings.enabled) return proxyTemplate({ url, referer: url });
			return wsrvTemplate({
				url: wsrvBlock ? proxyTemplate({ url, referer: url }) : url,
				q: imageSettings.quailty,
				w: screenWidth + 300,
				s: 1,
				n: imageSettings.allowGifs ? -1 : 1,
			});
		},
		[screenWidth, imageSettings],
	);

	return callback;
}

export default useWsrv;
