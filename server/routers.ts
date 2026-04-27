import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

// API_BASE_URL for FastAPI backend
const API_BASE_URL = process.env.QURAN_API_URL || "http://localhost:8000";

export const appRouter = router({
  system: router({
    notifyOwner: publicProcedure
      .input(z.object({ title: z.string(), content: z.string() }))
      .mutation(async ({ input }) => {
        // Placeholder for owner notification
        return { success: true };
      }),
  }),

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie("session", { maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Quran API routes
  quran: router({
    // Get Quran metadata
    getMetadata: publicProcedure.query(async () => {
      const response = await fetch(`${API_BASE_URL}/api/quran`);
      if (!response.ok) throw new Error("Failed to fetch Quran metadata");
      return response.json();
    }),

    // Get all Surahs
    getSurahs: publicProcedure.query(async () => {
      const response = await fetch(`${API_BASE_URL}/api/quran/surahs`);
      if (!response.ok) throw new Error("Failed to fetch Surahs");
      return response.json();
    }),

    // Get a specific Surah
    getSurah: publicProcedure
      .input(z.object({ surahId: z.number() }))
      .query(async ({ input }) => {
        const response = await fetch(`${API_BASE_URL}/api/quran/surah/${input.surahId}`);
        if (!response.ok) throw new Error(`Failed to fetch Surah ${input.surahId}`);
        return response.json();
      }),

    // Get a specific Ayah
    getAyah: publicProcedure
      .input(z.object({ surahId: z.number(), ayahId: z.number() }))
      .query(async ({ input }) => {
        const response = await fetch(
          `${API_BASE_URL}/api/quran/ayah/${input.surahId}/${input.ayahId}`
        );
        if (!response.ok) throw new Error("Failed to fetch Ayah");
        return response.json();
      }),

    // Search Quran
    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        const response = await fetch(
          `${API_BASE_URL}/api/search?q=${encodeURIComponent(input.query)}`
        );
        if (!response.ok) throw new Error("Search failed");
        return response.json();
      }),
  }),

  // Reciters API routes
  reciters: router({
    // Get all reciters
    getAll: publicProcedure.query(async () => {
      const response = await fetch(`${API_BASE_URL}/api/reciters`);
      if (!response.ok) throw new Error("Failed to fetch reciters");
      return response.json();
    }),

    // Get a specific reciter
    getById: publicProcedure
      .input(z.object({ reciterId: z.number() }))
      .query(async ({ input }) => {
        const response = await fetch(`${API_BASE_URL}/api/reciters/${input.reciterId}`);
        if (!response.ok) throw new Error(`Failed to fetch reciter ${input.reciterId}`);
        return response.json();
      }),

    // Search reciters
    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        const response = await fetch(
          `${API_BASE_URL}/api/reciters/search?q=${encodeURIComponent(input.query)}`
        );
        if (!response.ok) throw new Error("Reciter search failed");
        return response.json();
      }),
  }),

  // Word-by-word synchronization routes
  wordByWord: router({
    // Get word-by-word data for an Ayah
    getAyahSync: publicProcedure
      .input(z.object({ surahId: z.number(), ayahId: z.number() }))
      .query(async ({ input }) => {
        const response = await fetch(
          `${API_BASE_URL}/api/word-by-word/${input.surahId}/${input.ayahId}`
        );
        if (!response.ok) throw new Error("Failed to fetch word-by-word data");
        return response.json();
      }),
  }),

  // Multi-script routes
  scripts: router({
    // Get available scripts
    getAvailable: publicProcedure.query(async () => {
      const response = await fetch(`${API_BASE_URL}/api/scripts/available`);
      if (!response.ok) throw new Error("Failed to fetch available scripts");
      return response.json();
    }),

    // Get Ayah in specific script
    getAyahScript: publicProcedure
      .input(
        z.object({
          scriptType: z.string(),
          surahId: z.number(),
          ayahId: z.number(),
        })
      )
      .query(async ({ input }) => {
        const response = await fetch(
          `${API_BASE_URL}/api/scripts/${input.scriptType}/${input.surahId}/${input.ayahId}`
        );
        if (!response.ok) throw new Error("Failed to fetch script data");
        return response.json();
      }),
  }),

  // Transcription routes
  transcription: router({
    // Transcribe audio
    transcribeAudio: publicProcedure
      .input(z.object({ audioUrl: z.string() }))
      .mutation(async ({ input }) => {
        const response = await fetch(
          `${API_BASE_URL}/api/transcribe?audio_url=${encodeURIComponent(input.audioUrl)}`,
          { method: "POST" }
        );
        if (!response.ok) throw new Error("Transcription failed");
        return response.json();
      }),
  }),
});

export type AppRouter = typeof appRouter;
