import {
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
  easeInOutCubic,
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
  private readonly layoutRef = createRef<Layout>();
  private focusedIndex = 0;

  public constructor(props?: MemoryArrayProps) {
    super({
      ...props,
    });

    this.add(
      <Layout ref={this.layoutRef}>
        {range(this.count()).map((i) => (
          <Rect
            ref={makeRef(this.rects, i)}
            x={() => (this.side() + this.gap()) * i}
            width={() => this.side()}
            height={() => this.side()}
            stroke={this.borderColor()}
            fill={this.fillColor()}
            lineWidth={this.lineWidth()}
            radius={2}
          />
        ))}
      </Layout>
    );
  }

  private *center(which: number, duration: number, forwards: boolean = true) {
    const index = Math.round(which) - 1;
    const targetRect = this.rects[index];

    if (targetRect) {
      if (forwards) {
        yield* this.layoutRef().position(
          this.layoutRef()
            .position()
            .sub(targetRect.position())
            .add(
              this.layoutRef()
                .position()
                .sub(new Vector2(this.gap() * index, 0))
            ),
          duration,
          easeInOutCubic
        );
      } else {
        yield* this.layoutRef().position(
          this.layoutRef()
            .position()
            .add(targetRect.position())
            .sub(
              this.layoutRef()
                .position()
                .add(new Vector2(this.gap() * index, 0))
            ),
          duration,
          easeInOutCubic
        );
      }
    }
  }

  public *focus(
    which: number,
    duration: number,
    zoom: number = 1,
    sColor: Color = this.borderColor(),
    fColor: Color = this.fillColor()
  ) {
    this.focusedIndex = which - 1;

    yield* all(
      this.center(which, duration, true),
      this.gap(this.gap() * 2, duration, easeInOutCubic),
      this.rects[which - 1].scale(zoom, duration, easeInOutCubic),
      this.rects[which - 1].stroke(sColor, duration, easeInOutCubic),
      this.rects[which - 1].lineWidth(1, duration, easeInOutCubic),
      this.rects[which - 1].fill(fColor, duration, easeInOutCubic)
    );
  }

  public *unfocus(
    duration: number,
    timingFunctoin: TimingFunction = easeInOutCubic
  ) {
    yield* all(
      this.center(1, duration, false),
      this.gap(this.side(), duration, timingFunctoin),
      this.rects[this.focusedIndex].scale(1, duration, timingFunctoin),
      this.rects[this.focusedIndex].stroke(
        this.borderColor(),
        duration,
        timingFunctoin
      ),
      this.rects[this.focusedIndex].lineWidth(
        this.lineWidth(),
        duration,
        timingFunctoin
      ),
      this.rects[this.focusedIndex].fill(
        this.fillColor(),
        duration,
        timingFunctoin
      )
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
          ? this.rects[i].position().x + shift + this.lineWidth()
          : this.rects[i].position().x - shift - this.lineWidth(),
      };
      arr.push(obj);
    }

    for (let i = which; i < this.count(); i++) {
      const obj = {
        r: this.rects[i],
        c: reverse
          ? this.rects[i].position().x - shift - this.lineWidth()
          : this.rects[i].position().x + shift + this.lineWidth(),
      };
      arr.push(obj);
    }
    return arr;
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
