
'use server';
/**
 * @fileOverview A Genkit flow to generate album art for a song.
 *
 * - generateAlbumArt - A function that handles the generation of album art.
 * - GenerateAlbumArtInput - The input type for the generateAlbumArt function.
 * - GenerateAlbumArtOutput - The return type for the generateAlbumArt function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateAlbumArtInputSchema = z.object({
  prompt: z.string().describe('A descriptive prompt for the album art, based on the song story.'),
});
export type GenerateAlbumArtInput = z.infer<typeof GenerateAlbumArtInputSchema>;

const GenerateAlbumArtOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateAlbumArtOutput = z.infer<typeof GenerateAlbumArtOutputSchema>;


export async function generateAlbumArt(input: GenerateAlbumArtInput): Promise<GenerateAlbumArtOutput> {
  return generateAlbumArtFlow(input);
}


const generateAlbumArtFlow = ai.defineFlow(
  {
    name: 'generateAlbumArtFlow',
    inputSchema: GenerateAlbumArtInputSchema,
    outputSchema: GenerateAlbumArtOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
        // IMPORTANT: ONLY the googleai/gemini-2.0-flash-preview-image-generation model is able to generate images. You MUST use exactly this model to generate images.
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `Create a vibrant, high-quality, digital painting style album cover. The cover should not contain any text, letters, or numbers. The style should be epic and professional. The theme is: ${input.prompt}`,
        config: {
            responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
        },
    });

    if (!media || !media.url) {
        throw new Error('Image generation failed.');
    }

    return {
      imageUrl: media.url,
    };
  }
);

    