"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Plus,
  Save,
  Trash2,
  FileText,
  Search,
  Download,
  Upload,
  Copy,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Settings,
  FolderOpen,
  X,
  Edit3,
  RotateCcw,
  Sliders,
  BookOpen,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useDropzone } from "react-dropzone"
import { SettingsPanel } from "./settings-panel"
import { PresetBrowser } from "./preset-browser"
import { useCallback as use } from "react"

// Interface for FastFlag JSON files
interface FastFlagFile {
  id: string
  name: string
  content: string
  isValid: boolean
  isModified: boolean
  lastModified: Date
  size: number
}

// Interface for FastFlag entries
interface FastFlag {
  [key: string]: string | number | boolean
}

// Default FastFlag template
const DEFAULT_FASTFLAG_TEMPLATE = {
  FFlagExampleFlag: true,
  DFIntExampleNumber: "100",
  DFStringExampleString: "example_value",
  SFlagExampleStudioFlag: false,
  FIntTargetRefreshRate: "60",
  FIntRefreshRateLowerBound: "60",
  DFIntGraphicsOptimizationModeFRMFrameRateTarget: "60",
  DFIntRuntimeConcurrency: "3",
  FIntTaskSchedulerAutoThreadLimit: "3",
  DFIntDebugDynamicRenderKiloPixels: "2074",
}

// Helper function to determine if a string represents a number
const isNumericString = (value: string): boolean => {
  return !isNaN(Number(value)) && !isNaN(Number.parseFloat(value)) && isFinite(Number(value))
}

export default function RobloxFastFlags() {
  const [files, setFiles] = useState<FastFlagFile[]>([])
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [jsonContent, setJsonContent] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [autoSave, setAutoSave] = useState(true)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [newFileName, setNewFileName] = useState("")
  const [showNewFileDialog, setShowNewFileDialog] = useState(false)
  const [showSettingsPanel, setShowSettingsPanel] = useState(false)
  const [showPresetBrowser, setShowPresetBrowser] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  // Load files from localStorage on component mount
  useEffect(() => {
    loadFilesFromStorage()
  }, [])

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && selectedFileId && isEditing) {
      const timeoutId = setTimeout(() => {
        saveCurrentFile()
      }, 2000) // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId)
    }
  }, [jsonContent, autoSave, selectedFileId, isEditing])

  // Load files from localStorage
  const loadFilesFromStorage = () => {
    try {
      const storedFiles = localStorage.getItem("roblox-fastflags")
      if (storedFiles) {
        const parsedFiles = JSON.parse(storedFiles).map((file: any) => ({
          ...file,
          lastModified: new Date(file.lastModified),
        }))
        setFiles(parsedFiles)
      }
    } catch (error) {
      console.error("Error loading files from storage:", error)
      toast({
        title: "Error",
        description: "Failed to load files from storage",
        variant: "destructive",
      })
    }
  }

  // Save files to localStorage
  const saveFilesToStorage = (filesToSave: FastFlagFile[]) => {
    try {
      localStorage.setItem("roblox-fastflags", JSON.stringify(filesToSave))
    } catch (error) {
      console.error("Error saving files to storage:", error)
      toast({
        title: "Error",
        description: "Failed to save files to storage",
        variant: "destructive",
      })
    }
  }

  // Validate JSON content
  const validateJson = (content: string): { isValid: boolean; error?: string } => {
    if (!content.trim()) {
      return { isValid: false, error: "JSON content cannot be empty" }
    }

    try {
      const parsed = JSON.parse(content)
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        return { isValid: false, error: "FastFlags must be a JSON object" }
      }
      return { isValid: true }
    } catch (error) {
      return { isValid: false, error: `Invalid JSON: ${(error as Error).message}` }
    }
  }

  // Create a new file
  const createNewFile = () => {
    if (!newFileName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a file name",
        variant: "destructive",
      })
      return
    }

    const fileName = newFileName.endsWith(".json") ? newFileName : `${newFileName}.json`

    // Check if file name already exists
    if (files.some((file) => file.name === fileName)) {
      toast({
        title: "Error",
        description: "A file with this name already exists",
        variant: "destructive",
      })
      return
    }

    const newFile: FastFlagFile = {
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: fileName,
      content: JSON.stringify(DEFAULT_FASTFLAG_TEMPLATE, null, 2),
      isValid: true,
      isModified: false,
      lastModified: new Date(),
      size: JSON.stringify(DEFAULT_FASTFLAG_TEMPLATE).length,
    }

    const updatedFiles = [...files, newFile]
    setFiles(updatedFiles)
    saveFilesToStorage(updatedFiles)
    setSelectedFileId(newFile.id)
    setJsonContent(newFile.content)
    setIsEditing(true)
    setShowNewFileDialog(false)
    setNewFileName("")

    toast({
      title: "Success",
      description: `Created new file: ${fileName}`,
    })
  }

  // Select a file
  const selectFile = (fileId: string) => {
    const file = files.find((f) => f.id === fileId)
    if (file) {
      setSelectedFileId(fileId)
      setJsonContent(file.content)
      setIsEditing(false)
      setValidationError(null)
    }
  }

  // Save current file
  const saveCurrentFile = () => {
    if (!selectedFileId) return

    const validation = validateJson(jsonContent)
    if (!validation.isValid) {
      setValidationError(validation.error || "Invalid JSON")
      return
    }

    setValidationError(null)
    const updatedFiles = files.map((file) => {
      if (file.id === selectedFileId) {
        return {
          ...file,
          content: jsonContent,
          isValid: true,
          isModified: false,
          lastModified: new Date(),
          size: jsonContent.length,
        }
      }
      return file
    })

    setFiles(updatedFiles)
    saveFilesToStorage(updatedFiles)
    setIsEditing(false)

    toast({
      title: "Success",
      description: "File saved successfully",
    })
  }

  // Delete a file
  const deleteFile = (fileId: string) => {
    const file = files.find((f) => f.id === fileId)
    if (!file) return

    const updatedFiles = files.filter((f) => f.id !== fileId)
    setFiles(updatedFiles)
    saveFilesToStorage(updatedFiles)

    if (selectedFileId === fileId) {
      setSelectedFileId(null)
      setJsonContent("")
      setIsEditing(false)
    }

    toast({
      title: "Success",
      description: `Deleted file: ${file.name}`,
    })
  }

  // Handle JSON content change
  const handleContentChange = (value: string) => {
    setJsonContent(value)
    setIsEditing(true)

    // Update file modification status
    if (selectedFileId) {
      const updatedFiles = files.map((file) => {
        if (file.id === selectedFileId) {
          const validation = validateJson(value)
          return {
            ...file,
            isModified: value !== file.content,
            isValid: validation.isValid,
          }
        }
        return file
      })
      setFiles(updatedFiles)

      // Update validation error
      const validation = validateJson(value)
      setValidationError(validation.isValid ? null : validation.error || "Invalid JSON")
    }
  }

  // Format JSON content
  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonContent)
      const formatted = JSON.stringify(parsed, null, 2)
      setJsonContent(formatted)
      handleContentChange(formatted)
    } catch (error) {
      toast({
        title: "Error",
        description: "Cannot format invalid JSON",
        variant: "destructive",
      })
    }
  }

  // Copy content to clipboard
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(jsonContent)
      .then(() => {
        toast({
          title: "Success",
          description: "Content copied to clipboard",
        })
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to copy to clipboard",
          variant: "destructive",
        })
      })
  }

  // Export file
  const exportFile = (file: FastFlagFile) => {
    const blob = new Blob([file.content], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Success",
      description: `Exported ${file.name}`,
    })
  }

  // Handle file import
  const onDrop = use((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      if (!file.name.endsWith(".json")) {
        toast({
          title: "Error",
          description: `${file.name} is not a JSON file`,
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        const validation = validateJson(content)

        const newFile: FastFlagFile = {
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name: file.name,
          content: content,
          isValid: validation.isValid,
          isModified: false,
          lastModified: new Date(),
          size: content.length,
        }

        setFiles((prev) => {
          const updated = [...prev, newFile]
          saveFilesToStorage(updated)
          return updated
        })

        toast({
          title: "Success",
          description: `Imported ${file.name}`,
        })
      }

      reader.readAsText(file)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/json": [".json"],
    },
    noClick: true,
    noKeyboard: true,
  })

  // Filter files based on search term
  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Get selected file
  const selectedFile = files.find((f) => f.id === selectedFileId)

  // Reset current file
  const resetCurrentFile = () => {
    if (selectedFile) {
      setJsonContent(selectedFile.content)
      setIsEditing(false)
      setValidationError(null)
    }
  }

  // Show toast wrapper for settings panel
  const showToastWrapper = (title: string, description: string, variant: "default" | "destructive" = "default") => {
    toast({
      title,
      description,
      variant,
    })
  }

  // Handle importing a preset
  const handleImportPreset = (preset: any) => {
    // Create a unique name to avoid conflicts
    let fileName = `preset-${preset.title.toLowerCase().replace(/\s+/g, "-")}.json`

    // Check if file name already exists and add a suffix if needed
    let counter = 1
    while (files.some((file) => file.name === fileName)) {
      fileName = `preset-${preset.title.toLowerCase().replace(/\s+/g, "-")}-${counter}.json`
      counter++
    }

    const newFile: FastFlagFile = {
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: fileName,
      content: preset.content,
      isValid: true,
      isModified: false,
      lastModified: new Date(),
      size: preset.content.length,
    }

    const updatedFiles = [...files, newFile]
    setFiles(updatedFiles)
    saveFilesToStorage(updatedFiles)
    setSelectedFileId(newFile.id)
    setJsonContent(newFile.content)
    setIsEditing(false)
    setShowPresetBrowser(false)

    toast({
      title: "Success",
      description: `Imported "${preset.title}" preset`,
    })
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8" {...getRootProps()}>
        <input {...getInputProps()} />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Roblox FastFlags Manager</h1>
            <p className="text-muted-foreground mt-2">Create, edit, and manage Roblox FastFlag JSON files</p>
          </div>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" onClick={() => setShowPresetBrowser(true)}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Presets
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Browse recommended FastFlag presets</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" onClick={() => setShowSettingsPanel(true)}>
                      <Sliders className="h-4 w-4 mr-2" />
                      Hardware Settings
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Configure hardware-specific FastFlags</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => setShowNewFileDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New File
              </Button>
            </motion.div>
          </div>
        </div>

        {isDragActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-primary/10 border-2 border-dashed border-primary z-50 flex items-center justify-center"
          >
            <div className="text-center">
              <Upload className="h-16 w-16 mx-auto mb-4 text-primary" />
              <p className="text-xl font-semibold">Drop JSON files here to import</p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File List Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  Files ({files.length})
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-save" checked={autoSave} onCheckedChange={setAutoSave} />
                    <Label htmlFor="auto-save" className="text-xs">
                      Auto-save
                    </Label>
                  </div>
                </div>
              </div>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 transition-all duration-200 focus:border-primary"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                <AnimatePresence>
                  {filteredFiles.map((file) => (
                    <motion.div
                      key={file.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`p-3 border rounded-md cursor-pointer transition-all duration-200 group
                        ${selectedFileId === file.id ? "border-primary bg-primary/5" : "hover:border-primary/50"}
                      `}
                      onClick={() => selectFile(file.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="h-4 w-4 flex-shrink-0" />
                          <span className="font-medium truncate">{file.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {file.isModified && <Badge variant="outline">Modified</Badge>}
                          {!file.isValid && <Badge variant="destructive">Invalid</Badge>}
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                exportFile(file)
                              }}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteFile(file.id)
                              }}
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {file.size} bytes • {file.lastModified.toLocaleDateString()}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredFiles.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "No files match your search" : "No files yet. Create your first FastFlag file!"}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Editor Area */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {selectedFile ? (
                    <>
                      <Edit3 className="h-5 w-5" />
                      {selectedFile.name}
                      {selectedFile.isModified && <Badge variant="outline">Modified</Badge>}
                      {!selectedFile.isValid && <Badge variant="destructive">Invalid</Badge>}
                    </>
                  ) : (
                    <>
                      <FileText className="h-5 w-5" />
                      No file selected
                    </>
                  )}
                </CardTitle>

                {selectedFile && (
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button variant="ghost" size="icon" onClick={() => setShowPreview(!showPreview)}>
                              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{showPreview ? "Hide preview" : "Show preview"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy to clipboard</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button variant="ghost" size="icon" onClick={formatJson} disabled={!jsonContent}>
                              <Settings className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Format JSON</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {isEditing && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button variant="ghost" size="icon" onClick={resetCurrentFile}>
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Reset changes</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button onClick={saveCurrentFile} disabled={!isEditing || !!validationError}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </motion.div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {selectedFile ? (
                <div className="space-y-4">
                  {validationError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>JSON Validation Error</AlertTitle>
                      <AlertDescription>{validationError}</AlertDescription>
                    </Alert>
                  )}

                  {!validationError && selectedFile.isValid && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>Valid JSON</AlertTitle>
                      <AlertDescription>The JSON syntax is valid and ready to use.</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 gap-4">
                    <div className={showPreview ? "lg:col-span-1" : "col-span-full"}>
                      <Label htmlFor="json-editor" className="text-sm font-medium">
                        JSON Editor
                      </Label>
                      <Textarea
                        ref={textareaRef}
                        id="json-editor"
                        value={jsonContent}
                        onChange={(e) => handleContentChange(e.target.value)}
                        className="font-mono text-sm min-h-[400px] mt-2 transition-all duration-200 focus:border-primary"
                        placeholder="Enter your FastFlag JSON here..."
                      />
                    </div>

                    {showPreview && (
                      <div className="lg:col-span-1">
                        <Label className="text-sm font-medium">Preview</Label>
                        <div className="border rounded-md p-4 bg-muted/30 min-h-[400px] mt-2 overflow-auto">
                          {(() => {
                            try {
                              const parsed = JSON.parse(jsonContent)
                              const entries = Object.entries(parsed)

                              if (entries.length === 0) {
                                return (
                                  <div className="text-center py-8 text-muted-foreground">
                                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p>No FastFlags found</p>
                                  </div>
                                )
                              }

                              // Enhanced categorization system
                              const numberFlags = entries.filter(
                                ([_, value]) => typeof value === "string" && isNumericString(value),
                              )
                              const stringFlags = entries.filter(
                                ([_, value]) => typeof value === "string" && !isNumericString(value),
                              )
                              const booleanFlags = entries.filter(([_, value]) => typeof value === "boolean")
                              const otherFlags = entries.filter(
                                ([_, value]) => typeof value !== "string" && typeof value !== "boolean",
                              )

                              return (
                                <div className="space-y-6">
                                  {/* Number FastFlags (strings containing numbers) */}
                                  {numberFlags.length > 0 && (
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                        <h4 className="font-medium text-sm">Number FastFlags ({numberFlags.length})</h4>
                                        <Badge variant="outline" className="text-xs">
                                          Numeric strings
                                        </Badge>
                                      </div>
                                      <div className="space-y-2">
                                        {numberFlags.map(([key, value]) => (
                                          <div
                                            key={key}
                                            className="group hover:bg-background/50 rounded-md p-2 transition-colors"
                                          >
                                            <div className="flex items-center justify-between">
                                              <span className="font-mono text-sm text-foreground truncate flex-1 mr-2">
                                                {key}
                                              </span>
                                              <div className="flex items-center gap-2 flex-shrink-0">
                                                <Badge
                                                  variant="outline"
                                                  className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
                                                >
                                                  number
                                                </Badge>
                                                <span className="font-mono text-sm font-medium text-blue-600 dark:text-blue-400 min-w-0">
                                                  "{String(value)}"
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* String FastFlags */}
                                  {stringFlags.length > 0 && (
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        <h4 className="font-medium text-sm">String FastFlags ({stringFlags.length})</h4>
                                        <Badge variant="outline" className="text-xs">
                                          Text values
                                        </Badge>
                                      </div>
                                      <div className="space-y-2">
                                        {stringFlags.map(([key, value]) => (
                                          <div
                                            key={key}
                                            className="group hover:bg-background/50 rounded-md p-2 transition-colors"
                                          >
                                            <div className="flex items-center justify-between">
                                              <span className="font-mono text-sm text-foreground truncate flex-1 mr-2">
                                                {key}
                                              </span>
                                              <div className="flex items-center gap-2 flex-shrink-0">
                                                <Badge
                                                  variant="outline"
                                                  className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                                                >
                                                  string
                                                </Badge>
                                                <span className="font-mono text-sm font-medium text-green-600 dark:text-green-400 min-w-0 max-w-[120px] truncate">
                                                  "{String(value)}"
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Boolean FastFlags */}
                                  {booleanFlags.length > 0 && (
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                        <h4 className="font-medium text-sm">
                                          Boolean FastFlags ({booleanFlags.length})
                                        </h4>
                                        <Badge variant="outline" className="text-xs">
                                          True/false values
                                        </Badge>
                                      </div>
                                      <div className="space-y-2">
                                        {booleanFlags.map(([key, value]) => (
                                          <div
                                            key={key}
                                            className="group hover:bg-background/50 rounded-md p-2 transition-colors"
                                          >
                                            <div className="flex items-center justify-between">
                                              <span className="font-mono text-sm text-foreground truncate flex-1 mr-2">
                                                {key}
                                              </span>
                                              <div className="flex items-center gap-2 flex-shrink-0">
                                                <Badge
                                                  variant="outline"
                                                  className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800"
                                                >
                                                  boolean
                                                </Badge>
                                                <span
                                                  className={`font-mono text-sm font-medium min-w-0 ${
                                                    value
                                                      ? "text-emerald-600 dark:text-emerald-400"
                                                      : "text-red-600 dark:text-red-400"
                                                  }`}
                                                >
                                                  {String(value)}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Other FastFlags */}
                                  {otherFlags.length > 0 && (
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                        <h4 className="font-medium text-sm">Other FastFlags ({otherFlags.length})</h4>
                                        <Badge variant="outline" className="text-xs">
                                          Complex values
                                        </Badge>
                                      </div>
                                      <div className="space-y-2">
                                        {otherFlags.map(([key, value]) => (
                                          <div
                                            key={key}
                                            className="group hover:bg-background/50 rounded-md p-2 transition-colors"
                                          >
                                            <div className="flex items-center justify-between">
                                              <span className="font-mono text-sm text-foreground truncate flex-1 mr-2">
                                                {key}
                                              </span>
                                              <div className="flex items-center gap-2 flex-shrink-0">
                                                <Badge
                                                  variant="outline"
                                                  className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800"
                                                >
                                                  {typeof value}
                                                </Badge>
                                                <span className="font-mono text-sm font-medium text-orange-600 dark:text-orange-400 min-w-0 max-w-[120px] truncate">
                                                  {JSON.stringify(value)}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Summary */}
                                  <div className="border-t pt-4 mt-6">
                                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                      <span>Total: {entries.length} FastFlags</span>
                                      {numberFlags.length > 0 && <span>• {numberFlags.length} numbers</span>}
                                      {stringFlags.length > 0 && <span>• {stringFlags.length} strings</span>}
                                      {booleanFlags.length > 0 && <span>• {booleanFlags.length} booleans</span>}
                                      {otherFlags.length > 0 && <span>• {otherFlags.length} other</span>}
                                    </div>
                                  </div>
                                </div>
                              )
                            } catch {
                              return (
                                <div className="text-center py-8 text-muted-foreground">
                                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                  <p>Invalid JSON - cannot preview</p>
                                </div>
                              )
                            }
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No file selected</h3>
                  <p>Select a file from the sidebar or create a new one to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* New File Dialog */}
        <AnimatePresence>
          {showNewFileDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowNewFileDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-background border rounded-lg p-6 w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Create New FastFlag File</h3>
                  <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
                    <Button variant="ghost" size="icon" onClick={() => setShowNewFileDialog(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="file-name">File Name</Label>
                    <Input
                      id="file-name"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      placeholder="my-fastflags"
                      className="mt-1 transition-all duration-200 focus:border-primary"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          createNewFile()
                        }
                      }}
                    />
                    <p className="text-xs text-muted-foreground mt-1">.json extension will be added automatically</p>
                  </div>

                  <div className="flex justify-end gap-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" onClick={() => setShowNewFileDialog(false)}>
                        Cancel
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button onClick={createNewFile}>Create File</Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettingsPanel && (
            <SettingsPanel
              isOpen={showSettingsPanel}
              onClose={() => setShowSettingsPanel(false)}
              files={files}
              updateFiles={setFiles}
              saveFilesToStorage={saveFilesToStorage}
              showToast={showToastWrapper}
            />
          )}
        </AnimatePresence>

        {/* Preset Browser */}
        <AnimatePresence>
          {showPresetBrowser && (
            <PresetBrowser
              isOpen={showPresetBrowser}
              onClose={() => setShowPresetBrowser(false)}
              onImport={handleImportPreset}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
