"use server";

import { generateSongLyricsAndAudio, GenerateSongLyricsAndAudioInput } from "@/ai/flows/generate-song-lyrics-and-audio";
import { z } from "zod";

const actionSchema = z.object({
  songType: z.string(),
  dedicatedTo: z.string(),
  requester: z.string(),
  nickname: z.string().optional(),
  relationship: z.string(),
  story: z.string(),
  genre: z.string(),
  voice: z.string(), 
  voiceType: z.string(),
  includeNames: z.boolean().optional(),
  keywords: z.string().optional(),
  referenceSong: z.string().optional(),
  styleVoice: z.string().optional(),
  plan: z.string(),
  famousCollaboration: z.boolean().optional(),
});

export async function createSongAction(data: z.infer<typeof actionSchema>) {
  try {
    const validatedData = actionSchema.parse(data);

    const flowInput: GenerateSongLyricsAndAudioInput = {
      songType: validatedData.songType,
      dedicatedTo: validatedData.dedicatedTo,
      requester: validatedData.requester,
      nickname: validatedData.nickname,
      relationship: validatedData.relationship,
      story: validatedData.story,
      genre: validatedData.genre,
      voice: validatedData.voice,
      voiceType: validatedData.voiceType,
      includeNames: validatedData.includeNames,
      keywords: validatedData.keywords,
      referenceSong: validatedData.referenceSong,
      styleVoice: validatedData.styleVoice,
    };

    const result = await generateSongLyricsAndAudio(flowInput);

    if (!result.lyrics || !result.audio) {
      throw new Error("AI generation failed to produce lyrics or audio.");
    }

    return {
      lyrics: result.lyrics,
      audio: result.audio,
      error: null,
    };
  } catch (error) {
    console.error("[SONG_CREATION_ACTION_ERROR]", error);
    if (error instanceof z.ZodError) {
      return { lyrics: null, audio: null, error: "Invalid data provided.", details: error.issues };
    }
    const errorMessage = error instanceof Error ? error.message : "Failed to generate song. Please try again later.";
    return { lyrics: null, audio: null, error: errorMessage };
  }
}
