"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import {
  Wand2,
  Sparkles,
  Settings,
  History,
  Download,
  Copy,
  Trash2,
  Plus,
  RefreshCw,
  FileText,
  Zap,
  Brain,
  Target,
  Lightbulb,
  CheckCircle,
  Clock,
} from "lucide-react"

// Types
interface PromptHistory {
  id: string
  timestamp: Date
  input: string
  output: string
  provider: string
  model: string
  strategy: string
  settings: APISettings
}

interface APISettings {
  provider: string
  apiKey: string // Kept in type for potential future re-integration, but not used.
  model: string
  temperature: number
  maxTokens: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
}

interface PromptTemplate {
  id: string
  name: string
  description: string
  template: string
  category: string
}

// API Providers Configuration - Now only Google Gemini
const API_PROVIDERS = {
  google: {
    name: "Google Gemini",
    models: ["gemini-2.5-flash", "gemini-2.5-pro"],
    supportsTemperature: true,
    supportsMaxTokens: true,
    supportsTopP: true,
    supportsFrequencyPenalty: false,
    supportsPresencePenalty: false,
  },
}

// Enhancement Strategies
const ENHANCEMENT_STRATEGIES = [
  {
    id: "recommended",
    name: "Recommended",
    description: "Pretty good refinement for most cases.",
    icon: Sparkles,
    prompt:
      "Fully analyze the intentions of the following prompt I've made. Use everything you know about prompt engineering and my intentions, to improve the prompt to ensure that its output is always high quality and accurately satisfies the prompt's request. Please make sure to keep all the exact precise details of the prompt intact and just improve/perfect it to generate the best possible output. Do not give out 'steps to-dos' or 'what to-dos' inside the prompt and let the AI think for itself. I only want you to refine/improve the grammar and context of the prompt. Make sure to only write the enhanced prompt. My prompt:",
  },
  {
    id: "refine",
    name: "Refine",
    description: "Improve clarity and structure",
    icon: Target,
    prompt:
      "Please refine this prompt to make it clearer, more specific, and better structured while maintaining its original intent. Make sure to only write the refined prompt. My prompt:",
  },
  {
    id: "concise",
    name: "Make Concise",
    description: "Simplify and shorten",
    icon: Zap,
    prompt:
      "Please make this prompt more concise while preserving all essential information and intent. Make sure to only write the refined prompt. My prompt:",
  },
  {
    id: "creative",
    name: "Creative Boost",
    description: "Add creativity and flair",
    icon: Lightbulb,
    prompt:
      "Please enhance this prompt to be more creative, engaging, and inspiring while maintaining its core purpose. Make sure to only write the refined prompt. My prompt:",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Make more formal and professional",
    icon: Brain,
    prompt:
      "Please refine this prompt to be more professional, formal, and suitable for business or academic contexts. Make sure to only write the refined prompt. My prompt:",
  },
]

// Default Templates
const DEFAULT_TEMPLATES: PromptTemplate[] = [
  {
    id: "1",
    name: "Creative Writing",
    description: "Template for creative writing prompts",
    template:
      "Write a [genre] story about [character] who [situation]. The story should be [length] and include [elements]. Focus on [themes] and make sure to [requirements].",
    category: "Writing",
  },
  {
    id: "2",
    name: "Code Review",
    description: "Template for code review requests",
    template:
      "Please review this [language] code for [purpose]. Check for [aspects] and provide suggestions for [improvements]. The code should follow [standards] best practices.",
    category: "Development",
  },
  {
    id: "3",
    name: "Business Analysis",
    description: "Template for business analysis prompts",
    template:
      "Analyze [business_aspect] for [company/industry]. Consider [factors] and provide insights on [outcomes]. Include recommendations for [actions].",
    category: "Business",
  },
  {
    id: "4",
    name: "Educational Content",
    description: "Template for educational material creation",
    template:
      "Create educational content about [topic] for [audience]. Include [learning_objectives] and make it [difficulty_level]. Use [teaching_methods] and provide [assessments].",
    category: "Education",
  },
]

export default function PromptRefinerPage() {
  // State Management
  const [inputPrompt, setInputPrompt] = useState("")
  const [outputPrompt, setOutputPrompt] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [history, setHistory] = useState<PromptHistory[]>([])
  const [templates, setTemplates] = useState<PromptTemplate[]>(DEFAULT_TEMPLATES)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [customStrategy, setCustomStrategy] = useState("")
  const [showCustomStrategy, setShowCustomStrategy] = useState(false)

  // API Settings - Defaulted to Google Gemini
  const [settings, setSettings] = useState<APISettings>({
    provider: "google",
    apiKey: "", // No longer used
    model: "gemini-1.5-flash",
    temperature: 0.7,
    maxTokens: 1000,
    topP: 1.0,
    frequencyPenalty: 0,
    presencePenalty: 0,
  })

  const { toast } = useToast()

  // Load data from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("prompt-refiner-settings")
    const savedHistory = localStorage.getItem("prompt-refiner-history")
    const savedTemplates = localStorage.getItem("prompt-refiner-templates")

    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings)
      // Ensure provider is always google after removing OpenAI
      parsedSettings.provider = "google"
      setSettings(parsedSettings)
    }
    if (savedHistory) {
      setHistory(
        JSON.parse(savedHistory).map((h: any) => ({
          ...h,
          timestamp: new Date(h.timestamp),
        })),
      )
    }
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates))
    }
  }, [])

  // Save settings to localStorage
  const saveSettings = (newSettings: APISettings) => {
    setSettings(newSettings)
    localStorage.setItem("prompt-refiner-settings", JSON.stringify(newSettings))
  }

  // Save history to localStorage
  const saveHistory = (newHistory: PromptHistory[]) => {
    setHistory(newHistory)
    localStorage.setItem("prompt-refiner-history", JSON.stringify(newHistory))
  }

  // Process prompt with AI - Simplified for Google Gemini only
  const processPrompt = async (strategy: string, customPrompt?: string) => {
    if (!inputPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to refine.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setOutputPrompt("")

    try {
      const strategyConfig = ENHANCEMENT_STRATEGIES.find((s) => s.id === strategy)
      const systemPrompt = customPrompt || strategyConfig?.prompt || "Please improve this prompt:"

      const response = await fetch("/api/refine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemPrompt,
          userPrompt: inputPrompt,
          settings: { model: settings.model }, // Send relevant settings
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "An unknown error occurred")
      }

      const data = await response.json()
      const responseText = data.refinedPrompt

      setOutputPrompt(responseText)

      const historyItem: PromptHistory = {
        id: Date.now().toString(),
        timestamp: new Date(),
        input: inputPrompt,
        output: responseText,
        provider: settings.provider,
        model: settings.model,
        strategy: strategyConfig?.name || "Custom",
        settings: { ...settings },
      }

      const newHistory = [historyItem, ...history].slice(0, 50)
      saveHistory(newHistory)

      toast({
        title: "Success",
        description: "Prompt processed successfully!",
      })
    } catch (error: any) {
      console.error("Error processing prompt:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to process prompt. Please check your setup and try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Apply template
  const applyTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      setInputPrompt(template.template)
      setSelectedTemplate(templateId)
    }
  }

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied",
        description: "Text copied to clipboard",
      })
    })
  }

  // Export functionality
  const exportPrompt = (format: "txt" | "json") => {
    if (!outputPrompt) return

    const data =
      format === "json"
        ? JSON.stringify(
            {
              input: inputPrompt,
              output: outputPrompt,
              settings,
              timestamp: new Date().toISOString(),
            },
            null,
            2,
          )
        : outputPrompt

    const blob = new Blob([data], { type: format === "json" ? "application/json" : "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `refined-prompt.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Clear history
  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem("prompt-refiner-history")
    toast({
      title: "History Cleared",
      description: "All prompt history has been cleared.",
    })
  }

  const currentProvider = API_PROVIDERS.google

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
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
                Prompt Refiner & Enhancer
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              ref, do something.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 30 }}
              className="xl:col-span-3 space-y-6"
            >
              {/* Input Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 30 }}
              >
                <Card className="transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <motion.div
                          whileHover={{ rotate: 15, scale: 1.1 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                        >
                          <FileText className="h-5 w-5" />
                        </motion.div>
                        Input Prompt
                      </CardTitle>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.1 }}
                            >
                              <Button variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-1" />
                                Templates
                              </Button>
                            </motion.div>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Prompt Templates</DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="h-96">
                              <div className="space-y-4">
                                <AnimatePresence>
                                  {templates.map((template, index) => (
                                    <motion.div
                                      key={template.id}
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -20 }}
                                      transition={{
                                        delay: index * 0.05,
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                      }}
                                      whileHover={{ scale: 1.02, y: -2 }}
                                      whileTap={{ scale: 0.98 }}
                                      className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-all duration-200"
                                      onClick={() => applyTemplate(template.id)}
                                    >
                                      <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                          <h4 className="font-medium">{template.name}</h4>
                                          <p className="text-sm text-muted-foreground">{template.description}</p>
                                          <motion.div
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: index * 0.05 + 0.1 }}
                                          >
                                            <Badge variant="secondary" className="text-xs">
                                              {template.category}
                                            </Badge>
                                          </motion.div>
                                        </div>
                                      </div>
                                      <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.05 + 0.2 }}
                                        className="mt-2 p-2 bg-muted rounded text-sm font-mono"
                                      >
                                        {template.template.substring(0, 100)}...
                                      </motion.div>
                                    </motion.div>
                                  ))}
                                </AnimatePresence>
                              </div>
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <Textarea
                        placeholder="Enter your prompt here to refine or enhance it..."
                        value={inputPrompt}
                        onChange={(e) => setInputPrompt(e.target.value)}
                        className="min-h-[200px] resize-none transition-all duration-200 focus:border-primary"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex justify-between items-center mt-2 text-sm text-muted-foreground"
                    >
                      <motion.span
                        key={inputPrompt.length}
                        initial={{ scale: 1.2, color: "#3b82f6" }}
                        animate={{ scale: 1, color: "inherit" }}
                        transition={{ duration: 0.2 }}
                      >
                        {inputPrompt.length} characters
                      </motion.span>
                      <AnimatePresence>
                        {selectedTemplate && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                          >
                            <Badge variant="outline">
                              Template: {templates.find((t) => t.id === selectedTemplate)?.name}
                            </Badge>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enhancement Options */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 30 }}
              >
                <Card className="transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <motion.div
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                      >
                        <Wand2 className="h-5 w-5" />
                      </motion.div>
                      Enhancement Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                      <AnimatePresence>
                        {ENHANCEMENT_STRATEGIES.map((strategy, index) => (
                          <motion.div
                            key={strategy.id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            whileHover={{
                              scale: 1.05,
                              y: -5,
                              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                            }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                          >
                            <Button
                              variant="outline"
                              className="w-full h-auto p-4 flex flex-col items-center gap-2 transition-all duration-200"
                              onClick={() => processPrompt(strategy.id)}
                              disabled={isProcessing}
                            >
                              <motion.div
                                whileHover={{ rotate: 10, scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              >
                                <strategy.icon className="h-5 w-5" />
                              </motion.div>
                              <div className="text-center">
                                <div className="font-medium">{strategy.name}</div>
                                <div className="text-xs text-muted-foreground">{strategy.description}</div>
                              </div>
                            </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    <Separator className="my-4" />

                    {/* Custom Strategy */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <motion.div whileTap={{ scale: 0.9 }}>
                          <Switch checked={showCustomStrategy} onCheckedChange={setShowCustomStrategy} />
                        </motion.div>
                        <Label>Custom Enhancement Strategy</Label>
                      </div>

                      <AnimatePresence>
                        {showCustomStrategy && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, y: -10 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -10 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="space-y-3"
                          >
                            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }}>
                              <Textarea
                                placeholder="Describe how you want to enhance your prompt..."
                                value={customStrategy}
                                onChange={(e) => setCustomStrategy(e.target.value)}
                                className="min-h-[100px] transition-all duration-200 focus:border-primary"
                              />
                            </motion.div>
                            <motion.div
                              initial={{ scale: 0.95 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2 }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                onClick={() => processPrompt("custom", customStrategy)}
                                disabled={isProcessing || !customStrategy.trim()}
                                className="w-full"
                              >
                                <Sparkles className="h-4 w-4 mr-2" />
                                Apply Custom Strategy
                              </Button>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Output Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 300, damping: 30 }}
              >
                <Card className="transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <motion.div
                          whileHover={{ rotate: 15, scale: 1.1 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                        >
                          <Sparkles className="h-5 w-5" />
                        </motion.div>
                        Enhanced Prompt
                      </CardTitle>
                      <AnimatePresence>
                        {outputPrompt && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex gap-2"
                          >
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.1 }}
                            >
                              <Button variant="outline" size="sm" onClick={() => copyToClipboard(outputPrompt)}>
                                <Copy className="h-4 w-4 mr-1" />
                                Copy
                              </Button>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.1 }}
                            >
                              <Button variant="outline" size="sm" onClick={() => exportPrompt("txt")}>
                                <Download className="h-4 w-4 mr-1" />
                                Export
                              </Button>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <AnimatePresence mode="wait">
                      {isProcessing ? (
                        <motion.div
                          key="processing"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="flex items-center justify-center py-12"
                        >
                          <div className="text-center space-y-4">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            >
                              <RefreshCw className="h-8 w-8 mx-auto text-primary" />
                            </motion.div>
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2 }}
                              className="text-muted-foreground"
                            >
                              Processing your prompt...
                            </motion.p>
                          </div>
                        </motion.div>
                      ) : outputPrompt ? (
                        <motion.div
                          key="output"
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className="space-y-4"
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <ScrollArea className="h-[300px] w-full rounded border p-4">
                              <pre className="whitespace-pre-wrap text-sm">{outputPrompt}</pre>
                            </ScrollArea>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex justify-between items-center text-sm text-muted-foreground"
                          >
                            <motion.span
                              key={outputPrompt.length}
                              initial={{ scale: 1.2, color: "#10b981" }}
                              animate={{ scale: 1, color: "inherit" }}
                              transition={{ duration: 0.3 }}
                            >
                              {outputPrompt.length} characters
                            </motion.span>
                            <motion.div
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center gap-2"
                            >
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              >
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </motion.div>
                              <span>Enhanced successfully</span>
                            </motion.div>
                          </motion.div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
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
                            <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          </motion.div>
                          <p>Your enhanced prompt will appear here</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 30 }}
              className="space-y-6"
            >
              {/* Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 300, damping: 30 }}
              >
                <Card className="transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <motion.div
                        whileHover={{ rotate: 180, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Settings className="h-5 w-5" />
                      </motion.div>
                      Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* API Provider and Key sections are now removed */}

                    {/* Model Selection */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 }}
                      className="space-y-2"
                    >
                      <Label>Model (Google Gemini)</Label>
                      <Select
                        value={settings.model}
                        onValueChange={(value) => saveSettings({ ...settings, model: value })}
                      >
                        <SelectTrigger className="transition-all duration-200 hover:border-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currentProvider.models.map((model) => (
                            <SelectItem key={model} value={model}>
                              {model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>

                    {/* Temperature */}
                    {currentProvider.supportsTemperature && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.95 }}
                        className="space-y-2"
                      >
                        <div className="flex justify-between">
                          <Label>Temperature</Label>
                          <motion.span
                            key={settings.temperature}
                            initial={{ scale: 1.2, color: "#3b82f6" }}
                            animate={{ scale: 1, color: "inherit" }}
                            transition={{ duration: 0.2 }}
                            className="text-sm text-muted-foreground"
                          >
                            {settings.temperature}
                          </motion.span>
                        </div>
                        <Slider
                          value={[settings.temperature]}
                          onValueChange={([value]) => saveSettings({ ...settings, temperature: value })}
                          max={1}
                          min={0}
                          step={0.1}
                          className="w-full"
                        />
                      </motion.div>
                    )}

                    {/* Max Tokens */}
                    {currentProvider.supportsMaxTokens && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0 }}
                        className="space-y-2"
                      >
                        <Label>Max Tokens</Label>
                        <Input
                          type="number"
                          value={settings.maxTokens}
                          onChange={(e) =>
                            saveSettings({ ...settings, maxTokens: Number.parseInt(e.target.value) || 1000 })
                          }
                          min={1}
                          max={8192} // Updated max for Gemini models
                          className="transition-all duration-200 focus:border-primary"
                        />
                      </motion.div>
                    )}

                    {/* Advanced Settings */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05 }}>
                      <Separator />
                      <div className="text-sm font-medium mt-4 mb-4">Advanced Settings</div>
                    </motion.div>

                    {currentProvider.supportsTopP && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 }}
                        className="space-y-2"
                      >
                        <div className="flex justify-between">
                          <Label>Top P</Label>
                          <motion.span
                            key={settings.topP}
                            initial={{ scale: 1.2, color: "#3b82f6" }}
                            animate={{ scale: 1, color: "inherit" }}
                            transition={{ duration: 0.2 }}
                            className="text-sm text-muted-foreground"
                          >
                            {settings.topP}
                          </motion.span>
                        </div>
                        <Slider
                          value={[settings.topP]}
                          onValueChange={([value]) => saveSettings({ ...settings, topP: value })}
                          max={1}
                          min={0}
                          step={0.1}
                          className="w-full"
                        />
                      </motion.div>
                    )}

                    {/* Frequency and Presence Penalty sliders are dynamically hidden since Gemini doesn't support them */}
                    {currentProvider.supportsFrequencyPenalty && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.15 }}
                        className="space-y-2"
                      >
                        <div className="flex justify-between">
                          <Label>Frequency Penalty</Label>
                          <motion.span
                            key={settings.frequencyPenalty}
                            initial={{ scale: 1.2, color: "#3b82f6" }}
                            animate={{ scale: 1, color: "inherit" }}
                            transition={{ duration: 0.2 }}
                            className="text-sm text-muted-foreground"
                          >
                            {settings.frequencyPenalty}
                          </motion.span>
                        </div>
                        <Slider
                          value={[settings.frequencyPenalty]}
                          onValueChange={([value]) => saveSettings({ ...settings, frequencyPenalty: value })}
                          max={2}
                          min={-2}
                          step={0.1}
                          className="w-full"
                        />
                      </motion.div>
                    )}

                    {currentProvider.supportsPresencePenalty && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 }}
                        className="space-y-2"
                      >
                        <div className="flex justify-between">
                          <Label>Presence Penalty</Label>
                          <motion.span
                            key={settings.presencePenalty}
                            initial={{ scale: 1.2, color: "#3b82f6" }}
                            animate={{ scale: 1, color: "inherit" }}
                            transition={{ duration: 0.2 }}
                            className="text-sm text-muted-foreground"
                          >
                            {settings.presencePenalty}
                          </motion.span>
                        </div>
                        <Slider
                          value={[settings.presencePenalty]}
                          onValueChange={([value]) => saveSettings({ ...settings, presencePenalty: value })}
                          max={2}
                          min={-2}
                          step={0.1}
                          className="w-full"
                        />
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* History */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 300, damping: 30 }}
              >
                <Card className="transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <motion.div
                          whileHover={{ rotate: 15, scale: 1.1 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                        >
                          <History className="h-5 w-5" />
                        </motion.div>
                        History
                      </CardTitle>
                      <AnimatePresence>
                        {history.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ duration: 0.1 }}
                          >
                            <Button variant="ghost" size="sm" onClick={clearHistory}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {history.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8 text-muted-foreground"
                      >
                        <motion.div
                          animate={{
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        >
                          <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        </motion.div>
                        <p className="text-sm">No history yet</p>
                      </motion.div>
                    ) : (
                      <ScrollArea className="h-[300px]">
                        <div className="space-y-3">
                          <AnimatePresence>
                            {history.map((item, index) => (
                              <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                                transition={{
                                  delay: index * 0.05,
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 30,
                                }}
                                whileHover={{
                                  scale: 1.02,
                                  y: -2,
                                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.1, ease: "easeOut" }}
                                className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-all duration-200"
                                onClick={() => {
                                  setInputPrompt(item.input)
                                  setOutputPrompt(item.output)
                                }}
                              >
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: index * 0.05 + 0.1 }}
                                  className="flex items-center justify-between mb-2"
                                >
                                  <Badge variant="secondary" className="text-xs">
                                    {item.strategy}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {item.timestamp.toLocaleDateString()}
                                  </span>
                                </motion.div>
                                <motion.p
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: index * 0.05 + 0.15 }}
                                  className="text-sm truncate"
                                >
                                  {item.input}
                                </motion.p>
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: index * 0.05 + 0.2 }}
                                  className="flex items-center gap-2 mt-2 text-xs text-muted-foreground"
                                >
                                  <span>{item.provider}</span>
                                  <span>•</span>
                                  <span>{item.model}</span>
                                </motion.div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
