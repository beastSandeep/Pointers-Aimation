import {
  blur,
  Code,
  Layout,
  makeScene2D,
  QuadBezier,
  Rect,
  Txt,
} from "@motion-canvas/2d";

import { color } from "../constant";

import {
  all,
  chain,
  Color,
  createRef,
  createSignal,
  DEFAULT,
  easeInExpo,
  makeRef,
  range,
} from "@motion-canvas/core";
import MemoryArray from "../components/memoryArray";

export default makeScene2D(function* (view) {
  const memoryMapText = createRef<Txt>();
  const ref = createRef<MemoryArray>();

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
      <MemoryArray side={100} ref={ref} gap={50} fillColor={color.darkBlue} />
    </>
  );

  yield* memoryMapText().opacity(1, 1);

  yield* ref().focus(10, 2, 5, new Color("yellow"));

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
    addressTxtRef().opacity(1, 1),
    addressTxtRef().position([0, 400], 1),
    addressTxtRefGlow().opacity(1, 1),
    addressTxtRefGlow().position([0, 400], 1)
  );

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

  const iText = createRef<Txt>();

  view.add(<Code code={`int i = 3;`} />);
  view.add(
    <>
      <Txt
        ref={iText}
        fill={color.green}
        fontSize={30}
        fontWeight={400}
        position={[0, 0]}
      >
        i
      </Txt>
      <Txt fill={color.red} fontSize={30} fontWeight={400} position={[0, 0]}>
        3
      </Txt>
      <Txt
        fill={color.red}
        fontSize={30}
        fontWeight={400}
        // position={rects[0].position()}
      >
        3
      </Txt>
      <Txt
        fill={color.orange}
        fontSize={30}
        fontWeight={400}
        // position={rects[0].position()}
      >
        {address}
      </Txt>
    </>
  );

  // yield* iText().position(rects[0].position().sub(camera().position()), 1);
  yield* iText().position([iText().position().x, -100], 1);
});
