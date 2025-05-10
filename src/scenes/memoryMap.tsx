import {
  blur,
  Circle,
  Code,
  Layout,
  makeScene2D,
  QuadBezier,
  LezerHighlighter,
  Txt,
  word,
  lines,
} from "@motion-canvas/2d";

import { color } from "../constant";
import { parser } from "@lezer/json";

import {
  all,
  chain,
  Color,
  createRef,
  createSignal,
  DEFAULT,
  easeInExpo,
  linear,
  makeRef,
  range,
  sequence,
  Vector2,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import MemoryArray from "../components/memoryArray";
import FadeText from "../components/fadeText";
import WordHighlighter from "../components/wordHighlighter";

export default makeScene2D(function* (view) {
  const memoryMapText = createRef<Txt>();
  const memoryArrRef = createRef<MemoryArray>();

  view.add(
    <>
      <Txt
        opacity={0}
        ref={memoryMapText}
        y={-450}
        fill={color.white}
        fontWeight={800}
        fontSize={80}
      >
        Memory Array
      </Txt>
      <MemoryArray
        side={100}
        ref={memoryArrRef}
        gap={0}
        count={20}
        fillColor={color.darkBlue}
        opacity={0}
      />

      {/* TEMP 
      <Circle width={30} height={30} fill={color.red}>
        <Circle width={10} height={10} fill={color.black}></Circle>
      </Circle>
      */}
    </>
  );

  yield* memoryMapText().opacity(1, 1);

  yield* memoryArrRef().opacity(1, 1);
  yield* memoryArrRef().gap(1000, 0.1);
  yield* memoryArrRef().focus(
    10,
    2,
    6,
    new Color(color.green),
    new Color(color.black)
  ),
    memoryMapText().text("Memory Unit", 1);

  // --------------------------------------------------------------

  const bezier = createRef<QuadBezier>();
  const cellText = createRef<Txt>();
  const byteText = createRef<Txt>();
  const zeroText = createRef<Txt>();
  const oneText = createRef<Txt>();
  const address = "0x6f8ca193";
  const addressTxtRef = createRef<Txt>();
  const addressTxtRefGlow = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={cellText}
        opacity={0}
        fill={color.blue}
        fontSize={70}
        fontWeight={500}
      >
        Cell
      </Txt>
      <QuadBezier
        ref={bezier}
        lineWidth={10}
        startArrow
        endArrow
        stroke={color.blue}
        lineDash={[11]}
        p0={[350, 0]}
        p1={[620, 20]}
        p2={[590, -350]}
        end={0}
      />
    </>
  );
  yield* cellText().opacity(1, 1);
  yield* cellText().position([586, -400], 1);
  yield* bezier().end(1, 1);

  view.add(
    <>
      <Txt
        ref={byteText}
        opacity={0}
        fill={color.green}
        fontSize={70}
        fontWeight={500}
      >
        1 Byte = 8 bits
      </Txt>

      <Txt
        ref={zeroText}
        opacity={0}
        fontSize={100}
        fontWeight={500}
        fill={color.white}
      >
        0
      </Txt>
      <Txt
        ref={oneText}
        opacity={0}
        fontSize={100}
        fontWeight={500}
        fill={color.white}
      >
        1
      </Txt>
    </>
  );

  yield* byteText().opacity(1, 1);
  yield* byteText().position([-586, -400], 1);
  yield* zeroText().opacity(1, 0.8).to(0, 0.8);
  yield* oneText().opacity(1, 0.8).to(0, 0.8);

  zeroText().remove();
  oneText().remove();

  const bits: Txt[] = [];

  view.add(
    <Layout>
      {range(8).map((i) => (
        <Txt
          ref={makeRef(bits, i)}
          opacity={0}
          fill={color.red}
          x={-200 + 60 * i}
          fontSize={90}
          fontWeight={500}
        >{`${Math.round(Math.random())}`}</Txt>
      ))}
    </Layout>
  );

  yield* chain(...bits.map((bit) => bit.opacity(1, 0.5)));

  view.add(
    <>
      <Txt
        ref={addressTxtRefGlow}
        opacity={0}
        fill={color.orange}
        y={0}
        fontSize={90}
        fontWeight={500}
        filters={[blur(6)]}
      >
        {address}
      </Txt>
      <Txt
        ref={addressTxtRef}
        opacity={0}
        fill={color.orange}
        y={0}
        fontSize={90}
        fontWeight={500}
      >
        {address}
      </Txt>
    </>
  );

  yield* all(
    addressTxtRef().opacity(1, 2),
    addressTxtRef().position([0, 400], 2),
    addressTxtRefGlow().opacity(1, 2),
    addressTxtRefGlow().position([0, 400], 2)
  );

  yield* waitUntil("data");

  yield* all(
    chain(...bits.map((bit) => bit.opacity(0, 0.05))),
    addressTxtRefGlow().opacity(0, 1),
    addressTxtRefGlow().position(DEFAULT, 1),
    addressTxtRef().opacity(0, 1),
    addressTxtRef().position(DEFAULT, 1),
    cellText().opacity(0, 1),
    cellText().position(DEFAULT, 1),
    byteText().opacity(0, 1),
    byteText().position(DEFAULT, 1),
    bezier().opacity(0, 1),
    bezier().end(0, 1)
  );

  // remove
  addressTxtRefGlow().remove();
  addressTxtRef().remove();
  cellText().remove();
  byteText().remove();
  bezier().remove();
  bits.map((bit) => bit.remove());

  memoryMapText().text("Memory Map", 1);

  yield* memoryArrRef().unfocus(1, linear);
  yield* all(
    memoryArrRef().gap(0, 0.01, linear),
    memoryArrRef().side(80, 2),
    memoryArrRef().position([-750, -300], 3)
  );

  yield* waitUntil("les's think");

  const iText = createRef<Txt>();
  const ThreeText = createRef<Txt>();
  const codeRef = createRef<Code>();

  view.add(<Code ref={codeRef} fontSize={50} />);
  codeRef().code.append(`int i = 3;\n`);

  view.add(
    <>
      <Txt
        ref={iText}
        opacity={0}
        fill={color.green}
        fontSize={50}
        fontWeight={500}
        position={[-15, -30]}
      >
        i
      </Txt>

      <Txt
        ref={ThreeText}
        fill={color.white}
        fontSize={50}
        fontWeight={500}
        position={[90, -30]}
        opacity={0}
      >
        3
      </Txt>

      <Txt
        ref={addressTxtRef}
        fill={color.orange}
        fontSize={30}
        fontWeight={400}
        position={[
          210 - view.size().scale(0.5).x,
          240 - view.size().scale(0.5).y,
        ]}
        opacity={0}
      >
        {address}
      </Txt>
    </>
  );

  yield* chain(
    iText().opacity(1, 1),
    iText().position(
      [210 - view.size().scale(0.5).x, 170 - view.size().scale(0.5).y],
      1.5
    )
  );

  yield* chain(
    ThreeText().opacity(1, 1),
    ThreeText().position(
      [210 - view.size().scale(0.5).x, 240 - view.size().scale(0.5).y],
      1.5
    )
  );

  yield* all(
    addressTxtRef().opacity(1, 1),
    addressTxtRef().position(
      [210 - view.size().scale(0.5).x, 310 - view.size().scale(0.5).y],
      1.5
    )
  );

  yield* codeRef().code.append(`printf("%u", i);\n`, 0.8);
  yield* codeRef().code.append(`// But How i -> 3?`, 0.8);

  const str = `A variable name is a symbolic name given to a memory location where a value is stored.
When a variable is declared, the compiler allocates a specific memory address for it.
The variable name then serves as an identifier to access the value stored at that address.
`;

  const speech = createRef<WordHighlighter>();
  view.add(<WordHighlighter ref={speech} text={str} />);
  yield* speech().read();

  speech().remove();
  codeRef().remove();

  const curvePoninting = createRef<QuadBezier>();
  const curveText = createRef<FadeText>();
  const mainText = createRef<FadeText>();

  //variable to  address to value
  view.add(
    <>
      <FadeText
        ref={mainText}
        text={`i --> address --> value`}
        fill={color.green}
        endPosition={new Vector2([0, 0])}
        startPosition={new Vector2([0, 200])}
      />

      <QuadBezier
        ref={curvePoninting}
        p0={[-200, 50]}
        p1={[-25, 300]}
        p2={[150, 50]}
        stroke={color.red}
        lineWidth={4}
        endArrow
        startArrow
        end={0}
      />
      <FadeText
        ref={curveText}
        text={`3`}
        fill={color.white}
        endPosition={new Vector2([-25, 230])}
        startPosition={new Vector2([-25, 400])}
      />
    </>
  );

  yield* mainText().animate(2);
  yield* curvePoninting().end(1, 1);
  yield* curveText().animate(2);

  yield* all(
    curvePoninting().end(0, 1),
    curveText().opacity(0, 1),
    mainText().opacity(0, 1)
  );

  mainText().remove();
  curvePoninting().remove();
  curveText().remove();

  view.add(<Code ref={codeRef} fontSize={50} />);

  yield* codeRef().code.append(`int i = 3;\n`, 0.8);
  yield* codeRef().code.append(`printf("%u", &i);`, 0.8);

  view.add(
    <>
      <FadeText
        ref={mainText}
        text={`i ------> address`}
        fill={color.green}
        endPosition={new Vector2([0, 150])}
        startPosition={new Vector2([0, 300])}
      />

      <QuadBezier
        ref={curvePoninting}
        p0={[-150, 150 + 50]}
        p1={[-25, 150 + 200]}
        p2={[100, 150 + 50]}
        stroke={color.red}
        lineWidth={4}
        endArrow
        startArrow
        end={0}
      />

      <FadeText
        ref={curveText}
        text={`&`}
        fill={color.white}
        endPosition={new Vector2([-25, 320])}
        startPosition={new Vector2([-25, 500])}
      />
    </>
  );

  yield* mainText().animate(2);
  yield* curvePoninting().end(1, 1);
  yield* curveText().animate(2);

  yield* all(
    curvePoninting().end(0, 1),
    mainText().opacity(0, 1),
    curveText().animateReverse(1)
  );

  mainText().remove();
  curveText().remove();

  // address to value
  view.add(
    <>
      <FadeText
        ref={mainText}
        text={`address ------> value`}
        fill={color.green}
        endPosition={new Vector2([0, 150])}
        startPosition={new Vector2([0, 300])}
      />

      <FadeText
        ref={curveText}
        text={`*`}
        fill={color.white}
        endPosition={new Vector2([-25, 320])}
        startPosition={new Vector2([-25, 500])}
      />
    </>
  );

  yield* mainText().animate(2);
  yield* curvePoninting().end(1, 1);
  yield* curveText().animate(2);

  yield* all(
    curvePoninting().end(0, 1),
    mainText().opacity(0, 1),
    curveText().animateReverse(1)
  );

  mainText().remove();
  curvePoninting().remove();
  curveText().remove();

  yield* codeRef().code(
    `int i = 3;
printf("%u", *(&i));`,
    0.8
  );

  // variable to address to value again
  const curvePonintingTemp = createRef<QuadBezier>();
  const curveTextTemp = createRef<FadeText>();

  view.add(
    <>
      <FadeText
        ref={mainText}
        text={`i -----> address -----> value`}
        fill={color.green}
        endPosition={new Vector2([0, 150])}
        startPosition={new Vector2([0, 300])}
      />

      <QuadBezier
        ref={curvePoninting}
        p0={[-250, 200]}
        p1={[-150, 350]}
        p2={[-50, 200]}
        stroke={color.red}
        lineWidth={4}
        endArrow
        startArrow
        end={0}
      />

      <QuadBezier
        ref={curvePonintingTemp}
        p0={[120 + -150, 200]}
        p1={[120 + -25, 350]}
        p2={[120 + 100, 200]}
        stroke={color.red}
        lineWidth={4}
        endArrow
        startArrow
        end={0}
      />

      <FadeText
        ref={curveText}
        text={`&`}
        fill={color.white}
        endPosition={new Vector2([-150, 320])}
        startPosition={new Vector2([-150, 500])}
      />

      <FadeText
        ref={curveTextTemp}
        text={`*`}
        fill={color.white}
        endPosition={new Vector2([120 + -25, 320])}
        startPosition={new Vector2([120 + -25, 500])}
      />
    </>
  );

  yield* mainText().animate(2);
  yield* curvePoninting().end(1, 1);
  yield* curvePonintingTemp().end(1, 1);
  yield* curveText().animate(2);
  yield* curveTextTemp().animate(2);

  yield* all(
    curvePoninting().end(0, 1),
    curvePonintingTemp().end(0, 1),
    curveText().opacity(0, 1),
    curveTextTemp().opacity(0, 1),
    mainText().opacity(0, 1)
  );

  mainText().remove();
  curvePoninting().remove();
  curvePonintingTemp().remove();
  curveText().remove();
  curveTextTemp().remove();

  // speech

  view.add(
    <WordHighlighter
      ref={speech}
      text={`but we didn't talk about pointers yet 😎;
Pointers are just ordinary variables that stores another variable's address.`}
    />
  );
  yield* speech().read();
  speech().remove();

  yield* codeRef().code(
    `int i = 3;
int *j;`,
    0.8
  );

  //

  const jText = createRef<Txt>();
  const jValue = createRef<Txt>();
  const jAddressTextRef = createRef<Txt>();

  view.add(
    <>
      <Txt
        ref={jText}
        opacity={0}
        fill={color.purple}
        fontSize={50}
        fontWeight={500}
        position={[18, 30]}
      >
        j
      </Txt>

      <Txt
        ref={jValue}
        fill={color.white}
        fontSize={40}
        fontWeight={500}
        position={[
          450 - view.size().scale(0.5).x,
          240 - view.size().scale(0.5).y,
        ]}
        opacity={0}
      >
        94
      </Txt>

      <Txt
        ref={jAddressTextRef}
        fill={color.orange}
        fontSize={30}
        fontWeight={400}
        position={[
          450 - view.size().scale(0.5).x,
          310 - view.size().scale(0.5).y,
        ]}
        opacity={0}
      >
        0x6f8ca194
      </Txt>
    </>
  );

  yield* chain(
    jText().opacity(1, 1),
    jText().position(
      [450 - view.size().scale(0.5).x, 160 - view.size().scale(0.5).y],
      1.5
    )
  );
  yield* jValue().opacity(1, 1);
  yield* jAddressTextRef().opacity(1, 1);

  // speech
  view.add(
    <WordHighlighter
      fontSize={32}
      lineHeight={50}
      ref={speech}
      text={`here is j is a integer pointer(Wild Pointers) and has some garbage value in it,
and if you wonder what is "integer" word with pointer,
Pointer variables have specific types for storing the addresses of other variables.
For example, to store the address of an integer, we use an int* pointer; similarly,
other types have corresponding pointer types.
And here * is just a way to declare a pointer variable this has nothing to do with Dereference operator.`}
    />
  );
  yield* speech().read(0.1, 3);
  speech().remove();

  //

  yield* codeRef().code(
    `int i = 3;
int *j;
j = &i;
// or
// int *j = &i;`,
    0.8
  );
  yield* all(
    iText().position([iText().position().x - 60, iText().position().y], 1),
    ThreeText().position(
      [ThreeText().position().x - 60, ThreeText().position().y],
      1
    ),
    addressTxtRef().position(
      [addressTxtRef().position().x - 60, addressTxtRef().position().y],
      1
    ),
    jValue().fontSize(30, 1),
    memoryArrRef().sizeChange(4, 2.5, 1)
  );

  yield* all(jValue().text(address, 1), jValue().fill(color.yellow, 2));

  // reseting single cell zoom
  // yield* memoryArrRef().sizeUnChange(4, 2.5, 1);
  yield* waitFor(2);

  // removing comments from code
  yield* codeRef().code(
    `int i = 3;
int *j;
j = &i;`,
    0.8
  );

  yield* waitFor(2);

  yield* all(
    codeRef().code.append(
      `

// both are same
printf("%u %u", &i, j);

// both are same
printf("%u %u", i, *j);`,
      0.8
    ),
    codeRef().position([180, 150], 0.8)
  );

  yield* waitFor(2);
});
