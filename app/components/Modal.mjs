import { LAYER_NAMES } from "../constants.mjs";

export class Modal {
  constructor() {
    this.modalElement = null;
    this.initializeModal();
  }

  // Method to initialize and create the modal structure
  initializeModal() {
    // Create modal container
    this.modalElement = document.createElement("div");
    this.modalElement.id = "edit-modal";
    this.modalElement.className = "modal";

    // Create modal content
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    const modalTitle = document.createElement("h4");
    modalTitle.innerText = "Edit Layer";

    // Create form for editing layer
    const editForm = document.createElement("form");
    editForm.id = "edit-form";

    // Name field
    const nameLabel = document.createElement("label");
    nameLabel.setAttribute("for", "edit-name");
    nameLabel.innerText = "Name:";
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "edit-name";

    // Type field (Select dropdown for RECT_TYPES)
    const typeLabel = document.createElement("label");
    typeLabel.setAttribute("for", "edit-type");
    typeLabel.innerText = "Type:";
    const typeSelect = document.createElement("select");
    typeSelect.id = "edit-type";

    for (const [type, name] of Object.entries(LAYER_NAMES)) {
      const option = document.createElement("option");
      option.value = type;
      option.innerText = name;
      typeSelect.appendChild(option);
    }

    // Append fields to form
    editForm.appendChild(nameLabel);
    editForm.appendChild(nameInput);
    editForm.appendChild(typeLabel);
    editForm.appendChild(typeSelect);

    const modalFooter = document.createElement("div");
    modalFooter.className = "modal-footer";

    const saveButton = document.createElement("button");
    saveButton.id = "save-edit";
    saveButton.className = "modal-close btn";
    saveButton.innerText = "Save";

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

    document.body.appendChild(this.modalElement); // Append modal to body

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
    this.currentLayer.setName('updated. TODO: add logic')

    this.close();
    if (this.onSave) this.onSave();
  }

  setOnSaveCallback(callback) {
    this.onSave = callback;
  }
}

export default Modal;
