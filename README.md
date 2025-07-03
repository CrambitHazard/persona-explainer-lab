# ExplainItToMe

**ExplainItToMe** is an interactive web app that generates fun, custom explanations for any topic using world-class LLMs. Users can choose a topic and set a magical persona by picking age, fantasy race, vibe, and other fun personality traits to get creative, entertaining, and informative explanations.

## Features

- Input any topic and customize the explanation for age, fantasy race, vibe, era, and more!
- Beautiful modern UI with animated backgrounds and light/dark theme support
- Fast and playful UX: generate random creative explanations with a single click
- Persona builder lets you summon explanations as quirky characters (elves, astronauts, sassy pirates, etc.)
- Built with React, TypeScript, Tailwind CSS, and shadcn/ui
- Theming, background color customization, and a "summon" button for fun

## Tech Stack

- [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/) (for backend)

## Environment Variables Setup

Create a `.env.local` file in the project root with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
```

- Get your Supabase values from your Supabase project dashboard.
- Get your OpenRouter API key from https://openrouter.ai/.

These are required for local development and API access.

---

## Development & Editing

To get started locally:

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install
npm run dev
```

Or edit in the browser at https://lovable.dev/projects/ee195a4f-a60b-4dd5-99d6-020dcc11788f

*For more features and publishing instructions, see Lovable documentation at [docs.lovable.dev](https://docs.lovable.dev/).*

