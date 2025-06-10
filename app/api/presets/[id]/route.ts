import { NextResponse } from "next/server"
import type { PresetFile } from "@/app/roblox-fastflags/preset-browser"

/**
 * Helper to get the Cloudflare KV namespace.
 */
function getKVNamespace(): KVNamespace {
  // @ts-ignore
  const kv = process.env.PRESETS_KV as KVNamespace | undefined
  if (!kv) {
    throw new Error("PRESETS_KV binding not found. Please configure it in your Cloudflare project settings.")
  }
  return kv
}

interface RouteParams {
  params: { id: string }
}

/**
 * GET /api/presets/[id]
 * Fetches a single preset by its ID.
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = params
    const kv = getKVNamespace()
    const preset = await kv.get(id, "json")

    if (!preset) {
      return NextResponse.json({ error: "Preset not found" }, { status: 404 })
    }

    return NextResponse.json(preset)
  } catch (error) {
    console.error(`Failed to fetch preset ${params.id}:`, error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ error: "Failed to fetch preset", details: errorMessage }, { status: 500 })
  }
}

/**
 * PUT /api/presets/[id]
 * Updates an existing preset.
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = params
    const body = await request.json()
    const kv = getKVNamespace()

    const existingPreset = await kv.get<PresetFile>(id, "json")
    if (!existingPreset) {
      return NextResponse.json({ error: "Preset not found" }, { status: 404 })
    }

    const updatedPreset: PresetFile = {
      ...existingPreset,
      ...body,
      id, // Ensure the ID remains unchanged
      updatedAt: new Date().toISOString(),
    }

    await kv.put(id, JSON.stringify(updatedPreset))

    return NextResponse.json(updatedPreset)
  } catch (error) {
    console.error(`Failed to update preset ${params.id}:`, error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ error: "Failed to update preset", details: errorMessage }, { status: 500 })
  }
}

/**
 * DELETE /api/presets/[id]
 * Deletes a preset by its ID.
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = params
    const kv = getKVNamespace()

    // Check if the preset exists before deleting
    const existingPreset = await kv.get(id)
    if (!existingPreset) {
      return NextResponse.json({ error: "Preset not found" }, { status: 404 })
    }

    await kv.delete(id)

    return NextResponse.json({ message: `Preset ${id} deleted successfully` }, { status: 200 })
  } catch (error) {
    console.error(`Failed to delete preset ${params.id}:`, error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ error: "Failed to delete preset", details: errorMessage }, { status: 500 })
  }
}

export const runtime = "edge"
