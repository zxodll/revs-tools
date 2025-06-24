import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { prompt, model: modelName } = await req.json();

  const model = google(modelName === 'pro' ? 'models/gemini-1.5-pro-latest' : 'models/gemini-1.5-flash-latest');

  const result = await streamText({
    model,
    prompt: `Refine the following prompt: ${prompt}`,
  });

  return result.toDataStreamResponse();
}
