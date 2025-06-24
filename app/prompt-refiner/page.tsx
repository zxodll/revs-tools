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
  Eye,
  EyeOff,
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
  apiKey: string
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

// API Providers Configuration
const API_PROVIDERS = {
  openai: {
    name: "OpenAI",
    models: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"],
    supportsTemperature: true,
    supportsMaxTokens: true,
    supportsTopP: true,
    supportsFrequencyPenalty: true,
    supportsPresencePenalty: true,
  },
  google: {
    name: "Google Gemini",
    models: ["gemini-pro", "gemini-pro-vision"],
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
    id: "refine",
    name: "Refine",
    description: "Improve clarity and structure",
    icon: Target,
    prompt:
      "Please refine this prompt to make it clearer, more specific, and better structured while maintaining its original intent:",
  },
  {
    id: "enhance",
    name: "Enhance",
    description: "Add detail and context",
    icon: Sparkles,
    prompt: "Please enhance this prompt by adding more detail, context, and specificity to make it more effective:",
  },
  {
    id: "concise",
    name: "Make Concise",
    description: "Simplify and shorten",
    icon: Zap,
    prompt: "Please make this prompt more concise while preserving all essential information and intent:",
  },
  {
    id: "creative",
    name: "Creative Boost",
    description: "Add creativity and flair",
    icon: Lightbulb,
    prompt:
      "Please enhance this prompt to be more creative, engaging, and inspiring while maintaining its core purpose:",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Make more formal and professional",
    icon: Brain,
    prompt:
      "Please refine this prompt to be more professional, formal, and suitable for business or academic contexts:",
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
  const [showApiKey, setShowApiKey] = useState(false)
  const [history, setHistory] = useState<PromptHistory[]>([])
  const [settings, setSettings] = useState<APISettings>({
    provider: "google",
    apiKey: "",
    model: "flash",
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
  })
  const [activeStrategy, setActiveStrategy] = useState<string>("refine")

  const { toast } = useToast()

  const { completion, input, handleInputChange, handleSubmit, isLoading, setInput } = useCompletion({
    api: '/api/prompt-refiner',
    body: {
      model: settings.model,
    },
    onFinish: (prompt, completion) => {
      const newHistoryItem: PromptHistory = {
        id: Date.now().toString(),
        timestamp: new Date(),
        input: prompt,
        output: completion,
        provider: settings.provider,
        model: settings.model,
        strategy: activeStrategy,
        settings: settings,
      };
      const newHistory = [newHistoryItem, ...history];
      setHistory(newHistory);
      saveHistory(newHistory);
    }
  });

  // Load settings and history from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("promptRefinerSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
    const savedHistory = localStorage.getItem("promptRefinerHistory")
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory).map((item: any) => ({ ...item, timestamp: new Date(item.timestamp) })))
    }
  }, [])

  // Process prompt with AI
  const processPrompt = async (strategy: string, customPrompt?: string) => {
    if (!inputPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to refine.",
        variant: "destructive",
      })
      return
    }

    if (!settings.apiKey) {
      toast({
        title: "Error",
        description: "Please enter your API key in settings.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setOutputPrompt("")

    try {
      const strategyConfig = ENHANCEMENT_STRATEGIES.find((s) => s.id === strategy)
      const systemPrompt = customPrompt || strategyConfig?.prompt || "Please improve this prompt:"

      // Simulate API call (replace with actual API integration)
      const response = await simulateAPICall(systemPrompt, inputPrompt, settings)

      setOutputPrompt(response)

      // Add to history
      const historyItem: PromptHistory = {
        id: Date.now().toString(),
        timestamp: new Date(),
        input: inputPrompt,
        output: response,
        provider: settings.provider,
        model: settings.model,
        strategy: strategyConfig?.name || "Custom",
        settings: { ...settings },
      }

      const newHistory = [historyItem, ...history].slice(0, 50) // Keep last 50 items
      saveHistory(newHistory)

      toast({
        title: "Success",
        description: "Prompt processed successfully!",
      })
    } catch (error) {
      console.error("Error processing prompt:", error)
      toast({
        title: "Error",
        description: "Failed to process prompt. Please check your API key and try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Simulate API call (replace with actual implementation)
  const simulateAPICall = async (systemPrompt: string, userPrompt: string, settings: APISettings): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Return a mock enhanced prompt
    return `Enhanced version of your prompt:

${userPrompt}

[This is a simulated response. In the actual implementation, this would be replaced with real API calls to ${settings.provider} using the ${settings.model} model with temperature ${settings.temperature}.]

The enhanced prompt includes:
- Improved clarity and structure
- More specific instructions
- Better context and examples
- Optimized for AI understanding

Remember to replace this simulation with actual API integration using the AI SDK.`
  }

  // Apply template
  const applyTemplate = (templateId: string) => {
    const template = DEFAULT_TEMPLATES.find((t) => t.id === templateId)
    if (template) {
      setInput(template.template)
      toast({ title: "Template Applied", description: `Applied the "${template.name}" template.` })
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
    if (!completion) return

    const historyItem = history.find((item) => item.output === completion)
    const blob = new Blob(
      [
        format === "json"
          ? JSON.stringify(historyItem, null, 2)
          : `Input:\n${historyItem?.input}\n\nOutput:\n${historyItem?.output}`,
      ],
      { type: format === "json" ? "application/json" : "text/plain" }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `prompt_${historyItem?.id}.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Clear history
  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem("promptRefinerHistory")
    toast({
      title: "History Cleared",
      description: "All prompt history has been cleared.",
    })
  }

  const currentProvider = API_PROVIDERS[settings.provider as keyof typeof API_PROVIDERS]

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
              Transform your prompts with AI-powered refinement and enhancement. Make them clearer, more effective, and
              perfectly tailored for your needs.
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
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <FileText className="h-5 w-5" />
                        </motion.div>
                        Input Prompt
                      </CardTitle>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                                  {DEFAULT_TEMPLATES.map((template, index) => (
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
                      <form onSubmit={handleSubmit}>
                        <Textarea
                          placeholder="Enter your prompt here..."
                          className="h-48 text-base resize-none transition-all duration-200 focus:border-primary"
                          value={input}
                          onChange={handleInputChange}
                        />
                      </form>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex justify-between items-center mt-2 text-sm text-muted-foreground"
                    >
                      <motion.span
                        key={input.length}
                        initial={{ scale: 1.2, color: "#3b82f6" }}
                        animate={{ scale: 1, color: "inherit" }}
                        transition={{ duration: 0.2 }}
                      >
                        {input.length} characters
                      </motion.span>
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
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
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
                            transition={{
                              delay: 0.6 + index * 0.1,
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                            }}
                            whileHover={{
                              scale: 1.05,
                              y: -5,
                              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="outline"
                              className="w-full h-auto p-4 flex flex-col items-center gap-2 transition-all duration-200"
                              onClick={() => setActiveStrategy(strategy.id)}
                              disabled={isLoading}
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
                          whileHover={{ rotate: -15, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <Sparkles className="h-5 w-5" />
                        </motion.div>
                        Refined Output
                      </CardTitle>
                      <div className="flex gap-2">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(completion)}
                            disabled={!completion || isLoading}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => exportPrompt("txt")}
                            disabled={!completion || isLoading}
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
                    {/* API Provider */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                      className="space-y-2"
                    >
                      <Label>API Provider</Label>
                      <Select
                        value={settings.provider}
                        onValueChange={(value) =>
                          saveSettings({
                            ...settings,
                            provider: value,
                            model: API_PROVIDERS[value as keyof typeof API_PROVIDERS].models[0],
                          })
                        }
                      >
                        <SelectTrigger className="transition-all duration-200 hover:border-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(API_PROVIDERS).map(([key, provider]) => (
                            <SelectItem key={key} value={key}>
                              {provider.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>

                    {/* API Key */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.85 }}
                      className="space-y-2"
                    >
                      <Label>API Key</Label>
                      <div className="relative">
                        <Input
                          type={showApiKey ? "text" : "password"}
                          placeholder="Enter your API key"
                          value={settings.apiKey}
                          onChange={(e) => saveSettings({ ...settings, apiKey: e.target.value })}
                          className="transition-all duration-200 focus:border-primary"
                        />
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowApiKey(!showApiKey)}
                          >
                            {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Model Selection */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 }}
                      className="space-y-2"
                    >
                      <Label>Model</Label>
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
                          max={4000}
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
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
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
                                className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-all duration-200"
                                onClick={() => {
                                  setInput(item.input)
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
