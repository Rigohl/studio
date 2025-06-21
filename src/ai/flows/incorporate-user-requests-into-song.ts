'use server';
/**
 * @fileOverview A Genkit flow to incorporate user requests into a generated song.
 *
 * - incorporateUserRequestsIntoSong - A function that handles the incorporation of user requests into a song.
 * - IncorporateUserRequestsIntoSongInput - The input type for the incorporateUserRequestsIntoSong function.
 * - IncorporateUserRequestsIntoSongOutput - The return type for the incorporateUserRequestsIntoSong function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IncorporateUserRequestsIntoSongInputSchema = z.object({
  lyricsDraft: z.string().describe('The initial draft of the song lyrics.'),
  keywords: z.string().describe('Keywords provided by the user to include in the song.'),
  requests: z.string().describe('Specific requests from the user for the song.'),
  references: z.string().describe('References provided by the user to include in the song.'),
});
export type IncorporateUserRequestsIntoSongInput = z.infer<typeof IncorporateUserRequestsIntoSongInputSchema>;

const IncorporateUserRequestsIntoSongOutputSchema = z.object({
  revisedLyrics: z.string().describe('The revised song lyrics incorporating user requests.'),
});
export type IncorporateUserRequestsIntoSongOutput = z.infer<typeof IncorporateUserRequestsIntoSongOutputSchema>;

export async function incorporateUserRequestsIntoSong(input: IncorporateUserRequestsIntoSongInput): Promise<IncorporateUserRequestsIntoSongOutput> {
  return incorporateUserRequestsIntoSongFlow(input);
}

const prompt = ai.definePrompt({
  name: 'incorporateUserRequestsIntoSongPrompt',
  input: {schema: IncorporateUserRequestsIntoSongInputSchema},
  output: {schema: IncorporateUserRequestsIntoSongOutputSchema},
  prompt: `You are a songwriter who takes user input and intelligently weaves it into existing song lyrics.

  Your goal is to incorporate keywords, requests, and references provided by the user into the song lyrics in a way that feels natural and enhances the song.
  If incorporating the keywords, requests or references would not fit or make sense in the context of the song, then do not include it.

  Lyrics Draft: {{{lyricsDraft}}}
  Keywords: {{{keywords}}}
  Requests: {{{requests}}}
  References: {{{references}}}

  Revised Lyrics:`,
});

const incorporateUserRequestsIntoSongFlow = ai.defineFlow(
  {
    name: 'incorporateUserRequestsIntoSongFlow',
    inputSchema: IncorporateUserRequestsIntoSongInputSchema,
    outputSchema: IncorporateUserRequestsIntoSongOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
