export enum TokenType {
  Header,
  Paragraph,
  Emphasis,
  Bold,
  Blockquote,
  Newline,
  InlineCode,
  HorizontalRule,
  OrderedList,
}

export type Token = {
  type: TokenType;
  content: string | string[];
  level?: number; // For headers
};
