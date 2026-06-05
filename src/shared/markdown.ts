import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: false,
});

export function renderMarkdown(source: string): string {
  return marked.parse(source) as string;
}

export function encodeMarkdown(source: string): string {
  return btoa(encodeURIComponent(source));
}

export function decodeMarkdown(encoded: string): string {
  try {
    return decodeURIComponent(atob(encoded));
  } catch {
    return decodeURIComponent(encoded);
  }
}

export const MARKDOWN_EXTENSIONS = [".md", ".markdown", ".mdown", ".mkd"];

export function isMarkdownFile(filename: string): boolean {
  const lower = filename.toLowerCase();
  return MARKDOWN_EXTENSIONS.some((ext) => lower.endsWith(ext));
}
