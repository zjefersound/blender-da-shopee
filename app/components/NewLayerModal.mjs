import { RECT_TYPES } from "../constants.mjs";
import { Rect } from "../Rect.mjs";

export class NewLayerModal {
  constructor() {
    this.modalElement = null;
    this.state = {
      name: "",
    };
    this.inputs = {};
    this.initializeModal();
  }

  initializeModal() {
    // Create modal container
    this.modalElement = document.createElement("div");
    this.modalElement.id = "new-layer-modal";
    this.modalElement.className = "modal";

    // Create modal content
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    const modalTitle = document.createElement("h4");
    modalTitle.innerText = "Editar Camada";

    // Create form for editing layer
    const editForm = document.createElement("form");
    editForm.id = "new-layer-form";

    // Name Field
    const nameInput = this.createInputField("name", "Nome", "text", "");

    // Add field to form
    editForm.appendChild(nameInput);

    const modalFooter = document.createElement("div");
    modalFooter.className = "modal-footer";

    const saveButton = document.createElement("button");
    saveButton.id = "save-new-layer";
    saveButton.className = "modal-save btn";
    saveButton.innerText = "Salvar";

    const cancelButton = document.createElement("button");
    cancelButton.id = "cancel-new-layer";
    cancelButton.className = "modal-close btn";
    cancelButton.innerText = "Cancel";

    modalFooter.appendChild(saveButton);
    modalFooter.appendChild(cancelButton);

    modalContent.appendChild(modalTitle);
    modalContent.appendChild(editForm);
    modalContent.appendChild(modalFooter);
    this.modalElement.appendChild(modalContent);

    document.body.appendChild(this.modalElement);

    this.modalElement.style.display = "none";
    saveButton.addEventListener("click", () => this.handleSave());
    cancelButton.addEventListener("click", () => this.close());
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

  resetForm() {
    this.state = {
      name: "",
    };

    if (this.inputs.name) this.inputs.name.value = this.state.name;
  }

  open(layer) {
    this.resetForm();
    this.modalElement.style.display = "flex";
    this.currentLayer = layer;
  }

  close() {
    this.modalElement.style.display = "none";
  }

  handleSave() {
    this.close();
    const rectMock = new Rect(RECT_TYPES.polygon, this.state.name, [
      [0, 0, 0],
      [0, -50, 0],
      [-50, -50, 0],
      [-50, 0, 0],
      [-25, 25, 0],
    ]);
    if (this.onSave) this.onSave(rectMock);
  }

  setOnSaveCallback(callback) {
    this.onSave = callback;
  }
}
