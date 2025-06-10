import { NextResponse } from "next/server"

// The PresetFile type is defined in the frontend, but we need it here for type safety.
// We are importing it, assuming path aliases are configured.
import type { PresetFile } from "@/app/roblox-fastflags/preset-browser"

/**
 * Helper to get the Cloudflare KV namespace.
 * In a Cloudflare Pages environment with a KV binding,
 * the binding is available on the `process.env` object.
 * 
 * @throws {Error} If the PRESETS_KV binding is not found.
 * @returns {KVNamespace} The KV namespace instance.
 */
function getKVNamespace(): KVNamespace {
  // @ts-ignore: process.env.PRESETS_KV is a custom binding provided by Cloudflare.
  const kv = process.env.PRESETS_KV as KVNamespace | undefined;

  if (!kv) {
    // This will happen if the binding is not configured in the Cloudflare dashboard.
    throw new Error("PRESETS_KV binding not found. Please configure it in your Cloudflare project settings.")
  }
  return kv
}

/**
 * GET /api/presets
 * Fetches all presets from the Cloudflare KV store.
 * Lists all keys, then fetches each value.
 * @returns {NextResponse} A JSON response with the list of presets or an error.
 */
export async function GET() {
  try {
    const kv = getKVNamespace()
    const list = await kv.list()

    if (list.keys.length === 0) {
      return NextResponse.json([])
    }

        const presetPromises = list.keys.map((key: KVNamespaceListKey) => kv.get(key.name, "json"))
    const presets = (await Promise.all(presetPromises)).filter(Boolean) as PresetFile[]

    return NextResponse.json(presets)
  } catch (error) {
    console.error("Failed to fetch presets:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    // In production, you might want to avoid sending detailed error messages to the client.
    return NextResponse.json({ error: "Failed to fetch presets", details: errorMessage }, { status: 500 })
  }
}

/**
 * POST /api/presets
 * Creates a new preset in the Cloudflare KV store.
 * @param {Request} request - The incoming request object.
 * @returns {NextResponse} A JSON response with the newly created preset or an error.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Basic validation for required fields.
    // For a production app, consider using a validation library like Zod.
    if (!body.title || !body.content || !body.category || !body.difficulty) {
      return NextResponse.json({ error: "Missing required fields: title, content, category, and difficulty are required." }, { status: 400 })
    }
    
    const now = new Date().toISOString()
    const newPreset: PresetFile = {
      id: `preset-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: body.title,
      description: body.description || "",
      content: body.content,
      category: body.category,
      difficulty: body.difficulty,
      compatibility: body.compatibility || [],
      createdAt: now,
      updatedAt: now,
    }

    const kv = getKVNamespace()
    await kv.put(newPreset.id, JSON.stringify(newPreset))

    return NextResponse.json(newPreset, { status: 201 })
  } catch (error) {
    console.error("Failed to create preset:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ error: "Failed to create preset", details: errorMessage }, { status: 500 })
  }
}

// The 'edge' runtime is recommended for Cloudflare Pages for best performance.
export const runtime = "edge"
