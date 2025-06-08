import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent } from "@/components/ui/card"
import { Code, FileArchive, Settings } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
          Rev&apos;s Tools
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          for me, myself, and i
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/code-merger" className="block">
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:border-purple-500">
                  <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                    <Code size={48} className="mb-4 text-purple-500" />
                    <h2 className="text-2xl font-semibold mb-2 group-hover:text-purple-500 transition-colors">
                      Code Files Merger
                    </h2>
                    <p className="text-muted-foreground text-center">
                      Combine and format multiple files into one downloadable text file
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Merge multiple code files with proper formatting for sharing or AI input</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/cbz-tool" className="block">
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:border-blue-500">
                  <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                    <FileArchive size={48} className="mb-4 text-blue-500" />
                    <h2 className="text-2xl font-semibold mb-2 group-hover:text-blue-500 transition-colors">
                      CBZ Tool
                    </h2>
                    <p className="text-muted-foreground text-center">Extract and compress images into CBZ files</p>
                  </CardContent>
                </Card>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Extract and compress images into CBZ files, personally using for upscaling</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/roblox-fastflags" className="block">
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 hover:border-green-500">
                  <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                    <Settings size={48} className="mb-4 text-green-500" />
                    <h2 className="text-2xl font-semibold mb-2 group-hover:text-green-500 transition-colors">
                      Roblox FastFlags
                    </h2>
                    <p className="text-muted-foreground text-center">
                      Create, edit, and manage Roblox FastFlag JSON files
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Manage Roblox FastFlag configurations with a user-friendly JSON editor</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
