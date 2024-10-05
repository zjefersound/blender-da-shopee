import { App } from "./App.mjs";
import { CanvasGrid } from "./CanvasGrid.mjs";
import {
  HELPER_TEXT,
  ICONS,
  RECT_TYPES,
  VERTICAL_TOOLS,
} from "./constants.mjs";
import { Rect } from "./Rect.mjs";
import { Viewport } from "./Viewport.mjs";

const rect1 = new Rect(RECT_TYPES.polygon, "Polígono 1", [
  [0, 0],
  [0, -50],
  [-50, -50],
  [-50, 0],
  [-25, 25],
]);

rect1.rotateOrigin(180);

const app = new App({
  currentTool: VERTICAL_TOOLS[0].id,
  isDrawing: false,
  cursorState: null,
  layers: [
    rect1,
    new Rect(RECT_TYPES.polygon, "Polígono 2", [
      [0, 100],
      [0, 50],
      [-50, 50],
      [-50, 100],
      [-25, 125],
    ]),
    new Rect(RECT_TYPES.lines, "Polilinha 1", [
      [-100, 0],
      [-100, -50],
      [-150, -50],
      [-150, 0],
      [-125, 25],
    ]),
    new Rect(RECT_TYPES.lines, "Polilinha 2", [
      [-125, 125],
      [-100, 100],
      [-100, 50],
      [-150, 50],
      [-150, 100],
    ]),
  ],
});

function renderApp() {
  console.log(app.state.layers);
  // grid.setZoomAndPan(zoom, panOffset);
  grid.drawGrid(ctx);
  renderLayersList();
  renderVerticalTools();
  for (const layer of app.state.layers.getItems()) {
    layer.draw(ctx);
  }
}

function removeLayer(id) {
  app.state.layers.remove(id);
  renderApp();
}

function renderVerticalTools() {
  const verticalTools = document.getElementById("vertical-tools");
  verticalTools.innerHTML = "";
  for (const tool of VERTICAL_TOOLS) {
    const button = document.createElement("button");
    button.className = app.state.currentTool === tool.id ? "active" : "";
    button.title = tool.label;
    button.onclick = () => setCurrentTool(tool.id);
    const icon = document.createElement("i");
    icon.className = tool.icon;
    button.appendChild(icon);
    verticalTools.appendChild(button);
  }
}

function renderLayersList() {
  const layersList = document.getElementById("layers-list");
  layersList.innerHTML = "";
  for (const layer of app.state.layers.getItems()) {
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
        app.state.layers.setItems(
          app.state.layers.getItems().map((l) => {
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

function setCurrentTool(tool) {
  app.state.currentTool = tool;
  app.state.cursorState = {};
  const canvasContainer = document.getElementById("canvas-container");
  const helperText = document.getElementById("helper-text");
  if (tool === "cursor") {
    helperText.innerText = "";
    app.state.isDrawing = false;
    canvasContainer.style.cursor = "inherit";
  } else {
    helperText.innerText = HELPER_TEXT[tool];
    app.state.isDrawing = true;
    canvasContainer.style.cursor = "crosshair";
  }
  renderVerticalTools();
}

const coordinatesDisplay = document.getElementById("coordinates");
const canvas = document.getElementById("blender-canvas");
var ctx = canvas.getContext("2d");
canvas.height = window.innerHeight - 64 - 23;
canvas.width = window.innerWidth - 280;

const grid = new CanvasGrid(canvas, 1, [0, 0]);
const viewport = new Viewport(ctx, canvas, renderApp);

function getMousePos(evt) {
  const rect = canvas.getBoundingClientRect();
  const x =
    (evt.clientX - rect.left - viewport.width / 2 - viewport.offsetX) /
    viewport.scale;
  const y =
    -(evt.clientY - rect.top - viewport.height / 2 - viewport.offsetY) /
    viewport.scale;
  return { x: x, y: y };
}

canvas.addEventListener("mousemove", (event) => {
  const { x, y } = getMousePos(event);
  coordinatesDisplay.textContent = `Coordenadas: (${Math.round(
    x
  )}, ${Math.round(y)})`;
  if (app.state.currentTool === "cursor") {
    viewport.pan(event.clientX, event.clientY);
  }
});

canvas.addEventListener("click", (event) => {
  if (app.state.currentTool === "addDot") {
    const { x, y } = getMousePos(event);
    const newName = app.state.layers.generateName("dot");
    const rect = new Rect(RECT_TYPES.dot, newName, [x, y]);
    app.state.layers.push(rect);
    renderApp();
  }

  if (app.state.currentTool === "addPolygon") {
    const { x, y } = getMousePos(event);
    const polygonPosition = [x, y];
    if (!app.state?.cursorState?.polygonPositions)
      app.state.cursorState = {
        polygonPositions: [],
      };

    app.state.cursorState.polygonPositions.push(polygonPosition);
  }

  if (app.state.currentTool === "addLines") {
    const { x, y } = getMousePos(event);
    const linesPosition = [x, y];
    if (!app.state?.cursorState?.linesPositions)
      app.state.cursorState = {
        linesPositions: [],
      };

    app.state.cursorState.linesPositions.push(linesPosition);
  }
});

function keyDownEvents(event) {
  if (event.key === "Enter") {
    if (app.state.currentTool === "addPolygon") {
      if (app.state?.cursorState?.polygonPositions?.length < 3) {
        alert("Adicione pelo menos 3 pontos para criar um polígono");
        return;
      }
      const newName = app.state.layers.generateName("polygon");
      const rect = new Rect(
        RECT_TYPES.polygon,
        newName,
        app.state.cursorState.polygonPositions
      );
      app.state.layers.push(rect);
      app.state.cursorState.polygonPositions = [];
      renderApp();
    }
    if (app.state.currentTool === "addLines") {
      if (app.state?.cursorState?.polygonPositions?.length < 3) {
        alert(
          "Adicione pelo menos 3 pontos para criar uma sequencia de linhas"
        );
        return;
      }
      const newName = app.state.layers.generateName("lines");
      const rect = new Rect(
        RECT_TYPES.lines,
        newName,
        app.state.cursorState.linesPositions
      );
      app.state.layers.push(rect);
      app.state.cursorState.linesPositions = [];
      renderApp();
    }
  }
}

function mouseDownEvents(event) {
  if (app.state.currentTool === "addLine") {
    const { x, y } = getMousePos(event);

    app.state.cursorState = { mousedownPosition: [x, y] };
  }
}

function mouseUpEvents(event) {
  if (app.state.currentTool === "addLine") {
    const { x, y } = getMousePos(event);

    const startPosition = app.state.cursorState?.mousedownPosition;
    if (startPosition) {
      const endPosition = [x, y];
      const newName = app.state.layers.generateName("line");
      const rect = new Rect(RECT_TYPES.line, newName, [
        startPosition,
        endPosition,
      ]);
      app.state.layers.push(rect);
      app.state.cursorState = null;
      renderApp();
    }
  }
}

canvas.addEventListener("mousedown", (event) => {
  if (app.state.currentTool === "cursor") {
    viewport.startPan(event.clientX, event.clientY);
  } else {
    mouseDownEvents(event);
  }
});
canvas.addEventListener("mouseup", (event) => {
  if (app.state.currentTool === "cursor") {
    viewport.endPan();
  } else {
    mouseUpEvents(event);
  }
});
addEventListener("keydown", keyDownEvents);

addEventListener("resize", () => {
  canvas.height = window.innerHeight - 64 - 23;
  canvas.width = window.innerWidth - 280;

  viewport.updateSize();
});
canvas.addEventListener("wheel", (event) => {
  event.preventDefault();
  const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
  viewport.zoom(zoomFactor);
  grid.setZoomAndPan(zoom, panOffset);
  grid.drawGrid(ctx);
});
