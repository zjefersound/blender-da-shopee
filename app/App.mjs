import { VERTICAL_TOOLS } from "./constants.mjs";
import { Layers } from "./Layers.mjs";

export class App {
  constructor({ 
    currentTool= VERTICAL_TOOLS[0].id,
    isDrawing= false,
    cursorState= null,
    layers = []
  }) {
    this.state = {
      currentTool: currentTool,
      isDrawing: isDrawing,
      cursorState: cursorState,
      layers: new Layers(layers),
    };
  }
}
