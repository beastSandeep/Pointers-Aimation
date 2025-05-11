import { parser } from "@lezer/json";
import {
  Code,
  Layout,
  LezerHighlighter,
  makeScene2D,
  Rect,
  Txt,
  word,
} from "@motion-canvas/2d";
import {
  all,
  chain,
  createRef,
  fadeTransition,
  Vector2,
  waitFor,
} from "@motion-canvas/core";
import { color } from "../constant";
import FadeText from "../components/fadeText";
import WordHighlighter from "../components/wordHighlighter";
import MemoryArray from "../components/memoryArray";

export default makeScene2D(function* (view) {
  const question = createRef<Code>();

  view.add(
    <Code
      highlighter={new LezerHighlighter(parser)}
      opacity={0}
      ref={question}
      fill={color.offWhite}
      lineHeight={90}
      fontSize={60}
      code={`So you are now thinking that you know,
what "Pointers" are!! 😁.`.toUpperCase()}
    />
  );

  yield* question().opacity(1, 1);
  yield* question().code(`well not yet`.toUpperCase(), 0.5);

  const title = createRef<FadeText>();
  const codeRef = createRef<Code>();
  view.add(
    <>
      <FadeText
        ref={title}
        fill={color.white}
        fontSize={100}
        fontWeight={800}
        startPosition={new Vector2([0, 0])}
        endPosition={new Vector2([0, -450])}
        text={`sizeof()`}
      />

      <Code ref={codeRef} position={[0, 50]} />
    </>
  );

  yield* chain(
    all(title().animate(2), question().opacity(0, 1)),
    question().code(`sizeof(type)     sizeof(variable)`, 1)
  );

  yield* all(question().opacity(1, 1), question().position([0, -250], 1));

  yield* codeRef().code(
    `int a;
printf("%zu", sizeof(int)); // Usually prints 4
printf("%zu", sizeof(a)); // Also prints 4`,
    1
  );

  yield* all(codeRef().position([0, -100], 1));

  const table = createRef<Code>();
  view.add(
    <Code
      ref={table}
      highlighter={new LezerHighlighter(parser)}
      fill={color.white}
      fontSize={50}
      fontWeight={400}
      position={[700, 200]}
      opacity={0}
      code={`TYPE     Byte
char     1 byte
int      4 bytes
float    4 bytes
double   8 bytes
int*     4 or 8 bytes (depends on system)`}
    />
  );

  yield* all(table().position([-60, 200], 1), table().opacity(1, 1));

  yield* all(
    title().position([-700, -450], 1),
    title().opacity(0, 1),
    question().position([-700, -250], 1),
    question().opacity(0, 1),
    codeRef().position([-700, -100], 1),
    codeRef().opacity(0, 1),
    table().position([-700, 200], 1),
    table().opacity(0, 1)
  );

  const mainFact = createRef<FadeText>();

  view.add(
    <FadeText
      ref={mainFact}
      fill={color.white}
      fontSize={60}
      fontWeight={800}
      startPosition={new Vector2([700, 0])}
      endPosition={new Vector2([0, 0])}
      text={`When used on a pointer,
it returns the size of pointer type (not the object it points to).
But why we are talking about this thing,
next slide will show you how crucial is this!`}
    />
  );

  yield* mainFact().animate(1);
  yield* mainFact().animateReverse(1);

  title().text("Pointer Arithmetic");
  yield* all(title().position([0, -450], 1), title().opacity(1, 1));

  const pointerAirthmaticLineTextRef = createRef<WordHighlighter>();

  view.add(
    <WordHighlighter
      ref={pointerAirthmaticLineTextRef}
      position={[0, 0]}
      fontSize={40}
      text={`Pointer arithmetic means performing "mathematical-operations" on pointers.`}
    />
  );

  yield* pointerAirthmaticLineTextRef().read(0.3, 1, 1);
  yield* all(
    pointerAirthmaticLineTextRef().position([0, 400], 1),
    pointerAirthmaticLineTextRef().opacity(0, 1)
  );

  table().fill(color.offWhite);
  table().position([700, 0]);
  table().code(`There are four operation you can do on pointers

Addition (ptr + n)
Subtraction (ptr - n)
Increment (ptr++)
Decrement (ptr--)
`);

  yield* all(table().position([0, 0], 1), table().opacity(1, 1));
  yield* all(table().position([-700, 0], 1), table().opacity(0, 1));

  codeRef().remove();

  // -------------------------------------------------------

  const memArrRef = createRef<MemoryArray>();
  const ptrTextRef = createRef<Txt>();
  const prtVlaueRef = createRef<Txt>();

  view.add(
    <>
      <MemoryArray
        ref={memArrRef}
        opacity={0}
        borderColor={color.red}
        side={80}
        position={[-320, -250]}
      />

      <Txt
        ref={ptrTextRef}
        fontSize={60}
        opacity={0}
        fontWeight={500}
        position={[70, -5]}
        fill={color.offWhite}
      >
        ptr
      </Txt>

      <Txt
        ref={prtVlaueRef}
        fontSize={38}
        position={[-325, -250]}
        fill={color.white}
        opacity={0}
      >
        65734
      </Txt>

      <Code ref={codeRef} code={`int* ptr;`} opacity={0} fontSize={60} />
    </>
  );

  yield* memArrRef().opacity(1, 1);
  yield* codeRef().opacity(1, 1);

  yield* all(
    ptrTextRef().fontSize(38, 1),
    ptrTextRef().opacity(1, 1),
    ptrTextRef().position([-325, -325], 1)
  );

  yield* memArrRef().sizeChange(1, 2, 1);

  yield* prtVlaueRef().opacity(1, 1);

  yield* codeRef().code(
    `int* ptr;
ptr++; //?`,
    0.8
  );

  question().code(`will it become 65735?`);

  question().position([0, 500]);
  yield* all(question().position([0, 300], 1), question().opacity(1, 1));

  const thinking = createRef<Txt>();
  const cross = createRef<Layout>();
  const cross1 = createRef<Rect>();
  const cross2 = createRef<Rect>();

  view.add(
    <Txt ref={thinking} position={[550, 280]} fontSize={200} opacity={0}>
      🤔
    </Txt>
  );

  yield* thinking().opacity(1, 1);

  view.add(
    <Layout opacity={0} rotation={45} ref={cross} position={[250, 280]}>
      <Rect ref={cross1} width={300} height={30} fill={color.red} radius={40} />
      <Rect
        ref={cross2}
        width={300}
        height={30}
        fill={color.red}
        radius={40}
        rotation={90}
      />
    </Layout>
  );

  yield* cross().opacity(1, 0.6);

  yield* all(
    cross1().fill(color.green, 1),
    cross1().width(150, 1),
    cross1().position([-60, 135], 1),
    cross2().fill(color.green, 1),
    cross().position(
      [cross().position().x + 50, cross().position().y + 100],
      1
    ),
    question().code(`it will become 65738!`, 1),
    thinking().text("😯", 0.7),
    prtVlaueRef().text("65738", 1),
    codeRef().code.replace(word(1, 6, 4), "", 1)
  );

  yield* waitFor(2);

  yield* codeRef().code.append(`\n// sizeof(int) -> 4 bytes`, 1);
  yield* codeRef().code.append(`\n// ptr++ -> ptr + 4`, 1);

  yield* codeRef().code.insert([1, 6], " // 65738", 0.6);

  yield* all(
    question().opacity(0, 1),
    cross().opacity(0, 1),
    thinking().opacity(0, 1)
  );

  view.add(
    <WordHighlighter
      ref={pointerAirthmaticLineTextRef}
      fontSize={40}
      position={[0, 350]}
      text={`These operations move the pointer to the next or previous memory location,
based on the size of the type the pointer points to.
`}
    />
  );

  yield* pointerAirthmaticLineTextRef().read();
  yield* all(
    pointerAirthmaticLineTextRef().position([0, 400], 1),
    pointerAirthmaticLineTextRef().opacity(0, 1)
  );

  // -----------------------------------------------------------------
});
