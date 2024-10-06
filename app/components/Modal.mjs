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
      rotationDegrees: 60,
      rotationAroundOrigin: false,
      translateX: 0,
      translateY: 0,
      scaleX: 0,
      scaleY: 0,
    };
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
    modalTitle.innerText = "Editar camada";

    // Create form for editing layer
    const editForm = document.createElement("form");
    editForm.id = "edit-form";


    const modalFooter = document.createElement("div");
    modalFooter.className = "modal-footer";

    const saveButton = document.createElement("button");
    saveButton.id = "save-edit";
    saveButton.className = "modal-close btn";
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

  open(layer) {
    this.modalElement.style.display = "flex";
    this.currentLayer = layer;
  }

  close() {
    this.modalElement.style.display = "none";
  }

  handleSave() {
    if (!this.currentLayer) return;

    // translation
    if (this.state.scaleX !== 0 || this.state.scaleY !== 0)
      this.currentLayer.scale(this.state.scaleX, this.state.scaleY);
    if (this.state.translateX !== 0 || this.state.translateY !== 0)
      this.currentLayer.translate(this.state.translateX, this.state.translateY);
    if (this.state.rotationDegrees) {
      if (this.state.rotationAroundOrigin) this.currentLayer.rotateOrigin(this.state.rotationDegrees);
      else this.currentLayer.rotate(this.state.rotationDegrees);
    }

    this.currentLayer.setName('updated. TODO: add logic')

    this.close();
    if (this.onSave) this.onSave();
  }

  setOnSaveCallback(callback) {
    this.onSave = callback;
  }
}

export default Modal;
