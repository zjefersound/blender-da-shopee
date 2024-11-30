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
      rotationAxis: "z",
      rotationAroundOrigin: false,
      rotationAroundPoint: false,
      rotationAroundCenter: false,
      rotatePointX: 0,
      rotatePointY: 0,
      translateX: 0,
      translateY: 0,
      translateZ: 0,
      scaleAroundOrigin: false,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
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
    const translateZInput = this.createInputField(
      "translateZ",
      "Translação Z",
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

    // Rotation Axis Radio Group
    const rotationAxisGroup = document.createElement("fieldset");
    rotationAxisGroup.className = "rotation-axis-group";

    const legend = document.createElement("legend");
    legend.textContent = "Select Rotation Axis";
    rotationAxisGroup.appendChild(legend);

    ["x", "y", "z"].forEach((axis) => {
      const label = document.createElement("label");
      label.textContent = axis.toUpperCase();

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "rotationAxis";
      radio.value = axis;
      radio.checked = this.state.rotationAxis === axis;
      radio.addEventListener("change", (e) => {
        this.state.rotationAxis = e.target.value;
        console.log(this.state.rotationAxis);
      });

      label.appendChild(radio);
      rotationAxisGroup.appendChild(label);
    });

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
    const scaleZInput = this.createInputField(
      "scaleZ",
      "Escala Z",
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

    const shXInput = this.createInputField("shX", "sh x: ", "number", 0);

    const shYInput = this.createInputField("shY", "sh y: ", "number", 0);

    // Add fields to form
    editForm.appendChild(translateXInput);
    editForm.appendChild(translateYInput);
    editForm.appendChild(translateZInput);
    editForm.appendChild(rotationInput);
    editForm.appendChild(rotationAxisGroup);
    editForm.appendChild(rotationOriginInput);
    editForm.appendChild(rotationCenterInput);
    rotationFormGroup.appendChild(rotationPointInput);
    rotationFormGroup.appendChild(rotateXInput);
    rotationFormGroup.appendChild(rotateYInput);
    editForm.appendChild(rotationFormGroup);
    editForm.appendChild(scaleXInput);
    editForm.appendChild(scaleYInput);
    editForm.appendChild(scaleZInput);
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
      rotationAxis: "z",
      rotationAroundOrigin: false,
      rotationAroundPoint: false,
      rotationAroundCenter: false,
      rotatePointX: 0,
      rotatePointY: 0,
      translateX: 0,
      translateY: 0,
      translateZ: 0,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
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
    if (this.inputs.translateZ)
      this.inputs.translateZ.value = this.state.translateZ;
    if (this.inputs.rotationDegrees)
      this.inputs.rotationDegrees.value = this.state.rotationDegrees;
    const radioButtons = document.querySelectorAll(
      'input[name="rotationAxis"]'
    );
    radioButtons.forEach((radio) => {
      radio.checked = radio.value === "z";
    });
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
    if (this.inputs.scaleZ) this.inputs.scaleZ.value = this.state.scaleZ;
    if (this.inputs.scaleAroundOrigin)
      this.inputs.scaleAroundOrigin.checked = this.state.scaleAroundOrigin;
    if (this.inputs.reflectX)
      this.inputs.reflectX.checked = this.state.reflectX;
    if (this.inputs.reflectY)
      this.inputs.reflectY.checked = this.state.reflectY;
    if (this.inputs.shX) this.inputs.shX.value = this.state.shX;
    if (this.inputs.shY) this.inputs.shY.value = this.state.shY;
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
    if (
      this.state.translateX !== 0 ||
      this.state.translateY !== 0 ||
      this.state.translateZ !== 0
    ) {
      this.currentLayer.translate(
        this.state.translateX,
        this.state.translateY,
        this.state.translateZ
      );
    }

    // scaling
    if (
      this.state.scaleX !== 1 ||
      this.state.scaleY !== 1 ||
      this.state.scaleZ !== 1
    ) {
      if (this.state.scaleAroundOrigin) {
        const basePoint = Array.isArray(this.currentLayer.position[0])
          ? this.currentLayer.position[0]
          : this.currentLayer.position;
        this.currentLayer.scaleFrom(
          this.state.scaleX,
          this.state.scaleY,
          this.state.scaleZ,
          basePoint
        );
      } else {
        this.currentLayer.scale(
          this.state.scaleX,
          this.state.scaleY,
          this.state.scaleZ
        );
      }
    }
    // rotation
    if (this.state.rotationDegrees) {
      const degrees = this.state.rotationDegrees;
      const point = [this.state.rotatePointX, this.state.rotatePointY, 0]; // Assuming z=0 for 2D rotation, adjust as needed

      if (this.state.rotationAroundCenter) {
        this.currentLayer.rotateAroundAxis(
          degrees,
          this.state.rotationAxis,
          point
        );
      } else if (this.state.rotationAroundOrigin) {
        this.currentLayer.rotateAroundAxis(degrees, this.state.rotationAxis);
      } else if (this.state.rotationAroundPoint) {
        this.currentLayer.rotateAroundAxis(
          degrees,
          this.state.rotationAxis,
          point
        );
      } else {
        this.currentLayer.rotateAroundAxis(degrees, this.state.rotationAxis);
      }
    }

    // reflection
    if (this.state.reflectX || this.state.reflectY) {
      this.currentLayer.reflect(this.state.reflectX, this.state.reflectY);
    }

    // shear
    if (this.state.shX || this.state.shY) {
      this.currentLayer.shear(this.state.shX || 0, this.state.shY || 0);
    }

    this.close();
    if (this.onSave) this.onSave();
  }

  setOnSaveCallback(callback) {
    this.onSave = callback;
  }
}

export default Modal;
