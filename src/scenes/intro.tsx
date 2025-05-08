import {
  Code,
  Img,
  Layout,
  Rect,
  Txt,
  Video,
  lineTo,
  makeScene2D,
} from "@motion-canvas/2d";

import {
  createRef,
  waitFor,
  all,
  makeRef,
  chain,
  easeOutQuart,
  linear,
  waitUntil,
  range,
  createSignal,
  loop,
} from "@motion-canvas/core";
import { color } from "../constant";
import CImg from "../c.svg";
import vid from "../internet.mp4";

export default makeScene2D(function* (view) {
  // Create your animations here
  view.fill(color.darkBlue);

  const cImgRef = createRef<Img>();
  const codeRef = createRef<Code>();
  const floatinCharaters = createRef<Rect>();
  const characters: Txt[] = [];

  const total = 200;

  const xSignals = Array.from({ length: total }, () => createSignal(0));
  const ySignals = Array.from({ length: total }, () => createSignal(0));

  view.add(
    <>
      <Rect ref={floatinCharaters} height="100%" width="100%" opacity={0}>
        {range(total).map((i) => {
          const startX = (Math.random() - 0.5) * view.size().x;
          const startY = (Math.random() - 0.5) * view.size().y;
          xSignals[i](startX);
          ySignals[i](startY);

          const cV = Math.floor(Math.random() * 120) + 15;
          const length = Math.floor(Math.random() * 3) + 1;
          const symbol = Array.from(
            { length },
            () => ["*", "&"][Math.round(Math.random())]
          ).join("");

          return (
            <Txt
              opacity={1}
              fontSize={40}
              ref={makeRef(characters, i)}
              fill={`rgba(${cV},${cV},${cV},${(Math.random() * 0.3).toFixed(
                1
              )})`}
              x={xSignals[i]}
              y={ySignals[i]}
            >
              {symbol}
            </Txt>
          );
        })}
      </Rect>
      <Img ref={cImgRef} width={200} height={200} scale={20} src={CImg} />
      <Code ref={codeRef} offset={-1} position={[-300, -200]} fontSize={70} />
    </>
  );

  yield* cImgRef().scale(2, 2, easeOutQuart);
  yield* all(
    cImgRef().position(view.size().scale(0.5).sub(100), 0.5, linear),
    cImgRef().scale(1, 0.5, linear)
  );

  yield* floatinCharaters().opacity(2, 0.1);

  yield all(
    ...characters.map((ref, i) =>
      loop(Infinity, function* () {
        while (true) {
          const deltaX = ((Math.random() - 0.5) * view.size().x) / 2;
          const deltaY = ((Math.random() - 0.5) * view.size().y) / 2;
          yield* all(
            xSignals[i](xSignals[i]() + deltaX, 5, linear),
            ySignals[i](ySignals[i]() + deltaY, 5, linear)
          );
        }
      })
    )
  );

  // ------------------------------------------------------------------------

  codeRef().code.append(`int variable = 69;\n`);
  yield* codeRef().code.append("int *j = &variable;\n", 0.8);
  yield* codeRef().code.append("int **pointer = &j;", 0.8);
  yield* codeRef().code.prepend("// Just Examples\n", 1);

  view.save();

  yield* waitUntil("text");

  // --------------------------------------------------------------------------------------------

  const videoRef = createRef<Video>();
  view.add(<Video opacity={0} ref={videoRef} width={1920} src={vid} />);

  videoRef().play();
  yield* videoRef().opacity(1, 2);
  yield* waitUntil("video");
  yield* videoRef().opacity(0, 1);
  videoRef().remove();

  view.restore();

  // --------------------------------------------------------------------------------------------
});
