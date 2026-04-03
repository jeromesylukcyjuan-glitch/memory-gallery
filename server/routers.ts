import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  createAlbum,
  getUserAlbums,
  updateAlbum,
  deleteAlbum,
  createMemory,
  getUserMemories,
  getAlbumMemories,
  updateMemory,
  deleteMemory,
  searchMemories,
  getMemoriesByDateRange,
  addTags,
  getMemoryTags,
} from "./db";
import { generateImageDescription, generateVideoDescription } from "./ai";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  memories: router({
    list: protectedProcedure
      .input(z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      }))
      .query(async ({ ctx, input }) => {
        return getUserMemories(ctx.user.id, input.limit, input.offset);
      }),

    create: protectedProcedure
      .input(z.object({
        fileUrl: z.string(),
        fileKey: z.string(),
        fileType: z.enum(["image", "video"]),
        mimeType: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        memoryDate: z.date(),
        albumId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return createMemory(ctx.user.id, input);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        albumId: z.number().optional(),
        memoryDate: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        return updateMemory(input.id, input);
      }),

    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return deleteMemory(input);
      }),

    search: protectedProcedure
      .input(z.string())
      .query(async ({ ctx, input }) => {
        return searchMemories(ctx.user.id, input);
      }),

    getByDateRange: protectedProcedure
      .input(z.object({
        startDate: z.date(),
        endDate: z.date(),
      }))
      .query(async ({ ctx, input }) => {
        return getMemoriesByDateRange(ctx.user.id, input.startDate, input.endDate);
      }),

    getTags: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return getMemoryTags(input);
      }),

    addTags: protectedProcedure
      .input(z.object({
        memoryId: z.number(),
        tags: z.array(z.string()),
      }))
      .mutation(async ({ input }) => {
        return addTags(input.memoryId, input.tags);
      }),

    generateAIDescription: protectedProcedure
      .input(z.object({
        memoryId: z.number(),
        fileUrl: z.string(),
        fileType: z.enum(["image", "video"]),
      }))
      .mutation(async ({ input }) => {
        try {
          const description = input.fileType === "image"
            ? await generateImageDescription(input.fileUrl)
            : await generateVideoDescription(input.fileUrl);

          await updateMemory(input.memoryId, {
            title: description.title,
            description: description.description,
            aiGenerated: "completed",
          });

          if (description.tags.length > 0) {
            await addTags(input.memoryId, description.tags);
          }

          return {
            success: true,
            title: description.title,
            description: description.description,
            tags: description.tags,
          };
        } catch (error) {
          await updateMemory(input.memoryId, {
            aiGenerated: "failed",
          });
          throw error;
        }
      }),
  }),

  albums: router({
    list: protectedProcedure
      .query(async ({ ctx }) => {
        return getUserAlbums(ctx.user.id);
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return createAlbum(ctx.user.id, input.name, input.description);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        coverImageUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return updateAlbum(input.id, input);
      }),

    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return deleteAlbum(input);
      }),

    getMemories: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return getAlbumMemories(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
