"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  X,
  Search,
  Download,
  FileText,
  Info,
  RefreshCw,
  Filter,
  Monitor,
  Cpu,
  Smartphone,
  Palette,
  Shield,
  GitBranch,
} from "lucide-react"
import { AdminPanel } from "./admin-panel"
import { RECOMMENDED_PRESETS } from "./presets"

// Types
export interface FastFlagFile {
  id: string
  name: string
  content: string
  isValid: boolean
  isModified: boolean
  lastModified: Date
  size: number
}

// Update this interface to include the version
export interface PresetFile {
  id: string
  title: string
  description: string
  content: string
  category: "performance" | "graphics" | "mobile" | "desktop"
  difficulty: "safe" | "experimental"
  compatibility: string[]
  version: string
  createdAt?: string
  updatedAt?: string
}

interface PresetBrowserProps {
  isOpen: boolean
  onClose: () => void
  onImport: (preset: PresetFile) => void
  showToast: (title: string, description: string, variant?: "default" | "destructive") => void
}

// Available categories for FastFlag presets
const AVAILABLE_CATEGORIES = [
  { value: "performance", label: "Performance", icon: Cpu },
  { value: "graphics", label: "Graphics", icon: Palette },
  { value: "mobile", label: "Mobile", icon: Smartphone },
  { value: "desktop", label: "Desktop", icon: Monitor },
]

export function PresetBrowser({ isOpen, onClose, onImport, showToast }: PresetBrowserProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("recommended")
  const [selectedPreset, setSelectedPreset] = useState<PresetFile | null>(null)
  const [showPresetDetails, setShowPresetDetails] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)

  // NOTE: Ensure your RECOMMENDED_PRESETS in './presets.ts' now include a `version` string for each object.
  const [presets, setPresets] = useState<PresetFile[]>(RECOMMENDED_PRESETS)

  // Filter presets based on search term, category, and difficulty
  const filteredPresets = presets.filter((preset) => {
    // Filter by search term
    const matchesSearch =
      preset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      preset.description.toLowerCase().includes(searchTerm.toLowerCase())

    // Filter by category
    const matchesCategory = selectedCategory === "all" || preset.category === selectedCategory

    // Filter by difficulty
    const matchesDifficulty = selectedDifficulty === "all" || preset.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  // Sort presets
  const sortedPresets = [...filteredPresets].sort((a, b) => {
    switch (sortBy) {
      case "recommended":
        // Custom order for recommended presets
        const order = ["safe", "experimental"]
        return order.indexOf(a.difficulty) - order.indexOf(b.difficulty)
      case "alphabetical":
        return a.title.localeCompare(b.title)
      case "difficulty":
        const difficultyOrder = ["safe", "experimental"]
        return difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty)
      default:
        return 0
    }
  })

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Handle preset selection
  const handleSelectPreset = (preset: PresetFile) => {
    setSelectedPreset(preset)
    setShowPresetDetails(true)
  }

  // Handle preset import
  const handleImportPreset = () => {
    if (selectedPreset) {
      // Pass the full selectedPreset object, which now matches the onImport type
      onImport(selectedPreset)
      setShowPresetDetails(false)
      setSelectedPreset(null)
    }
  }

  // Handle admin panel updates
  const handlePresetsUpdate = (updatedPresets: PresetFile[]) => {
    setPresets(updatedPresets)
    showToast("Presets Updated", "The preset library has been updated successfully.")
  }

  // Get category badge color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "performance":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
      case "graphics":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800"
      case "ui":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
      case "gameplay":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800"
      case "studio":
        return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800"
      case "mobile":
        return "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800"
      case "desktop":
        return "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
    }
  }

  // Get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "safe":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
      case "experimental":
        return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Main Preset Browser */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-hidden"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-background border rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-background z-10 border-b">
            <div className="flex items-center justify-between p-4">
              <div>
                <h2 className="text-xl font-semibold">Recommended FastFlags Presets</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Curated FastFlag configurations for different use cases and system types
                </p>
              </div>
              <div className="flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" onClick={() => setShowAdminPanel(true)}>
                    <Shield className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Search and Filters */}
            <div className="p-4 border-b bg-background">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search presets by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full transition-all duration-200 focus:border-primary"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recommended">Recommended</SelectItem>
                      <SelectItem value="alphabetical">Alphabetical</SelectItem>
                      <SelectItem value="difficulty">Levels</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="safe">Safe</SelectItem>
                      <SelectItem value="experimental">Experimental</SelectItem>
                    </SelectContent>
                  </Select>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-[100px]">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedCategory("all")
                        setSelectedDifficulty("all")
                      }}
                      disabled={!searchTerm && !selectedCategory}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </motion.div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="h-4 w-4" />
                  <span className="text-sm font-medium">Filter by category:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    key="all"
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory("all")}
                  >
                    All Categories
                  </Badge>
                  {AVAILABLE_CATEGORIES.map((category) => {
                    const IconComponent = category.icon
                    return (
                      <Badge
                        key={category.value}
                        variant={selectedCategory === category.value ? "default" : "outline"}
                        className={`cursor-pointer flex items-center gap-1 ${
                          selectedCategory === category.value ? "" : getCategoryColor(category.value)
                        }`}
                        onClick={() => setSelectedCategory(category.value)}
                      >
                        <IconComponent className="h-3 w-3" />
                        {category.label}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {sortedPresets.length > 0 ? (
                    sortedPresets.map((preset) => {
                      const categoryInfo = AVAILABLE_CATEGORIES.find((c) => c.value === preset.category)
                      const IconComponent = categoryInfo?.icon || FileText

                      return (
                        <motion.div
                          key={preset.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card
                            className="h-full cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
                            onClick={() => handleSelectPreset(preset)}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-start gap-3">
                                <div className="p-2 rounded-md bg-primary/10">
                                  <IconComponent className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <CardTitle className="text-base line-clamp-1">{preset.title}</CardTitle>
                                  <CardDescription className="line-clamp-2 mt-1">{preset.description}</CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="flex flex-wrap gap-2 mb-3">
                                <Badge variant="outline" className={`text-xs ${getCategoryColor(preset.category)}`}>
                                  {categoryInfo?.label || preset.category}
                                </Badge>
                                <Badge variant="outline" className={`text-xs ${getDifficultyColor(preset.difficulty)}`}>
                                  {preset.difficulty}
                                </Badge>
                                {preset.version && (
                                  <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                    <GitBranch className="h-3 w-3" />
                                    v{preset.version}
                                  </Badge>
                                )}
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-start text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Monitor className="h-3.5 w-3.5" />
                                    <span>{preset.compatibility.length} platforms</span>
                                  </div>
                                </div>

                                <div className="text-xs text-muted-foreground">
                                  <span className="font-medium">Compatible:</span> {preset.compatibility.join(", ")}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })
                  ) : (
                    <div className="col-span-full flex items-center justify-center py-12 text-muted-foreground">
                      <div className="text-center">
                        <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium">No presets found</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Preset Details Dialog */}
      <Dialog open={showPresetDetails} onOpenChange={setShowPresetDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto z-[101]" onClick={(e) => e.stopPropagation()}>
          {selectedPreset && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  {(() => {
                    const categoryInfo = AVAILABLE_CATEGORIES.find((c) => c.value === selectedPreset.category)
                    const IconComponent = categoryInfo?.icon || FileText
                    return (
                      <div className="p-2 rounded-md bg-primary/10">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                    )
                  })()}
                  <div>
                    <DialogTitle className="text-left">{selectedPreset.title}</DialogTitle>
                    <DialogDescription className="text-left mt-1">{selectedPreset.description}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={getCategoryColor(selectedPreset.category)}>
                    {AVAILABLE_CATEGORIES.find((c) => c.value === selectedPreset.category)?.label ||
                      selectedPreset.category}
                  </Badge>
                  <Badge variant="outline" className={getDifficultyColor(selectedPreset.difficulty)}>
                    {selectedPreset.difficulty}
                  </Badge>
                  {selectedPreset.version && (
                    <Badge variant="secondary" className="text-base flex items-center gap-1">
                      <GitBranch className="h-3 w-3" />
                      v{selectedPreset.version}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Difficulty:</span>
                          <span className="ml-2 capitalize">{selectedPreset.difficulty}</span>
                        </div>
                        <div>
                          <span className="font-medium">Category:</span>
                          <span className="ml-2">
                            {AVAILABLE_CATEGORIES.find((c) => c.value === selectedPreset.category)?.label}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        Compatibility
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedPreset.compatibility.map((platform) => (
                          <div key={platform} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>{platform}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">FastFlag Configuration</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"></div>
                  </div>

                  <Card>
                    <CardContent className="p-4">
                      {/* --- START OF FIX --- */}
                      <pre className="text-xs overflow-auto max-h-64 font-mono bg-muted/30 p-3 rounded-md whitespace-pre-wrap break-words">
                        {selectedPreset.content}
                      </pre>
                      {/* --- END OF FIX --- */}
                    </CardContent>
                  </Card>
                </div>
              </div>

              <DialogFooter>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={handleImportPreset}>
                    <Download className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </motion.div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Admin Panel */}
      <AdminPanel
        isOpen={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
        presets={presets}
        onPresetsUpdate={handlePresetsUpdate}
        showToast={showToast}
      />
    </>
  )
}