import { Token, TokenType } from "./types";

// Function to tokenize headers
export const tokenizeHeader = (
  input: string,
  start: number
): { token: Token | null; next: number } => {
  const headerMatch = input.slice(start).match(/#+/);
  if (headerMatch) {
    const headerLevel = headerMatch[0].length;
    let current = start + headerLevel; // Move past the '#' characters
    while (current < input.length && input[current] === " ") {
      current++; // Skip spaces
    }
    const headerStart = current;
    while (current < input.length && input[current] !== "\n") {
      current++;
    }
    return {
      token: {
        type: TokenType.Header,
        content: input.slice(headerStart, current).trim(),
        level: headerLevel,
      },
      next: current,
    };
  }
  return { token: null, next: start };
};

// Function to tokenize emphasis
export const tokenizeEmphasis = (
  input: string,
  start: number
): { token: Token | null; next: number } => {
  let current = start + 1; // Move past '*'
  const emphasisStart = current;
  while (current < input.length && input[current] !== "*") {
    current++;
  }
  if (current < input.length) {
    return {
      token: {
        type: TokenType.Emphasis,
        content: input.slice(emphasisStart, current).trim(),
      },
      next: current + 1, // Move past '*'
    };
  }
  return { token: null, next: start };
};

// Function to tokenize paragraphs
export const tokenizeParagraph = (
  input: string,
  start: number
): { token: Token | null; next: number } => {
  let current = start;
  while (current < input.length && !["\n", "#", "*"].includes(input[current])) {
    current++;
  }
  if (start < current) {
    return {
      token: {
        type: TokenType.Paragraph,
        content: input.slice(start, current).trim(),
      },
      next: current,
    };
  }
  return { token: null, next: start };
};
// Function to tokenize blockquotes by capturing the entire line after '>'
export const tokenizeBlockquote = (
  input: string,
  start: number
): { token: Token; next: number } => {
  let current = start + 1; // Move past '>'
  while (current < input.length && input[current] === " ") {
    current++; // Skip spaces after '>'
  }
  const blockquoteStart = current;
  while (current < input.length && input[current] !== "\n") {
    current++;
  }
  return {
    token: {
      type: TokenType.Blockquote,
      content: input.slice(blockquoteStart, current).trim(),
    },
    next: current,
  };
};

// Function to tokenize inline code
export const tokenizeInlineCode = (
  input: string,
  start: number
): { token: Token; next: number } => {
  let current = start + 1; // Move past the opening backtick
  while (current < input.length && input[current] !== "`") {
    current++;
  }
  return {
    token: {
      type: TokenType.InlineCode,
      content: input.slice(start + 1, current).trim(),
    },
    next: current + 1, // Move past the closing backtick
  };
};

// Function to handle newlines
export const tokenizeNewline = (
  start: number
): { token: Token; next: number } => {
  return {
    token: { type: TokenType.Newline, content: "\n" },
    next: start + 1,
  };
};

// Function to tokenize bold text
export const tokenizeBold = (
  input: string,
  start: number
): { token: Token | null; next: number } => {
  let current = start + 2; // Move past '**'
  const boldStart = current;
  while (
    current < input.length &&
    !(input[current] === "*" && input[current + 1] === "*")
  ) {
    current++;
  }
  if (current < input.length) {
    return {
      token: {
        type: TokenType.Bold,
        content: input.slice(boldStart, current).trim(),
      },
      next: current + 2, // Move past '**'
    };
  }
  return { token: null, next: start };
};

// Function to tokenize horizontal rules
export const tokenizeHorizontalRule = (
  input: string,
  start: number
): { token: Token; next: number } => {
  let current = start + 3; // Move past the initial '---'
  while (current < input.length && input[current] === "-") {
    current++;
  }
  return {
    token: {
      type: TokenType.HorizontalRule,
      content: "",
    },
    next: current,
  };
};

export const tokenizeOrderedList = (
  input: string,
  start: number
): { token: Token; next: number } => {
  const items: string[] = [];
  let current = start;

  while (current < input.length) {
    const lines = input.split("\n"); // Split input into lines
    if (current >= lines.length) break; // Prevent accessing out of bounds

    const line = lines[current].trim(); // Get the current line

    // Check if the line matches the ordered list format (number followed by a dot and space)
    const match = line.match(/^(\d+)\.\s(.+)/);
    if (match) {
      items.push(`<li>${match[2].trim()}</li>`); // Wrap the item in <li>
      current++;
    } else {
      break; // Exit if the current line does not match ordered list format
    }
  }

  // Return an ordered list token with all items wrapped
  return {
    token: {
      type: TokenType.OrderedList,
      content: `<ol>${items.join("")}</ol>`, // Join items and wrap in <ol>
    },
    next: current,
  };
};
