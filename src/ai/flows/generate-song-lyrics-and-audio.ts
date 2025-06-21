'use server';
/**
 * @fileOverview An AI agent that generates song lyrics and audio based on user input.
 *
 * - generateSongLyricsAndAudio - A function that handles the song generation process.
 * - GenerateSongLyricsAndAudioInput - The input type for the generateSongLyricsAndAudio function.
 * - GenerateSongLyricsAndAudioOutput - The return type for the generateSongLyricsAndAudio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { generateLyrics } from '@/services/lyrics-service';
import { generateMusic } from '@/services/music-service';

const GenerateSongLyricsAndAudioInputSchema = z.object({
  dedicatedTo: z.string().describe('The person the song is dedicated to.'),
  requester: z.string().describe('The person requesting the song.'),
  nickname: z.string().describe('The nickname of the person the song is dedicated to.'),
  relationship: z.string().describe('The relationship of the requester to the dedicatee.'),
  story: z.string().describe('The story or background for the song.'),
  genre: z.string().describe('The genre of the song.'),
  voice: z.string().describe('The desired voice for the song.'),
  voiceType: z.string().describe('The type of voice for the song (e.g., male, female).'),
  songType: z.string().describe('The type of song (Emotional song or Corridos bélicos)'),
  keywords: z.string().optional().describe('Keywords to be included in the song.'),
  referenceSong: z.string().optional().describe('A reference song for inspiration.'),
  styleVoice: z.string().optional().describe('The desired style of voice for the song.'),
  includeNames: z.boolean().optional().describe('Whether to include names in the song.'),
});

export type GenerateSongLyricsAndAudioInput = z.infer<typeof GenerateSongLyricsAndAudioInputSchema>;

const GenerateSongLyricsAndAudioOutputSchema = z.object({
  lyrics: z.string().describe('The generated lyrics of the song.'),
  audio: z.string().describe('The generated audio of the song as a base64 encoded data URI.'),
});

export type GenerateSongLyricsAndAudioOutput = z.infer<typeof GenerateSongLyricsAndAudioOutputSchema>;

export async function generateSongLyricsAndAudio(input: GenerateSongLyricsAndAudioInput): Promise<GenerateSongLyricsAndAudioOutput> {
  return generateSongLyricsAndAudioFlow(input);
}

const generateSongLyricsAndAudioFlow = ai.defineFlow(
  {
    name: 'generateSongLyricsAndAudioFlow',
    inputSchema: GenerateSongLyricsAndAudioInputSchema,
    outputSchema: GenerateSongLyricsAndAudioOutputSchema,
  },
  async input => {
    const lyrics = await generateLyrics(input);
    const audio = await generateMusic(lyrics, input.voice);

    return {
      lyrics: lyrics,
      audio: audio,
    };
  }
);
