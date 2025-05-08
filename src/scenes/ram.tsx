import { Img, Video, makeScene2D } from "@motion-canvas/2d";

import { color } from "../constant";

import ramImage from "../ram.jpg";
import ramVideo from "../ram.mp4";

import {
  BBox,
  createRef,
  waitUntil,
  zoomInTransition,
} from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  // const area = new BBox(1260, 450, 10, 10);
  const area = new BBox(view.size().x * 0.66, view.size().y * 0.42, 1, 1);

  view.fill(color.darkBlue);
  yield* zoomInTransition(area, 2);

  const imgRef = createRef<Img>();

  view.add(<Img ref={imgRef} src={ramImage} width={"100%"} opacity={0} />);

  yield* imgRef().opacity(1, 0.5);
  yield* waitUntil("RAM I");
  yield* imgRef().opacity(0, 0.5);
  imgRef().remove();

  const vidRef = createRef<Video>();
  view.add(<Video ref={vidRef} width={"100%"} src={ramVideo} opacity={0} />);

  vidRef().play();
  vidRef().seek(18);
  yield* vidRef().opacity(1, 0.5);
  yield* waitUntil("RAM V");
  yield* vidRef().opacity(0, 0.5);
  vidRef().remove();

  view.removeChildren();
});
