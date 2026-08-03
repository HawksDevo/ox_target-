import { fetchNui } from "./fetchNui.js?v=2.7.4";

const optionsWrapper = document.getElementById("options-wrapper");

function onClick() {
  this.style.pointerEvents = "none";
  fetchNui("select", [this.targetType, this.targetId, this.zoneId]);
  setTimeout(() => (this.style.pointerEvents = "auto"), 100);
}

function setIconClasses(element, icon) {
  const classes = typeof icon === "string" ? icon.split(/\s+/) : [];
  const safeClasses = classes.filter((name) => /^(fa|fas|far|fab|fa-solid|fa-regular|fa-brands|fa-[a-z0-9-]+)$/.test(name));
  element.className = "fa-fw option-icon";
  element.classList.add(...(safeClasses.length ? safeClasses : ["fa-solid", "fa-circle"]));
}

export function createOptions(type, data, id, zoneId) {
  if (data.hide) return;

  const option = document.createElement("div");
  const icon = document.createElement("i");
  const label = document.createElement("p");
  const index = document.createElement("span");

  setIconClasses(icon, data.icon);
  if (data.iconColor) icon.style.color = data.iconColor;

  label.className = "option-label";
  label.textContent = String(data.label ?? "");
  index.className = "option-index";
  index.textContent = id;

  option.className = "option-container";
  option.targetType = type;
  option.targetId = id;
  option.zoneId = zoneId;
  option.append(icon, label, index);
  option.addEventListener("click", onClick);
  optionsWrapper.appendChild(option);
}
