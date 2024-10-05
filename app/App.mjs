import { HELPER_TEXT, ICONS, VERTICAL_TOOLS } from "./constants.mjs";
import { Layers } from "./Layers.mjs";

export class App {
  constructor({
    currentTool = VERTICAL_TOOLS[0].id,
    isDrawing = false,
    cursorState = null,
    layers = [],
  }) {
    this.state = {
      currentTool: currentTool,
      isDrawing: isDrawing,
      cursorState: cursorState,
      layers: new Layers(layers),
    };
  }

  setCurrentTool(tool) {
    this.state.currentTool = tool;
    this.state.cursorState = {};
    const canvasContainer = document.getElementById("canvas-container");
    const helperText = document.getElementById("helper-text");
    if (tool === "cursor") {
      helperText.innerText = "";
      this.state.isDrawing = false;
      canvasContainer.style.cursor = "inherit";
    } else {
      helperText.innerText = HELPER_TEXT[tool];
      this.state.isDrawing = true;
      canvasContainer.style.cursor = "crosshair";
    }
    this.renderVerticalTools();
  }

  renderVerticalTools() {
    const verticalTools = document.getElementById("vertical-tools");
    verticalTools.innerHTML = "";
    for (const tool of VERTICAL_TOOLS) {
      const button = document.createElement("button");
      button.className = this.state.currentTool === tool.id ? "active" : "";
      button.title = tool.label;
      button.onclick = () => this.setCurrentTool(tool.id);
      const icon = document.createElement("i");
      icon.className = tool.icon;
      button.appendChild(icon);
      verticalTools.appendChild(button);
    }
  }

  removeLayer(id) {
    this.state.layers.remove(id);
    renderApp();
  }

  renderLayersList() {
    const layersList = document.getElementById("layers-list");
    layersList.innerHTML = "";
    for (const layer of this.state.layers.getItems()) {
      const li = document.createElement("li");

      const icon = document.createElement("i");
      icon.className = ICONS[layer.type];
      li.appendChild(icon);

      const text = document.createElement("input");
      text.id = "layer-input-" + layer.id;
      text.value = layer.name;
      text.onblur = (event) => {
        console.log(event.currentTarget.value.trim());
        if (!event.currentTarget.value.trim()) {
          text.value = layer.name;
        } else {
          this.state.layers.setItems(
            this.state.layers.getItems().map((l) => {
              if (l.id === layer.id) {
                layer.setName(event.currentTarget.value);
              }
              return l;
            })
          );
        }
      };
      li.appendChild(text);

      const deleteButton = document.createElement("button");
      deleteButton.className = `${ICONS.trash} delete-button`;
      deleteButton.onclick = () => removeLayer(layer.id);
      li.appendChild(deleteButton);

      layersList.appendChild(li);
    }
  }
}
