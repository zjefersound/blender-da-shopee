export const RECT_TYPES = {
  dot: "dot",
  line: "line",
  polygon: "polygon",
}

export const ICONS = {
  cursor: "ph ph-cursor",
  dot: "ph-fill ph-dots-three-outline",
  trash: "ph ph-trash",
  line: "ph ph-line-segment",
  polygon: "ph ph-polygon",
}

export const VERTICAL_TOOLS = [
  { id: "cursor", icon: ICONS.cursor, label: "Cursor" },
  { id: "addDot", icon: ICONS.dot, label: "Adicionar ponto" },
  { id: "addLine", icon: ICONS.line, label: "Adicionar linha" },
  { id: "addPolygon", icon: ICONS.polygon, label: "Adicionar polígono" },
]

export const HELPER_TEXT = {
  addDot: "Adicionar ponto: clique na tela para criar o ponto",
  addLine: "Adicionar linha: Clique e arraste para criar uma linha",
  addPolygon: "Adicionar polígono: Adicione pontos clicando na tela e pressione Enter",
}