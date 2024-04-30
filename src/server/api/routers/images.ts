import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import * as rule34 from "~/server/api/sources/rule34";
import * as reddit from "~/server/api/sources/reddit";
import * as realbooru from "~/server/api/sources/realbooru";
import * as gelbooru from "~/server/api/sources/gelbooru";
import * as hanimeTv from "~/server/api/sources/hanimetv";
//import * as pornhub from "~/server/api/sources/pornhub";
import { TRPCError } from "@trpc/server";
import { type Image } from "~/server/api/types";

export const imagesRouter = createTRPCRouter({
  page: publicProcedure
    .input(
      z.object({
        source: z
          .enum([
            "rule34",
            "reddit",
            "realbooru",
            "gelbooru",
            "hanimetv",
            "pornhub",
          ])
          .default("realbooru"),
        mediaType: z.enum(["real", "hentai"]).default("real"),
        categories: z.string().array(),
        sfw: z.boolean().default(true),
        cursor: z
          .object({
            page: z.number().int().positive().default(1),
            reddit: z.object({}).optional().default({}),
            pornhub: z.string().optional().default(""),
          })
          .optional()
          .default({
            page: 1,
            pornhub: "1:1",
            reddit: {},
          }),
        limit: z.number().int().positive().default(25),
      }),
    )
    .query(async ({ input }) => {
      const {
        source,
        mediaType,
        sfw,
        cursor: { page, ...pagination },
        categories,
        limit,
      } = input;

      const response: {
        input: typeof input;
        data: Image[];
        pagination: {
          next: {
            reddit?: Record<string, string | undefined>;
            pornhub?: string;
            page: number;
          };
        };
      } = {
        input,
        data: [],
        pagination: {
          next: input.cursor,
        },
      };

      const unifiedBooruTags = [...categories, sfw ? "sfw" : undefined].filter(
        Boolean,
      ) as string[];

      if (source === "gelbooru") {
        response.data = await gelbooru.getPostsPage({
          limit,
          page,
          tags: unifiedBooruTags,
        });

        response.pagination.next.page++;
      } else if (source === "realbooru") {
        response.data = await realbooru.getPostsPage({
          limit,
          page,
          tags: unifiedBooruTags,
        });

        response.pagination.next.page++;
      } else if (source === "rule34") {
        response.data = await rule34.getPostsPage({
          limit,
          page,
          tags: unifiedBooruTags,
        });

        response.pagination.next.page++;
      }
      //   else if (source === "pornhub") {
      //     const [albumPage, albumIndex] = pagination.pornhub
      //       .split(":")
      //       .map(Number);

      //     const albums = await pornhub.getAlbums({
      //       query: `${categories.join(" ")}${sfw ? " sfw" : ""}`,
      //       page: albumPage,
      //     });

      //     const albumId = albums.data[albumIndex ?? 0];
      //     if (!albumId || !albumIndex || !albumPage) {
      //       throw new TRPCError({ code: "NOT_FOUND" });
      //     }

      //     const album = await pornhub.getAlbum(albumId);

      //     const nextIndex =
      //       albums.data.length > albumIndex + 1 ? albumIndex + 1 : 0;

      //     const nextPage =
      //       nextIndex === 0 && !albums.paging.isEnd ? albumPage + 1 : albumPage;

      //     response.data = album;
      //     response.pagination.next.pornhub =
      //       album.length >= 1 ? `${nextPage}:${nextIndex}` : undefined;
      //   }
      else if (source === "reddit") {
        const sub =
          categories.length > 0
            ? reddit.getSub({ subs: categories })
            : reddit.getSub({ mediaType: sfw ? "sfw" : mediaType });

        const images = await reddit.getPostsPage({
          limit,
          name: (pagination.reddit as Record<string, string>)[sub] as
            | string
            | undefined,
          sub: sub,
        });

        response.data = images

        response.pagination.next.reddit = {
          ...response.pagination.next.reddit,
          [sub]: images[images.length - 1]?.name,
        };
      } else if (source === "hanimetv") {
        let tags: string[] =
          mediaType === "real" ? ["irl-3d"] : sfw ? ["media"] : [];
        tags = [...tags, ...categories];
        if (categories.length < 1 && !sfw) tags.push("nsfw-general");

        response.input.categories = tags;

        response.data = await hanimeTv.getPostsPage({
          limit,
          page,
          tags: tags,
        });

        response.pagination.next.page =
          response.data.length > 1 ? page + 1 : (null as unknown as number);
      }

      return response;
    }),
});
