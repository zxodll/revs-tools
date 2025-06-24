"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Navbar } from "@/components/navbar"
import { FileImage, Download, Trash2, Archive, ImageIcon, FolderOpen, CheckCircle, AlertCircle, X } from "lucide-react"
import JSZip from "jszip"

interface ImageFile {
  id: string
  file: File
  preview: string
  name: string
  size: number
  type: string
}

// Enhanced animation variants to match prompt-refiner
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
}

export default function CBZTool() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const imageFiles = acceptedFiles.filter((file) => file.type.startsWith("image/"))

      if (imageFiles.length !== acceptedFiles.length) {
        toast({
          title: "Warning",
          description: "Some files were skipped (only image files are supported)",
          variant: "destructive",
        })
      }

      const newImages: ImageFile[] = imageFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type,
      }))

      setImages((prev) => [...prev, ...newImages])
    },
    [toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"],
    },
    multiple: true,
  })

  const removeImage = (id: string) => {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id)
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview)
      }
      return prev.filter((img) => img.id !== id)
    })
  }

  const clearAll = () => {
    images.forEach((img) => URL.revokeObjectURL(img.preview))
    setImages([])
    setProgress(0)
  }

  const createCBZ = async () => {
    if (images.length === 0) {
      toast({
        title: "Error",
        description: "Please add some images first",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setProgress(0)

    try {
      const zip = new JSZip()

      // Sort images by name for consistent ordering
      const sortedImages = [...images].sort((a, b) => a.name.localeCompare(b.name))

      // Add images to zip with progress tracking
      for (let i = 0; i < sortedImages.length; i++) {
        const image = sortedImages[i]
        const fileExtension = image.name.split(".").pop() || "jpg"
        const paddedIndex = String(i + 1).padStart(3, "0")
        const fileName = `${paddedIndex}.${fileExtension}`

        zip.file(fileName, image.file)
        setProgress(((i + 1) / sortedImages.length) * 80) // 80% for adding files
      }

      // Generate the CBZ file
      setProgress(90)
      const content = await zip.generateAsync({ type: "blob" })
      setProgress(100)

      // Download the file
      const url = URL.createObjectURL(content)
      const a = document.createElement("a")
      a.href = url
      a.download = "comic.cbz"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Success",
        description: "CBZ file created and downloaded successfully!",
      })
    } catch (error) {
      console.error("Error creating CBZ:", error)
      toast({
        title: "Error",
        description: "Failed to create CBZ file",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const totalSize = images.reduce((sum, img) => sum + img.size, 0)

  return (
    <>
      <Navbar />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-8"
      >
        <motion.div variants={staggerItem} className="text-center space-y-4 mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              delay: 0.1,
            }}
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CBZ Creator Tool
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Transform your image collections into professional CBZ comic book archives with ease.
          </motion.p>
        </motion.div>

        <motion.div variants={staggerItem} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Archive className="h-5 w-5" />
                  </motion.div>
                  Create CBZ Archive
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 30 }}
                >
                  {/* Dropzone */}
                  <motion.div
                    whileHover={{ scale: isDragActive ? 1 : 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer mb-6 transition-all duration-300
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
                      <FileImage className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                    </motion.div>
                    <p className="text-lg font-medium">Drag & drop images here</p>
                    <p className="text-sm text-muted-foreground mb-4">or click to select files</p>
                    <p className="text-xs text-muted-foreground">Supports: PNG, JPG, JPEG, GIF, BMP, WebP</p>
                  </motion.div>

                  {/* Stats */}
                  {images.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex flex-wrap gap-2 mb-4"
                    >
                      <Badge variant="secondary">
                        <ImageIcon className="mr-1 h-3 w-3" />
                        {images.length} images
                      </Badge>
                      <Badge variant="secondary">
                        <FolderOpen className="mr-1 h-3 w-3" />
                        {formatFileSize(totalSize)}
                      </Badge>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 300, damping: 30 }}
                    className="flex flex-wrap gap-2 justify-end"
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" onClick={clearAll} disabled={images.length === 0}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear All
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: images.length === 0 || isProcessing ? 1 : 1.05 }}
                      whileTap={{ scale: images.length === 0 || isProcessing ? 1 : 0.95 }}
                    >
                      <Button onClick={createCBZ} disabled={images.length === 0 || isProcessing}>
                        <Download className="mr-2 h-4 w-4" />
                        Create CBZ
                      </Button>
                    </motion.div>
                  </motion.div>

                  {/* Progress */}
                  {isProcessing && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Creating CBZ file...</span>
                        <span className="text-sm font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </motion.div>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Image Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <ImageIcon className="h-5 w-5" />
                  </motion.div>
                  Image Preview
                </CardTitle>
                {images.length > 0 && (
                  <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
                    <Button variant="ghost" size="icon" onClick={clearAll}>
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </CardHeader>
              <CardContent>
                {images.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 text-muted-foreground"
                  >
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >
                      <ImageIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    </motion.div>
                    <p>No images selected</p>
                    <p className="text-sm">Add images to see preview</p>
                  </motion.div>
                ) : (
                  <div className="max-h-[500px] overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <AnimatePresence>
                        {images.map((image, index) => (
                          <motion.div
                            key={image.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                              delay: index * 0.05,
                            }}
                            whileHover={{ scale: 1.05 }}
                            className="relative group"
                          >
                            <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                              <img
                                src={image.preview || "/placeholder.svg"}
                                alt={image.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeImage(image.id)}
                              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </motion.button>
                            <div className="mt-2">
                              <p className="text-xs font-medium truncate">{image.name}</p>
                              <p className="text-xs text-muted-foreground">{formatFileSize(image.size)}</p>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 30 }}
          className="mt-8"
        >
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <AlertCircle className="h-5 w-5" />
                </motion.div>
                About CBZ Format
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    What is CBZ?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    CBZ (Comic Book ZIP) is a popular format for digital comics. It's essentially a ZIP archive
                    containing image files that represent comic book pages.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    How to Use
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Simply drag and drop your comic page images, and this tool will create a CBZ file that can be read
                    by most comic book readers and apps.
                  </p>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </>
  )
}
