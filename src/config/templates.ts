import { IMAGE_PROXY } from "~/config";

export const wsrvTemplate = ({
  url,
  q,
  w,
  s,
  n,
  out,
}: {
  url: string;
  q: number;
  w: number;
  s: number;
  n: 1 | -1;
  out: "webp" | "jpg" | "png";
}) =>
  `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${w}&q=${q}&output=${out}${s > 0 ? `&sharp=${s}` : ``}&n=${n}`;

export const proxyTemplate = ({
  url,
  referer,
}: {
  url: string;
  referer: string;
}) => `${IMAGE_PROXY}/?url=${encodeURIComponent(url)}&referer=${referer}`;
