export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  content?: string;
  children?: FileNode[];
  isOpen?: boolean;
}

export interface Project {
  id: string;
  name: string;
  files: FileNode[];
  config: EleventyConfig;
}

export interface EleventyConfig {
  input: string;
  output: string;
  templateFormats: string[];
  markdownTemplateEngine: string;
  htmlTemplateEngine: string;
  dataTemplateEngine: string;
}

export interface BuildResult {
  success: boolean;
  output?: string;
  error?: string;
  files: Array<{
    inputPath: string;
    outputPath: string;
    content: string;
  }>;
}