import { IMAGE_PROXY, wsrvTemplate } from "@/config";
import { useSettings } from "@/store/settings";
import React, { useCallback } from "react";

function useWsrv() {
	const settings = useSettings((settings) => ({
		imageOptimizations: settings.imageOptimizations,
		imageOptimizationQuailty: settings.imageOptimizationQuailty,
	}));

	const [screenWidth, setScreenWidth] = React.useState(300);

	React.useEffect(() => {
		window.addEventListener("resize", () => setScreenWidth(window.innerWidth));
		return () => window.removeEventListener("resize", () => setScreenWidth(window.innerWidth));
	}, []);

	const callback = useCallback(
		({ url, wsrvBlock }: { url: string; wsrvBlock: boolean }) => {
			if (!settings.imageOptimizations) return url;
			return wsrvTemplate({
				url: wsrvBlock ? `${IMAGE_PROXY}/fetch?url=${url}&referer=${url}` : url,
				q: settings.imageOptimizationQuailty,
				w: screenWidth - 50,
				s: 1,
			});
		},
		[screenWidth, settings],
	);

	return callback;
}

export default useWsrv;
