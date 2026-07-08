// src/app/AI/route.ts
import { getUser } from '@/auth/server';
import { env } from '@/config/env';
import prisma from '@/config/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const apiKey = env.AIApi.key || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_AI_KEY;
const ai = apiKey ? new GoogleGenerativeAI(apiKey) : null;

function buildNotesContext(notes: Array<{ text: string }>) {
  return notes
    .filter((note) => note.text?.trim())
    .slice(0, 5)
    .map((note) => note.text.trim().replace(/\s+/g, ' '))
    .map((text) => (text.length > 800 ? `${text.slice(0, 797)}...` : text))
    .join('\n\n');
}

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const { userQuery } = (await request.json()) as { userQuery?: string };
    if (!userQuery?.trim()) {
      return NextResponse.json({ error: 'Missing input query' }, { status: 400 });
    }

    const userNotes = await prisma.note.findMany({
      where: { authorId: user.id },
      orderBy: { updatedAt: 'desc' },
      select: { text: true },
    });

    const notesContext = buildNotesContext(userNotes);

    if (!ai) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 });
    }

    const prompt = `You are a concise workspace assistant.
Reply with short, polished semantic HTML only. Keep the answer compact and helpful.
Use <h3> for headings, <p> for explanations, <ul>/<li> for lists, and avoid markdown code fences.

Workspace notes:
${notesContext || 'No notes yet.'}

User question:
${userQuery.trim()}`;

    const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
    console.log('apiKey:', apiKey);
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        topP: 0.9,
        maxOutputTokens: 2048,
      },
    });

    const responseText = result.response.text().trim();
    if (!responseText) {
      throw new Error('Empty processing output received from Gemini API');
    }

    return NextResponse.json({ text: responseText });
  } catch (error) {
    console.error('CRITICAL GEMINI ROUTE CRASH ERROR:', error);
    return NextResponse.json({ error: 'Failed to process workspace prompt session' }, { status: 500 });
  }
}

