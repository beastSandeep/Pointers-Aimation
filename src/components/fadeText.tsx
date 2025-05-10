import {
  Txt,
  initial,
  signal,
  TxtProps, // Add text components if needed
} from "@motion-canvas/2d";
import {
  SignalValue,
  SimpleSignal,
  Vector2,
  all,
  createRef,
  waitUntil,
} from "@motion-canvas/core";

// Define props interface for customization
export interface FadeTextProps extends TxtProps {
  text: SignalValue<string>; // Boolean state to control visibility or interactivity
  startPosition: SignalValue<Vector2>;
  endPosition: SignalValue<Vector2>;
}

export default class FadeText extends Txt {
  @initial("")
  @signal()
  public declare readonly text: SimpleSignal<string, this>;

  @initial([0, 0])
  @signal()
  public declare readonly endPosition: SignalValue<Vector2>;

  @initial([0, 100])
  @signal()
  public declare readonly startPosition: SignalValue<Vector2>;

  // Create references to elements for manipulation
  private readonly textRef = createRef<Text>();

  public constructor(props?: FadeTextProps) {
    super({
      ...props,
      text: props?.text,
      ref: props?.ref,
      position: props.startPosition,
      opacity: 0,
    });
  }

  // Create custom animations
  public *animate(duration: number = 1) {
    yield* all(
      this.opacity(1, duration),
      this.position(this.endPosition, duration)
    );
  }

  public *animateReverse(duration: number = 1) {
    yield* all(
      this.opacity(0, duration),
      this.position(this.startPosition, duration)
    );
  }
}
