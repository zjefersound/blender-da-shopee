import { LAYER_NAMES } from "../constants.mjs";

/**
 * I need to:
 * Add translation
 * Add rotation: around itself + around canvas origin (0,0)
 * Add scaling (vertical, horizontal)
 */
export class Modal {
  constructor() {
    this.modalElement = null;
    this.state = {
      rotationDegrees: 0,
      rotationAroundOrigin: false,
      translateX: 0,
      translateY: 0,
      scaleX: 1,
      scaleY: 1,
    };
    this.inputs = {};
    this.initializeModal();
  }

  initializeModal() {
    // Create modal container
    this.modalElement = document.createElement("div");
    this.modalElement.id = "edit-modal";
    this.modalElement.className = "modal";

    // Create modal content
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    const modalTitle = document.createElement("h4");
    modalTitle.innerText = "Editar Camada";

    // Create form for editing layer
    const editForm = document.createElement("form");
    editForm.id = "edit-form";

    // Translation Fields
    const translateXInput = this.createInputField("translateX", "Translação X", "number", 0);
    const translateYInput = this.createInputField("translateY", "Translação Y", "number", 0);

    // Rotation Fields
    const rotationInput = this.createInputField("rotationDegrees", "Rotação (graus)", "number", 0);
    const rotationOriginInput = this.createCheckboxField("rotationAroundOrigin", "Rotacionar ao redor da origem (0,0)");

    // Scaling Fields
    const scaleXInput = this.createInputField("scaleX", "Escala X", "number", 1);
    const scaleYInput = this.createInputField("scaleY", "Escala Y", "number", 1);

    // Add fields to form
    editForm.appendChild(translateXInput);
    editForm.appendChild(translateYInput);
    editForm.appendChild(rotationInput);
    editForm.appendChild(rotationOriginInput);
    editForm.appendChild(scaleXInput);
    editForm.appendChild(scaleYInput);

    const modalFooter = document.createElement("div");
    modalFooter.className = "modal-footer";

    const saveButton = document.createElement("button");
    saveButton.id = "save-edit";
    saveButton.className = "modal-save btn";
    saveButton.innerText = "Salvar";

    const cancelButton = document.createElement("button");
    cancelButton.id = "cancel-edit";
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
    container.className = 'form-control';
    const labelElement = document.createElement("label");
    labelElement.innerText = label;

    const inputElement = document.createElement("input");
    inputElement.type = type;
    inputElement.value = defaultValue;

    this.inputs[stateKey] = inputElement;

    inputElement.addEventListener("input", (e) => {
      this.state[stateKey] = type === "number" ? parseFloat(e.target.value) : e.target.value;
    });

    container.appendChild(labelElement);
    container.appendChild(inputElement);

    return container;
  }

  createCheckboxField(stateKey, label) {
    const container = document.createElement("div");
    container.className = 'form-checkbox';
    const labelElement = document.createElement("label");
    labelElement.innerText = label;

    const checkboxElement = document.createElement("input");
    checkboxElement.type = "checkbox";
    checkboxElement.checked = this.state[stateKey];

    // Save reference to checkbox element
    this.inputs[stateKey] = checkboxElement;

    checkboxElement.addEventListener("change", (e) => {
      this.state[stateKey] = e.target.checked;
    });

    container.appendChild(checkboxElement);
    container.appendChild(labelElement);

    return container;
  }

  resetForm() {
    this.state = {
      rotationDegrees: 0,
      rotationAroundOrigin: false,
      translateX: 0,
      translateY: 0,
      scaleX: 1,
      scaleY: 1,
    };

    // Update input fields with default values
    if (this.inputs.translateX) this.inputs.translateX.value = this.state.translateX;
    if (this.inputs.translateY) this.inputs.translateY.value = this.state.translateY;
    if (this.inputs.rotationDegrees) this.inputs.rotationDegrees.value = this.state.rotationDegrees;
    if (this.inputs.rotationAroundOrigin) this.inputs.rotationAroundOrigin.checked = this.state.rotationAroundOrigin;
    if (this.inputs.scaleX) this.inputs.scaleX.value = this.state.scaleX;
    if (this.inputs.scaleY) this.inputs.scaleY.value = this.state.scaleY;
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
    if (!this.currentLayer) return;

    // translation
    if (this.state.translateX !== 0 || this.state.translateY !== 0) {
      this.currentLayer.translate(this.state.translateX, this.state.translateY);
    }

    // scaling
    if (this.state.scaleX !== 1 || this.state.scaleY !== 1) {
      this.currentLayer.scale(this.state.scaleX, this.state.scaleY);
    }

    // rotation
    if (this.state.rotationDegrees) {
      if (this.state.rotationAroundOrigin) {
        this.currentLayer.rotateOrigin(this.state.rotationDegrees);
      } else {
        this.currentLayer.rotate(this.state.rotationDegrees);
      }
    }

    this.close();
    if (this.onSave) this.onSave();
  }

  setOnSaveCallback(callback) {
    this.onSave = callback;
  }
}

export default Modal;
