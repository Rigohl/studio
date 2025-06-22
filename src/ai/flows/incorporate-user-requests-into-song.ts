
'use server';
/**
 * @fileOverview A Genkit flow to incorporate user requests into a generated song and regenerate the audio.
 *
 * - incorporateUserRequestsIntoSong - A function that handles the incorporation of user requests into a song.
 * - IncorporateUserRequestsIntoSongInput - The input type for the incorporateUserRequestsIntoSong function.
 * - IncorporateUserRequestsIntoSongOutput - The return type for the incorporateUserRequestsIntoSong function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';
import wav from 'wav';

// Re-using the input schema from the main generation flow for consistency
const SongDetailsSchema = z.object({
  email: z.string().email(),
  dedicatedTo: z.string(),
  requester: z.string(),
  nickname: z.string().optional(),
  relationship: z.string(),
  story: z.string(),
  genre: z.string(),
  voice: z.string(),
  voiceType: z.string(),
  songType: z.string(),
  keywords: z.string().optional(),
  referenceSong: z.string().optional(),
  styleVoice: z.string().optional(),
  includeNames: z.boolean().optional(),
  instrumentation: z.string().optional(),
  mood: z.string().optional(),
  tempo: z.string().optional(),
  structure: z.string().optional(),
  ending: z.string().optional(),
  plan: z.string(),
  famousCollaboration: z.boolean().optional(),
  inspirationalArtist: z.string().optional(),
});


const IncorporateUserRequestsIntoSongInputSchema = z.object({
  lyricsDraft: z.string().describe('The initial draft of the song lyrics.'),
  requests: z.string().describe('Specific requests from the user for changing the song.'),
  songDetails: SongDetailsSchema.describe("The original parameters of the song for context."),
});
export type IncorporateUserRequestsIntoSongInput = z.infer<typeof IncorporateUserRequestsIntoSongInputSchema>;

const IncorporateUserRequestsIntoSongOutputSchema = z.object({
  revisedLyrics: z.string().describe('The revised song lyrics incorporating user requests.'),
  revisedAudio: z.string().describe('The re-generated audio for the revised song as a base64 encoded data URI.'),
});
export type IncorporateUserRequestsIntoSongOutput = z.infer<typeof IncorporateUserRequestsIntoSongOutputSchema>;

export async function incorporateUserRequestsIntoSong(input: IncorporateUserRequestsIntoSongInput): Promise<IncorporateUserRequestsIntoSongOutput> {
  return incorporateUserRequestsIntoSongFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const revisionPrompt = ai.definePrompt({
  name: 'reviseLyricsPrompt',
  input: {schema: IncorporateUserRequestsIntoSongInputSchema},
  output: {schema: z.object({ revisedLyrics: z.string() })},
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
       {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  },
  prompt: `You are a professional songwriter revising a song based on client feedback.
Your goal is to intelligently incorporate the requested changes into the existing lyrics. Maintain the song's original tone, style, and core story as much as possible unless the request specifically asks to change it.

Here is the original song context:
- Song Type: {{songDetails.songType}}
- Genre: {{songDetails.genre}}
- Dedicated to: {{songDetails.dedicatedTo}} from {{songDetails.requester}}
- Story: {{{songDetails.story}}}
{{#if songDetails.inspirationalArtist}}
- Inspirational Style: {{{songDetails.inspirationalArtist}}}
{{/if}}

Here is the current draft of the lyrics:
--- LYRICS DRAFT ---
{{{lyricsDraft}}}
--- END DRAFT ---

Here are the client's revision requests:
--- CLIENT REQUESTS ---
{{{requests}}}
--- END REQUESTS ---

Please generate the new, revised lyrics for the song. Only output the lyrics.
`,
});


const incorporateUserRequestsIntoSongFlow = ai.defineFlow(
  {
    name: 'incorporateUserRequestsIntoSongFlow',
    inputSchema: IncorporateUserRequestsIntoSongInputSchema,
    outputSchema: IncorporateUserRequestsIntoSongOutputSchema,
  },
  async (input) => {
    // 1. Generate revised lyrics
    const revisionResponse = await revisionPrompt(input);
    const revisedLyrics = revisionResponse.output?.revisedLyrics;

    if (!revisedLyrics) {
      throw new Error('Failed to generate revised lyrics.');
    }

    // 2. Generate new audio from the revised lyrics
    const voiceName = input.songDetails.voice === 'female' ? 'Achernar' : 'Algenib';

    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
      prompt: revisedLyrics,
    });

    if (!media) {
      throw new Error('Failed to generate audio for revised lyrics.');
    }
    
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const audioWavBase64 = await toWav(audioBuffer);

    return {
      revisedLyrics,
      revisedAudio: 'data:audio/wav;base64,' + audioWavBase64,
    };
  }
);
