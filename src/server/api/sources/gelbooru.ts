import axios from "xior";
import querystring from "query-string";

import axiosRetry from "axios-retry";
import { isVideoFile } from "../util";

const gelbooruClient = axios.create({
  baseURL: "https://gelbooru.com",
});

axiosRetry(gelbooruClient as never, { retries: 10, retryCondition: () => true });

const wsrvSupport = false;

export async function getPostsPage({
  page,
  limit,
  tags,
}: {
  page: number;
  limit: number;
  tags: string[];
}) {
  const { data } = await gelbooruClient.get<{
    post: {
      id: number;
      created_at: string;
      score: number;
      width: number;
      height: number;
      md5: string;
      directory: string;
      image: string;
      rating: string;
      source: string;
      change: number;
      owner: string;
      creator_id: number;
      parent_id: number;
      sample: number;
      preview_height: number;
      preview_width: number;
      tags: string;
      title: string;
      has_notes: string;
      has_comments: string;
      file_url: string;
      preview_url: string;
      sample_url: string;
      sample_height: number;
      sample_width: number;
      status: string;
      post_locked: 0;
      has_children: string;
    }[];
  }>(
    "/index.php?" +
      querystring.stringify({
        page: "dapi",
        s: "post",
        q: "index",
        limit: limit,
        pid: page,
        json: 1,
      }) +
      `&tags=${tags.join("+")}`,
  );

  return ((data?.post && data) || { post: [] }).post.map((image) => {
    const isVideo = isVideoFile(image.image);

    return {
      id: image.id,
      url: `https://gelbooru.com/index.php?page=post&s=view&id=${image.id}`,
      urls: [image.file_url],
      category: image.tags.replace(/ /g, ","),
      aspectRatio: image.width / image.height,
      isVideo,
      wsrvSupport,
    };
  });
}
