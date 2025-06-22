
'use server';
/**
 * @fileOverview An AI agent that generates song lyrics and audio based on user input.
 *
 * - generateSongLyricsAndAudio - A function that handles the song generation process.
 * - GenerateSongLyricsAndAudioInput - The input type for the generateSongLyricsAndAudio function.
 * - GenerateSongLyricsAndAudioOutput - The return type for the generateSongLyricsAndAudio function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';
import wav from 'wav';

const GenerateSongLyricsAndAudioInputSchema = z.object({
  email: z.string().email().describe('The email of the requester to send the final song to.'),
  dedicatedTo: z.string().describe('The person the song is dedicated to.'),
  requester: z.string().describe('The person requesting the song.'),
  nickname: z.string().optional().describe('The nickname of the person the song is dedicated to.'),
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
  instrumentation: z.string().optional().describe('The desired instrumentation for the song.'),
  mood: z.string().optional().describe('The desired mood or atmosphere for the song.'),
  tempo: z.string().optional().describe('The desired tempo for the song (e.g., slow, medium, fast).'),
  structure: z.string().optional().describe('The desired structure for the song (e.g., verse-chorus, narrative).'),
  ending: z.string().optional().describe('The desired ending for the song (e.g., fade out, abrupt end).'),
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

const lyricsPrompt = ai.definePrompt({
  name: 'generateLyricsPrompt',
  input: {schema: GenerateSongLyricsAndAudioInputSchema},
  output: {schema: z.object({lyrics: z.string()})},
  prompt: `Eres un compositor experto y productor musical. Escribe una canción detallada basada en los siguientes parámetros.
La canción es de tipo {{songType}}.
Es del género {{genre}}.
Está dedicada a {{dedicatedTo}}{{#if nickname}} (apodo: {{nickname}}){{/if}}, de parte de {{requester}}. Su relación es de {{relationship}}.

La historia detrás de la canción es fundamental: {{{story}}}

{{#if includeNames}}
Asegúrate de incluir los nombres "{{dedicatedTo}}" y "{{requester}}" en la letra de forma natural.
{{/if}}

Parámetros de composición avanzada:
{{#if mood}}
- El ambiente (mood) de la canción debe ser: {{{mood}}}.
{{/if}}
{{#if tempo}}
- El tempo de la canción debe ser: {{{tempo}}}.
{{/if}}
{{#if instrumentation}}
- La instrumentación principal debe incluir: {{{instrumentation}}}.
{{/if}}
{{#if structure}}
- La estructura de la canción debe seguir este formato: {{{structure}}}.
{{/if}}
{{#if ending}}
- El final de la canción debe ser: {{{ending}}}.
{{/if}}

Inspiración y Estilo:
{{#if keywords}}
- Incorpora estas palabras clave de forma creativa: {{{keywords}}}.
{{/if}}
{{#if referenceSong}}
- Usa esta canción como inspiración para el estilo y el tono: {{{referenceSong}}}.
{{/if}}
{{#if styleVoice}}
- El estilo vocal debe ser como: {{{styleVoice}}}.
{{/if}}

Genera únicamente la letra de la canción. La letra debe ser rica, coherente y seguir todas las instrucciones proporcionadas.`,
});

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

const generateSongLyricsAndAudioFlow = ai.defineFlow(
  {
    name: 'generateSongLyricsAndAudioFlow',
    inputSchema: GenerateSongLyricsAndAudioInputSchema,
    outputSchema: GenerateSongLyricsAndAudioOutputSchema,
  },
  async (input) => {
    // 1. Generate Lyrics
    const lyricsResponse = await lyricsPrompt(input);
    const lyrics = lyricsResponse.output?.lyrics;
    if (!lyrics) {
      throw new Error('Failed to generate lyrics.');
    }

    // 2. Generate Audio from Lyrics using TTS
    const voiceName = input.voice === 'female' ? 'Achernar' : 'Algenib';

    const {media} = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName},
          },
        },
      },
      prompt: lyrics,
    });

    if (!media) {
      throw new Error('Failed to generate audio from lyrics.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const audioWavBase64 = await toWav(audioBuffer);

    return {
      lyrics: lyrics,
      audio: 'data:audio/wav;base64,' + audioWavBase64,
    };
  }
);
