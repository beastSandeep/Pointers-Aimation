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
  PossibleColor,
  SignalValue,
  SimpleSignal,
  Vector2,
  all,
  createRef,
  createSignal,
  easeInOutCubic,
  loop,
  makeRef,
  range,
  tween,
} from "@motion-canvas/core";

export interface MemoryArrayProps extends NodeProps {
  initialState?: SignalValue<boolean>;
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

  public constructor(props?: MemoryArrayProps) {
    super({
      ...props,
    });

    this.add(
      <Layout ref={this.layoutRef} layout gap={() => this.gap()}>
        {range(this.count()).map((i) => (
          <Rect
            ref={makeRef(this.rects, i)}
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

  public *center(which: number, duration: number) {
    const index = Math.round(which);
    const targetRect = this.rects[index - 1] || undefined;

    if (targetRect) {
      yield* this.layoutRef().absolutePosition(
        this.layoutRef()
          .absolutePosition()
          .sub(targetRect.absolutePosition())
          .add(
            this.layoutRef()
              .absolutePosition()
              .add(new Vector2((this.count() - 1) * this.gap(), 0))
          ),
        duration
      );
    }
  }

  public *reposition(duration: number) {
    yield* this.layoutRef().absolutePosition(
      this.view().size().scale(0.5),
      duration
    );
  }

  public *margin(
    which: number,
    duration: number,
    x: number = 100,
    y: number = 100
  ) {
    const index = Math.round(which);
    const targetRect = this.rects[index - 1];

    yield* targetRect.margin([y, x], duration);
  }

  public *focus(
    which: number,
    duration: number,
    zoom: number = 1,
    color: Color = this.borderColor()
  ) {
    yield* all(
      this.center(which, duration),
      // this.margin(which, duration, 5000, 0),
      this.gap(700, duration),
      this.rects[which - 1].stroke(color, duration),
      // this.rects[which].scale(zoom, duration)
      this.side(this.side() * zoom, duration)
    );
  }
  // public *toggle(duration: number) {
  //   yield* all(
  //     // color change
  //     tween(duration, (value) => {
  //       const oldColor = this.isOn ? this.borderColor() : this.offColor;
  //       const newColor = this.isOn ? this.offColor : this.borderColor();

  //       this.container().fill(
  //         Color.lerp(oldColor, newColor, easeInOutCubic(value))
  //       );
  //     })
  //   );
  //   //state update
  // }
}
