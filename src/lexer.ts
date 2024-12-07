import {
  tokenizeBlockquote,
  tokenizeBold,
  tokenizeEmphasis,
  tokenizeHeader,
  tokenizeHorizontalRule,
  tokenizeInlineCode,
  tokenizeNewline,
  tokenizeParagraph,
} from "./lexerFunctions";
import { Token, TokenType } from "./types";

export const lexer = (input: string): Token[] => {
  const tokens: Token[] = [];
  let current = 0;

  while (current < input.length) {
    const char = input[current];

    // Check for inline code
    if (char === "`") {
      const { token, next } = tokenizeInlineCode(input, current);
      tokens.push(token);
      current = next; // Move past the token
      continue;
    }

    // Handle Newline
    if (char === "\n") {
      const { token, next } = tokenizeNewline(current);
      tokens.push(token);
      current = next;
      continue;
    }

    // Check for horizontal rules
    if (
      input.slice(current, current + 3) === "---" ||
      input.slice(current, current + 3) === "***" ||
      input.slice(current, current + 3) === "___"
    ) {
      const { token, next } = tokenizeHorizontalRule(input, current);
      tokens.push(token);
      current = next; // Move past the token
      continue;
    }

    // Handle Headers
    if (char === "#") {
      const { token, next } = tokenizeHeader(input, current);
      if (token) tokens.push(token);
      current = next;
      continue;
    }

    // Handle Bold
    if (char === "*" && input[current + 1] === "*") {
      const { token, next } = tokenizeBold(input, current);
      if (token) tokens.push(token);
      current = next;
      continue;
    }

    // Handle Emphasis
    if (char === "*") {
      const { token, next } = tokenizeEmphasis(input, current);
      if (token) tokens.push(token);
      current = next;
      continue;
    }

    // Handle Blockquotes
    if (char === ">") {
      const { token, next } = tokenizeBlockquote(input, current);
      tokens.push(token);
      current = next;
      continue;
    }

    // Handle Paragraph
    const { token, next } = tokenizeParagraph(input, current);
    if (token) tokens.push(token);
    current = next;
  }
  console.log(tokens);

  return tokens;
};
