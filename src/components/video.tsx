/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import * as React from "react";
import videojs from "video.js";

// Styles
import "video.js/dist/video-js.css";

interface IVideoPlayerProps {
	options: videojs.PlayerOptions;
	className: string;
}

const initialOptions: videojs.PlayerOptions = {
	controls: true,
	fluid: true,
	controlBar: {
		volumePanel: {
			inline: false,
		},
	},
};

const VideoPlayer: React.FC<IVideoPlayerProps> = ({ options, className }) => {
	const videoNode = React.useRef<HTMLVideoElement>();
	const player = React.useRef<videojs.Player>();

	React.useEffect(() => {
		player.current = videojs(videoNode.current as any, {
			...initialOptions,
			...options,
		}).ready(function () {
			// console.log('onPlayerReady', this);
		});
		return () => {
			if (player.current) {
				player.current.dispose();
			}
		};
	}, [options]);

	return (
		<div>
			<video ref={videoNode as any} className={cn("video-js vjs-theme-city", className)} />
		</div>
	);
};

VideoPlayer.displayName = "VideoPlayer";
export default VideoPlayer;
