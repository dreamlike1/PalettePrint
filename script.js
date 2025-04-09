// DOM Elements
const hexInput = document.getElementById('hexInput');
const errorMessage = document.getElementById('errorMessage');
const colorPicker = document.getElementById('colorPicker');
const colorPreview = document.getElementById('colorPreview');
const resetBtn = document.getElementById('resetBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const cmykModeToggle = document.getElementById('cmykModeToggle');
const originalColorBox = document.getElementById('originalColorBox');
const originalHex = document.getElementById('originalHex');
const originalRgb = document.getElementById('originalRgb');
const cmykColorBox = document.getElementById('cmykColorBox');
const cmykHex = document.getElementById('cmykHex');
const cmykRgb = document.getElementById('cmykRgb');
const cmykValues = document.getElementById('cmykValues');
const shade1 = document.getElementById('shade1');
const shade2 = document.getElementById('shade2');
const shade3 = document.getElementById('shade3');
const copyHexBtn = document.getElementById('copyHexBtn');
const spectrumBar = document.getElementById('spectrumBar');

// State variables
let currentHex = '';
let isAdditiveMode = false;

// Event Listeners
hexInput.addEventListener('input', onHexInput);
colorPicker.addEventListener('input', onColorPick);
resetBtn.addEventListener('click', resetAll);
darkModeToggle.addEventListener('change', toggleDarkMode);
cmykModeToggle.addEventListener('change', toggleCMYKMode);
copyHexBtn.addEventListener('click', copyHexValues);

// Initialize with a default color and in dark mode
colorPicker.value = "#FFFFFF";
colorPreview.style.backgroundColor = "#FFFFFF";
hexInput.value = "FFFFFF";
currentHex = "FFFFFF";
darkModeToggle.checked = true;
document.body.classList.add('dark-mode');
generateColors();

// Functions
function onHexInput(e) {
  let value = e.target.value.toUpperCase();
  
  // Remove any non-hex characters
  value = value.replace(/[^0-9A-F]/g, '');
  
  // Update the input with cleaned value
  e.target.value = value;
  
  // Validate
  const isValid = /^[0-9A-F]{6}$/.test(value);
  
  if (value.length === 6) {
    if (isValid) {
      errorMessage.textContent = '';
      currentHex = value;
      updateColorPicker(value);
      generateColors();
    } else {
      errorMessage.textContent = 'Please enter valid HEX characters (0-9, A-F)';
    }
  } else if (value.length > 0) {
    errorMessage.textContent = 'Please enter exactly 6 characters';
  } else {
    errorMessage.textContent = '';
  }
}

function onColorPick(e) {
  const hexValue = e.target.value.substring(1).toUpperCase();
  hexInput.value = hexValue;
  currentHex = hexValue;
  errorMessage.textContent = '';
  colorPreview.style.backgroundColor = e.target.value;
  generateColors();
}

function updateColorPicker(hex) {
  colorPicker.value = `#${hex}`;
  colorPreview.style.backgroundColor = `#${hex}`;
}

function generateColors() {
  if (!currentHex) return;
  
  // Convert HEX to RGB
  const rgb = hexToRgb(currentHex);
  if (!rgb) return;
  
  // Update original color section
  originalColorBox.style.backgroundColor = `#${currentHex}`;
  originalHex.textContent = `HEX: #${currentHex}`;
  originalRgb.textContent = `RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}`;
  
  // Convert RGB to CMYK
  const cmyk = rgbToCmyk(rgb);
  
  // Simulate CMYK conversion (with enhancements)
  const simulatedRgb = simulateCmykPrint(rgb);
  const simulatedHex = rgbToHex(simulatedRgb);
  
  // Update CMYK color section
  cmykColorBox.style.backgroundColor = `#${simulatedHex}`;
  cmykHex.textContent = `HEX: #${simulatedHex}`;
  cmykRgb.textContent = `RGB: ${Math.round(simulatedRgb.r)}, ${Math.round(simulatedRgb.g)}, ${Math.round(simulatedRgb.b)}`;
  cmykValues.textContent = `CMYK: ${Math.round(cmyk.c)}%, ${Math.round(cmyk.m)}%, ${Math.round(cmyk.y)}%, ${Math.round(cmyk.k)}%`;
  
  // Generate shades
  generateShades(simulatedRgb, cmyk);
  
  // Update spectrum
  updateSpectrum(simulatedHex);
}

function generateShades(simulatedRgb, cmyk) {
  const shades = [];
  
  if (isAdditiveMode) {
    // CMYK Additive Mode
    const shade1Cmyk = {
      c: Math.min(100, cmyk.c + 3),
      m: Math.min(100, cmyk.m + 3),
      y: Math.min(100, cmyk.y + 3),
      k: Math.min(100, cmyk.k + 3)
    };
    
    const shade2Cmyk = {
      c: Math.min(100, cmyk.c + 6),
      m: Math.min(100, cmyk.m + 6),
      y: Math.min(100, cmyk.y + 6),
      k: Math.min(100, cmyk.k + 6)
    };
    
    const shade3Cmyk = {
      c: Math.min(100, cmyk.c + 9),
      m: Math.min(100, cmyk.m + 9),
      y: Math.min(100, cmyk.y + 9),
      k: Math.min(100, cmyk.k + 9)
    };
    
    shades.push({
      rgb: cmykToRgb(shade1Cmyk),
      cmyk: shade1Cmyk
    });
    
    shades.push({
      rgb: cmykToRgb(shade2Cmyk),
      cmyk: shade2Cmyk
    });
    
    shades.push({
      rgb: cmykToRgb(shade3Cmyk),
      cmyk: shade3Cmyk
    });
  } else {
    // Darken Mode - Always use the simulated CMYK color as base
    shades.push({
      rgb: darkenRgb(simulatedRgb, 0.1),
      cmyk: rgbToCmyk(darkenRgb(simulatedRgb, 0.1))
    });
    
    shades.push({
      rgb: darkenRgb(simulatedRgb, 0.15),
      cmyk: rgbToCmyk(darkenRgb(simulatedRgb, 0.15))
    });
    
    shades.push({
      rgb: darkenRgb(simulatedRgb, 0.2),
      cmyk: rgbToCmyk(darkenRgb(simulatedRgb, 0.2))
    });
  }
  
  // Update shade elements
  updateShadeElement(shade1, shades[0]);
  updateShadeElement(shade2, shades[1]);
  updateShadeElement(shade3, shades[2]);
  
  // Update spectrum markers for shades
  updateSpectrumMarkers(simulatedRgb, shades);
}

function updateShadeElement(element, shade) {
  const hex = rgbToHex(shade.rgb);
  element.querySelector('.color-box').style.backgroundColor = `#${hex}`;
  element.querySelector('.hex').textContent = `HEX: #${hex}`;
  element.querySelector('.cmyk').textContent = `CMYK: ${Math.round(shade.cmyk.c)}%, ${Math.round(shade.cmyk.m)}%, ${Math.round(shade.cmyk.y)}%, ${Math.round(shade.cmyk.k)}%`;
  element.dataset.hex = hex;
}

function updateSpectrum(simulatedHex) {
  // Create gradient from black to color to white
  spectrumBar.style.background = `linear-gradient(to right, #000000, #${simulatedHex}, #FFFFFF)`;
}

function updateSpectrumMarkers(simulatedRgb, shades) {
  // Clear existing markers
  while (spectrumBar.firstChild) {
    spectrumBar.removeChild(spectrumBar.firstChild);
  }
  
  // Original color marker
  const originalRgb = hexToRgb(currentHex);
  addSpectrumMarker(originalRgb, 'Original', currentHex, '#' + currentHex);
  
  // Simulated CMYK marker
  const simulatedHex = rgbToHex(simulatedRgb);
  addSpectrumMarker(simulatedRgb, 'CMYK', simulatedHex, '#' + simulatedHex);
  
  // Shade markers
  addSpectrumMarker(shades[0].rgb, 'Shade 1', rgbToHex(shades[0].rgb), '#' + rgbToHex(shades[0].rgb));
  addSpectrumMarker(shades[1].rgb, 'Shade 2', rgbToHex(shades[1].rgb), '#' + rgbToHex(shades[1].rgb));
  addSpectrumMarker(shades[2].rgb, 'Shade 3', rgbToHex(shades[2].rgb), '#' + rgbToHex(shades[2].rgb));
}

function addSpectrumMarker(rgb, label, hex, backgroundColor) {
  const brightness = getPerceivedBrightness(rgb);
  const marker = document.createElement('div');
  marker.className = 'spectrum-marker';
  marker.style.left = `${brightness * 100}%`;
  marker.style.backgroundColor = backgroundColor;
  
  const tooltip = document.createElement('div');
  tooltip.className = 'marker-tooltip';
  tooltip.textContent = `${label}: #${hex}`;
  
  marker.appendChild(tooltip);
  spectrumBar.appendChild(marker);
}

function getPerceivedBrightness(rgb) {
  // HSP (Highly Sensitive Persons) equation for perceived brightness
  // See: http://alienryderflex.com/hsp.html
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  return Math.sqrt(
    0.299 * r * r +
    0.587 * g * g +
    0.114 * b * b
  );
}

function copyHexValues() {
  if (!shade1.dataset.hex) return;
  
  const hexValues = [
    `• #${shade1.dataset.hex}`,
    `• #${shade2.dataset.hex}`,
    `• #${shade3.dataset.hex}`
  ].join('\n');
  
  navigator.clipboard.writeText(hexValues).then(() => {
    const originalText = copyHexBtn.textContent;
    copyHexBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyHexBtn.textContent = originalText;
    }, 2000);
  });
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

function toggleCMYKMode() {
  isAdditiveMode = cmykModeToggle.checked;
  if (currentHex) {
    generateColors();
  }
}

function resetAll() {
  // Reset to default color
  hexInput.value = 'FFFFFF';
  currentHex = 'FFFFFF';
  errorMessage.textContent = '';
  colorPicker.value = '#FFFFFF';
  colorPreview.style.backgroundColor = '#FFFFFF';
  
  // Reset toggles
  cmykModeToggle.checked = false;
  isAdditiveMode = false;
  
  // Generate colors with default
  generateColors();
}

// Color conversion utilities
function hexToRgb(hex) {
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return { r, g, b };
}

function rgbToHex(rgb) {
  return [
    Math.round(rgb.r).toString(16).padStart(2, '0'),
    Math.round(rgb.g).toString(16).padStart(2, '0'),
    Math.round(rgb.b).toString(16).padStart(2, '0')
  ].join('').toUpperCase();
}

function rgbToCmyk(rgb) {
  // Normalize RGB values
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  // Find maximum value
  const k = 1 - Math.max(r, g, b);
  
  // Handle black case
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }
  
  // Calculate CMY
  const c = (1 - r - k) / (1 - k) * 100;
  const m = (1 - g - k) / (1 - k) * 100;
  const y = (1 - b - k) / (1 - k) * 100;
  
  return { c, m, y, k: k * 100 };
}

function cmykToRgb(cmyk) {
  // Normalize CMYK values
  const c = cmyk.c / 100;
  const m = cmyk.m / 100;
  const y = cmyk.y / 100;
  const k = cmyk.k / 100;
  
  // Calculate RGB
  const r = Math.round(255 * (1 - c) * (1 - k));
  const g = Math.round(255 * (1 - m) * (1 - k));
  const b = Math.round(255 * (1 - y) * (1 - k));
  
  return { r, g, b };
}

function simulateCmykPrint(rgb) {
  // Convert to CMYK
  const cmyk = rgbToCmyk(rgb);
  
  // Convert back to RGB with enhancements for FOGRA39 simulation
  const enhancedRgb = cmykToRgb(cmyk);
  
  // Apply gamma correction
  const gamma = 1.1;
  let r = Math.pow(enhancedRgb.r / 255, gamma) * 255;
  let g = Math.pow(enhancedRgb.g / 255, gamma) * 255;
  let b = Math.pow(enhancedRgb.b / 255, gamma) * 255;
  
  // Dot gain simulation - slightly darken
  r *= 0.95;
  g *= 0.95;
  b *= 0.95;
  
  // Slight desaturation
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  const desatFactor = 0.15;
  r = r * (1 - desatFactor) + luminance * desatFactor;
  g = g * (1 - desatFactor) + luminance * desatFactor;
  b = b * (1 - desatFactor) + luminance * desatFactor;
  
  // Reduced contrast
  const midpoint = 127.5;
  const contrastFactor = 0.9;
  r = (r - midpoint) * contrastFactor + midpoint;
  g = (g - midpoint) * contrastFactor + midpoint;
  b = (b - midpoint) * contrastFactor + midpoint;
  
  // Clamp values
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  
  return { r, g, b };
}

function darkenRgb(rgb, factor) {
  return {
    r: Math.max(0, rgb.r * (1 - factor)),
    g: Math.max(0, rgb.g * (1 - factor)),
    b: Math.max(0, rgb.b * (1 - factor))
  };
}