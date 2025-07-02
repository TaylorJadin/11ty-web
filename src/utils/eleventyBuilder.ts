import { BuildResult, FileNode } from '../types';

// Mock file system for 11ty
const mockFs = {
  files: new Map<string, string>(),
  
  writeFile(path: string, content: string) {
    this.files.set(path, content);
  },
  
  readFile(path: string): string {
    return this.files.get(path) || '';
  },
  
  exists(path: string): boolean {
    return this.files.has(path);
  },
  
  mkdir(path: string) {
    // Mock directory creation
  }
};

const flattenFiles = (files: FileNode[], basePath = ''): Array<{path: string, content: string}> => {
  const result: Array<{path: string, content: string}> = [];
  
  for (const file of files) {
    const fullPath = basePath ? `${basePath}/${file.name}` : file.name;
    
    if (file.type === 'file' && file.content) {
      result.push({
        path: fullPath,
        content: file.content
      });
    } else if (file.type === 'folder' && file.children) {
      result.push(...flattenFiles(file.children, fullPath));
    }
  }
  
  return result;
};

export const buildEleventyProject = async (files: FileNode[]): Promise<BuildResult> => {
  try {
    // Clear previous files
    mockFs.files.clear();
    
    // Flatten and write all files to mock filesystem
    const flatFiles = flattenFiles(files);
    flatFiles.forEach(file => {
      mockFs.writeFile(file.path, file.content);
    });
    
    // Simple template processing (mock 11ty build)
    const outputFiles: Array<{inputPath: string, outputPath: string, content: string}> = [];
    
    // Find and process markdown files
    const mdFiles = flatFiles.filter(f => f.path.endsWith('.md'));
    const baseTemplate = flatFiles.find(f => f.path.includes('base.njk'))?.content || '';
    
    for (const mdFile of mdFiles) {
      const content = mdFile.content;
      const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      
      if (frontMatterMatch) {
        const frontMatter = frontMatterMatch[1];
        const bodyContent = frontMatterMatch[2];
        
        // Parse front matter (simple parsing)
        const titleMatch = frontMatter.match(/title:\s*(.+)/);
        const title = titleMatch ? titleMatch[1].trim() : 'Untitled';
        
        // Convert markdown to HTML (basic conversion)
        let htmlContent = bodyContent
          .replace(/^# (.+)$/gm, '<h1>$1</h1>')
          .replace(/^## (.+)$/gm, '<h2>$1</h2>')
          .replace(/^### (.+)$/gm, '<h3>$1</h3>')
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.+?)\*/g, '<em>$1</em>')
          .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
          .replace(/\n\n/g, '</p><p>')
          .replace(/^(?!<[h1-6]|<\/)/gm, '<p>')
          .replace(/(?<!>)$/gm, '</p>')
          .replace(/<p><\/p>/g, '')
          .replace(/<p>(<h[1-6])/g, '$1')
          .replace(/(<\/h[1-6]>)<\/p>/g, '$1');
        
        // Apply template
        let finalHtml = baseTemplate
          .replace(/\{\{\s*title\s*\}\}/g, title)
          .replace(/\{\{\s*content\s*\|\s*safe\s*\}\}/g, htmlContent);
        
        const outputPath = mdFile.path
          .replace(/^src\//, '')
          .replace(/\.md$/, '/index.html')
          .replace(/^index\/index\.html$/, 'index.html');
        
        outputFiles.push({
          inputPath: mdFile.path,
          outputPath: `_site/${outputPath}`,
          content: finalHtml
        });
      }
    }
    
    return {
      success: true,
      output: `✅ Build completed successfully!\n\nGenerated ${outputFiles.length} pages:\n${outputFiles.map(f => `- ${f.outputPath}`).join('\n')}`,
      files: outputFiles
    };
    
  } catch (error) {
    return {
      success: false,
      error: `Build failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      files: []
    };
  }
};