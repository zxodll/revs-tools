"use client"

import { useState, useCallback, useRef } from "react"
import { useDropzone } from "react-dropzone"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Trash2,
  FileText,
  FolderOpen,
  Download,
  Copy,
  X,
  GripVertical,
  FileIcon,
  ImageIcon,
  FileVideo,
  FileAudio,
  FileBadge,
  FileArchive,
  FileCode,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

// File type for our application
interface FileItem {
  id: string
  name: string
  path: string
  type: string
  size: number
  content?: string
  checked: boolean
  isTextFile: boolean
}

// Constants for file types
const TEXT_FILE_EXTENSIONS = [
  // Programming languages
  ".txt",
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".py",
  ".html",
  ".css",
  ".json",
  ".md",
  ".csv",
  ".xml",
  ".yml",
  ".yaml",
  ".sh",
  ".bat",
  ".c",
  ".cpp",
  ".h",
  ".java",
  ".php",
  ".rb",
  ".go",
  ".rs",
  ".swift",
  ".kt",
  ".sql",
  ".lua",
  ".pl",
  ".pm",
  ".r",
  ".scala",
  ".groovy",
  ".dart",
  ".elm",
  ".erl",
  ".ex",
  ".fs",
  ".fsx",
  ".hs",
  ".lhs",
  ".lisp",
  ".clj",
  ".cljs",

  // Configuration files
  ".ini",
  ".toml",
  ".conf",
  ".config",
  ".properties",
  ".env",

  // Document formats
  ".tex",
  ".rst",
  ".adoc",
  ".textile",
  ".wiki",
  ".org",

  // Web formats
  ".svg",
  ".less",
  ".sass",
  ".scss",
  ".vue",
  ".jade",
  ".pug",
  ".ejs",

  // Data formats
  ".tsv",
  ".jsonl",
  ".graphql",
  ".gql",

  // Shell scripts
  ".zsh",
  ".fish",
  ".bash",
  ".ps1",

  // Other text formats
  ".log",
  ".diff",
  ".patch",
]

// Binary file extensions (common non-text files)
const BINARY_FILE_EXTENSIONS = [
  // Images
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".tiff",
  ".webp",
  ".ico",
  ".heic",

  // Audio
  ".mp3",
  ".wav",
  ".ogg",
  ".flac",
  ".aac",
  ".m4a",
  ".wma",

  // Video
  ".mp4",
  ".avi",
  ".mov",
  ".wmv",
  ".flv",
  ".mkv",
  ".webm",
  ".m4v",

  // Documents
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",

  // Archives
  ".zip",
  ".rar",
  ".7z",
  ".tar",
  ".gz",
  ".bz2",
  ".xz",
  ".iso",

  // Executables
  ".exe",
  ".dll",
  ".so",
  ".dylib",
  ".app",
  ".apk",
  ".deb",
  ".rpm",

  // Fonts
  ".ttf",
  ".otf",
  ".woff",
  ".woff2",
  ".eot",

  // Other binary formats
  ".db",
  ".sqlite",
  ".mdb",
  ".accdb",
  ".psd",
  ".ai",
  ".sketch",
]

// Language mapping for code blocks
const LANGUAGE_MAPPING: Record<string, string> = {
  ".js": "javascript",
  ".jsx": "jsx",
  ".ts": "typescript",
  ".tsx": "tsx",
  ".py": "python",
  ".html": "html",
  ".css": "css",
  ".json": "json",
  ".md": "markdown",
  ".xml": "xml",
  ".yml": "yaml",
  ".yaml": "yaml",
  ".sh": "bash",
  ".bat": "batch",
  ".c": "c",
  ".cpp": "cpp",
  ".h": "c",
  ".java": "java",
  ".php": "php",
  ".rb": "ruby",
  ".go": "go",
  ".rs": "rust",
  ".swift": "swift",
  ".kt": "kotlin",
  ".sql": "sql",
  ".lua": "lua",
  ".r": "r",
  ".dart": "dart",
  ".scala": "scala",
  ".groovy": "groovy",
  ".clj": "clojure",
  ".cljs": "clojure",
  ".ps1": "powershell",
  ".graphql": "graphql",
  ".gql": "graphql",
}

// Helper function to determine if a file is a text file
const isTextFile = (filename: string): boolean => {
  const extension = filename.substring(filename.lastIndexOf(".")).toLowerCase()
  return TEXT_FILE_EXTENSIONS.includes(extension)
}

// Helper function to get file icon based on file type
const getFileIcon = (file: FileItem) => {
  const extension = file.path.substring(file.path.lastIndexOf(".")).toLowerCase()

  if (file.isTextFile) {
    if ([".js", ".jsx", ".ts", ".tsx", ".py", ".java", ".c", ".cpp", ".go", ".rs", ".swift"].includes(extension)) {
      return <FileCode size={16} className="text-blue-400" />
    }
    return <FileText size={16} className="text-green-400" />
  }

  // Non-text files
  if ([".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"].includes(extension)) {
    return <ImageIcon size={16} className="text-purple-400" />
  }

  if ([".mp4", ".avi", ".mov", ".wmv", ".flv", ".mkv"].includes(extension)) {
    return <FileVideo size={16} className="text-red-400" />
  }

  if ([".mp3", ".wav", ".ogg", ".flac", ".aac"].includes(extension)) {
    return <FileAudio size={16} className="text-yellow-400" />
  }

  if ([".zip", ".rar", ".7z", ".tar", ".gz"].includes(extension)) {
    return <FileArchive size={16} className="text-orange-400" />
  }

  if ([".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx"].includes(extension)) {
    return <FileBadge size={16} className="text-blue-400" />
  }

  return <FileIcon size={16} className="text-muted-foreground" />
}

// DnD item type
const ItemTypes = {
  FILE: "file",
}

// Draggable file item component
const DraggableFileItem = ({
  file,
  index,
  moveFile,
  removeFile,
  toggleFileCheck,
}: {
  file: FileItem
  index: number
  moveFile: (dragIndex: number, hoverIndex: number) => void
  removeFile: (id: string) => void
  toggleFileCheck: (id: string) => void
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.FILE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.FILE,
    hover: (item: { index: number }, monitor) => {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      // Calculate mouse position
      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the item's height
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      moveFile(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  drag(drop(ref))

  // Determine if we should show the insertion indicator and where
  const showTopIndicator = isOver && canDrop && !isDragging
  const showBottomIndicator = false // We'll only use the top indicator for simplicity

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isDragging ? 1.02 : 1,
        boxShadow: isDragging
          ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        zIndex: isDragging ? 10 : 1,
      }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        opacity: { duration: 0.2 },
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative"
    >
      {/* Top insertion indicator */}
      {showTopIndicator && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 3 }}
          className="absolute top-0 left-0 right-0 bg-primary rounded-full"
          style={{ transform: "translateY(-50%)" }}
        />
      )}

      <div
        ref={ref}
        className={`flex items-center p-3 border rounded-md mb-2 transition-all duration-200 min-h-[52px]
          ${isDragging ? "opacity-50 bg-secondary" : "bg-card"}
          ${file.checked ? "" : "opacity-70"}
          ${isHovering && !isDragging ? "border-primary/50" : ""}
        `}
        style={{
          transform: isDragging ? "rotate(1deg)" : "rotate(0deg)",
        }}
      >
        <motion.div
          className="flex items-center justify-center mr-2 cursor-move p-1 rounded-md hover:bg-secondary min-w-[28px]"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <GripVertical size={16} className="text-muted-foreground" />
        </motion.div>

        <div className="flex items-center justify-center h-full mr-2 min-w-[24px]">
          <motion.div
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="flex items-center justify-center"
          >
            <Checkbox
              id={`file-${file.id}`}
              checked={file.checked}
              onCheckedChange={() => toggleFileCheck(file.id)}
              className="transition-all duration-300"
            />
          </motion.div>
        </div>

        <div className="flex-1 overflow-hidden transition-all duration-300">
          <div className="flex items-center gap-2">
            <span className="flex-shrink-0">{getFileIcon(file)}</span>
            <span
              className={`font-medium truncate transition-all duration-300 ${
                file.checked ? "" : "line-through text-muted-foreground"
              }`}
            >
              {file.name}
            </span>
            {!file.isTextFile && (
              <Badge variant="outline" className="ml-1 text-xs py-0 h-5">
                Binary
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground truncate">{file.path}</div>
        </div>

        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeFile(file.id)}
            className="ml-2 transition-all duration-200"
          >
            <Trash2 size={16} className="text-destructive" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function CodeMerger() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [headerText, setHeaderText] = useState("")
  const [footerText, setFooterText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [combinedText, setCombinedText] = useState("")
  const { toast } = useToast()

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Process dropped files
    const processFiles = async () => {
      const newFiles: FileItem[] = []

      for (const file of acceptedFiles) {
        const path = file.webkitRelativePath || file.name
        const fileIsTextFile = isTextFile(path)

        let content = undefined
        let fileIsTextFileTemp = fileIsTextFile
        // Only read content for text files
        if (fileIsTextFileTemp) {
          try {
            content = await file.text()
          } catch (error) {
            console.error(`Error reading file ${path}:`, error)
            // If we can't read the file as text, mark it as non-text
            fileIsTextFileTemp = false
          }
        }

        newFiles.push({
          id: `${path}-${Date.now()}`,
          name: file.name,
          path: path,
          type: file.type || path.substring(path.lastIndexOf(".")),
          size: file.size,
          content,
          checked: true,
          isTextFile: fileIsTextFile,
        })
      }

      setFiles((prev) => [...prev, ...newFiles])
    }

    processFiles()
  }, [])

  // Setup dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: false,
    noKeyboard: false,
  })

  // Handle folder selection
  const handleFolderSelect = async () => {
    try {
      // @ts-ignore - webkitdirectory is not in the standard types
      const input = document.createElement("input")
      input.type = "file"
      input.webkitdirectory = true

      input.onchange = async (e) => {
        const target = e.target as HTMLInputElement
        if (target.files) {
          const fileList = Array.from(target.files)
          onDrop(fileList)
        }
      }

      input.click()
    } catch (error) {
      console.error("Error selecting folder:", error)
      toast({
        title: "Error",
        description: "Failed to select folder. Your browser may not support this feature.",
        variant: "destructive",
      })
    }
  }

  // Handle file selection
  const handleFileSelect = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.multiple = true

    input.onchange = (e) => {
      const target = e.target as HTMLInputElement
      if (target.files) {
        const fileList = Array.from(target.files)
        onDrop(fileList)
      }
    }

    input.click()
  }

  // Remove a file
  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  // Toggle file checkbox
  const toggleFileCheck = (id: string) => {
    setFiles((prev) => prev.map((file) => (file.id === id ? { ...file, checked: !file.checked } : file)))
  }

  // Move file (for drag and drop reordering)
  const moveFile = (dragIndex: number, hoverIndex: number) => {
    const draggedFile = files[dragIndex]
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles]
      newFiles.splice(dragIndex, 1)
      newFiles.splice(hoverIndex, 0, draggedFile)
      return newFiles
    })
  }

  // Process and combine files
  const processFiles = async () => {
    setIsProcessing(true)
    setProgress(0)

    try {
      // Start with header text if provided
      let result = headerText ? `${headerText}\n\n` : ""

      // Get checked files
      const checkedFiles = files.filter((file) => file.checked)

      // Process each file
      for (let i = 0; i < checkedFiles.length; i++) {
        const file = checkedFiles[i]

        // Update progress
        setProgress(Math.round((i / checkedFiles.length) * 100))

        // Add file path as a heading
        result += `## ${file.path}\n\n`

        // If it's a text file with content, add it with code formatting
        if (file.isTextFile && file.content) {
          const extension = file.path.substring(file.path.lastIndexOf(".")).toLowerCase()
          const language = LANGUAGE_MAPPING[extension] || ""

          result += "```" + language + "\n"
          result += file.content
          result += "\n```\n\n"
        } else {
          // For non-text files, just note that it's a binary file
          result += "*[Binary file not included]*\n\n"
        }
      }

      // Add footer text if provided
      if (footerText) {
        result += footerText
      }

      // Set the combined text
      setCombinedText(result)
      setProgress(100)

      toast({
        title: "Success",
        description: "Files combined successfully!",
      })
    } catch (error) {
      console.error("Error processing files:", error)
      toast({
        title: "Error",
        description: "Failed to process files.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Get file statistics
  const getFileStats = () => {
    const checkedFiles = files.filter((f) => f.checked)
    const textFiles = checkedFiles.filter((f) => f.isTextFile)
    const binaryFiles = checkedFiles.filter((f) => !f.isTextFile)

    return {
      total: checkedFiles.length,
      text: textFiles.length,
      binary: binaryFiles.length,
    }
  }

  // Download the combined text
  const downloadCombinedText = () => {
    if (!combinedText) return

    const blob = new Blob([combinedText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "combined-code.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Copy to clipboard
  const copyToClipboard = () => {
    if (!combinedText) return

    navigator.clipboard
      .writeText(combinedText)
      .then(() => {
        toast({
          title: "Copied",
          description: "Text copied to clipboard",
        })
      })
      .catch((err) => {
        console.error("Failed to copy:", err)
        toast({
          title: "Error",
          description: "Failed to copy to clipboard",
          variant: "destructive",
        })
      })
  }

  // Clear all files
  const clearFiles = () => {
    setFiles([])
    setCombinedText("")
    setProgress(0)
  }

  // File stats for the UI
  const fileStats = getFileStats()

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Code Files Merger</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* File Selection Section */}
          <Card>
            <CardHeader>
              <CardTitle>Select Files</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Dropzone */}
              <motion.div
                whileHover={{ scale: isDragActive ? 1 : 1.01 }}
                whileTap={{ scale: 0.99 }}
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer mb-4 transition-all duration-300
                  ${isDragActive ? "border-primary bg-primary/10 scale-102" : "border-border hover:border-primary/50"}`}
              >
                <input {...getInputProps()} />
                <motion.div
                  animate={{
                    y: isDragActive ? [0, -10, 0] : 0,
                    scale: isDragActive ? 1.1 : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: isDragActive ? Number.POSITIVE_INFINITY : 0,
                    repeatType: "reverse",
                  }}
                >
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                </motion.div>
                <p className="text-lg font-medium">Drag & drop files here</p>
                <p className="text-sm text-muted-foreground mb-4">or select files using the buttons below</p>

                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleFileSelect()
                      }}
                    >
                      <FileText className="mr-2 h-4 w-4" /> Browse Files
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleFolderSelect()
                      }}
                    >
                      <FolderOpen className="mr-2 h-4 w-4" /> Browse Folder
                    </Button>
                  </motion.div>
                </div>
              </motion.div>

              {/* Custom Header/Footer */}
              <div className="space-y-4 mb-4">
                <div>
                  <label htmlFor="header" className="block text-sm font-medium mb-1">
                    Custom Header Text (optional)
                  </label>
                  <Textarea
                    id="header"
                    placeholder="Text to add at the beginning of the combined file"
                    value={headerText}
                    onChange={(e) => setHeaderText(e.target.value)}
                    rows={3}
                    className="transition-all duration-200 focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="footer" className="block text-sm font-medium mb-1">
                    Custom Footer Text (optional)
                  </label>
                  <Textarea
                    id="footer"
                    placeholder="Text to add at the end of the combined file"
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    rows={3}
                    className="transition-all duration-200 focus:border-primary"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 justify-end">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" onClick={clearFiles} disabled={files.length === 0}>
                    Clear All
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: files.filter((f) => f.checked).length === 0 || isProcessing ? 1 : 1.05 }}
                  whileTap={{ scale: files.filter((f) => f.checked).length === 0 || isProcessing ? 1 : 0.95 }}
                >
                  <Button onClick={processFiles} disabled={files.filter((f) => f.checked).length === 0 || isProcessing}>
                    Combine Files
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>

          {/* File List and Output Section */}
          <div className="space-y-8">
            {/* File List */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Selected Files ({files.length})</CardTitle>
                {files.length > 0 && (
                  <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
                    <Button variant="ghost" size="icon" onClick={clearFiles}>
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </CardHeader>
              <CardContent>
                {files.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No files selected
                  </motion.div>
                ) : (
                  <DndProvider backend={HTML5Backend}>
                    <div className="max-h-[300px] overflow-y-auto pr-1">
                      <AnimatePresence>
                        {files.map((file, index) => (
                          <DraggableFileItem
                            key={file.id}
                            file={file}
                            index={index}
                            moveFile={moveFile}
                            removeFile={removeFile}
                            toggleFileCheck={toggleFileCheck}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </DndProvider>
                )}
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card>
              <CardHeader>
                <CardTitle>Output</CardTitle>
              </CardHeader>
              <CardContent>
                {isProcessing ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 py-4">
                    <p className="text-center text-muted-foreground">Processing files...</p>
                    <Progress value={progress} className="h-2" />
                  </motion.div>
                ) : combinedText ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="space-y-4"
                  >
                    <div className="flex flex-wrap gap-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button onClick={downloadCombinedText}>
                          <Download className="mr-2 h-4 w-4" /> Download
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" onClick={copyToClipboard}>
                          <Copy className="mr-2 h-4 w-4" /> Copy to Clipboard
                        </Button>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="border rounded-md p-3 bg-muted/30"
                    >
                      <p className="text-sm text-muted-foreground">
                        Combined {fileStats.total} files ({fileStats.text} text, {fileStats.binary} binary) •{" "}
                        {combinedText.length.toLocaleString()} characters
                      </p>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Combine files to see output
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
