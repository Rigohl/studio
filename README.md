# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Project Structure Map

This is a breakdown of your web application's structure, built with Next.js (App Router), Tailwind CSS, and Genkit for AI.

### Root Directory (`/`)

*   **`package.json`**: The project's "birth certificate." It defines dependencies (libraries like React, Next.js, Genkit) and scripts to run, build, and test your website (e.g., `npm run dev`).
*   **`tailwind.config.ts`**: The control center for your design. This is where you define colors (`emotional-pink`, `accent-gold`), fonts (`Playfair Display`), and other Tailwind CSS style customizations.
*   **`next.config.ts`**: Configuration file for Next.js.
*   **`tsconfig.json`**: Configuration file for TypeScript. It helps prevent errors and keep the code clean.
*   **`apphosting.yaml`**: Defines the configuration for deploying to Firebase App Hosting.

---

### `src` Folder (Source Code)

This is the main folder where all your application's code lives.

*   **`src/app/`**: The heart of the application. Each folder inside represents a route (a page) on your website.
    *   `layout.tsx`: The main template for the entire website. It contains the header (`<Header />`), footer (`<Footer />`), and the base HTML structure that wraps all other pages.
    *   `page.tsx`: This is your **homepage** (what you see at `yourdomain.com/`).
    *   `globals.css`: Defines global styles and color variables (theme) used by ShadCN and Tailwind components.
    *   **Page Folders** (e.g., `/faq`, `/ejemplos`, `/formularios`, `/test-pago`):
        *   `page.tsx`: Inside each of these folders, this file contains the React component that renders that specific page.
        *   `actions.ts` (only in `/test-pago`): A special Next.js file (Server Action). It contains the server-side logic that runs securely when the user submits the form. It handles calling the AI to create the song.

*   **`src/ai/`**: The brain of the artificial intelligence.
    *   `genkit.ts`: Initializes and configures Genkit, the AI tool.
    *   **`flows/`**: This is where the AI workflows are defined.
        *   `generate-song-lyrics-and-audio.ts`: Contains the prompt and logic for the AI to generate both the lyrics and the audio file for the song based on the form responses.
        *   `incorporate-user-requests-into-song.ts`: Defines a flow for future song revision features.

*   **`src/components/`**: The reusable building blocks of your interface.
    *   `Header.tsx`, `Footer.tsx`: The header and footer components.
    *   `SongCreationForm.tsx`: The most complex component. It is the song creation questionnaire, with all its logic: fields, validations, the differentiated visual experience (emotional vs. corrido), and the multi-step flow (form -> upsell -> loading -> result).
    *   **`ui/`**: Pre-built UI components from **ShadCN** (e.g., `Button.tsx`, `Card.tsx`, `Input.tsx`). You generally don't need to modify these.

*   **`src/hooks/`**: Custom React "hooks" for reusable logic.
    *   `use-toast.ts`: Handles pop-up notifications (toasts).
    *   `use-mobile.ts`: A utility to detect if the website is being viewed on a mobile device.

*   **`src/lib/`**: Utility functions.
    *   `utils.ts`: Contains `cn`, a very useful function for intelligently combining Tailwind CSS classes.

---

### `public` Folder

This is where static files that are publicly accessible, like images, sample audio, or fonts, are stored.
