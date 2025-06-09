"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Monitor, Cpu, AlertCircle, Info, RefreshCw, DiscIcon as Display, FileText, Save } from "lucide-react"

interface FastFlagFile {
  id: string
  name: string
  content: string
  isValid: boolean
  isModified: boolean
  lastModified: Date
  size: number
}

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  files: FastFlagFile[]
  updateFiles: (files: FastFlagFile[]) => void
  saveFilesToStorage: (files: FastFlagFile[]) => void
  showToast: (title: string, description: string, variant?: "default" | "destructive") => void
}

interface UserFastFlagSettings {
  refreshRate: number;
  logicalProcessors: number;
  renderResolution: string;
}

const USER_SETTINGS_KEY = "robloxFastFlagUserSettings";

// Define FastFlags at component scope for reusability
const REFRESH_RATE_FLAGS = [
  "FIntTargetRefreshRate",
  "FIntRefreshRateLowerBound",
  "DFIntGraphicsOptimizationModeFRMFrameRateTarget",
];
const LOGICAL_PROCESSOR_FLAGS = ["DFIntRuntimeConcurrency", "FIntTaskSchedulerAutoThreadLimit"];
const RENDER_RESOLUTION_FLAGS = ["DFIntDebugDynamicRenderKiloPixels"];

// Resolution mapping for render resolution setting
const RESOLUTION_OPTIONS = [
  { label: "144p", value: "144p", kiloPixels: "37" },
  { label: "240p", value: "240p", kiloPixels: "102" },
  { label: "360p", value: "360p", kiloPixels: "230" },
  { label: "480p", value: "480p", kiloPixels: "410" },
  { label: "720p", value: "720p", kiloPixels: "922" },
  { label: "1080p", value: "1080p", kiloPixels: "2074" },
  { label: "2K", value: "2k", kiloPixels: "3686" },
  { label: "4K", value: "4k", kiloPixels: "8294" },
  { label: "8K", value: "8k", kiloPixels: "33178" },
]

export function SettingsPanel({
  isOpen,
  onClose,
  files,
  updateFiles,
  saveFilesToStorage,
  showToast,
}: SettingsPanelProps) {
  const [refreshRate, setRefreshRate] = useState<number>(60)
  const [detectedRefreshRate, setDetectedRefreshRate] = useState<number | null>(null)
  const [logicalProcessors, setLogicalProcessors] = useState<number>(4)
  const [detectedLogicalProcessors, setDetectedLogicalProcessors] = useState<number | null>(null);
  const [renderResolution, setRenderResolution] = useState<string>("1080p")
  const [detectedRenderResolution, setDetectedRenderResolution] = useState<string | null>(null);
  const [isSavingConfiguration, setIsSavingConfiguration] = useState(false)
  const [affectedFileCount, setAffectedFileCount] = useState<number>(0)
  const [previewChanges, setPreviewChanges] = useState<{ [key: string]: any }>({})
  const [savedUserSettings, setSavedUserSettings] = useState<UserFastFlagSettings | null>(null);
  const initialEffectHasRunRef = useRef(false);

  // Load saved settings on mount and handle initial hardware detection
  useEffect(() => {
    if (initialEffectHasRunRef.current) {
      return;
    }
    initialEffectHasRunRef.current = true;

    try {
      const storedSettings = localStorage.getItem(USER_SETTINGS_KEY);
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings) as UserFastFlagSettings;
        setSavedUserSettings(parsedSettings);
        setRefreshRate(parsedSettings.refreshRate);
        setLogicalProcessors(parsedSettings.logicalProcessors);
        setRenderResolution(parsedSettings.renderResolution);
        showToast("Settings Loaded", "Your saved FFs config has been loaded.");
      } else {
        // No saved settings, perform initial hardware detection
        detectHardwareSpecs();
      }
    } catch (error) {
      console.error("Error loading saved settings or detecting hardware:", error);
      showToast("Initialization Error", "Could not load settings or detect hardware. Using defaults.", "destructive");
      // Fallback to default values if detection also fails or not desired here
      // For now, detectHardwareSpecs() handles its own errors internally for UI updates.
    }
  }, []); // Empty dependency array: runs once on mount

  // Update affected file count when files or settings change
  useEffect(() => {
    calculateAffectedFiles()
  }, [files, refreshRate, logicalProcessors, renderResolution])

  // Detect hardware specifications
  const detectHardwareSpecs = async () => {
    // Detect monitor refresh rate
    try {
      // This is a best-effort approach as there's no direct API for refresh rate
      const detectRefreshRate = () => {
        return new Promise<number>((resolve) => {
          let rafCount = 0
          let startTime: number | null = null

          const countFrames = (timestamp: number) => {
            if (!startTime) {
              startTime = timestamp
              rafCount = 0
              requestAnimationFrame(countFrames)
              return
            }

            rafCount++
            const elapsed = timestamp - startTime

            if (elapsed < 1000) {
              requestAnimationFrame(countFrames)
            } else {
              // Calculate frames per second
              const fps = Math.round((rafCount * 1000) / elapsed)
              resolve(fps)
            }
          }

          requestAnimationFrame(countFrames)
        })
      }

      const rate = await detectRefreshRate()
      // Round to common refresh rates (60, 75, 120, 144, 165, 240)
      const commonRates = [60, 75, 120, 144, 165, 240]
      const closestRate = commonRates.reduce((prev, curr) => {
        return Math.abs(curr - rate) < Math.abs(prev - rate) ? curr : prev
      })

      setDetectedRefreshRate(closestRate)
      setRefreshRate(closestRate)
    } catch (error) {
      console.error("Failed to detect refresh rate:", error)
      // Default to 60Hz if detection fails
      setDetectedRefreshRate(60)
      setRefreshRate(60)
    }

    // Auto-detect resolution based on screen size
    try {
      const screenHeight = window.screen.height
      let detectedResolution = "1080p"

      if (screenHeight <= 144) detectedResolution = "144p"
      else if (screenHeight <= 240) detectedResolution = "240p"
      else if (screenHeight <= 360) detectedResolution = "360p"
      else if (screenHeight <= 480) detectedResolution = "480p"
      else if (screenHeight <= 720) detectedResolution = "720p"
      else if (screenHeight <= 1080) detectedResolution = "1080p"
      else if (screenHeight <= 1440) detectedResolution = "2k"
      else if (screenHeight <= 2160) detectedResolution = "4k"
      else detectedResolution = "8k"

      setDetectedRenderResolution(detectedResolution);
      setRenderResolution(detectedResolution)
    } catch (error) {
      setDetectedRenderResolution(null);
      console.error("Failed to detect resolution:", error)
    }

    // Auto-detect logical processors
    try {
      const numCores = navigator.hardwareConcurrency;
      if (numCores && numCores > 0) {
        setDetectedLogicalProcessors(numCores);
        setLogicalProcessors(numCores);
      } else {
        setDetectedLogicalProcessors(null);
        // If navigator.hardwareConcurrency is not supported or returns an invalid value,
        // keep the current value (initial default or user-saved).
        // Log a warning for debugging purposes.
        console.warn(
          "Could not detect logical processors or an invalid value was returned. Using current value for logical processors.",
          `Value received: ${numCores}`
        );
      }
    } catch (error) {
      setDetectedLogicalProcessors(null);
      console.error("Error attempting to detect logical processors:", error);
      // In case of an unexpected error, keep the current value.
    }
  }

  // Calculate how many files would be affected by the changes
  const calculateAffectedFiles = () => {
    let count = 0
    const changes: { [key: string]: any } = {}

    // Calculate values as strings from current UI state
    const currentRefreshRateValue = String(refreshRate)
    const currentLogicalProcessorsValue = String(Math.max(1, logicalProcessors - 1))
    const currentRenderResolutionValue =
      RESOLUTION_OPTIONS.find((opt) => opt.value === renderResolution)?.kiloPixels || "2074"

    files.forEach((file) => {
      try {
        const content = JSON.parse(file.content)
        let fileAffected = false

        // Check for refresh rate flags
        REFRESH_RATE_FLAGS.forEach((flag) => {
          if (flag in content && content[flag] !== currentRefreshRateValue) {
            fileAffected = true
            if (!changes[file.name]) changes[file.name] = {}
            changes[file.name][flag] = {
              old: content[flag],
              new: currentRefreshRateValue,
            }
          }
        })

        // Check for logical processor flags
        LOGICAL_PROCESSOR_FLAGS.forEach((flag) => {
          if (flag in content && content[flag] !== currentLogicalProcessorsValue) {
            fileAffected = true
            if (!changes[file.name]) changes[file.name] = {}
            changes[file.name][flag] = {
              old: content[flag],
              new: currentLogicalProcessorsValue,
            }
          }
        })

        // Check for render resolution flags
        RENDER_RESOLUTION_FLAGS.forEach((flag) => {
          if (flag in content && content[flag] !== currentRenderResolutionValue) {
            fileAffected = true
            if (!changes[file.name]) changes[file.name] = {}
            changes[file.name][flag] = {
              old: content[flag],
              new: currentRenderResolutionValue,
            }
          }
        })

        if (fileAffected) count++
      } catch (error) {
        // Skip invalid JSON files
        console.error(`Error parsing file ${file.name} for preview:`, error)
      }
    })

    setAffectedFileCount(count)
    setPreviewChanges(changes)
  }

  // Helper function to generate new file content based on settings
  const generateNewFileContent = (file: FastFlagFile, settings: UserFastFlagSettings): { updatedFile: FastFlagFile | null; changesMade: boolean } => {
    try {
      const content = JSON.parse(file.content);
      let modified = false;

      const targetRefreshRate = String(settings.refreshRate);
      const targetLogicalProcessors = String(Math.max(1, settings.logicalProcessors - 1));
      const targetRenderResolution =
        RESOLUTION_OPTIONS.find((opt) => opt.value === settings.renderResolution)?.kiloPixels || "2074";

      REFRESH_RATE_FLAGS.forEach((flag) => {
        if (flag in content && content[flag] !== targetRefreshRate) {
          content[flag] = targetRefreshRate;
          modified = true;
        }
      });

      LOGICAL_PROCESSOR_FLAGS.forEach((flag) => {
        if (flag in content && content[flag] !== targetLogicalProcessors) {
          content[flag] = targetLogicalProcessors;
          modified = true;
        }
      });

      RENDER_RESOLUTION_FLAGS.forEach((flag) => {
        if (flag in content && content[flag] !== targetRenderResolution) {
          content[flag] = targetRenderResolution;
          modified = true;
        }
      });

      if (modified) {
        return {
          updatedFile: {
            ...file,
            content: JSON.stringify(content, null, 2),
            isModified: true,
            lastModified: new Date(),
          },
          changesMade: true,
        };
      }
      return { updatedFile: null, changesMade: false };
    } catch (error) {
      console.error(`Error processing file ${file.name} for auto-apply:`, error);
      return { updatedFile: null, changesMade: false };
    }
  };

  // Effect to auto-apply saved settings to files
  useEffect(() => {
    if (!savedUserSettings || !files || files.length === 0) {
      return;
    }

    let filesWereUpdated = false;
    const newFilesArray = files.map(file => {
      const { updatedFile, changesMade } = generateNewFileContent(file, savedUserSettings);
      if (changesMade && updatedFile) {
        filesWereUpdated = true;
        return updatedFile;
      }
      return file;
    });

    if (filesWereUpdated) {
      updateFiles(newFilesArray);
      saveFilesToStorage(newFilesArray);
      showToast("Settings Auto-Applied", "Your saved config has been applied to some FFs.");
    }
  }, [files, savedUserSettings, updateFiles, saveFilesToStorage, showToast]); // generateNewFileContent is stable if its dependencies are stable

  // Save current UI settings as the persistent configuration
  const handleSaveConfiguration = () => {
    setIsSavingConfiguration(true);
    try {
      const currentSettings: UserFastFlagSettings = {
        refreshRate,
        logicalProcessors,
        renderResolution,
      };

      localStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(currentSettings));
      setSavedUserSettings(currentSettings);

      showToast("Settings Saved", "Your FFs settings have been saved and applied.");
      onClose(); // Close the panel after successful save
      // The auto-apply useEffect will handle updating files based on new savedUserSettings
    } catch (error) {
      console.error("Error saving configuration:", error);
      showToast("Error Saving", "cant save your configuration, mb gng.", "destructive");
    } finally {
      setIsSavingConfiguration(false);
    }
  };

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-background border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-background z-10 border-b">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-semibold">Hardware-Specific FastFlag Settings</h2>
            <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="p-4">
          <Tabs defaultValue="settings">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="preview">Preview Changes ({affectedFileCount})</TabsTrigger>
            </TabsList>

            <TabsContent value="settings">
              <div className="space-y-6">
                <div className="flex items-center justify-end">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="sm" onClick={detectHardwareSpecs} className="flex items-center gap-1">
                      <RefreshCw className="h-3 w-3" />
                      Re-detect Hardware
                    </Button>
                  </motion.div>
                </div>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-5 w-5" />
                      <CardTitle>Monitor Refresh Rate</CardTitle>
                    </div>
                    <CardDescription>
                      Set the refresh rate for your monitor. Values will be stored as strings in the JSON:
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="refresh-rate">Refresh Rate (Hz)</Label>
                          {detectedRefreshRate && (
                            <Badge variant="outline" className="ml-2">
                              Detected: {detectedRefreshRate}Hz
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <Slider
                            id="refresh-rate"
                            min={30}
                            max={360}
                            step={1}
                            value={[refreshRate]}
                            onValueChange={(value) => setRefreshRate(value[0])}
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            value={refreshRate}
                            onChange={(e) => setRefreshRate(parseInt(e.target.value))}
                            className="w-24 transition-all duration-200 focus:border-primary"
                            min={30}
                            max={360}
                          />
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>• FIntTargetRefreshRate: "{refreshRate}"</p>
                        <p>• FIntRefreshRateLowerBound: "{refreshRate}"</p>
                        <p>• DFIntGraphicsOptimizationModeFRMFrameRateTarget: "{refreshRate}"</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-5 w-5" />
                      <CardTitle>Logical Processors</CardTitle>
                    </div>
                    <CardDescription>
                      Set the number of logical processors (includes hyperthreading). Values will be stored as strings:
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="logical-processors">Logical Processors</Label>
                          {detectedLogicalProcessors && detectedLogicalProcessors > 0 && (
                            <Badge variant="outline" className="ml-2">
                              Detected: {detectedLogicalProcessors}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <Slider
                            id="logical-processors"
                            min={2}
                            max={64}
                            step={1}
                            value={[logicalProcessors]}
                            onValueChange={(value) => setLogicalProcessors(value[0])}
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            value={logicalProcessors}
                            onChange={(e) => setLogicalProcessors(parseInt(e.target.value))}
                            className="w-24 transition-all duration-200 focus:border-primary"
                            min={2}
                            max={64}
                          />
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>• DFIntRuntimeConcurrency: "{Math.max(1, logicalProcessors - 1)}"</p>
                        <p>• FIntTaskSchedulerAutoThreadLimit: "{Math.max(1, logicalProcessors - 1)}"</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Display className="h-5 w-5" />
                      <CardTitle>Render Resolution</CardTitle>
                    </div>
                    <CardDescription>
                      Set the render resolution for dynamic rendering optimization. This affects graphics quality and
                      performance:
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="render-resolution">Resolution</Label>
                          {detectedRenderResolution && (
                            <Badge variant="outline" className="ml-2">
                              Detected: {detectedRenderResolution}
                            </Badge>
                          )}
                        </div>
                        <Select value={renderResolution} onValueChange={setRenderResolution}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select resolution" />
                          </SelectTrigger>
                          <SelectContent>
                            {RESOLUTION_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{option.label}</span>
                                  <span className="text-xs text-muted-foreground ml-4">
                                    ({option.kiloPixels} kPixels)
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>
                          • DFIntDebugDynamicRenderKiloPixels: "
                          {RESOLUTION_OPTIONS.find((opt) => opt.value === renderResolution)?.kiloPixels || "2074"}"
                        </p>
                      </div>

                      <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-md">
                        <p className="font-medium mb-1">Resolution Guide:</p>
                        <p>• Lower values (144p-480p): Better performance, lower quality</p>
                        <p>• Medium values (720p-1080p): Balanced performance and quality</p>
                        <p>• Higher values (2K-8K): Better quality, may impact performance</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    All numerical FastFlag values will be stored as strings (enclosed in quotation marks) to ensure
                    proper compatibility with Roblox. These settings will only be applied to files that already contain
                    the specified FastFlags.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <div className="space-y-4">
                {affectedFileCount > 0 ? (
                  Object.entries(previewChanges).map(([fileName, changes]) => (
                    <Card key={fileName}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center"><FileText className="h-4 w-4 mr-2 text-muted-foreground" />{fileName}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="divide-y divide-border/60">
                          {Object.entries(changes as Record<string, { old: any; new: any }>).map(([flag, values]) => (
                            <div key={flag} className="py-3 first:pt-0 last:pb-0">
                              <p className="font-semibold font-mono text-sm mb-1.5 text-foreground">{flag}</p>
                              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs ml-1">
                                <span className="text-muted-foreground font-medium">Old:</span>
                                <span className="font-mono text-red-600 dark:text-red-500 line-through">
                                  {typeof values.old === "string" ? `"${values.old}"` : String(values.old === undefined || values.old === null ? "N/A" : values.old)}
                                </span>
                                <span className="text-muted-foreground font-medium">New:</span>
                                <span className="font-mono text-green-600 dark:text-green-400">
                                  {typeof values.new === "string" ? `"${values.new}"` : String(values.new)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No files will be affected by these changes.</p>
                    <p className="text-sm mt-2">
                      This could be because no files contain the specified FastFlags, or the values already match your
                      settings.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="sticky bottom-0 bg-background border-t p-4 flex justify-end gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={handleSaveConfiguration} disabled={isSavingConfiguration}>
              {isSavingConfiguration ? (
                <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" /> Save Configuration</>
              )}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
