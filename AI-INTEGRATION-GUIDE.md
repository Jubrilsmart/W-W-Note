# AI Provider Integration Guide

This project now uses a compact Gemini route in [src/app/AI/route.ts](src/app/AI/route.ts). The same pattern can be extended to OpenAI and Anthropic Claude with lower token cost if you keep the prompt short and only send the minimum useful context.

## 1. Recommended setup

Add provider API keys to your server environment (not the browser bundle):

```env
# .env.local
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_claude_key
```

Use server-side route handlers for all model calls so keys stay private.

---

## 2. Gemini integration (already wired in this app)

### Why this is a good default
- Fast response times
- Good for short structured answers
- Works well with HTML-style output

### Server route pattern

```ts
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const result = await ai.models.generateContent({
  model: 'gemini-2.0-flash',
  contents: prompt,
  config: {
    temperature: 0.2,
    maxOutputTokens: 320,
    responseMimeType: 'text/plain',
    systemInstruction: 'Return semantic HTML only.',
  },
});
```

### Token-saving tips for Gemini
- Send only the last 3-5 notes.
- Trim notes to around 700-800 characters each.
- Ask for compact HTML only.
- Set `maxOutputTokens` low, such as 240-320.

---

## 3. OpenAI integration

### Install

```bash
pnpm add openai
```

### Example server route

```ts
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const completion = await openai.responses.create({
  model: 'gpt-4.1-mini',
  input: prompt,
  temperature: 0.2,
  max_output_tokens: 320,
});

const text = completion.output_text;
```

### Recommended model choices
- `gpt-4.1-mini` for lower cost and faster responses
- `gpt-4.1-nano` for very small tasks

### Token-saving tips for OpenAI
- Use `gpt-4.1-mini` instead of larger flagship models.
- Keep the system prompt short.
- Avoid sending full note history if the user only asks a single question.
- Ask for a short answer format, such as a paragraph or 3 bullet points.

---

## 4. Claude integration

### Install

```bash
pnpm add @anthropic-ai/sdk
```

### Example server route

```ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const msg = await anthropic.messages.create({
  model: 'claude-3-5-haiku-20241022',
  max_tokens: 320,
  temperature: 0.2,
  system: 'Return semantic HTML only.',
  messages: [{ role: 'user', content: prompt }],
});

const text = msg.content[0].text;
```

### Recommended model choices
- `claude-3-5-haiku` for low-cost quick tasks
- `claude-3-7-sonnet` for more complex reasoning

### Token-saving tips for Claude
- Use a tiny system prompt.
- Restrict the response to HTML snippets.
- Send only the most relevant note fragments.
- Prefer `haiku` for simple note summarization or rewriting tasks.

---

## 5. Best practices to reduce token use

### Keep the prompt lean
Instead of sending every note, send:
- the last 3-5 notes
- only relevant note text
- a short task instruction

### Trim the content
Before sending to the model:
- collapse repeated whitespace
- remove very long notes
- drop irrelevant notes
- keep only the latest meaningful context

### Ask for a constrained format
Examples:
- `Return a short HTML snippet only.`
- `Reply in 3 bullets max.`
- `Do not explain your reasoning.`

### Use smaller models for small tasks
- Summarization: `gemini-2.0-flash`, `gpt-4.1-mini`, `claude-3-5-haiku`
- Drafting: `gpt-4.1-mini` or `claude-3-5-haiku`
- Complex reasoning: use a larger model only when necessary

### Cache and reuse when possible
If the same note context is used repeatedly, cache the transformed prompt or the generated summary.

---

## 6. Suggested production pattern

Use one shared server helper like this:

```ts
export function buildCompactPrompt(userQuery: string, notes: string[]) {
  const compactNotes = notes
    .slice(0, 5)
    .map((note) => note.trim().replace(/\s+/g, ' '))
    .map((note) => (note.length > 700 ? `${note.slice(0, 697)}...` : note));

  return `You are a concise assistant. Reply with short HTML only.\n\nNotes:\n${compactNotes.join('\n\n')}\n\nQuestion:\n${userQuery}`;
}
```

That keeps your requests smaller, faster, and cheaper.
