import { RECT_TYPES } from "../constants.mjs";
import { Rect } from "../Rect.mjs";

/**
 * I need to:
 * Add translation
 * Add rotation: around itself + around canvas origin (0,0)
 * Add scaling (vertical, horizontal)
 */
export class NewLayerModal {
  constructor() {
    this.modalElement = null;
    this.state = {
      rotationDegrees: 0,
      rotationAroundOrigin: false,
      rotationAroundPoint: false,
      rotationAroundCenter: false,
      rotatePointX: 0,
      rotatePointY: 0,
      translateX: 0,
      translateY: 0,
      scaleAroundOrigin: false,
      scaleX: 1,
      scaleY: 1,
      reflectX: false,
      reflectY: false,
      shX: 0,
      shY: 0,
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
    const translateXInput = this.createInputField(
      "translateX",
      "Translação X",
      "number",
      0
    );
    const translateYInput = this.createInputField(
      "translateY",
      "Translação Y",
      "number",
      0
    );

    // Rotation Fields
    const rotationInput = this.createInputField(
      "rotationDegrees",
      "Rotação (graus)",
      "number",
      0
    );
    const rotationOriginInput = this.createCheckboxField(
      "rotationAroundOrigin",
      "Rotacionar ao redor da origem (0,0)"
    );

    const rotationCenterInput = this.createCheckboxField(
      "rotationAroundCenter",
      "Rotacionar ao redor do centro do objeto"
    );

    // Rotation around any point
    const rotationFormGroup = document.createElement("div");
    rotationFormGroup.className = "rotation-form-group";
    const rotationPointInput = this.createCheckboxField(
      "rotationAroundPoint",
      "Rotacionar ao redor de um ponto qualquer:"
    );
    const rotateXInput = this.createInputField(
      "rotatePointX",
      "x: ",
      "number",
      0
    );
    const rotateYInput = this.createInputField(
      "rotatePointY",
      "y: ",
      "number",
      0
    );

    // Scaling Fields
    const scaleXInput = this.createInputField(
      "scaleX",
      "Escala X",
      "number",
      1
    );
    const scaleYInput = this.createInputField(
      "scaleY",
      "Escala Y",
      "number",
      1
    );

    const scaleOriginInput = this.createCheckboxField(
      "scaleAroundOrigin",
      "Em relação a origem"
    );

    const reflectXInput = this.createCheckboxField(
      "reflectX",
      "Refletir em torno do eixo X"
    );

    const reflectYInput = this.createCheckboxField(
      "reflectY",
      "Refletir em torno do eixo Y"
    );

    const shXInput = this.createInputField(
      "shX",
      "sh x: ",
      "number",
      0
    );

    const shYInput = this.createInputField(
      "shY",
      "sh y: ",
      "number",
      0
    );

    // Add fields to form
    editForm.appendChild(translateXInput);
    editForm.appendChild(translateYInput);
    editForm.appendChild(rotationInput);
    editForm.appendChild(rotationOriginInput);
    editForm.appendChild(rotationCenterInput);
    rotationFormGroup.appendChild(rotationPointInput);
    rotationFormGroup.appendChild(rotateXInput);
    rotationFormGroup.appendChild(rotateYInput);
    editForm.appendChild(rotationFormGroup);
    editForm.appendChild(scaleXInput);
    editForm.appendChild(scaleYInput);
    editForm.appendChild(scaleOriginInput);
    editForm.appendChild(reflectXInput);
    editForm.appendChild(reflectYInput);
    editForm.appendChild(shXInput);
    editForm.appendChild(shYInput);

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

  createCheckboxField(stateKey, label) {
    const container = document.createElement("div");
    container.className = "form-checkbox";
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
      rotationAroundPoint: false,
      rotationAroundCenter: false,
      rotatePointX: 0,
      rotatePointY: 0,
      translateX: 0,
      translateY: 0,
      scaleX: 1,
      scaleY: 1,
      scaleAroundOrigin: false,
      reflectX: false,
      reflectY: false,
      shX: 0,
      shY: 0,
    };

    // Update input fields with default values
    if (this.inputs.translateX)
      this.inputs.translateX.value = this.state.translateX;
    if (this.inputs.translateY)
      this.inputs.translateY.value = this.state.translateY;
    if (this.inputs.rotationDegrees)
      this.inputs.rotationDegrees.value = this.state.rotationDegrees;
    if (this.inputs.rotationAroundOrigin)
      this.inputs.rotationAroundOrigin.checked =
        this.state.rotationAroundOrigin;
    if (this.inputs.rotationAroundCenter)
      this.inputs.rotationAroundCenter.checked =
        this.state.rotationAroundCenter;
    if (this.inputs.rotationAroundPoint)
      this.inputs.rotationAroundPoint.checked = this.state.rotationAroundPoint;
    if (this.inputs.rotatePointX)
      this.inputs.rotatePointX.value = this.state.rotatePointX;
    if (this.inputs.rotatePointY)
      this.inputs.rotatePointY.value = this.state.rotatePointY;
    if (this.inputs.scaleX) this.inputs.scaleX.value = this.state.scaleX;
    if (this.inputs.scaleY) this.inputs.scaleY.value = this.state.scaleY;
    if (this.inputs.scaleAroundOrigin)
      this.inputs.scaleAroundOrigin.checked = this.state.scaleAroundOrigin;
    if (this.inputs.reflectX)
      this.inputs.reflectX.checked = this.state.reflectX;
    if (this.inputs.reflectY)
      this.inputs.reflectY.checked = this.state.reflectY;
    if (this.inputs.shX)
      this.inputs.shX.value = this.state.shX;
    if (this.inputs.shY)
      this.inputs.shY.value = this.state.shY;
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
    const rectMock = new Rect(RECT_TYPES.polygon, "Polígono 1", [
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