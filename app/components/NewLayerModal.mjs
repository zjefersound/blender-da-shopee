import { RECT_TYPES } from "../constants.mjs";
import { Rect } from "../Rect.mjs";
export class NewLayerModal {
  constructor() {
    this.modalElement = null;
    this.state = {
      name: "",
      type: "point", // Default type
      coordinates: [], // Stores [x, y, z] arrays
    };
    this.inputs = {};
    this.initializeModal();
  }

  initializeModal() {
    this.modalElement = document.createElement("div");
    this.modalElement.id = "new-layer-modal";
    this.modalElement.className = "modal";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    const modalTitle = document.createElement("h4");
    modalTitle.innerText = "Adicionar Novo Objeto";

    const form = document.createElement("form");
    form.id = "new-layer-form";

    // Name Field
    const nameInput = this.createInputField("name", "Nome", "text", "");
    form.appendChild(nameInput);

    // Object Type Selector
    const typeSelect = this.createSelectField("type", "Tipo", [
      { value: "point", label: "Ponto" },
      { value: "line", label: "Linha" },
      { value: "polyline", label: "Polilinha" },
      { value: "polygon", label: "Polígono" },
    ]);
    typeSelect.addEventListener("change", () => this.updateCoordinateFields());
    form.appendChild(typeSelect);

    // Coordinates Section
    const coordinatesContainer = document.createElement("div");
    coordinatesContainer.id = "coordinates-container";
    form.appendChild(coordinatesContainer);

    // Modal Footer
    const modalFooter = document.createElement("div");
    modalFooter.className = "modal-footer";

    const saveButton = document.createElement("button");
    saveButton.id = "save-new-layer";
    saveButton.className = "modal-save btn";
    saveButton.innerText = "Salvar";

    const cancelButton = document.createElement("button");
    cancelButton.id = "cancel-new-layer";
    cancelButton.className = "modal-close btn";
    cancelButton.innerText = "Cancelar";

    modalFooter.appendChild(saveButton);
    modalFooter.appendChild(cancelButton);

    modalContent.appendChild(modalTitle);
    modalContent.appendChild(form);
    modalContent.appendChild(modalFooter);
    this.modalElement.appendChild(modalContent);

    document.body.appendChild(this.modalElement);

    this.modalElement.style.display = "none";
    saveButton.addEventListener("click", () => this.handleSave());
    cancelButton.addEventListener("click", () => this.close());

    this.updateCoordinateFields();
  }

  createInputField(stateKey, label, type = "text", defaultValue = "") {
    const container = document.createElement("div");
    container.className = "form-control";
    const labelElement = document.createElement("label");
    labelElement.innerText = label;

    const inputElement = document.createElement("input");
    inputElement.type = type;
    inputElement.value = defaultValue;

    this.inputs[stateKey] = inputElement;

    inputElement.addEventListener("input", (e) => {
      this.state[stateKey] =
        type === "number" ? parseFloat(e.target.value) : e.target.value;
    });

    container.appendChild(labelElement);
    container.appendChild(inputElement);

    return container;
  }

  createSelectField(stateKey, label, options) {
    const container = document.createElement("div");
    container.className = "form-control";
    const labelElement = document.createElement("label");
    labelElement.innerText = label;

    const selectElement = document.createElement("select");
    this.inputs[stateKey] = selectElement;

    options.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option.value;
      optionElement.innerText = option.label;
      selectElement.appendChild(optionElement);
    });

    selectElement.addEventListener("change", (e) => {
      this.state[stateKey] = e.target.value;
    });

    container.appendChild(labelElement);
    container.appendChild(selectElement);

    return container;
  }

  updateCoordinateFields() {
    const container = document.getElementById("coordinates-container");
    container.innerHTML = ""; // Clear existing fields

    const type = this.state.type;
    let pointsNeeded = 1;

    if (type === "line") pointsNeeded = 2;
    else if (type === "polyline" || type === "polygon") pointsNeeded = 3;

    for (let i = 0; i < pointsNeeded; i++) {
      const xInput = this.createInputField(`x${i}`, `Ponto ${i + 1} - X`, "number", 0);
      const yInput = this.createInputField(`y${i}`, `Ponto ${i + 1} - Y`, "number", 0);
      const zInput = this.createInputField(`z${i}`, `Ponto ${i + 1} - Z`, "number", 0);
      container.appendChild(xInput);
      container.appendChild(yInput);
      container.appendChild(zInput);
    }
  }

  resetForm() {
    this.state = {
      name: "",
      type: "point",
      coordinates: [],
    };
    if (this.inputs.name) this.inputs.name.value = this.state.name;
    if (this.inputs.type) this.inputs.type.value = this.state.type;
    this.updateCoordinateFields();
  }

  open() {
    this.resetForm();
    this.modalElement.style.display = "flex";
  }

  close() {
    this.modalElement.style.display = "none";
  }

  handleSave() {
    const { name, type } = this.state;

    const coordinates = [];
    for (let key in this.inputs) {
      if (key.startsWith("x") || key.startsWith("y") || key.startsWith("z")) {
        const idx = key.slice(1); // Extract index
        coordinates[idx] = coordinates[idx] || [];
        coordinates[idx].push(parseFloat(this.inputs[key].value));
      }
    }

    if (type === "polygon") {
      coordinates.push([...coordinates[0]]); // Close polygon
    }

    const rect = new Rect(RECT_TYPES[type], name, coordinates);
    if (this.onSave) this.onSave(rect);
    this.close();
  }

  setOnSaveCallback(callback) {
    this.onSave = callback;
  }
}
