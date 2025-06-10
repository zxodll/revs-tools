"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  X,
  Shield,
  Plus,
  Edit,
  Trash2,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  Lock,
  Unlock,
  FileText,
  Settings,
  Monitor,
  Cpu,
  Smartphone,
  Palette,
  LogOut,
  Search,
} from "lucide-react"
import bcrypt from 'bcryptjs';

// Types
interface PresetFile {
  id: string
  title: string
  description: string
  content: string
  category: "performance" | "graphics" | "mobile" | "desktop"
  difficulty: "safe" | "experimental"
  compatibility: string[]
  createdAt?: string
  updatedAt?: string
}

interface AdminPanelProps {
  isOpen: boolean
  onClose: () => void
  presets: PresetFile[]
  onPresetsUpdate: () => void
  showToast: (title: string, description: string, variant?: "default" | "destructive") => void
}

// Admin configuration
const STORED_ADMIN_HASH = process.env.NEXT_PUBLIC_ADMIN_PASSWORD_HASH;

const ADMIN_CONFIG = {
  // In production, this should be stored securely and hashed
  // PASSWORD_HASH: "admin123", // Replaced by environment variable NEXT_PUBLIC_ADMIN_PASSWORD_HASH
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_LOGIN_ATTEMPTS: 3,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
}

// Available categories
const AVAILABLE_CATEGORIES = [
  { value: "performance", label: "Performance", icon: Cpu },
  { value: "graphics", label: "Graphics", icon: Palette },
  { value: "mobile", label: "Mobile", icon: Smartphone },
  { value: "desktop", label: "Desktop", icon: Monitor },
]

// Available platforms
const AVAILABLE_PLATFORMS = ["Roblox", "Roblox Studio", "Roblox Mobile"]

// Animation variants
const panelVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -20,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
      duration: 0.25,
    },
  },
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, delay: 0.1 },
  },
}

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 },
  },
}

export function AdminPanel({ isOpen, onClose, presets, onPresetsUpdate, showToast }: AdminPanelProps) {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLockedOut, setIsLockedOut] = useState(false)
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null)
  const [sessionEndTime, setSessionEndTime] = useState<number | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  // Panel state
  const [selectedPreset, setSelectedPreset] = useState<PresetFile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [presetToDelete, setPresetToDelete] = useState<PresetFile | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all")

  // Form state for editing/creating presets
  const [formData, setFormData] = useState<Partial<PresetFile>>({
    title: "",
    description: "",
    content: "",
    category: "performance",
    difficulty: "safe",
    compatibility: [],
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Session management
  useEffect(() => {
    if (isAuthenticated && sessionEndTime) {
      const timer = setInterval(() => {
        if (Date.now() > sessionEndTime) {
          handleLogout()
          showToast("Session Expired", "Please log in again.", "destructive")
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isAuthenticated, sessionEndTime])

  // Lockout management
  useEffect(() => {
    if (isLockedOut && lockoutEndTime) {
      const timer = setInterval(() => {
        if (Date.now() > lockoutEndTime) {
          setIsLockedOut(false)
          setLockoutEndTime(null)
          setLoginAttempts(0)
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isLockedOut, lockoutEndTime])

  // Reset state when panel closes
  useEffect(() => {
    if (!isOpen) {
      setPassword("")
      setSelectedPreset(null)
      setIsEditing(false)
      setSearchTerm("")
      setFilterCategory("all")
      setFilterDifficulty("all")
      setFormData({
        title: "",
        description: "",
        content: "",
        category: "performance",
        difficulty: "safe",
        compatibility: [],
      })
      setFormErrors({})
    }
  }, [isOpen])

  // Authentication functions
  const handleLogin = async () => {
    if (isLockedOut) {
      const remainingTime = lockoutEndTime ? Math.ceil((lockoutEndTime - Date.now()) / 60000) : 0;
      showToast(
        "Login Locked",
        `Too many attempts. Try again in ${remainingTime > 0 ? remainingTime : "<1"} minute(s).`,
        "destructive",
      );
      return;
    }

    if (!STORED_ADMIN_HASH) {
      console.error("Admin password hash is not configured. Set NEXT_PUBLIC_ADMIN_PASSWORD_HASH environment variable.");
      showToast("Configuration Error", "Admin panel is not properly configured. Please contact support.", "destructive");
      return;
    }

    if (!password) {
      showToast("Login Failed", "Password cannot be empty.", "destructive");
      return;
    }

    try {
      const isMatch = await bcrypt.compare(password, STORED_ADMIN_HASH);
      if (isMatch) {
        setIsAuthenticated(true);
        setLoginAttempts(0);
        setLockoutEndTime(null); // Clear any previous lockout time
        const newSessionEndTime = Date.now() + ADMIN_CONFIG.SESSION_TIMEOUT;
        setSessionEndTime(newSessionEndTime);
        localStorage.setItem("adminSessionEndTime", newSessionEndTime.toString());
        showToast("Login Successful", "Welcome, Admin!", "default");
        setPassword(""); // Clear password field after successful login
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        if (newAttempts >= ADMIN_CONFIG.MAX_LOGIN_ATTEMPTS) {
          setIsLockedOut(true);
          const newLockoutEndTime = Date.now() + ADMIN_CONFIG.LOCKOUT_DURATION;
          setLockoutEndTime(newLockoutEndTime);
          localStorage.setItem("adminLockoutEndTime", newLockoutEndTime.toString());
          showToast(
            "Login Failed",
            `Too many attempts. Locked out for ${ADMIN_CONFIG.LOCKOUT_DURATION / 60000} minutes.`,
            "destructive",
          );
        } else {
          showToast(
            "Login Failed",
            `Invalid password. ${ADMIN_CONFIG.MAX_LOGIN_ATTEMPTS - newAttempts} attempts remaining.`,
            "destructive",
          );
        }
        setPassword(""); // Clear password field after failed attempt
      }
    } catch (error) {
      console.error("Error comparing password:", error);
      showToast("Login Error", "An unexpected error occurred during login. Please try again.", "destructive");
      setPassword(""); // Clear password field
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false)
    setSessionEndTime(null)
    setPassword("")
    setSelectedPreset(null)
    setIsEditing(false)
    showToast("Logged Out", "You have been logged out successfully.")
  }

  // Enhanced close handler with animation
  const handleClose = () => {
    // Reset authentication state when closing
    if (isAuthenticated) {
      handleLogout()
    }
    onClose()
  }

  // Preset management functions
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.title?.trim()) {
      errors.title = "Title is required"
    }

    if (!formData.description?.trim()) {
      errors.description = "Description is required"
    }

    if (!formData.content?.trim()) {
      errors.content = "Content is required"
    } else {
      try {
        JSON.parse(formData.content)
      } catch {
        errors.content = "Content must be valid JSON"
      }
    }

    if (!formData.compatibility?.length) {
      errors.compatibility = "At least one compatibility option is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSavePreset = async () => {
    if (!isAuthenticated) {
      showToast("Authentication Error", "You must be logged in to save changes.", "destructive")
      return
    }

    if (!validateForm()) {
      showToast("Validation Error", "Please fix the errors before saving.", "destructive")
      return
    }

    setIsSubmitting(true)

    try {
      if (selectedPreset) {
        // Update existing preset
        const response = await fetch(`/api/presets/${selectedPreset.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to update preset.")
        }

        showToast("Preset Updated", `"${formData.title}" has been updated successfully.`)
      } else {
        // Create new preset
        const response = await fetch("/api/presets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to create preset.")
        }

        showToast("Preset Created", `"${formData.title}" has been created successfully.`)
      }

      onPresetsUpdate()
      setIsEditing(false)
      setSelectedPreset(null)
      setFormData({
        title: "",
        description: "",
        content: "",
        category: "performance",
        difficulty: "safe",
        compatibility: [],
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
      showToast("Error", errorMessage, "destructive")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeletePreset = async () => {
    if (!presetToDelete) return

    if (!isAuthenticated) {
      showToast("Authentication Error", "You must be logged in to delete presets.", "destructive")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/presets/${presetToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete preset.")
      }

      showToast("Preset Deleted", `"${presetToDelete.title}" has been deleted.`)
      onPresetsUpdate()

      if (selectedPreset?.id === presetToDelete.id) {
        setSelectedPreset(null)
        setIsEditing(false)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
      showToast("Error", errorMessage, "destructive")
    } finally {
      setShowDeleteDialog(false)
      setPresetToDelete(null)
      setIsSubmitting(false)
    }
  }

  const handleEditPreset = (preset: PresetFile) => {
    setSelectedPreset(preset)
    setFormData({
      title: preset.title,
      description: preset.description,
      content: preset.content,
      category: preset.category,
      difficulty: preset.difficulty,
      compatibility: [...preset.compatibility],
    })
    setIsEditing(true)
    setFormErrors({})
  }

  const handleCreateNew = () => {
    setSelectedPreset(null)
    setFormData({
      title: "",
      description: "",
      content: JSON.stringify(
        {
          FFlagExampleFlag: true,
          DFIntExampleNumber: "100",
          DFStringExampleString: "example_value",
        },
        null,
        2,
      ),
      category: "performance",
      difficulty: "safe",
      compatibility: ["Roblox"],
    })
    setIsEditing(true)
    setFormErrors({})
  }

  const handleCompatibilityToggle = (platform: string) => {
    const current = formData.compatibility || []
    const updated = current.includes(platform) ? current.filter((p) => p !== platform) : [...current, platform]

    setFormData({ ...formData, compatibility: updated })
  }

  // Filter presets
  const filteredPresets = presets.filter((preset) => {
    const matchesSearch =
      preset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      preset.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = filterCategory === "all" || preset.category === filterCategory
    const matchesDifficulty = filterDifficulty === "all" || preset.difficulty === filterDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  // Get category info
  const getCategoryInfo = (category: string) => {
    return AVAILABLE_CATEGORIES.find((c) => c.value === category)
  }

  // Get badge colors
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "performance":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
      case "graphics":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800"
      case "mobile":
        return "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800"
      case "desktop":
        return "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
    }
  }

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
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="admin-panel-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleClose()
            }
          }}
        >
          <motion.div
            key="admin-panel-content"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-background border rounded-lg w-full max-w-7xl h-[95vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-background z-10 border-b">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-red-100 dark:bg-red-900">
                    <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Admin Panel</h2>
                    <p className="text-sm text-muted-foreground">
                      {isAuthenticated ? "Manage FastFlag presets" : "Authentication required"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isAuthenticated && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" size="sm" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </motion.div>
                  )}
                  <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
                    <Button variant="ghost" size="icon" onClick={handleClose}>
                      <X className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              {!isAuthenticated ? (
                /* Login Form */
                <div className="flex items-center justify-center h-full p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="w-full max-w-md">
                      <CardHeader className="text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                          className="mx-auto p-3 rounded-full bg-red-100 dark:bg-red-900 w-fit mb-4"
                        >
                          <Lock className="h-8 w-8 text-red-600 dark:text-red-400" />
                        </motion.div>
                        <CardTitle>Admin Authentication</CardTitle>
                        <CardDescription>Enter the admin password to access the management panel</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <AnimatePresence>
                          {isLockedOut && lockoutEndTime && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Account Locked</AlertTitle>
                                <AlertDescription>
                                  Too many failed attempts. Try again in{" "}
                                  {Math.ceil((lockoutEndTime - Date.now()) / 1000 / 60)} minutes.
                                </AlertDescription>
                              </Alert>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="space-y-2">
                          <Label htmlFor="admin-password">Password</Label>
                          <div className="relative">
                            <Input
                              id="admin-password"
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Enter admin password"
                              disabled={isLockedOut}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !isLockedOut) {
                                  handleLogin()
                                }
                              }}
                              className="pr-10 text-sm transition-all duration-200 focus:border-primary"
                            />
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="absolute right-0 top-0 h-full flex items-center"
                            >
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="px-3 h-full"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </motion.div>
                          </div>
                        </div>

                        <AnimatePresence>
                          {loginAttempts > 0 && !isLockedOut && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                  {ADMIN_CONFIG.MAX_LOGIN_ATTEMPTS - loginAttempts} attempts remaining
                                </AlertDescription>
                              </Alert>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button onClick={handleLogin} disabled={!password || isLockedOut} className="w-full">
                            <Unlock className="h-4 w-4 mr-2" />
                            Login
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              ) : (
                /* Admin Panel Content */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex h-full"
                >
                  {/* Sidebar - Preset List */}
                  <div className="w-1/3 border-r flex flex-col min-h-0">
                    <div className="p-4 border-b bg-background">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Presets ({presets.length})</h3>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button size="sm" onClick={handleCreateNew}>
                            <Plus className="h-4 w-4 mr-2" />
                            New
                          </Button>
                        </motion.div>
                      </div>

                      {/* Search and Filters */}
                      <div className="space-y-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search presets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 text-sm transition-all duration-200 focus:border-primary"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger className="text-xs">
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Categories</SelectItem>
                              {AVAILABLE_CATEGORIES.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                  {cat.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                            <SelectTrigger className="text-xs">
                              <SelectValue placeholder="Difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Levels</SelectItem>
                              <SelectItem value="safe">Safe</SelectItem>
                              <SelectItem value="experimental">Experimental</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Preset List with Enhanced Scrolling */}
                    <ScrollArea className="flex-1">
                      <div className="p-4 space-y-3">
                        <AnimatePresence mode="popLayout">
                          {filteredPresets.length > 0 ? (
                            filteredPresets.map((preset, index) => {
                              const categoryInfo = getCategoryInfo(preset.category)
                              const IconComponent = categoryInfo?.icon || FileText

                              return (
                                <motion.div
                                  key={preset.id}
                                  variants={listItemVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  transition={{ delay: index * 0.05 }}
                                  layout
                                >
                                  <Card
                                    className={`cursor-pointer transition-all hover:shadow-md ${
                                      selectedPreset?.id === preset.id
                                        ? "border-primary bg-primary/5 shadow-md"
                                        : "hover:border-primary/50"
                                    }`}
                                    onClick={() => {
                                      setSelectedPreset(preset)
                                      setIsEditing(false)
                                    }}
                                  >
                                    <CardContent className="p-3">
                                      <div className="flex items-start gap-3">
                                        <div className="p-1.5 rounded bg-primary/10 flex-shrink-0">
                                          <IconComponent className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h4 className="font-medium text-sm line-clamp-1">{preset.title}</h4>
                                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                            {preset.description}
                                          </p>
                                          <div className="flex gap-1 mt-2 flex-wrap">
                                            <Badge
                                              variant="outline"
                                              className={`text-xs ${getCategoryColor(preset.category)}`}
                                            >
                                              {categoryInfo?.label}
                                            </Badge>
                                            <Badge
                                              variant="outline"
                                              className={`text-xs ${getDifficultyColor(preset.difficulty)}`}
                                            >
                                              {preset.difficulty}
                                            </Badge>
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              )
                            })
                          ) : (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-center py-8 text-muted-foreground"
                            >
                              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No presets found</p>
                              {searchTerm && <p className="text-xs mt-1">Try adjusting your search or filters</p>}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 flex flex-col min-h-0">
                    {selectedPreset || isEditing ? (
                      <div className="flex-1 overflow-hidden flex flex-col">
                        {/* Action Bar */}
                        <div className="p-4 border-b flex items-center justify-between bg-background">
                          <div>
                            <h3 className="font-semibold">
                              {isEditing
                                ? selectedPreset
                                  ? "Edit Preset"
                                  : "Create New Preset"
                                : selectedPreset?.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {isEditing ? "Modify preset details and content" : "View preset information"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {!isEditing && selectedPreset && (
                              <>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button variant="outline" size="sm" onClick={() => handleEditPreset(selectedPreset)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setPresetToDelete(selectedPreset)
                                      setShowDeleteDialog(true)
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </Button>
                                </motion.div>
                              </>
                            )}
                            {isEditing && (
                              <>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setIsEditing(false)
                                      setFormErrors({})
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button size="sm" onClick={handleSavePreset} disabled={isSubmitting}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {isSubmitting ? "Saving..." : "Save Preset"}
                                  </Button>
                                </motion.div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Content with Enhanced Scrolling */}
                        <ScrollArea className="flex-1">
                          <div className="p-4">
                            {isEditing ? (
                              /* Edit Form */
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6 max-w-4xl"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="title">Title *</Label>
                                      <Input
                                        id="title"
                                        value={formData.title || ""}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Enter preset title"
                                        className={[
                                          "transition-all",
                                          "duration-200",
                                          "focus:border-primary",
                                          formErrors.title ? "border-red-500" : "",
                                        ]
                                          .filter(Boolean)
                                          .join(" ")}
                                      />
                                      {formErrors.title && (
                                        <p className="text-sm text-red-500 mt-1">{formErrors.title}</p>
                                      )}
                                    </div>

                                    <div>
                                      <Label htmlFor="description">Description *</Label>
                                      <Textarea
                                        id="description"
                                        value={formData.description || ""}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Enter preset description"
                                        rows={3}
                                        className={[
                                          "transition-all",
                                          "duration-200",
                                          "focus:border-primary",
                                          formErrors.description ? "border-red-500" : "",
                                        ]
                                          .filter(Boolean)
                                          .join(" ")}
                                      />
                                      {formErrors.description && (
                                        <p className="text-sm text-red-500 mt-1">{formErrors.description}</p>
                                      )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label htmlFor="category">Category *</Label>
                                        <Select
                                          value={formData.category}
                                          onValueChange={(value) =>
                                            setFormData({
                                              ...formData,
                                              category: value as PresetFile["category"],
                                            })
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {AVAILABLE_CATEGORIES.map((cat) => (
                                              <SelectItem key={cat.value} value={cat.value}>
                                                {cat.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <div>
                                        <Label htmlFor="difficulty">Difficulty *</Label>
                                        <Select
                                          value={formData.difficulty}
                                          onValueChange={(value) =>
                                            setFormData({
                                              ...formData,
                                              difficulty: value as PresetFile["difficulty"],
                                            })
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="safe">Safe</SelectItem>
                                            <SelectItem value="experimental">Experimental</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <Label>Platform Compatibility *</Label>
                                    <ScrollArea className="h-48 mt-2 border rounded-md p-2">
                                      <div className="grid grid-cols-1 gap-2">
                                        {AVAILABLE_PLATFORMS.map((platform) => (
                                          <motion.div
                                            key={platform}
                                            whileHover={{ scale: 1 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`p-2 border rounded cursor-pointer transition-colors ${
                                              formData.compatibility?.includes(platform)
                                                ? "border-primary bg-primary/10"
                                                : "border-border hover:border-primary/50"
                                            }`}
                                            onClick={() => handleCompatibilityToggle(platform)}
                                          >
                                            <div className="flex items-center gap-2">
                                              <div
                                                className={`w-3 h-3 rounded-full border-2 transition-colors ${
                                                  formData.compatibility?.includes(platform)
                                                    ? "bg-primary border-primary"
                                                    : "border-muted-foreground"
                                                }`}
                                              />
                                              <span className="text-sm">{platform}</span>
                                            </div>
                                          </motion.div>
                                        ))}
                                      </div>
                                    </ScrollArea>
                                    {formErrors.compatibility && (
                                      <p className="text-sm text-red-500 mt-1">{formErrors.compatibility}</p>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <Label htmlFor="content">FastFlag Content (JSON) *</Label>
                                  <Textarea
                                    id="content"
                                    value={formData.content || ""}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="Enter FastFlag JSON content"
                                    rows={20}
                                    className={[
                                      "font-mono",
                                      "text-sm",
                                      "transition-all",
                                      "duration-200",
                                      "focus:border-primary",
                                      formErrors.content ? "border-red-500" : "",
                                    ]
                                      .filter(Boolean)
                                      .join(" ")}
                                  />
                                  {formErrors.content && (
                                    <p className="text-sm text-red-500 mt-1">{formErrors.content}</p>
                                  )}
                                </div>
                              </motion.div>
                            ) : (
                              /* View Mode */
                              selectedPreset && (
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="space-y-6 max-w-4xl"
                                >
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card>
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-base">Details</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div>
                                          <Label className="text-sm font-medium">Title</Label>
                                          <p className="text-sm mt-1">{selectedPreset.title}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Description</Label>
                                          <p className="text-sm mt-1">{selectedPreset.description}</p>
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                          <Badge
                                            variant="outline"
                                            className={getCategoryColor(selectedPreset.category)}
                                          >
                                            {getCategoryInfo(selectedPreset.category)?.label}
                                          </Badge>
                                          <Badge
                                            variant="outline"
                                            className={getDifficultyColor(selectedPreset.difficulty)}
                                          >
                                            {selectedPreset.difficulty}
                                          </Badge>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    <Card>
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-base">Compatibility</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <ScrollArea className="h-32">
                                          <div className="space-y-2">
                                            {selectedPreset.compatibility.map((platform) => (
                                              <div key={platform} className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                                <span className="text-sm">{platform}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </ScrollArea>
                                      </CardContent>
                                    </Card>
                                  </div>

                                  <Card>
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-base">FastFlag Content</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <ScrollArea className="h-96">
                                        <pre className="text-xs font-mono bg-muted/30 p-3 rounded-md whitespace-pre-wrap">
                                          {selectedPreset.content}
                                        </pre>
                                      </ScrollArea>
                                    </CardContent>
                                  </Card>

                                  {(selectedPreset.createdAt || selectedPreset.updatedAt) && (
                                    <Card>
                                      <CardHeader className="pb-3">
                                        <CardTitle className="text-base">Metadata</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-2">
                                        {selectedPreset.createdAt && (
                                          <div>
                                            <Label className="text-sm font-medium">Created</Label>
                                            <p className="text-sm mt-1">
                                              {new Date(selectedPreset.createdAt).toLocaleString()}
                                            </p>
                                          </div>
                                        )}
                                        {selectedPreset.updatedAt && (
                                          <div>
                                            <Label className="text-sm font-medium">Last Updated</Label>
                                            <p className="text-sm mt-1">
                                              {new Date(selectedPreset.updatedAt).toLocaleString()}
                                            </p>
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>
                                  )}
                                </motion.div>
                              )
                            )}
                          </div>
                        </ScrollArea>
                      </div>
                    ) : (
                      /* No Selection */
                      <div className="flex-1 flex items-center justify-center text-muted-foreground">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center"
                        >
                          <Settings className="h-12 w-12 mx-auto mb-4 opacity-20" />
                          <p className="text-lg font-medium">No preset selected</p>
                          <p className="text-sm">Select a preset from the list or create a new one</p>
                        </motion.div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {showDeleteDialog && (
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent onClick={(e) => e.stopPropagation()}>
              <DialogHeader>
                <DialogTitle>Delete Preset</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete "{presetToDelete?.title}"? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                    Cancel
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button variant="destructive" onClick={handleDeletePreset} disabled={isSubmitting}>
                    {isSubmitting ? "Deleting..." : "Delete"}
                  </Button>
                </motion.div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </AnimatePresence>
  )
}