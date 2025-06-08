"use client"

import { useState, useCallback, useRef } from "react"
import { useDropzone } from "react-dropzone"
import JSZip from "jszip"
import FileSaver from "file-saver"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileArchive,
  ImageIcon,
  Upload,
  Download,
  Trash2,
  GripVertical,
  FileIcon,
  FileText,
  FileBadge,
  AlertCircle,
  Info,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Interface for extracted image files
interface ImageFile {
  id: string
  name: string
  data: ArrayBuffer
  url: string
  checked: boolean
}

// Interface for files to compress
interface CompressFile extends File {
  id: string
  checked: boolean
  isImage: boolean
  isSpecialFile: boolean
  preview?: string
}

// Special files that should keep their original names
const SPECIAL_FILES = ["comicinfo.xml", "metadata.xml", "info.xml", "readme.txt", "credits.txt"]

// Image file extensions
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff"]

// DnD item type
const ItemTypes = {
  IMAGE: "image",
}

// Helper function to check if a file is an image
const isImageFile = (filename: string): boolean => {
  const ext = filename.substring(filename.lastIndexOf(".")).toLowerCase()
  return IMAGE_EXTENSIONS.includes(ext)
}

// Helper function to check if a file is a special file
const isSpecialFile = (filename: string): boolean => {
  return SPECIAL_FILES.includes(filename.toLowerCase())
}

// Helper function to get file icon based on file type
const getFileIcon = (file: CompressFile) => {
  const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()

  if (file.isImage) {
    return <ImageIcon size={16} className="text-purple-400" />
  }

  if (extension === ".xml") {
    return <FileText size={16} className="text-blue-400" />
  }

  if (extension === ".txt") {
    return <FileText size={16} className="text-green-400" />
  }

  if (extension === ".pdf") {
    return <FileBadge size={16} className="text-red-400" />
  }

  return <FileIcon size={16} className="text-muted-foreground" />
}

// Draggable extracted image component
const DraggableExtractedImage = ({
  image,
  index,
  moveImage,
  toggleImageCheck,
  downloadImage,
}: {
  image: ImageFile
  index: number
  moveImage: (dragIndex: number, hoverIndex: number) => void
  toggleImageCheck: (id: string) => void
  downloadImage: (image: ImageFile) => void
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.IMAGE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.IMAGE,
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

      moveImage(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  drag(drop(ref))

  // Determine if we should show the insertion indicator
  const showTopIndicator = isOver && canDrop && !isDragging

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        zIndex: isDragging ? 10 : 1,
      }}
      exit={{ opacity: 0, scale: 0.9 }}
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
          className="absolute top-0 left-0 right-0 bg-primary rounded-full z-10"
          style={{ transform: "translateY(-50%)" }}
        />
      )}

      <div
        ref={ref}
        className={`relative group transition-all duration-200 rounded-md overflow-hidden border
          ${isDragging ? "opacity-70 shadow-lg" : ""}
          ${isHovering && !isDragging ? "border-primary/50" : "border-border"}
          ${image.checked ? "" : "opacity-60"}
        `}
        style={{
          transform: isDragging ? "scale(1.02) rotate(1deg)" : "scale(1) rotate(0deg)",
        }}
      >
        <div className="aspect-square overflow-hidden bg-muted relative">
          <img src={image.url || "/placeholder.svg"} alt={image.name} className="object-contain w-full h-full" />

          {/* Checkbox overlay */}
          <div className="absolute top-2 left-2 z-10">
            <motion.div
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="flex items-center justify-center bg-background/80 rounded-md p-0.5"
            >
              <Checkbox
                id={`image-${image.id}`}
                checked={image.checked}
                onCheckedChange={() => toggleImageCheck(image.id)}
                className="transition-all duration-300"
              />
            </motion.div>
          </div>

          {/* Drag handle */}
          <motion.div
            className="absolute top-2 right-2 z-10 cursor-move bg-background/80 rounded-md p-1"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <GripVertical size={16} className="text-muted-foreground" />
          </motion.div>

          {/* Download button */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => downloadImage(image)}
          >
            <Download className="h-8 w-8 text-white cursor-pointer" />
          </motion.div>
        </div>

        <div className={`p-2 text-xs truncate ${image.checked ? "" : "line-through text-muted-foreground"}`}>
          {image.name}
        </div>
      </div>
    </motion.div>
  )
}

// Draggable compress file component
const DraggableCompressFile = ({
  file,
  index,
  moveFile,
  removeFile,
  toggleFileCheck,
}: {
  file: CompressFile
  index: number
  moveFile: (dragIndex: number, hoverIndex: number) => void
  removeFile: (id: string) => void
  toggleFileCheck: (id: string) => void
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.IMAGE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.IMAGE,
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

  // Determine if we should show the insertion indicator
  const showTopIndicator = isOver && canDrop && !isDragging

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
          ${file.isSpecialFile ? "border-blue-500/30 bg-blue-500/5" : ""}
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
            {file.isSpecialFile && (
              <Badge
                variant="outline"
                className="ml-1 text-xs py-0 h-5 bg-blue-500/10 text-blue-500 border-blue-500/30"
              >
                Special
              </Badge>
            )}
            {!file.isImage && !file.isSpecialFile && (
              <Badge variant="outline" className="ml-1 text-xs py-0 h-5">
                Non-Image
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <span>{(file.size / 1024).toFixed(1)} KB</span>
            {file.isSpecialFile && (
              <span className="text-blue-400 flex items-center gap-1">
                <Info size={12} /> Will keep original filename
              </span>
            )}
            {file.isImage && (
              <span className="text-purple-400 flex items-center gap-1">
                <ImageIcon size={12} /> Will be renamed sequentially
              </span>
            )}
          </div>
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

export default function CbzTool() {
  const [extractedImages, setExtractedImages] = useState<ImageFile[]>([])
  const [compressImages, setCompressImages] = useState<CompressFile[]>([])
  const [isExtracting, setIsExtracting] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)
  const [extractProgress, setExtractProgress] = useState(0)
  const [compressProgress, setCompressProgress] = useState(0)
  const [outputFilename, setOutputFilename] = useState("output.cbz")
  const [preserveAllFilenames, setPreserveAllFilenames] = useState(false)
  const [processingLog, setProcessingLog] = useState<string[]>([])
  const [showLog, setShowLog] = useState(false)
  const { toast } = useToast()

  // Handle CBZ file drop for extraction
  const onDropExtract = useCallback(
    (acceptedFiles: File[]) => {
      const cbzFile = acceptedFiles[0]
      if (!cbzFile) return

      if (!cbzFile.name.toLowerCase().endsWith(".cbz")) {
        toast({
          title: "Invalid file",
          description: "Please select a CBZ file",
          variant: "destructive",
        })
        return
      }

      extractCbz(cbzFile)
    },
    [toast],
  )

  // Handle files drop for compression
  const onDropCompress = useCallback(
    (acceptedFiles: File[]) => {
      // Process all files, not just images
      if (acceptedFiles.length === 0) {
        toast({
          title: "No files found",
          description: "Please select files to add",
          variant: "destructive",
        })
        return
      }

      // Sort files by name to maintain order
      const sortedFiles = acceptedFiles.sort((a, b) => a.name.localeCompare(b.name))

      // Process files to add metadata
      const processedFiles: CompressFile[] = sortedFiles.map((file) => {
        const fileWithMeta = file as CompressFile
        fileWithMeta.id = `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        fileWithMeta.checked = true
        fileWithMeta.isImage = isImageFile(file.name)
        fileWithMeta.isSpecialFile = isSpecialFile(file.name)

        // Create preview URL for images
        if (fileWithMeta.isImage) {
          fileWithMeta.preview = URL.createObjectURL(file)
        }

        return fileWithMeta
      })

      setCompressImages((prev) => [...prev, ...processedFiles])

      // Count file types
      const imageCount = processedFiles.filter((f) => f.isImage).length
      const specialCount = processedFiles.filter((f) => f.isSpecialFile).length
      const otherCount = processedFiles.filter((f) => !f.isImage && !f.isSpecialFile).length

      toast({
        title: "Files added",
        description: `Added ${processedFiles.length} files (${imageCount} images, ${specialCount} special, ${otherCount} other)`,
      })
    },
    [toast],
  )

  // Setup dropzones
  const extractDropzone = useDropzone({
    onDrop: onDropExtract,
    accept: {
      "application/zip": [".cbz"],
      "application/x-cbz": [".cbz"],
    },
    maxFiles: 1,
  })

  const compressDropzone = useDropzone({
    onDrop: onDropCompress,
    accept: {
      // Accept all file types
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff"],
      "text/xml": [".xml"],
      "text/plain": [".txt"],
      "application/pdf": [".pdf"],
      // Allow any file type
      "application/octet-stream": [".*"],
    },
    multiple: true,
  })

  // Extract CBZ file
  const extractCbz = async (file: File) => {
    setIsExtracting(true)
    setExtractProgress(0)
    setExtractedImages([])
    setProcessingLog([])
    addToLog(`Starting extraction of ${file.name}...`)

    try {
      const zip = new JSZip()
      const zipData = await file.arrayBuffer()

      addToLog(`Reading ZIP archive...`)
      const loadedZip = await zip.loadAsync(zipData)
      const allFiles = Object.keys(loadedZip.files).filter((filename) => !loadedZip.files[filename].dir)

      addToLog(`Found ${allFiles.length} files in archive`)

      // Filter image files
      const imageFiles = allFiles.filter((filename) => /\.(jpe?g|png|gif|webp|bmp|tiff)$/i.test(filename))
      addToLog(`Found ${imageFiles.length} image files`)

      const sortedImageFiles = imageFiles.sort((a, b) => a.localeCompare(b))
      const extractedFiles: ImageFile[] = []

      for (let i = 0; i < sortedImageFiles.length; i++) {
        const filename = sortedImageFiles[i]
        try {
          const fileData = await loadedZip.files[filename].async("arraybuffer")

          // Create object URL for preview
          const blob = new Blob([fileData], { type: getImageMimeType(filename) })
          const url = URL.createObjectURL(blob)

          extractedFiles.push({
            id: `${filename}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            name: filename.split("/").pop() || filename,
            data: fileData,
            url,
            checked: true,
          })

          setExtractProgress(Math.round(((i + 1) / sortedImageFiles.length) * 100))
        } catch (error) {
          addToLog(`Error extracting ${filename}: ${error}`)
        }
      }

      setExtractedImages(extractedFiles)
      addToLog(`Successfully extracted ${extractedFiles.length} images`)

      toast({
        title: "Extraction complete",
        description: `Extracted ${extractedFiles.length} images`,
      })
    } catch (error) {
      console.error("Error extracting CBZ:", error)
      addToLog(`Error extracting CBZ: ${error}`)
      toast({
        title: "Extraction failed",
        description: "Failed to extract the CBZ file",
        variant: "destructive",
      })
    } finally {
      setIsExtracting(false)
    }
  }

  // Create CBZ from files
  const createCbz = async () => {
    const checkedFiles = compressImages.filter((file) => file.checked)

    if (checkedFiles.length === 0) {
      toast({
        title: "No files",
        description: "Please add and select files first",
        variant: "destructive",
      })
      return
    }

    setIsCompressing(true)
    setCompressProgress(0)
    setProcessingLog([])
    addToLog(`Starting creation of ${outputFilename}...`)

    try {
      const zip = new JSZip()

      // Count file types
      const imageFiles = checkedFiles.filter((f) => f.isImage)
      const specialFiles = checkedFiles.filter((f) => f.isSpecialFile)
      const otherFiles = checkedFiles.filter((f) => !f.isImage && !f.isSpecialFile)

      addToLog(
        `Processing ${checkedFiles.length} files (${imageFiles.length} images, ${specialFiles.length} special, ${otherFiles.length} other)`,
      )

      // Track used filenames to avoid conflicts
      const usedFilenames = new Set<string>()

      // Process special files first (keep original names)
      for (let i = 0; i < specialFiles.length; i++) {
        const file = specialFiles[i]
        try {
          const data = await file.arrayBuffer()
          const filename = file.name

          // Check for filename conflicts
          if (usedFilenames.has(filename)) {
            // Handle conflict by adding a suffix
            const nameParts = filename.split(".")
            const ext = nameParts.pop() || ""
            const baseName = nameParts.join(".")
            let newFilename = `${baseName}_1.${ext}`
            let counter = 1

            while (usedFilenames.has(newFilename)) {
              counter++
              newFilename = `${baseName}_${counter}.${ext}`
            }

            addToLog(`Filename conflict: renamed ${filename} to ${newFilename}`)
            zip.file(newFilename, data)
            usedFilenames.add(newFilename)
          } else {
            zip.file(filename, data)
            usedFilenames.add(filename)
          }

          setCompressProgress(Math.round((i / checkedFiles.length) * 20)) // First 20% for special files
        } catch (error) {
          addToLog(`Error processing special file ${file.name}: ${error}`)
        }
      }

      // Process image files (rename sequentially)
      let imageCounter = 1
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i]
        try {
          const data = await file.arrayBuffer()

          // Get file extension
          const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()

          // Create sequential filename with padding
          const paddedIndex = String(imageCounter).padStart(3, "0")
          const newFilename = preserveAllFilenames ? file.name : `${paddedIndex}${extension}`

          // Check for filename conflicts
          if (usedFilenames.has(newFilename)) {
            // For sequential files, just increment the counter and try again
            i-- // Retry this file
            imageCounter++
            continue
          }

          zip.file(newFilename, data)
          usedFilenames.add(newFilename)
          imageCounter++

          const progress = 20 + Math.round(((i + 1) / imageFiles.length) * 60) // 20-80% for images
          setCompressProgress(progress)
        } catch (error) {
          addToLog(`Error processing image file ${file.name}: ${error}`)
        }
      }

      // Process other files (rename sequentially with original extension)
      for (let i = 0; i < otherFiles.length; i++) {
        const file = otherFiles[i]
        try {
          const data = await file.arrayBuffer()

          // Get file extension
          const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()

          // Create sequential filename with padding
          const paddedIndex = String(imageCounter).padStart(3, "0")
          const newFilename = preserveAllFilenames ? file.name : `${paddedIndex}${extension}`

          // Check for filename conflicts
          if (usedFilenames.has(newFilename)) {
            // For sequential files, just increment the counter and try again
            i-- // Retry this file
            imageCounter++
            continue
          }

          zip.file(newFilename, data)
          usedFilenames.add(newFilename)
          imageCounter++

          const progress = 80 + Math.round(((i + 1) / otherFiles.length) * 20) // 80-100% for other files
          setCompressProgress(progress)
        } catch (error) {
          addToLog(`Error processing other file ${file.name}: ${error}`)
        }
      }

      addToLog(`Generating final CBZ archive...`)
      const content = await zip.generateAsync(
        {
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: { level: 6 },
        },
        (metadata) => {
          // This progress is for the final compression step
          addToLog(`Compressing: ${Math.round(metadata.percent)}%`)
        },
      )

      // Download the CBZ file
      FileSaver.saveAs(content, outputFilename)
      addToLog(`CBZ file created successfully: ${outputFilename}`)

      toast({
        title: "CBZ created",
        description: `Created CBZ with ${checkedFiles.length} files`,
      })
    } catch (error) {
      console.error("Error creating CBZ:", error)
      addToLog(`Error creating CBZ: ${error}`)
      toast({
        title: "Creation failed",
        description: "Failed to create the CBZ file",
        variant: "destructive",
      })
    } finally {
      setIsCompressing(false)
      setCompressProgress(100)
    }
  }

  // Add message to processing log
  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setProcessingLog((prev) => [...prev, `[${timestamp}] ${message}`])
  }

  // Download all extracted images as a zip
  const downloadAllImages = async () => {
    const checkedImages = extractedImages.filter((image) => image.checked)

    if (checkedImages.length === 0) {
      toast({
        title: "No images selected",
        description: "Please select images to download",
        variant: "destructive",
      })
      return
    }

    try {
      const zip = new JSZip()

      checkedImages.forEach((image, index) => {
        const paddedIndex = String(index + 1).padStart(3, "0")
        const extension = image.name.split(".").pop() || "jpg"
        const filename = `image_${paddedIndex}.${extension}`

        zip.file(filename, image.data)
      })

      const content = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
      })

      FileSaver.saveAs(content, "extracted_images.zip")

      toast({
        title: "Download complete",
        description: `Downloaded ${checkedImages.length} images as ZIP`,
      })
    } catch (error) {
      console.error("Error downloading images:", error)
      toast({
        title: "Download failed",
        description: "Failed to download images",
        variant: "destructive",
      })
    }
  }

  // Download a single image
  const downloadImage = (image: ImageFile) => {
    const a = document.createElement("a")
    a.href = image.url
    a.download = image.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  // Clear extracted images
  const clearExtractedImages = () => {
    // Revoke object URLs to prevent memory leaks
    extractedImages.forEach((image) => URL.revokeObjectURL(image.url))
    setExtractedImages([])
    setProcessingLog([])
  }

  // Clear compress images
  const clearCompressImages = () => {
    // Revoke object URLs to prevent memory leaks
    compressImages.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })
    setCompressImages([])
    setProcessingLog([])
  }

  // Toggle extracted image checkbox
  const toggleExtractedImageCheck = (id: string) => {
    setExtractedImages((prev) => prev.map((image) => (image.id === id ? { ...image, checked: !image.checked } : image)))
  }

  // Toggle compress file checkbox
  const toggleCompressFileCheck = (id: string) => {
    setCompressImages((prev) => prev.map((file) => (file.id === id ? { ...file, checked: !file.checked } : file)))
  }

  // Move extracted image (for drag and drop reordering)
  const moveExtractedImage = (dragIndex: number, hoverIndex: number) => {
    const draggedImage = extractedImages[dragIndex]
    setExtractedImages((prevImages) => {
      const newImages = [...prevImages]
      newImages.splice(dragIndex, 1)
      newImages.splice(hoverIndex, 0, draggedImage)
      return newImages
    })
  }

  // Move compress file (for drag and drop reordering)
  const moveCompressFile = (dragIndex: number, hoverIndex: number) => {
    const draggedFile = compressImages[dragIndex]
    setCompressImages((prevFiles) => {
      const newFiles = [...prevFiles]
      newFiles.splice(dragIndex, 1)
      newFiles.splice(hoverIndex, 0, draggedFile)
      return newFiles
    })
  }

  // Remove a compress file
  const removeCompressFile = (id: string) => {
    const fileToRemove = compressImages.find((file) => file.id === id)
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview)
    }
    setCompressImages((prev) => prev.filter((file) => file.id !== id))
  }

  // Helper to get MIME type from filename
  const getImageMimeType = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase()
    switch (ext) {
      case "jpg":
      case "jpeg":
        return "image/jpeg"
      case "png":
        return "image/png"
      case "gif":
        return "image/gif"
      case "webp":
        return "image/webp"
      case "bmp":
        return "image/bmp"
      case "tiff":
        return "image/tiff"
      default:
        return "image/jpeg"
    }
  }

  // Get file statistics
  const getFileStats = () => {
    const checkedFiles = compressImages.filter((f) => f.checked)
    const imageFiles = checkedFiles.filter((f) => f.isImage)
    const specialFiles = checkedFiles.filter((f) => f.isSpecialFile)
    const otherFiles = checkedFiles.filter((f) => !f.isImage && !f.isSpecialFile)

    return {
      total: checkedFiles.length,
      images: imageFiles.length,
      special: specialFiles.length,
      other: otherFiles.length,
    }
  }

  const fileStats = getFileStats()

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">CBZ Tool</h1>

        <Tabs defaultValue="compress" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="extract">Extract CBZ</TabsTrigger>
            <TabsTrigger value="compress">Create CBZ</TabsTrigger>
          </TabsList>

          {/* Extract Tab */}
          <TabsContent value="extract">
            <Card>
              <CardHeader>
                <CardTitle>Extract CBZ File</CardTitle>
                <CardDescription>Upload a CBZ file to extract and view its images</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Dropzone */}
                <motion.div
                  whileHover={{ scale: extractDropzone.isDragActive ? 1 : 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  {...extractDropzone.getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer mb-6 transition-all duration-300
                    ${extractDropzone.isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}
                >
                  <input {...extractDropzone.getInputProps()} />
                  <motion.div
                    animate={{
                      y: extractDropzone.isDragActive ? [0, -10, 0] : 0,
                      scale: extractDropzone.isDragActive ? 1.1 : 1,
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: extractDropzone.isDragActive ? Number.POSITIVE_INFINITY : 0,
                      repeatType: "reverse",
                    }}
                  >
                    <FileArchive className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  </motion.div>
                  <p className="text-lg font-medium">Drag & drop a CBZ file here</p>
                  <p className="text-sm text-muted-foreground mb-4">or click to select a file</p>
                </motion.div>

                {/* Extraction Progress */}
                {isExtracting && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 py-4">
                    <p className="text-center text-muted-foreground">Extracting CBZ file...</p>
                    <Progress value={extractProgress} className="h-2" />
                  </motion.div>
                )}

                {/* Processing Log */}
                {processingLog.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <Button variant="outline" size="sm" onClick={() => setShowLog(!showLog)}>
                        {showLog ? "Hide Log" : "Show Processing Log"}
                      </Button>
                      {showLog && (
                        <Button variant="ghost" size="sm" onClick={() => setProcessingLog([])}>
                          Clear Log
                        </Button>
                      )}
                    </div>
                    {showLog && (
                      <div className="bg-muted/30 border rounded-md p-3 max-h-[200px] overflow-y-auto text-xs font-mono">
                        {processingLog.map((log, index) => (
                          <div key={index} className="mb-1">
                            {log}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Extracted Images */}
                {extractedImages.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="space-y-4"
                  >
                    <div className="flex flex-wrap justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium">Extracted Images ({extractedImages.length})</h3>
                        <Badge variant="outline" className="text-xs">
                          {extractedImages.filter((img) => img.checked).length} selected
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="outline" onClick={downloadAllImages}>
                            <Download className="mr-2 h-4 w-4" /> Download Selected
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="outline" onClick={clearExtractedImages}>
                            <Trash2 className="mr-2 h-4 w-4" /> Clear All
                          </Button>
                        </motion.div>
                      </div>
                    </div>

                    <DndProvider backend={HTML5Backend}>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                        <AnimatePresence>
                          {extractedImages.map((image, index) => (
                            <DraggableExtractedImage
                              key={image.id}
                              image={image}
                              index={index}
                              moveImage={moveExtractedImage}
                              toggleImageCheck={toggleExtractedImageCheck}
                              downloadImage={downloadImage}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    </DndProvider>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compress Tab */}
          <TabsContent value="compress">
            <Card>
              <CardHeader>
                <CardTitle>Create CBZ File</CardTitle>
                <CardDescription>Upload images and other files to create a CBZ archive</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Dropzone */}
                <motion.div
                  whileHover={{ scale: compressDropzone.isDragActive ? 1 : 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  {...compressDropzone.getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer mb-6 transition-all duration-300
                    ${compressDropzone.isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}
                >
                  <input {...compressDropzone.getInputProps()} />
                  <motion.div
                    animate={{
                      y: compressDropzone.isDragActive ? [0, -10, 0] : 0,
                      scale: compressDropzone.isDragActive ? 1.1 : 1,
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: compressDropzone.isDragActive ? Number.POSITIVE_INFINITY : 0,
                      repeatType: "reverse",
                    }}
                  >
                    <FileArchive className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  </motion.div>
                  <p className="text-lg font-medium">Drag & drop files here</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Images, XML, TXT, PDF and other files are supported
                  </p>
                </motion.div>

                {/* Output Settings */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="output-filename" className="block text-sm font-medium mb-1">
                      Output Filename
                    </label>
                    <Input
                      id="output-filename"
                      value={outputFilename}
                      onChange={(e) => setOutputFilename(e.target.value)}
                      placeholder="output.cbz"
                      className="transition-all duration-200 focus:border-primary"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="preserve-filenames"
                      checked={preserveAllFilenames}
                      onCheckedChange={setPreserveAllFilenames}
                    />
                    <Label htmlFor="preserve-filenames">Preserve all original filenames</Label>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>File Naming</AlertTitle>
                    <AlertDescription>
                      {preserveAllFilenames ? (
                        "All files will keep their original filenames. Conflicts will be resolved by adding a suffix."
                      ) : (
                        <>
                          Images will be renamed sequentially (001.jpg, 002.png, etc.). Special files like ComicInfo.xml
                          will keep their original names. Other files will be numbered sequentially with their original
                          extensions.
                        </>
                      )}
                    </AlertDescription>
                  </Alert>
                </div>

                {/* Processing Log */}
                {processingLog.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <Button variant="outline" size="sm" onClick={() => setShowLog(!showLog)}>
                        {showLog ? "Hide Log" : "Show Processing Log"}
                      </Button>
                      {showLog && (
                        <Button variant="ghost" size="sm" onClick={() => setProcessingLog([])}>
                          Clear Log
                        </Button>
                      )}
                    </div>
                    {showLog && (
                      <div className="bg-muted/30 border rounded-md p-3 max-h-[200px] overflow-y-auto text-xs font-mono">
                        {processingLog.map((log, index) => (
                          <div key={index} className="mb-1">
                            {log}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Selected Files */}
                {compressImages.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="space-y-4"
                  >
                    <div className="flex flex-wrap justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium">Selected Files ({compressImages.length})</h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="text-xs">
                                {fileStats.total} selected
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {fileStats.images} images, {fileStats.special} special, {fileStats.other} other files
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex gap-2">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button onClick={createCbz} disabled={isCompressing}>
                            <Upload className="mr-2 h-4 w-4" /> Create CBZ
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="outline" onClick={clearCompressImages} disabled={isCompressing}>
                            <Trash2 className="mr-2 h-4 w-4" /> Clear All
                          </Button>
                        </motion.div>
                      </div>
                    </div>

                    {/* Compression Progress */}
                    {isCompressing && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 py-4">
                        <p className="text-center text-muted-foreground">Creating CBZ file...</p>
                        <Progress value={compressProgress} className="h-2" />
                      </motion.div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="border rounded-md p-3 bg-muted/30"
                    >
                      <p className="text-sm">
                        Files will be processed in the order shown below. Drag and drop to reorder them. Uncheck files
                        to exclude them from the CBZ file.
                      </p>
                    </motion.div>

                    <DndProvider backend={HTML5Backend}>
                      <div className="max-h-[300px] overflow-y-auto pr-1">
                        <AnimatePresence>
                          {compressImages.map((file, index) => (
                            <DraggableCompressFile
                              key={file.id}
                              file={file}
                              index={index}
                              moveFile={moveCompressFile}
                              removeFile={removeCompressFile}
                              toggleFileCheck={toggleCompressFileCheck}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    </DndProvider>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
