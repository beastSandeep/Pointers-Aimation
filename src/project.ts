import { makeProject } from "@motion-canvas/core";

import { Code, LezerHighlighter } from "@motion-canvas/2d";
import { parser } from "@lezer/cpp";

Code.defaultHighlighter = new LezerHighlighter(
  parser.configure({
    // Provide a space-separated list of dialects to enable:
    dialect: "jsx ts",
  })
);

import intro from "./scenes/intro?scene";
import memoryMap from "./scenes/memoryMap?scene";
import ram from "./scenes/ram?scene";
import "./global.css";

export default makeProject({
  scenes: [
    // intro,
    // ram,
    memoryMap,
  ],
});
