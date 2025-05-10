import {
  initial,
  signal,
  Code,
  LezerHighlighter,
  word,
  PossibleCodeSelection,
  CodeSelection,
  CodeProps, // Add text components if needed
} from "@motion-canvas/2d";
import {
  DEFAULT,
  SignalGenerator,
  SignalValue,
  SimpleSignal,
  chain,
  waitFor,
} from "@motion-canvas/core";
import { parser } from "@lezer/json";
import { color } from "../constant";

export interface WordHighlighterProps extends CodeProps {
  text: SignalValue<string>;
}

export default class WordHighlighter extends Code {
  @initial("")
  @signal()
  public declare readonly text: SimpleSignal<string, this>;

  private selectionArr: SignalGenerator<
    PossibleCodeSelection,
    CodeSelection
  >[] = [];

  public constructor(props?: WordHighlighterProps) {
    super({
      ...props,
      fontSize: props?.fontSize || 35,
      fontWeight: props?.fontWeight || 600,
      highlighter: props?.highlighter || new LezerHighlighter(parser),
      fill: props?.fill || color.offWhite,
      fontStyle: props?.fontStyle ? props.fontStyle : "italic",
      position: props?.position || [0, 300],
      lineHeight: props?.lineHeight || 55,
      code: props.text,
    });

    // here also could be some code
  }

  public *read(
    perWordTiminng: number = 0.3,
    waitAfterReading: number = 1,
    quotedwordTiming: number = 2
  ) {
    const lines = this.text().split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const words = line.split(" ");

      let column = 0;
      for (let j = 0; j < words.length; j++) {
        const singleWord = words[j];
        console.log();
        this.selectionArr.push(
          this.selection(
            word(i, column, singleWord.length),
            singleWord.startsWith(`"`) && singleWord.endsWith("")
              ? quotedwordTiming
              : perWordTiminng
          )
        );

        column += singleWord.length + 1;
      }
    }

    yield* chain(...this.selectionArr);
    yield* this.selection(DEFAULT, perWordTiminng);
    yield* waitFor(waitAfterReading);
  }
}
