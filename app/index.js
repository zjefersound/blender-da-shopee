import {
  HELPER_TEXT,
  ICONS,
  RECT_TYPES,
  VERTICAL_TOOLS,
} from "./constants.mjs";
import { Rect } from "./Rect.mjs";

const appState = {
  currentTool: VERTICAL_TOOLS[0].id,
  isDrawing: false,
  cursorState: null,
  layers: [
    new Rect(RECT_TYPES.polygon, "Polígono 1", [
      [0, 0],
      [0, -50],
      [-50, -50],
      [-50, 0],
      [-25, 25],
    ]),
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
};

function removeLayer(id) {
  appState.layers = appState.layers.filter((l) => l.id !== id);
  renderApp();
}

function renderVerticalTools() {
  const verticalTools = document.getElementById("vertical-tools");
  verticalTools.innerHTML = "";
  for (const tool of VERTICAL_TOOLS) {
    const button = document.createElement("button");
    button.className = appState.currentTool === tool.id ? "active" : "";
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
  for (const layer of appState.layers) {
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
        appState.layers = appState.layers.map((l) => {
          if (l.id === layer.id) {
            layer.setName(event.currentTarget.value);
          }
          return l;
        });
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

function renderApp() {
  console.log(appState.layers);

  clearCanvas(ctx);
  renderLayersList();
  renderVerticalTools();
  for (const layer of appState.layers) {
    layer.draw(ctx);
  }
}

function setCurrentTool(tool) {
  appState.currentTool = tool;
  appState.cursorState = {};
  const canvasContainer = document.getElementById("canvas-container");
  const helperText = document.getElementById("helper-text");
  if (tool === "cursor") {
    helperText.innerText = "";
    appState.isDrawing = false;
    canvasContainer.style.cursor = "inherit";
  } else {
    helperText.innerText = HELPER_TEXT[tool];
    appState.isDrawing = true;
    canvasContainer.style.cursor = "crosshair";
  }
  renderVerticalTools();
}
function clearCanvas(context) {
  const W = context.canvas.width,
    H = context.canvas.height;
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, W, H);
  context.setTransform(1, 0, 0, -1, W / 2, H / 2);
}
const coordinatesDisplay = document.getElementById("coordinates");
const canvas = document.getElementById("blender-canvas");
var ctx = canvas.getContext("2d");
canvas.height = window.innerHeight - 64 - 23;
canvas.width = window.innerWidth - 280;
const W = ctx.canvas.width,
  H = ctx.canvas.height;
clearCanvas(ctx);

// ctx.setTransform(2, 0, 0, 2, W / 2, H / 2); // zooms in by 2 with origin at center
// ctx.setTransform(0.5, 0, 0, 0.5, W / 2, H / 2); // zooms out by 2 with origin at center

function getMousePos(evt) {
  const rect = canvas.getBoundingClientRect();
  const x = evt.clientX - rect.left - W / 2;
  const y = -(evt.clientY - rect.top - H / 2);
  return { x: x, y: y };
}
canvas.addEventListener("mousemove", (event) => {
  const { x, y } = getMousePos(event);
  coordinatesDisplay.textContent = `Coordenadas: (${x}, ${y})`;
});

canvas.addEventListener("click", (event) => {
  if (appState.currentTool === "addDot") {
    const { x, y } = getMousePos(event);
    const newName =
      "Ponto " + appState.layers.filter((l) => l.type === "dot").length;
    const rect = new Rect(RECT_TYPES.dot, newName, [x, y]);
    appState.layers.push(rect);
    renderApp();
  }

  if (appState.currentTool === "addPolygon") {
    const { x, y } = getMousePos(event);
    const polygonPosition = [x, y];
    if (!appState?.cursorState?.polygonPositions)
      appState.cursorState = {
        polygonPositions: [],
      };

    appState.cursorState.polygonPositions.push(polygonPosition);
  }

  if (appState.currentTool === "addLines") {
    const { x, y } = getMousePos(event);
    const linesPosition = [x, y];
    if (!appState?.cursorState?.linesPositions)
      appState.cursorState = {
        linesPositions: [],
      };

    appState.cursorState.linesPositions.push(linesPosition);
  }
});

function keyDownEvents(event) {
  if (event.key === "Enter") {
    if (appState.currentTool === "addPolygon") {
      if (appState?.cursorState?.polygonPositions?.length < 3) {
        alert("Adicione pelo menos 3 pontos para criar um polígono");
        return;
      }
      const newName =
        "Polígono " +
        appState.layers.filter((l) => l.type === "polygon").length;
      const rect = new Rect(
        RECT_TYPES.polygon,
        newName,
        appState.cursorState.polygonPositions
      );
      appState.layers.push(rect);
      appState.cursorState.polygonPositions = [];
      renderApp();
    }
    if (appState.currentTool === "addLines") {
      if (appState?.cursorState?.polygonPositions?.length < 3) {
        alert(
          "Adicione pelo menos 3 pontos para criar uma sequencia de linhas"
        );
        return;
      }
      const newName =
        "Polilinha " + appState.layers.filter((l) => l.type === "lines").length;
      const rect = new Rect(
        RECT_TYPES.lines,
        newName,
        appState.cursorState.linesPositions
      );
      appState.layers.push(rect);
      appState.cursorState.linesPositions = [];
      renderApp();
    }
  }
}

function startLine(event) {
  if (appState.currentTool === "addLine") {
    const { x, y } = getMousePos(event);

    appState.cursorState = { mousedownPosition: [x, y] };
  }
}

function endLine(event) {
  if (appState.currentTool === "addLine") {
    const { x, y } = getMousePos(event);

    const startPosition = appState.cursorState?.mousedownPosition;
    if (startPosition) {
      const endPosition = [x, y];
      const newName =
        "Linha " + appState.layers.filter((l) => l.type === "line").length;
      const rect = new Rect(RECT_TYPES.line, newName, [
        startPosition,
        endPosition,
      ]);
      appState.layers.push(rect);
      appState.cursorState = null;
      renderApp();
    }
  }
}

canvas.addEventListener("mousedown", startLine);
canvas.addEventListener("mouseup", endLine);
addEventListener("keydown", keyDownEvents);

addEventListener("resize", () => {
  canvas.height = window.innerHeight - 64 - 23;
  canvas.width = window.innerWidth - 280;

  clearCanvas(ctx);
  renderApp();
});
renderApp();
