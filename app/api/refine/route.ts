// src/app/api/refine/route.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// --- THIS IS THE FIX ---
export const runtime = 'edge';
// ---------------------

// Initialize the Google Generative AI client with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { systemPrompt, userPrompt, settings } = await req.json();

    if (!userPrompt || !settings || !settings.model) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Select the appropriate Gemini model
    const model = genAI.getGenerativeModel({ model: settings.model });

    // Construct the full prompt
    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    // Generate content using the Gemini model
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Return the refined prompt
    return NextResponse.json({ refinedPrompt: text });
  } catch (error) {
    console.error("Error processing prompt with Gemini:", error);
    return NextResponse.json(
      { error: "Failed to process prompt with Gemini" },
      { status: 500 }
    );
  }
}