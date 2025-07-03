export interface PresetFile {
  id: string;
  title: string;
  description: string;
  content: string;
  category: "performance" | "graphics" | "mobile" | "desktop";
  difficulty: "safe" | "experimental";
  compatibility: string[];
  version: string;
}
