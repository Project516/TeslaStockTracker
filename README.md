# Tesla Stock Tracker

A small web app that tracks Tesla (TSLA) stock in real time using the
**Google Gemini API** with **Google Search grounding**. Instead of a plain
dashboard, it shows the market from the perspective of a **short seller**:
the app is happy (🤑) when the price drops and devastated (😭) when it rises.

This was built as a concept app to demonstrate grounding an LLM with live web
search results.

## Features

- **Live Tesla price, change, and percent change** pulled from Gemini's
  grounded search results.
- **Short-seller "Mood Indicator"** that reacts to the direction of the market:
  - 🤑 "IT'S CRASHING! YES!" when the stock is down.
  - 😭 "OH NO, IT'S GOING UP!" when the stock is up.
  - 😐 neutral waiting state when the market is flat.
- **Standard market card** showing the price, change amount, percent change,
  a one-sentence natural-language summary, and links to the grounding sources.
- **Refresh button** to re-query the current data.
- **Error handling** with a retry prompt when the API call fails.

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 7](https://vitejs.dev/) as the dev server and build tool
- [Tailwind CSS v4](https://tailwindcss.com/) for styling
- [lucide-react](https://lucide.dev/) for icons
- [`@google/genai`](https://www.npmjs.com/package/@google/genai) (Gemini SDK)
  with the `gemini-2.5-flash` model and the Google Search grounding tool

## Prerequisites

- Node.js (a recent LTS version is recommended)
- A **Gemini API key** with access to `gemini-2.5-flash` and Google Search
  grounding. You can obtain one from
  [Google AI Studio](https://aistudio.google.com/app/apikey).

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file at the project root called `.env.local`
   and add your Gemini API key:

   ```bash
   # .env.local
   GEMINI_API_KEY=your_api_key_here
   ```

   The Vite config maps `GEMINI_API_KEY` (the value used on Vercel) to
   `process.env.API_KEY`, which is what the app reads at runtime. If
   `GEMINI_API_KEY` is not set, it falls back to `API_KEY`.

   > ⚠️ Never commit your API key. `.env.local` is already covered by the
   > `*.local` pattern in `.gitignore`.

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Build for production:

   ```bash
   npm run build
   ```

5. Preview the production build locally:

   ```bash
   npm run preview
   ```

## Project Structure

```
.
├── index.html              # HTML entry; loads Tailwind via CDN + importmap
├── index.tsx               # React root mount
├── App.tsx                 # Main app: state management, layout, refresh
├── types.ts                # StockData interface + AppState enum
├── services/
│   └── geminiService.ts    # Calls Gemini with Google Search grounding and parses the response
├── components/
│   ├── MoodIndicator.tsx   # Short-seller mood/emoji reaction
│   └── StockCard.tsx       # Price card with change, summary, and sources
├── vite.config.ts          # Vite config; maps env API key to process.env.API_KEY
├── package.json
└── tsconfig.json
```

## How It Works

`geminiService.ts` sends a prompt to `gemini-2.5-flash` with the
`googleSearch` tool enabled. The prompt asks the model to return:

```
DIRECTION: <UP or DOWN or NEUTRAL>
PRICE: <Current Price with currency symbol>
CHANGE: <Change amount with currency symbol>
PERCENT: <Percentage change with %>
```

followed by a one-sentence summary. The service parses those four lines and
also extracts the grounding source links from the response metadata so they
can be displayed under the stock card.

## Deployment

This app is designed to deploy on **Vercel**. Set the `GEMINI_API_KEY`
environment variable in your Vercel project settings so it is available at
build/runtime, then deploy with Vite as the framework preset.

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE).
