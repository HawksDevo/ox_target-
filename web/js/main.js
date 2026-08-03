import { createOptions } from "./createOptions.js?v=2.7.4";
import { fetchNui } from "./fetchNui.js?v=2.7.4";
import { ALLOWED_LANGUAGES, translate, translateInterface } from "./i18n.js?v=2.7.4";

const DEFAULT_CUSTOM_LAYOUTS = Object.freeze({
  "1": [{ x: 0, y: -70 }],
  "2": [{ x: -82, y: 0 }, { x: 82, y: 0 }],
  "3": [{ x: -82, y: 52 }, { x: 0, y: -74 }, { x: 82, y: 52 }],
  "4": [{ x: 0, y: -82 }, { x: 0, y: 82 }, { x: -102, y: 0 }, { x: 102, y: 0 }],
  "5": [{ x: 0, y: -96 }, { x: 91, y: -30 }, { x: 56, y: 78 }, { x: -56, y: 78 }, { x: -91, y: -30 }],
  "6": [{ x: 0, y: -102 }, { x: 88, y: -51 }, { x: 88, y: 51 }, { x: 0, y: 102 }, { x: -88, y: 51 }, { x: -88, y: -51 }],
});

const DEFAULT_CUSTOM_PREVIEW_LABELS = Object.freeze(["Meni", "Skladište", "Smjena", "Pregledaj", "Razgovaraj", "Posebna radnja"]);
const PREVIEW_SETS = Object.freeze({
  interactions: [
    { icon: "fa-solid fa-user", label: "Interakcija" },
    { icon: "fa-solid fa-door-open", label: "Otvori vrata" },
    { icon: "fa-solid fa-magnifying-glass", label: "Pregledaj" },
    { icon: "fa-solid fa-box-archive", label: "Spremi predmet" },
    { icon: "fa-solid fa-comments", label: "Razgovaraj" },
    { icon: "fa-solid fa-star", label: "Posebna radnja" },
  ],
  work: [
    { icon: "fa-solid fa-star", label: "Završi smjenu" },
    { icon: "fa-solid fa-box-archive", label: "Otvori skladište posla" },
    { icon: "fa-solid fa-building", label: "Otvori poslovni meni" },
    { icon: "fa-solid fa-clipboard-list", label: "Pregledaj zadatke" },
    { icon: "fa-solid fa-coins", label: "Preuzmi plaću" },
    { icon: "fa-solid fa-user-group", label: "Upravljanje radnicima" },
  ],
  vehicle: [
    { icon: "fa-solid fa-horse", label: "Pregledaj vozilo" },
    { icon: "fa-solid fa-box-open", label: "Otvori prtljažnik" },
    { icon: "fa-solid fa-key", label: "Zaključaj vozilo" },
    { icon: "fa-solid fa-screwdriver-wrench", label: "Popravi vozilo" },
    { icon: "fa-solid fa-broom", label: "Očisti vozilo" },
    { icon: "fa-solid fa-user-plus", label: "Smjesti osobu" },
  ],
  storage: [
    { icon: "fa-solid fa-box-archive", label: "Otvori skladište" },
    { icon: "fa-solid fa-box", label: "Spremi predmet" },
    { icon: "fa-solid fa-hand", label: "Uzmi predmet" },
    { icon: "fa-solid fa-list", label: "Pregledaj sadržaj" },
    { icon: "fa-solid fa-lock", label: "Zaključaj sanduk" },
    { icon: "fa-solid fa-share", label: "Podijeli pristup" },
  ],
});

const DEFAULTS = Object.freeze({
  settingsVersion: 2,
  language: "en",
  iconMode: "preset",
  icon: "fa-eye",
  customIcon: "fa-solid fa-hat-cowboy",
  imageUrl: "",
  imageSize: 24,
  imageRound: false,
  tabShape: "rounded",
  layout: "glass",
  arrangement: "list",
  radialRadius: 95,
  previewCount: 3,
  previewSet: "interactions",
  previewLabels: DEFAULT_CUSTOM_PREVIEW_LABELS,
  customLayouts: DEFAULT_CUSTOM_LAYOUTS,
  accentColor: "#d7b24a",
  secondaryColor: "#5cc8ff",
  textColor: "#f8f7f3",
  backgroundColor: "#121418",
  position: "right",
  borderWidth: 1,
  radius: 10,
  menuWidth: 220,
  scale: 100,
  rowHeight: 42,
  opacity: 88,
  glow: true,
  animations: true,
  animationStyle: "pulse",
  animationSpeed: 100,
  dualColor: false,
  colorAnimation: "smooth",
  showNumbers: false,
});

const ALLOWED_ICONS = new Set(["fa-eye", "fa-crosshairs", "fa-bullseye", "fa-hand-pointer", "fa-location-crosshairs", "fa-compass", "fa-hat-cowboy", "fa-star", "fa-skull"]);
const ALLOWED_ICON_MODES = new Set(["preset", "custom", "image"]);
const ALLOWED_TAB_SHAPES = new Set(["rounded", "pill", "compact", "sharp", "split", "floating", "ticket", "angled", "double", "soft", "stripe", "badge"]);
const ALLOWED_LAYOUTS = new Set(["glass", "solid", "minimal", "neon", "outline", "western", "frost", "carbon", "gold", "crimson", "ghost", "terminal"]);
const ALLOWED_ARRANGEMENTS = new Set(["list", "cross", "circle", "arc", "fan", "zigzag", "custom"]);
const ALLOWED_PREVIEW_SETS = new Set(["interactions", "work", "vehicle", "storage", "custom"]);
const ALLOWED_POSITIONS = new Set(["right", "left", "below"]);
const ALLOWED_ANIMATIONS = new Set(["pulse", "breathe", "spin", "bounce", "wiggle", "flip", "orbit", "none"]);
const ALLOWED_COLOR_ANIMATIONS = new Set(["smooth", "snap", "flow", "wave", "glow", "border"]);

const targetHud = document.getElementById("target-hud");
const optionsWrapper = document.getElementById("options-wrapper");
const eyeContainer = document.getElementById("eye");
const eye = document.getElementById("eyeSvg");
const eyeImage = document.getElementById("eyeImage");
const overlay = document.getElementById("appearance-overlay");
const form = document.getElementById("appearance-form");
const previewStage = document.getElementById("preview-stage");
const previewOptions = document.getElementById("preview-options");
const previewEye = document.getElementById("preview-eye");
const previewImage = document.getElementById("preview-image");
const previewSetSelect = document.getElementById("preview-set-select");
const customPreviewLabelsInput = document.getElementById("custom-preview-labels");
const languageSelect = document.getElementById("language-select");
const shareCodeInput = document.getElementById("settings-share-code");
const saveServerSettingsButton = document.getElementById("save-server-settings");
const toast = document.getElementById("toast");

let currentSettings = { ...DEFAULTS };
let savedSettings = { ...DEFAULTS };
let toastTimer;
const failedImageUrls = new Set();
let dragState = null;
let appearanceAdmin = false;
const t = (key, replacements = {}) => translate(key, currentSettings.language, replacements);
const SHARE_CODE_PREFIX = "OX1:";

function syncNuiVisibility() {
  const isVisible = targetHud.classList.contains("is-visible") || overlay.classList.contains("is-open");
  document.body.classList.toggle("is-nui-visible", isVisible);
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value)));
const validHex = (value, fallback) => /^#[0-9a-f]{6}$/i.test(value || "") ? value.toLowerCase() : fallback;
const cleanText = (value, maxLength) => String(value ?? "").replace(/[\u0000-\u001f\u007f]/g, "").slice(0, maxLength);

function validImageUrl(value) {
  try {
    const parsed = new URL(String(value || "").trim());
    return parsed.protocol === "https:" ? parsed.toString() : "";
  } catch {
    return "";
  }
}

function normalizeIconClass(value) {
  const styleClasses = new Set(["fa-solid", "fa-regular", "fa-brands", "fas", "far", "fab"]);
  const tokens = cleanText(value, 80)
    .toLowerCase()
    .split(/\s+/)
    .filter((token) => /^(fa-solid|fa-regular|fa-brands|fas|far|fab|fa-[a-z0-9-]+)$/.test(token))
    .slice(0, 3);
  const hasGlyph = tokens.some((token) => token.startsWith("fa-") && !styleClasses.has(token));

  if (!hasGlyph) return DEFAULTS.customIcon;
  if (!tokens.some((token) => styleClasses.has(token))) tokens.unshift("fa-solid");
  return tokens.join(" ");
}

const hexToRgb = (hex) => {
  const value = validHex(hex, "#121418").slice(1);
  return `${parseInt(value.slice(0, 2), 16)}, ${parseInt(value.slice(2, 4), 16)}, ${parseInt(value.slice(4, 6), 16)}`;
};

function sanitizePreviewLabels(value) {
  if (!Array.isArray(value)) return [...DEFAULT_CUSTOM_PREVIEW_LABELS];
  return value
    .slice(0, 6)
    .map((label) => cleanText(label, 32).trim())
    .filter(Boolean);
}

function sanitizeSettings(settings = {}) {
  return {
    settingsVersion: 2,
    language: ALLOWED_LANGUAGES.has(settings.language) ? settings.language : DEFAULTS.language,
    iconMode: ALLOWED_ICON_MODES.has(settings.iconMode) ? settings.iconMode : DEFAULTS.iconMode,
    icon: ALLOWED_ICONS.has(settings.icon) ? settings.icon : DEFAULTS.icon,
    customIcon: cleanText(settings.customIcon ?? DEFAULTS.customIcon, 80).replace(/[^a-zA-Z0-9\s-]/g, ""),
    imageUrl: cleanText(settings.imageUrl, 500),
    imageSize: clamp(settings.imageSize ?? DEFAULTS.imageSize, 14, 48),
    imageRound: settings.imageRound === true,
    tabShape: ALLOWED_TAB_SHAPES.has(settings.tabShape) ? settings.tabShape : DEFAULTS.tabShape,
    layout: ALLOWED_LAYOUTS.has(settings.layout) ? settings.layout : DEFAULTS.layout,
    arrangement: ALLOWED_ARRANGEMENTS.has(settings.arrangement) ? settings.arrangement : DEFAULTS.arrangement,
    radialRadius: clamp(settings.radialRadius ?? DEFAULTS.radialRadius, 45, 200),
    previewCount: clamp(settings.previewCount ?? DEFAULTS.previewCount, 1, 6),
    previewSet: ALLOWED_PREVIEW_SETS.has(settings.previewSet) ? settings.previewSet : DEFAULTS.previewSet,
    previewLabels: sanitizePreviewLabels(settings.previewLabels),
    customLayouts: sanitizeCustomLayouts(settings.customLayouts),
    accentColor: validHex(settings.accentColor, DEFAULTS.accentColor),
    secondaryColor: validHex(settings.secondaryColor, DEFAULTS.secondaryColor),
    textColor: validHex(settings.textColor, DEFAULTS.textColor),
    backgroundColor: validHex(settings.backgroundColor, DEFAULTS.backgroundColor),
    position: ALLOWED_POSITIONS.has(settings.position) ? settings.position : DEFAULTS.position,
    borderWidth: clamp(settings.borderWidth ?? DEFAULTS.borderWidth, 0, 4),
    radius: clamp(settings.radius ?? DEFAULTS.radius, 0, 22),
    menuWidth: clamp(settings.menuWidth ?? DEFAULTS.menuWidth, 180, 340),
    scale: clamp(settings.scale ?? DEFAULTS.scale, 80, 125),
    rowHeight: clamp(settings.rowHeight ?? DEFAULTS.rowHeight, 34, 58),
    opacity: clamp(settings.opacity ?? DEFAULTS.opacity, 20, 100),
    glow: settings.glow !== false,
    animations: settings.animations !== false,
    animationStyle: ALLOWED_ANIMATIONS.has(settings.animationStyle) ? settings.animationStyle : DEFAULTS.animationStyle,
    animationSpeed: clamp(settings.animationSpeed ?? DEFAULTS.animationSpeed, 50, 200),
    dualColor: settings.dualColor === true,
    colorAnimation: ALLOWED_COLOR_ANIMATIONS.has(settings.colorAnimation) ? settings.colorAnimation : DEFAULTS.colorAnimation,
    showNumbers: settings.showNumbers === true,
  };
}

function sanitizeCustomLayouts(value) {
  const result = {};

  for (let count = 1; count <= 6; count += 1) {
    const key = String(count);
    const fallback = DEFAULT_CUSTOM_LAYOUTS[key];
    const source = value && Array.isArray(value[key]) ? value[key] : fallback;
    result[key] = Array.from({ length: count }, (_, index) => ({
      x: clamp(source[index]?.x ?? fallback[index].x, -260, 260),
      y: clamp(source[index]?.y ?? fallback[index].y, -240, 240),
    }));
  }

  return result;
}

function renderPreviewOptions() {
  const signature = JSON.stringify([currentSettings.previewCount, currentSettings.previewSet, currentSettings.previewLabels, currentSettings.language]);
  if (previewOptions.dataset.signature === signature) return;

  const baseSet = currentSettings.previewSet === "custom"
    ? PREVIEW_SETS.interactions.map((demo, index) => ({
      ...demo,
      label: currentSettings.previewLabels[index] || DEFAULT_CUSTOM_PREVIEW_LABELS[index],
    }))
    : PREVIEW_SETS[currentSettings.previewSet];

  previewOptions.replaceChildren();
  previewOptions.dataset.count = String(currentSettings.previewCount);
  previewOptions.dataset.signature = signature;

  baseSet.slice(0, currentSettings.previewCount).forEach((demo, index) => {
    const option = document.createElement("div");
    const icon = document.createElement("i");
    const label = document.createElement("p");
    const number = document.createElement("span");

    option.className = `option-container preview-row${index === 0 ? " active" : ""}`;
    option.dataset.previewIndex = String(index);
    icon.className = `${demo.icon} option-icon`;
    label.className = "option-label";
    label.textContent = currentSettings.previewSet === "custom" ? demo.label : t(demo.label);
    number.className = "option-index";
    number.textContent = String(index + 1);
    option.append(icon, label, number);
    previewOptions.appendChild(option);
  });
}

function getPreviewSpatialFactor() {
  return 0.72 * (currentSettings.scale / 100);
}

function circlePoint(angle, radius) {
  const radians = angle * Math.PI / 180;
  return { x: Math.cos(radians) * radius, y: Math.sin(radians) * radius };
}

function buildSpatialPositions(arrangement, count, baseRadius, rowHeight) {
  if (!count) return [];

  if (arrangement === "zigzag") {
    const spacing = Math.min(62, rowHeight + 16);
    return Array.from({ length: count }, (_, index) => ({
      x: (index % 2 === 0 ? -1 : 1) * baseRadius,
      y: (index - (count - 1) / 2) * spacing,
    }));
  }

  if (arrangement === "arc") {
    if (count === 1) return [{ x: 0, y: -baseRadius }];
    return Array.from({ length: count }, (_, index) => circlePoint(150 + (240 * index / (count - 1)), baseRadius + Math.max(0, count - 5) * 7));
  }

  if (arrangement === "fan") {
    if (count === 1) return [{ x: baseRadius, y: 0 }];
    return Array.from({ length: count }, (_, index) => circlePoint(-75 + (150 * index / (count - 1)), baseRadius + Math.max(0, count - 5) * 7));
  }

  if (arrangement === "cross") {
    const angles = [-90, 90, 180, 0, -45, 135, -135, 45];
    return Array.from({ length: count }, (_, index) => {
      const ring = Math.floor(index / angles.length);
      return circlePoint(angles[index % angles.length], baseRadius + ring * 82);
    });
  }

  const positions = [];
  let remaining = count;
  let offset = 0;
  let ring = 0;

  while (remaining > 0) {
    const ringCount = Math.min(8, remaining);
    const radius = baseRadius + Math.max(0, ringCount - 4) * 10 + ring * 82;
    for (let index = 0; index < ringCount; index += 1) {
      positions[offset + index] = circlePoint(-90 + (360 * index / ringCount), radius);
    }
    offset += ringCount;
    remaining -= ringCount;
    ring += 1;
  }

  return positions;
}

function layoutOptions(container, isPreview = false) {
  const children = Array.from(container.children);
  const spatial = currentSettings.arrangement !== "list";
  container.classList.toggle("spatial-layout", spatial);
  container.classList.toggle("custom-layout", currentSettings.arrangement === "custom");
  if (isPreview) previewStage.classList.toggle("is-spatial", spatial);

  children.forEach((option) => {
    option.style.removeProperty("--spatial-x");
    option.style.removeProperty("--spatial-y");
  });

  if (!spatial) return;

  const positions = currentSettings.arrangement === "custom" && children.length <= 6
    ? currentSettings.customLayouts[String(children.length)]
    : buildSpatialPositions(currentSettings.arrangement === "custom" ? "circle" : currentSettings.arrangement, children.length, currentSettings.radialRadius, currentSettings.rowHeight);
  const previewFactor = isPreview ? getPreviewSpatialFactor() : 1;
  children.forEach((option, index) => {
    const point = positions[index];
    option.style.setProperty("--spatial-x", `${(point.x * previewFactor).toFixed(1)}px`);
    option.style.setProperty("--spatial-y", `${(point.y * previewFactor).toFixed(1)}px`);
  });
}

function layoutAllOptions() {
  layoutOptions(optionsWrapper, false);
  layoutOptions(previewOptions, true);
}

function renderTargetGraphic(iconElement, imageElement, settings) {
  const fallbackClass = `fa-solid ${settings.icon} target-icon target-visual`;
  const iconClass = settings.iconMode === "custom" ? normalizeIconClass(settings.customIcon) : `fa-solid ${settings.icon}`;
  const candidateUrl = settings.iconMode === "image" ? validImageUrl(settings.imageUrl) : "";
  const imageUrl = candidateUrl && !failedImageUrls.has(candidateUrl) ? candidateUrl : "";

  iconElement.className = `${iconClass} target-icon target-visual`;

  if (imageUrl) {
    iconElement.hidden = true;
    imageElement.hidden = false;
    if (imageElement.src !== imageUrl) imageElement.src = imageUrl;
  } else {
    iconElement.hidden = false;
    imageElement.hidden = true;
    imageElement.removeAttribute("src");
    if (settings.iconMode === "image") iconElement.className = fallbackClass;
  }
}

function applySettings(settings, updateForm = false) {
  currentSettings = sanitizeSettings(settings);
  const root = document.documentElement;
  const opacity = currentSettings.opacity / 100;
  const speed = currentSettings.animationSpeed / 100;

  root.style.setProperty("--ox-accent", currentSettings.accentColor);
  root.style.setProperty("--ox-secondary", currentSettings.secondaryColor);
  root.style.setProperty("--ox-text", currentSettings.textColor);
  root.style.setProperty("--ox-bg-rgb", hexToRgb(currentSettings.backgroundColor));
  root.style.setProperty("--ox-opacity", opacity);
  root.style.setProperty("--ox-opacity-glass-a", (opacity * 0.86).toFixed(3));
  root.style.setProperty("--ox-opacity-glass-b", (opacity * 0.68).toFixed(3));
  root.style.setProperty("--ox-opacity-minimal", (opacity * 0.58).toFixed(3));
  root.style.setProperty("--ox-opacity-ghost", (opacity * 0.3).toFixed(3));
  root.style.setProperty("--ox-opacity-hover", Math.min(1, opacity + 0.08).toFixed(3));
  root.style.setProperty("--ox-border", `${currentSettings.borderWidth}px`);
  root.style.setProperty("--ox-radius", `${currentSettings.radius}px`);
  root.style.setProperty("--ox-minimal-radius", `${Math.max(2, Math.round(currentSettings.radius * 0.55))}px`);
  root.style.setProperty("--ox-width", `${currentSettings.menuWidth}px`);
  root.style.setProperty("--ox-scale", currentSettings.scale / 100);
  root.style.setProperty("--ox-row-height", `${currentSettings.rowHeight}px`);
  root.style.setProperty("--ox-compact-row-height", `${Math.max(28, currentSettings.rowHeight - 10)}px`);
  root.style.setProperty("--ox-image-size", `${currentSettings.imageSize}px`);
  root.style.setProperty("--ox-image-radius", currentSettings.imageRound ? "50%" : `${Math.max(2, Math.round(currentSettings.imageSize * 0.16))}px`);
  const radialWidth = Math.min(currentSettings.menuWidth, currentSettings.arrangement === "zigzag" ? 190 : 175);
  const previewSpatialFactor = getPreviewSpatialFactor();
  root.style.setProperty("--ox-radial-width", `${radialWidth}px`);
  root.style.setProperty("--ox-preview-scale", previewSpatialFactor.toFixed(3));
  root.style.setProperty("--ox-preview-radial-width", `${Math.round(radialWidth * previewSpatialFactor)}px`);
  root.style.setProperty("--ox-preview-row-height", `${Math.max(25, Math.round(currentSettings.rowHeight * previewSpatialFactor))}px`);
  root.style.setProperty("--ox-animation-duration", `${(1.7 / speed).toFixed(2)}s`);
  root.style.setProperty("--ox-color-duration", `${(2.4 / speed).toFixed(2)}s`);

  document.body.dataset.layout = currentSettings.layout;
  document.body.dataset.tabShape = currentSettings.tabShape;
  document.body.dataset.position = currentSettings.position;
  document.body.dataset.arrangement = currentSettings.arrangement;
  document.body.dataset.animationStyle = currentSettings.animationStyle;
  document.body.dataset.colorAnimation = currentSettings.colorAnimation;
  document.body.classList.toggle("has-glow", currentSettings.glow);
  document.body.classList.toggle("has-animations", currentSettings.animations);
  document.body.classList.toggle("has-dual-color", currentSettings.dualColor);
  document.body.classList.toggle("show-numbers", currentSettings.showNumbers);
  languageSelect.value = currentSettings.language;
  translateInterface(document.querySelector(".settings-shell"), currentSettings.language);
  if (!toast.classList.contains("show")) toast.querySelector("span").textContent = t("Postavke spremljene");

  renderTargetGraphic(eye, eyeImage, currentSettings);
  renderTargetGraphic(previewEye, previewImage, currentSettings);
  renderPreviewOptions();
  previewStage.dataset.layout = currentSettings.layout;
  previewStage.dataset.position = currentSettings.position;
  previewStage.dataset.arrangement = currentSettings.arrangement;
  previewStage.dataset.glow = String(currentSettings.glow);
  previewStage.dataset.animations = String(currentSettings.animations);
  previewStage.dataset.animationStyle = currentSettings.animationStyle;
  previewStage.dataset.numbers = String(currentSettings.showNumbers);
  previewSetSelect.value = currentSettings.previewSet;
  customPreviewLabelsInput.classList.toggle("is-visible", currentSettings.previewSet === "custom");
  layoutAllOptions();

  if (updateForm) syncForm();
}

function syncForm() {
  languageSelect.value = currentSettings.language;
  form.elements.customIcon.value = currentSettings.customIcon;
  form.elements.imageUrl.value = currentSettings.imageUrl;
  form.elements.imageSize.value = currentSettings.imageSize;
  form.elements.imageRound.checked = currentSettings.imageRound;
  previewSetSelect.value = currentSettings.previewSet;
  customPreviewLabelsInput.value = currentSettings.previewLabels.join(", ");
  customPreviewLabelsInput.classList.toggle("is-visible", currentSettings.previewSet === "custom");
  form.elements.radialRadius.value = currentSettings.radialRadius;
  form.elements.accentColor.value = currentSettings.accentColor;
  form.elements.secondaryColor.value = currentSettings.secondaryColor;
  form.elements.textColor.value = currentSettings.textColor;
  form.elements.backgroundColor.value = currentSettings.backgroundColor;
  form.elements.position.value = currentSettings.position;
  form.elements.borderWidth.value = currentSettings.borderWidth;
  form.elements.radius.value = currentSettings.radius;
  form.elements.menuWidth.value = currentSettings.menuWidth;
  form.elements.scale.value = currentSettings.scale;
  form.elements.rowHeight.value = currentSettings.rowHeight;
  form.elements.opacity.value = currentSettings.opacity;
  form.elements.glow.checked = currentSettings.glow;
  form.elements.animations.checked = currentSettings.animations;
  form.elements.animationStyle.value = currentSettings.animationStyle;
  form.elements.animationSpeed.value = currentSettings.animationSpeed;
  form.elements.dualColor.checked = currentSettings.dualColor;
  form.elements.colorAnimation.value = currentSettings.colorAnimation;
  form.elements.showNumbers.checked = currentSettings.showNumbers;

  document.querySelectorAll(".source-tab").forEach((button) => {
    const selected = button.dataset.iconMode === currentSettings.iconMode;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-checked", String(selected));
  });
  document.getElementById("preset-icon-panel").classList.toggle("is-active", currentSettings.iconMode === "preset");
  document.getElementById("custom-icon-panel").classList.toggle("is-active", currentSettings.iconMode === "custom");
  document.getElementById("image-icon-panel").classList.toggle("is-active", currentSettings.iconMode === "image");

  document.querySelectorAll(".icon-choice").forEach((button) => {
    const selected = button.dataset.icon === currentSettings.icon;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-checked", String(selected));
  });
  document.querySelectorAll(".layout-choice").forEach((button) => {
    const selected = button.dataset.layout === currentSettings.layout;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-checked", String(selected));
  });
  document.querySelectorAll(".shape-choice").forEach((button) => {
    const selected = button.dataset.tabShape === currentSettings.tabShape;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-checked", String(selected));
  });
  document.querySelectorAll(".arrangement-choice").forEach((button) => {
    const selected = button.dataset.arrangement === currentSettings.arrangement;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-checked", String(selected));
  });
  document.querySelectorAll("[data-preview-count]").forEach((button) => {
    const selected = Number(button.dataset.previewCount) === currentSettings.previewCount;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-checked", String(selected));
  });
  updateOutputs();
}

function readForm() {
  return sanitizeSettings({
    ...currentSettings,
    language: languageSelect.value,
    customIcon: form.elements.customIcon.value,
    imageUrl: form.elements.imageUrl.value,
    imageSize: form.elements.imageSize.value,
    imageRound: form.elements.imageRound.checked,
    previewSet: previewSetSelect.value,
    previewLabels: customPreviewLabelsInput.value.split(","),
    radialRadius: form.elements.radialRadius.value,
    accentColor: form.elements.accentColor.value,
    secondaryColor: form.elements.secondaryColor.value,
    textColor: form.elements.textColor.value,
    backgroundColor: form.elements.backgroundColor.value,
    position: form.elements.position.value,
    borderWidth: form.elements.borderWidth.value,
    radius: form.elements.radius.value,
    menuWidth: form.elements.menuWidth.value,
    scale: form.elements.scale.value,
    rowHeight: form.elements.rowHeight.value,
    opacity: form.elements.opacity.value,
    glow: form.elements.glow.checked,
    animations: form.elements.animations.checked,
    animationStyle: form.elements.animationStyle.value,
    animationSpeed: form.elements.animationSpeed.value,
    dualColor: form.elements.dualColor.checked,
    colorAnimation: form.elements.colorAnimation.value,
    showNumbers: form.elements.showNumbers.checked,
  });
}

function updateOutputs() {
  document.getElementById("accent-value").textContent = currentSettings.accentColor;
  document.getElementById("secondary-value").textContent = currentSettings.secondaryColor;
  document.getElementById("text-value").textContent = currentSettings.textColor;
  document.getElementById("background-value").textContent = currentSettings.backgroundColor;
  document.getElementById("image-size-output").textContent = `${currentSettings.imageSize}px`;
  document.getElementById("border-output").textContent = `${currentSettings.borderWidth}px`;
  document.getElementById("radius-output").textContent = `${currentSettings.radius}px`;
  document.getElementById("width-output").textContent = `${currentSettings.menuWidth}px`;
  document.getElementById("scale-output").textContent = `${currentSettings.scale}%`;
  document.getElementById("height-output").textContent = `${currentSettings.rowHeight}px`;
  document.getElementById("opacity-output").textContent = `${currentSettings.opacity}%`;
  document.getElementById("animation-speed-output").textContent = `${currentSettings.animationSpeed}%`;
  document.getElementById("radial-radius-output").textContent = `${currentSettings.radialRadius}px`;
}

function showToast(message, isError = false) {
  clearTimeout(toastTimer);
  toast.querySelector("span").textContent = message;
  toast.querySelector("i").className = isError ? "fa-solid fa-circle-exclamation" : "fa-solid fa-check-circle";
  toast.classList.toggle("error", isError);
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}

function encodeShareCode(settings) {
  const sharedSettings = { ...sanitizeSettings(settings) };
  delete sharedSettings.language;
  const bytes = new TextEncoder().encode(JSON.stringify({ version: 1, settings: sharedSettings }));
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return `${SHARE_CODE_PREFIX}${btoa(binary)}`;
}

function decodeShareCode(value) {
  const code = String(value || "").trim();
  if (!code.startsWith(SHARE_CODE_PREFIX) || code.length > 32768) throw new Error("invalid_prefix");
  const encoded = code.slice(SHARE_CODE_PREFIX.length);
  if (!encoded || !/^[a-z0-9+/=]+$/i.test(encoded)) throw new Error("invalid_base64");

  const binary = atob(encoded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  const payload = JSON.parse(new TextDecoder().decode(bytes));
  if (payload?.version !== 1 || !payload.settings || typeof payload.settings !== "object" || Array.isArray(payload.settings)) throw new Error("invalid_payload");

  return sanitizeSettings({ ...payload.settings, language: currentSettings.language });
}

function setAppearanceAdmin(value) {
  appearanceAdmin = value === true || value === 1 || value === "true";
  saveServerSettingsButton.hidden = !appearanceAdmin;
}

async function refreshAppearanceAdmin() {
  try {
    const result = await fetchNui("getAppearanceAdminStatus", {});
    if (result?.success) setAppearanceAdmin(result.isAdmin);
  } catch {
    // Keep the admin value supplied by the initial open message.
  }
}

async function copyShareCode(code) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(code);
      return true;
    }
  } catch {
    // CEF may block the Clipboard API; the selection fallback remains available.
  }

  shareCodeInput.focus();
  shareCodeInput.select();
  try {
    return typeof document.execCommand === "function" && document.execCommand("copy");
  } catch {
    return false;
  }
}

function openSettings(settings, isAdmin = false) {
  savedSettings = sanitizeSettings(settings);
  setAppearanceAdmin(isAdmin);
  applySettings(savedSettings, true);
  targetHud.classList.remove("is-visible");
  overlay.classList.add("is-open");
  overlay.setAttribute("aria-hidden", "false");
  syncNuiVisibility();
  refreshAppearanceAdmin();
}

async function closeSettings(keepChanges = false) {
  if (!keepChanges) applySettings(savedSettings, true);
  overlay.classList.remove("is-open");
  overlay.setAttribute("aria-hidden", "true");
  syncNuiVisibility();
  await fetchNui("closeAppearance", {});
}

[eyeImage, previewImage].forEach((imageElement) => {
  imageElement.addEventListener("error", () => {
    if (imageElement.src) failedImageUrls.add(imageElement.src);
    imageElement.hidden = true;
    const iconElement = imageElement.previousElementSibling;
    iconElement.className = `fa-solid ${currentSettings.icon} target-icon target-visual`;
    iconElement.hidden = false;
  });
});

previewOptions.addEventListener("pointerdown", (event) => {
  if (currentSettings.arrangement !== "custom" || event.button !== 0) return;

  const option = event.target.closest(".preview-row");
  if (!option || !previewOptions.contains(option)) return;

  dragState = { option, index: Number(option.dataset.previewIndex) };
  option.classList.add("is-dragging");
  if (option.setPointerCapture) option.setPointerCapture(event.pointerId);
  event.preventDefault();
});

window.addEventListener("pointermove", (event) => {
  if (!dragState) return;

  const rect = previewStage.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  const previewFactor = getPreviewSpatialFactor();
  const previewWidth = Math.min(currentSettings.menuWidth, 175) * previewFactor;
  const previewHeight = Math.max(25, currentSettings.rowHeight * previewFactor);
  const maxX = Math.max(25, (rect.width / 2 - previewWidth / 2 - 9) / previewFactor);
  const maxY = Math.max(25, (rect.height / 2 - previewHeight / 2 - 9) / previewFactor);
  const x = Math.round(clamp((event.clientX - (rect.left + rect.width / 2)) / previewFactor, -maxX, maxX));
  const y = Math.round(clamp((event.clientY - (rect.top + rect.height / 2)) / previewFactor, -maxY, maxY));
  const layouts = sanitizeCustomLayouts(currentSettings.customLayouts);
  const key = String(currentSettings.previewCount);

  layouts[key][dragState.index] = { x, y };
  currentSettings = { ...currentSettings, customLayouts: layouts };
  layoutAllOptions();
  event.preventDefault();
});

function stopDragging() {
  if (!dragState) return;
  dragState.option.classList.remove("is-dragging");
  dragState = null;
}

window.addEventListener("pointerup", stopDragging);
window.addEventListener("pointercancel", stopDragging);

window.addEventListener("message", (event) => {
  const data = event.data || {};

  switch (data.event) {
    case "visible":
      targetHud.classList.toggle("is-visible", Boolean(data.state) && !overlay.classList.contains("is-open"));
      if (!data.state) {
        eyeContainer.classList.remove("eye-hover");
        optionsWrapper.replaceChildren();
      }
      syncNuiVisibility();
      break;
    case "leftTarget":
      eyeContainer.classList.remove("eye-hover");
      optionsWrapper.replaceChildren();
      break;
    case "setTarget":
      optionsWrapper.replaceChildren();
      eyeContainer.classList.add("eye-hover");
      if (data.options) {
        Object.entries(data.options).forEach(([type, list]) => list.forEach((option, id) => createOptions(type, option, id + 1)));
      }
      if (data.zones) {
        data.zones.forEach((zone, zoneIndex) => zone.forEach((option, id) => createOptions("zones", option, id + 1, zoneIndex + 1)));
      }
      layoutOptions(optionsWrapper, false);
      break;
    case "applyAppearance":
      savedSettings = sanitizeSettings(data.settings);
      applySettings(savedSettings, overlay.classList.contains("is-open"));
      break;
    case "openAppearance":
      openSettings(data.settings, data.isAdmin);
      break;
    case "closeAppearance":
      applySettings(savedSettings, true);
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      syncNuiVisibility();
      break;
  }
});

form.addEventListener("input", (event) => {
  if (event.target !== shareCodeInput) applySettings(readForm(), true);
});
form.addEventListener("change", (event) => {
  if (event.target !== shareCodeInput) applySettings(readForm(), true);
});

document.querySelectorAll(".source-tab").forEach((button) => {
  button.addEventListener("click", () => applySettings({ ...currentSettings, iconMode: button.dataset.iconMode }, true));
});

document.querySelectorAll(".icon-choice").forEach((button) => {
  button.addEventListener("click", () => applySettings({ ...currentSettings, iconMode: "preset", icon: button.dataset.icon }, true));
});

document.querySelectorAll(".layout-choice").forEach((button) => {
  button.addEventListener("click", () => applySettings({ ...currentSettings, layout: button.dataset.layout }, true));
});

document.querySelectorAll(".shape-choice").forEach((button) => {
  button.addEventListener("click", () => applySettings({ ...currentSettings, tabShape: button.dataset.tabShape }, true));
});

document.querySelectorAll(".arrangement-choice").forEach((button) => {
  button.addEventListener("click", () => applySettings({ ...currentSettings, arrangement: button.dataset.arrangement }, true));
});

document.querySelectorAll("[data-preview-count]").forEach((button) => {
  button.addEventListener("click", () => applySettings({ ...currentSettings, previewCount: Number(button.dataset.previewCount) }, true));
});

previewSetSelect.addEventListener("change", () => {
  applySettings({ ...currentSettings, previewSet: previewSetSelect.value }, true);
});

customPreviewLabelsInput.addEventListener("input", () => {
  applySettings({
    ...currentSettings,
    previewSet: "custom",
    previewLabels: customPreviewLabelsInput.value.split(","),
  });
});

languageSelect.addEventListener("change", () => {
  applySettings({ ...currentSettings, language: languageSelect.value }, true);
});

document.getElementById("copy-settings-code").addEventListener("click", async () => {
  const code = encodeShareCode(currentSettings);
  shareCodeInput.value = code;
  const copied = await copyShareCode(code);
  showToast(t(copied ? "Kod postavki je kopiran" : "Kod je spreman — pritisni Ctrl+C"));
});

document.getElementById("import-settings-code").addEventListener("click", () => {
  try {
    applySettings(decodeShareCode(shareCodeInput.value), true);
    showToast(t("Kod je uvezen — klikni Spremi promjene"));
  } catch {
    showToast(t("Neispravan kod postavki"), true);
  }
});

document.getElementById("reset-custom-layout").addEventListener("click", () => {
  const layouts = sanitizeCustomLayouts(currentSettings.customLayouts);
  const key = String(currentSettings.previewCount);
  layouts[key] = DEFAULT_CUSTOM_LAYOUTS[key].map((point) => ({ ...point }));
  applySettings({ ...currentSettings, arrangement: "custom", customLayouts: layouts }, true);
  showToast(t("Custom raspored za {count} tabli je vraćen", { count: key }));
});

document.getElementById("reset-settings").addEventListener("click", () => {
  applySettings({ ...DEFAULTS, language: currentSettings.language }, true);
  showToast(t("Vraćene su zadane vrijednosti — klikni Spremi"));
});

document.getElementById("save-settings").addEventListener("click", async () => {
  try {
    const result = await fetchNui("saveAppearance", currentSettings);
    if (!result?.success) throw new Error("save_failed");
    savedSettings = sanitizeSettings(result.settings || currentSettings);
    applySettings(savedSettings, true);
    showToast(t("Postavke su spremljene"));
  } catch {
    showToast(t("Postavke nije moguće spremiti"), true);
  }
});

saveServerSettingsButton.addEventListener("click", async () => {
  if (!appearanceAdmin) return;

  try {
    const result = await fetchNui("saveServerAppearance", currentSettings);
    if (!result?.success) {
      if (result?.error === "not_allowed") throw new Error("not_allowed");
      throw new Error("save_failed");
    }
    showToast(t("Server zadani izgled je spremljen"));
  } catch (error) {
    showToast(t(error?.message === "not_allowed" ? "Nemaš ovlasti za server zadani izgled" : "Server zadani izgled nije moguće spremiti"), true);
  }
});

document.getElementById("close-settings").addEventListener("click", () => closeSettings(false));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && overlay.classList.contains("is-open")) closeSettings(false);
});

applySettings(DEFAULTS, true);
syncNuiVisibility();

fetchNui("appearanceReady", {})
  .then((result) => {
    if (result?.settings) {
      savedSettings = sanitizeSettings(result.settings);
      applySettings(savedSettings, true);
    }
  })
  .catch(() => {});
