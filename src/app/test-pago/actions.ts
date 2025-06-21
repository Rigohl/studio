"use server";

import { generateSongLyricsAndAudio, GenerateSongLyricsAndAudioInput } from "@/ai/flows/generate-song-lyrics-and-audio";
import { z } from "zod";

const actionSchema = z.object({
  songType: z.enum(["emotional", "corrido"]),
  dedicatedTo: z.string(),
  requester: z.string(),
  nickname: z.string().optional(),
  relationship: z.string(),
  story: z.string(),
  genre: z.string(),
  voice: z.enum(["male", "female"]),
  voiceType: z.string(), // Mapped from 'voice' in the form
  includeNames: z.boolean().optional(),
  keywords: z.string().optional(),
  referenceSong: z.string().optional(),
  styleVoice: z.string().optional(),
  plan: z.enum(["creator", "artist", "master"]),
});

export async function createSongAction(data: z.infer<typeof actionSchema>) {
  try {
    const validatedData = actionSchema.parse(data);

    // The Genkit flow expects a specific input structure.
    const flowInput: GenerateSongLyricsAndAudioInput = {
      songType: validatedData.songType,
      dedicatedTo: validatedData.dedicatedTo,
      requester: validatedData.requester,
      nickname: validatedData.nickname,
      relationship: validatedData.relationship,
      story: validatedData.story,
      genre: validatedData.genre,
      voice: validatedData.voice,
      voiceType: validatedData.voiceType, // Using voice as voiceType for now.
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
    };
  } catch (error) {
    console.error("[SONG_CREATION_ACTION_ERROR]", error);
    if (error instanceof z.ZodError) {
      return { error: "Invalid data provided.", details: error.issues };
    }
    return { error: "Failed to generate song. Please try again later." };
  }
}
