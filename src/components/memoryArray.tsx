import {
  Camera,
  Layout,
  Node,
  NodeProps,
  Rect,
  colorSignal,
  initial,
  signal,
} from "@motion-canvas/2d";
import {
  Color,
  ColorSignal,
  DEFAULT,
  PossibleColor,
  SignalValue,
  SimpleSignal,
  TimingFunction,
  Vector2,
  all,
  createRef,
  createSignal,
  easeInExpo,
  easeInOutCubic,
  easeOutExpo,
  linear,
  loop,
  makeRef,
  range,
  tween,
} from "@motion-canvas/core";

export interface MemoryArrayProps extends NodeProps {
  count?: SignalValue<number>;
  fillColor?: SignalValue<PossibleColor>;
  borderColor?: SignalValue<PossibleColor>;
  gap?: SignalValue<number>;
  lineWidth?: SignalValue<number>;
  side?: SignalValue<number>;
}

export default class MemoryArray extends Node {
  @initial(10)
  @signal()
  public declare readonly count: SimpleSignal<number, this>;

  @initial("#fff")
  @colorSignal()
  public declare readonly borderColor: ColorSignal<this>;

  @initial("#000")
  @colorSignal()
  public declare readonly fillColor: ColorSignal<this>;

  @initial(0)
  @signal()
  public declare readonly gap: SimpleSignal<number, this>;

  @initial(3)
  @signal()
  public declare readonly lineWidth: SimpleSignal<number, this>;

  @initial(50)
  @signal()
  public declare readonly side: SimpleSignal<number, this>;

  private readonly rects: Rect[] = [];
  private cameraRef = createRef<Camera>();

  private focusedZoomFactor = 1;
  private focusExtraGap = 2000;

  public constructor(props?: MemoryArrayProps) {
    super({
      ...props,
    });

    this.add(
      <Layout>
        <Camera ref={this.cameraRef}>
          {range(this.count()).map((i) => (
            <Rect
              ref={makeRef(this.rects, i)}
              // x={() => (this.side() + this.gap()) * i}
              x={(this.side() + this.gap()) * i}
              width={() => this.side()}
              height={() => this.side()}
              stroke={this.borderColor()}
              fill={this.fillColor()}
              lineWidth={this.lineWidth()}
              radius={2}
            />
          ))}
        </Camera>
      </Layout>
    );
  }

  private selector(
    which: number,
    scaleFactor: number,
    reverse: boolean = false
  ) {
    const shift = ((scaleFactor - 1) * this.side()) / 2;
    const arr: { r: Rect; c: number }[] = [];

    for (let i = 0; i < which - 1; i++) {
      const obj = {
        r: this.rects[i],
        c: reverse
          ? this.rects[i].position().x + shift + this.lineWidth() // unfocus
          : this.rects[i].position().x - shift - this.lineWidth(),
      };
      arr.push(obj);
    }

    for (let i = which; i < this.count(); i++) {
      const obj = {
        r: this.rects[i],
        c: reverse
          ? this.rects[i].position().x - shift - this.lineWidth() //unfocus
          : this.rects[i].position().x + shift + this.lineWidth(),
      };
      arr.push(obj);
    }

    return arr;
  }

  public *focus(
    which: number,
    duration: number,
    zoom: number = 1,
    sColor: Color = this.borderColor(),
    fColor: Color = this.fillColor(),
    timingFunc: TimingFunction = easeInExpo
  ) {
    this.focusedZoomFactor = zoom;
    yield* all(
      this.rects[which - 1].scale(zoom, duration, timingFunc),
      this.rects[which - 1].stroke(sColor, duration, timingFunc),
      this.rects[which - 1].fill(fColor, duration, timingFunc),
      this.cameraRef().centerOn(
        this.rects[which - 1].position(),
        duration,
        timingFunc
      ),
      this.rects[which - 1].lineWidth(
        this.lineWidth() / zoom,
        duration,
        timingFunc
      ),
      ...this.selector(which, zoom).map((obj) =>
        obj.r.position(
          [
            obj.c > 0 ? obj.c + this.focusExtraGap : obj.c - this.focusExtraGap,
            0,
          ],
          duration,
          timingFunc
        )
      )
    );
  }

  public *unfocus(
    which: number,
    duration: number,
    sColor: Color = this.borderColor(),
    fColor: Color = this.fillColor(),
    timingFunc: TimingFunction = easeOutExpo
  ) {
    yield* all(
      this.rects[which - 1].scale(1, duration, timingFunc),
      this.rects[which - 1].stroke(sColor, duration, timingFunc),
      this.rects[which - 1].fill(fColor, duration, timingFunc),
      this.rects[which - 1].lineWidth(this.lineWidth(), duration, timingFunc),
      this.cameraRef().reset(duration, timingFunc),
      ...this.selector(which, this.focusedZoomFactor, true).map((obj) =>
        obj.r.position(
          [
            obj.c > 0 ? obj.c - this.focusExtraGap : obj.c + this.focusExtraGap,
            0,
          ],
          duration,
          timingFunc
        )
      )
    );

    this.focusedZoomFactor = 1;
  }

  public *sizeChange(which: number, scaleFactor: number, duration: number) {
    yield* all(
      this.rects[which - 1].scale(
        [scaleFactor, this.rects[which - 1].scale().y],
        duration
      ),

      ...this.selector(which, scaleFactor).map((obj) =>
        obj.r.position([obj.c, 0], 1)
      )
    );
  }

  public *sizeUnChange(which: number, scaleFactor: number, duration: number) {
    yield* all(
      this.rects[which - 1].scale(
        [1, this.rects[which - 1].scale().y],
        duration
      ),

      ...this.selector(which, scaleFactor, true).map((obj) =>
        obj.r.position([obj.c, 0], 1)
      )
    );
  }
}
