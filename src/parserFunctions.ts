import { Token } from "./types";

// Function to parse horizontal rules
export const parseHorizontalRule = (): string => {
  return `<hr>`;
};

// Function to parse headers
export const parseHeader = (token: Token): string => {
  return `<h${token.level}>${token.content}</h${token.level}>`;
};

// Function to parse paragraphs
export const parseParagraph = (content: string): string => {
  return `<p>${content.trim()}</p>`;
};

// Function to parse blockquotes
export const parseBlockquote = (content: string): string => {
  return `<blockquote>${content.trim()}</blockquote>`;
};

// Function to parse emphasized text
export const parseEmphasis = (content: string): string => {
  return `<em>${content}</em>`;
};

// Function to parse inline code
export const parseInlineCode = (content: string): string => {
  return `<code>${content}</code>`;
};

// Function to parse bold text
export const parseBold = (content: string): string => {
  return `<strong>${content}</strong>`;
};

// Function to handle newlines
export const handleNewline = (currentParagraph: string): string => {
  return currentParagraph ? parseParagraph(currentParagraph) : "";
};
