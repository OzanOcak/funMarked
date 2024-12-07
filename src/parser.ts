import { Token, TokenType } from "./types";

// Example parse functions for demonstration
const parseHeader = (token: Token): string => {
  return `<h${token.level}>${token.content}</h${token.level}>`;
};

const parseEmphasis = (text: string): string => {
  return `<em>${text}</em>`;
};

const parseBold = (text: string): string => {
  return `<strong>${text}</strong>`;
};

const parseInlineCode = (text: string): string => {
  return `<code>${text}</code>`;
};

const parseParagraph = (text: string): string => {
  return `<p>${text}</p>`;
};

const parseBlockquote = (text: string): string => {
  return `<blockquote>${text}</blockquote>`;
};

const parseHorizontalRule = (): string => {
  return `<hr />`;
};

export const parser = (tokens: Token[]): string => {
  const results: string[] = [];
  let currentParagraph: string = "";
  let currentBlockquote: string = ""; // To handle blockquote content
  let newlineCount = 0; // To track the number of consecutive newlines

  for (const token of tokens) {
    switch (token.type) {
      case TokenType.Header:
        if (currentParagraph) {
          results.push(parseParagraph(currentParagraph));
          currentParagraph = "";
        }
        if (currentBlockquote) {
          results.push(parseBlockquote(currentBlockquote));
          currentBlockquote = ""; // Reset blockquote
        }
        results.push(parseHeader(token));
        newlineCount = 0; // Reset newline count after a header
        break;

      case TokenType.Emphasis:
        if (typeof token.content === "string") {
          if (currentBlockquote) {
            currentBlockquote += parseEmphasis(token.content) + " ";
          } else {
            currentParagraph += parseEmphasis(token.content) + " ";
          }
        }
        break;

      case TokenType.Bold:
        if (typeof token.content === "string") {
          if (currentBlockquote) {
            currentBlockquote += parseBold(token.content) + " ";
          } else {
            currentParagraph += parseBold(token.content) + " ";
          }
        }
        break;

      case TokenType.Paragraph:
        currentParagraph += `${token.content} `;
        newlineCount = 0; // Reset newline count when accumulating content
        break;

      case TokenType.InlineCode:
        if (typeof token.content === "string") {
          currentParagraph += parseInlineCode(token.content);
        }
        break;

      case TokenType.Blockquote:
        // If current paragraph exists, flush it
        if (currentParagraph) {
          results.push(parseParagraph(currentParagraph));
          currentParagraph = "";
        }
        // Accumulate blockquote content
        currentBlockquote += `${token.content} `;
        break;

      case TokenType.Newline:
        newlineCount++;
        if (newlineCount === 2 && currentParagraph) {
          results.push(parseParagraph(currentParagraph));
          currentParagraph = ""; // Reset current paragraph
        }
        break;

      case TokenType.HorizontalRule:
        // Flush current paragraph if any
        if (currentParagraph) {
          results.push(parseParagraph(currentParagraph));
          currentParagraph = "";
        }
        results.push(parseHorizontalRule());
        break;
    }
  }

  // Flush any remaining content
  if (currentParagraph) {
    results.push(parseParagraph(currentParagraph));
  }
  if (currentBlockquote) {
    results.push(parseBlockquote(currentBlockquote));
  }

  return results.join("");
};
