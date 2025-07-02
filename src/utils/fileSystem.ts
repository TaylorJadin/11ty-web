import { FileNode } from '../types';

export const createDefaultProject = (): FileNode[] => {
  return [
    {
      id: 'src',
      name: 'src',
      type: 'folder',
      path: 'src',
      isOpen: true,
      children: [
        {
          id: 'index-md',
          name: 'index.md',
          type: 'file',
          path: 'src/index.md',
          content: `---
layout: base.njk
title: Welcome to 11ty
---

# Welcome to Your 11ty Site!

This is your homepage. Edit this file to customize your content.

## Getting Started

- Edit templates in the \`_includes\` folder
- Add pages in the \`src\` folder
- Configure your site in \`.eleventy.js\`

Happy building! 🚀
`
        },
        {
          id: 'about-md',
          name: 'about.md',
          type: 'file',
          path: 'src/about.md',
          content: `---
layout: base.njk
title: About
---

# About

This is the about page of your 11ty site.
`
        },
        {
          id: 'includes',
          name: '_includes',
          type: 'folder',
          path: 'src/_includes',
          isOpen: true,
          children: [
            {
              id: 'base-njk',
              name: 'base.njk',
              type: 'file',
              path: 'src/_includes/base.njk',
              content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }} | My 11ty Site</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            color: #333;
        }
        nav ul {
            list-style: none;
            padding: 0;
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
        }
        nav a {
            text-decoration: none;
            color: #0066cc;
        }
        nav a:hover {
            text-decoration: underline;
        }
        h1, h2, h3 {
            color: #2c3e50;
        }
    </style>
</head>
<body>
    <nav>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about/">About</a></li>
        </ul>
    </nav>
    
    <main>
        {{ content | safe }}
    </main>
</body>
</html>
`
            }
          ]
        }
      ]
    },
    {
      id: 'eleventy-js',
      name: '.eleventy.js',
      type: 'file',
      path: '.eleventy.js',
      content: `module.exports = function(eleventyConfig) {
  // Copy static files
  eleventyConfig.addPassthroughCopy("src/assets");
  
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_includes"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
`
    },
    {
      id: 'package-json',
      name: 'package.json',
      type: 'file',
      path: 'package.json',
      content: `{
  "name": "my-eleventy-site",
  "version": "1.0.0",
  "scripts": {
    "build": "eleventy",
    "serve": "eleventy --serve"
  },
  "dependencies": {
    "@11ty/eleventy": "^2.0.1"
  }
}
`
    }
  ];
};

export const findFileById = (files: FileNode[], id: string): FileNode | null => {
  for (const file of files) {
    if (file.id === id) {
      return file;
    }
    if (file.children) {
      const found = findFileById(file.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const updateFileContent = (files: FileNode[], id: string, content: string): FileNode[] => {
  return files.map(file => {
    if (file.id === id) {
      return { ...file, content };
    }
    if (file.children) {
      return { ...file, children: updateFileContent(file.children, id, content) };
    }
    return file;
  });
};

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop() || '';
};

export const getLanguageFromExtension = (extension: string): string => {
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'json': 'json',
    'md': 'markdown',
    'html': 'html',
    'njk': 'html',
    'css': 'css',
    'scss': 'scss',
    'ts': 'typescript',
    'yaml': 'yaml',
    'yml': 'yaml'
  };
  
  return languageMap[extension] || 'plaintext';
};