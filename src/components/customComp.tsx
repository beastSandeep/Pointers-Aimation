import {
  Node,
  NodeProps,
  initial,
  signal,
  Txt, // Add text components if needed
} from "@motion-canvas/2d";
import { SignalValue, SimpleSignal, createRef } from "@motion-canvas/core";

// Define props interface for customization
export interface CustomComponentProps extends NodeProps {
  isActive?: SignalValue<boolean>; // Boolean state to control visibility or interactivity
}

export default class CustomComponent extends Node {
  // Declare signals and initial values
  @initial(false) // Default to false (can be customized)
  @signal()
  public declare readonly isActive: SimpleSignal<boolean, this>;

  // Create references to elements for manipulation
  private readonly textRef = createRef<Text>();

  public constructor(props?: CustomComponentProps) {
    super({
      ...props,
    });

    // Define your component layout here
    this.add(
      <Txt
        ref={this.textRef}
        text="Hello Motion Canvas!"
        fill="white" // Static text color (could be dynamic too)
      />
    );
  }

  // Create custom animations
  public *animate() {}
}
