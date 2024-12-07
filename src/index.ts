// index.ts
import { lexer } from "./lexer";
import { parser } from "./parser";

const input = `# Header 1
something more **serous**
## Header 2
This is a paragraph with *emphasized text*.
Another paragraph here.

---

but i am in new line now
> hello *world*

 1. hello
 2. world
 3. yarp
 
`;

const tokens = lexer(input);
const output = parser(tokens);

console.log(output);
