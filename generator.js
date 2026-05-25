/**
 * Unicode Block Font Studio - Core Engine
 * Customizer, Real-Time Paint Matrix Editor & Multi-Format Exporter
 */

// Global Default Font Map
const DEFAULT_BLOCKS = {
  'a': ['    ', '▀▀▀█', '█▀▀█', '▀▀▀▀'],
  'b': ['▄   ', '█▀▀▄', '█  █', '▀▀▀▀'],
  'c': ['    ', '█▀▀▀', '█   ', '▀▀▀▀'],
  'd': ['   ▄', '█▀▀█', '█  █', '▀▀▀▀'],
  'e': ['    ', '█▀▀█', '█▀▀▀', '▀▀▀▀'],
  'f': ['    ', ' ▄▀▀', ' █▀▀', ' █  '],
  'g': ['    ', '█▀▀█', '▀▀▀█', '▀▀▀▀'],
  'h': ['▄   ', '█▀▀▄', '█  █', '▀  ▀'],
  'i': ['    ', ' ▀  ', ' █  ', ' ▀  '],
  'j': ['  ▄ ', '  ▄ ', '▄ █ ', '▀▀  '],
  'k': ['    ', '█  █', '█▀▀▄', '▀  ▀'],
  'l': ['    ', '█   ', '█   ', '▀▀▀▀'],
  'm': ['    ', '█▄▄█', '█▐▌█', '▀  ▀'],
  'n': ['    ', '█▀▀▄', '█  █', '▀  ▀'],
  'o': ['    ', '█▀▀█', '█  █', '▀▀▀▀'],
  'p': ['    ', '█▀▀█', '█  █', '█▀▀▀'],
  'q': ['    ', '█▀▀█', '█  █', '▀▀▀█'],
  'r': ['    ', '█▀▀▄', '█   ', '▀   '],
  's': ['    ', '█▀▀▀', '▀▀▀█', '▀▀▀▀'],
  't': ['', '▀██▀', ' ██', ' ▀▀'],
  'u': ['    ', '█  █', '█  █', '▀▀▀▀'],
  'v': ['    ', '█  █', '▀▄▄▀', ' ▀▀ '],
  'w': ['    ', '█  █', '█▐▌█', '▀▀▀▀'],
  'x': ['    ', '█  █', '▄▀▀▄', '▀  ▀'],
  'y': ['    ', '█  █', '▀▀▀█', '▀▀▀▀'],
  'z': ['▀▀▀▌', ' ▄▀', '▀▀▀▀', '    '],
  '0': ['    ', '█▀▀█', '█  █', '▀▀▀▀'],
  '1': ['    ', ' ▀█ ', '  █ ', '  ▀ '],
  '2': ['    ', '▀▀▀█', '█▀▀▀', '▀▀▀▀'],
  '3': ['    ', '▀▀▀█', ' ▀▀█', '▀▀▀▀'],
  '4': ['    ', '█  █', '▀▀▀█', '   ▀'],
  '5': ['    ', '█▀▀▀', '▀▀▀█', '▀▀▀▀'],
  '6': ['    ', '█▀▀▀', '█▀▀█', '▀▀▀▀'],
  '7': ['    ', '▀▀▀█', '   █', '   ▀'],
  '8': ['    ', '█▀▀█', '█▀▀█', '▀▀▀▀'],
  '9': ['    ', '█▀▀█', '▀▀▀█', '▀▀▀▀'],
  ' ': ['    ', '    ', '    ', '    '],
  '.': ['    ', '    ', '    ', ' ▀  '],
  '-': ['    ', '    ', '▀▀▀▀', '    '],
  '_': ['    ', '    ', '    ', '▀▀▀▀']
};

let BLOCKS = JSON.parse(JSON.stringify(DEFAULT_BLOCKS));

if (localStorage.getItem('unicode_blocks_custom_v6')) {
  try {
    const loaded = JSON.parse(localStorage.getItem('unicode_blocks_custom_v6'));
    Object.keys(DEFAULT_BLOCKS).forEach(k => {
      if (loaded[k] && Array.isArray(loaded[k]) && loaded[k].length === 4) {
        BLOCKS[k] = loaded[k];
      }
    });
  } catch (e) {
    console.error("Failed to parse custom font, resetting to default.", e);
  }
}

let activeEditingChar = 'a';
let activeSelectedTool = '█';

// DOM ELEMENTS
const textInput = document.getElementById('text-input');
const charSpacingInput = document.getElementById('char-spacing');
const spacingValBadge = document.getElementById('spacing-val');
const trimRowsToggle = document.getElementById('trim-rows');
const charShadingToggle = document.getElementById('char-shading');
const crtOverlayToggle = document.getElementById('crt-overlay');
const colorModeSelect = document.getElementById('color-mode');
const ansiOptionsGroup = document.getElementById('ansi-options-group');
const ansiColorsInput = document.getElementById('ansi-colors-input');
const ansiBoldToggle = document.getElementById('ansi-bold');
const ansiResetToggle = document.getElementById('ansi-reset');
const themePicker = document.getElementById('theme-picker');
const outputRendered = document.getElementById('output-rendered');
const terminalCard = document.querySelector('.terminal-card');
const outputCodeSyntax = document.getElementById('output-code-syntax');
const fontBookGrid = document.getElementById('font-book-grid');
const btnCopyRaw = document.getElementById('btn-copy-raw');
const btnCopyJs = document.getElementById('btn-copy-js');
const btnExportSvg = document.getElementById('btn-export-svg');
const btnInlineCopyJs = document.getElementById('btn-inline-copy-js');
const btnResetFont = document.getElementById('btn-reset-font');
const editorModal = document.getElementById('editor-modal');
const editingCharLabel = document.getElementById('editing-char');
const matrixGrid = document.getElementById('matrix-grid');
const paletteTools = document.getElementById('palette-tools');
const btnApplyGlyph = document.getElementById('btn-apply-glyph');
const btnClearGlyph = document.getElementById('btn-clear-glyph');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnToggleTheme = document.getElementById('btn-toggle-theme');

/* ==========================================================================
   THEME MANAGER
   ========================================================================== */
function getOSColorScheme() {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function initializeTheme() {
  const savedTheme = localStorage.getItem('app_theme_v4') || 'cyan-glow';
  const savedMode = localStorage.getItem('app_mode_v4');
  setTheme(savedTheme);
  const mode = savedMode || getOSColorScheme();
  setMode(mode);
  document.querySelectorAll('.theme-btn').forEach(btn => {
    if (btn.dataset.theme === savedTheme) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function setTheme(themeName) {
  document.body.className = '';
  if (themeName !== 'cyan-glow') {
    document.body.classList.add(themeName);
  }
  localStorage.setItem('app_theme_v4', themeName);
}

function setMode(mode) {
  if (mode === 'light') {
    document.body.classList.add('light-mode');
    btnToggleTheme.textContent = '☀️';
  } else {
    document.body.classList.remove('light-mode');
    btnToggleTheme.textContent = '🌙';
  }
  localStorage.setItem('app_mode_v4', mode);
}

function toggleMode() {
  const currentMode = localStorage.getItem('app_mode_v4') || getOSColorScheme();
  const newMode = currentMode === 'dark' ? 'light' : 'dark';
  setMode(newMode);
}

btnToggleTheme.addEventListener('click', toggleMode);

window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
  if (!localStorage.getItem('app_mode_v4')) {
    setMode(e.matches ? 'light' : 'dark');
  }
});

themePicker.addEventListener('click', (e) => {
  const btn = e.target.closest('.theme-btn');
  if (!btn) return;
  document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  setTheme(btn.dataset.theme);
});

/* ==========================================================================
   FONT RENDERER ENGINE
   ========================================================================== */
function getAnsiColorsArray() {
  const raw = ansiColorsInput.value;
  return raw.split(',').map(s => s.trim().toUpperCase()).filter(s => s.length > 0);
}

function applyShading(segment, char) {
  // Skip narrow/centered glyphs where spaces are structural, not background
  const skipChars = ['i', 'l', 't', '1'];
  if (skipChars.includes(char)) return segment;
  return segment.replace(/  /g, '░░');
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderLogo() {
  const text = textInput.value || '';
  const spacing = parseInt(charSpacingInput.value);
  const trimEmptyTop = trimRowsToggle.checked;
  const mode = colorModeSelect.value;
  const enableShading = charShadingToggle.checked;

  const chars = text.toLowerCase().split('');
  const lines = ['', '', '', ''];
  const spacingStr = ' '.repeat(spacing);

  chars.forEach((char, index) => {
    const art = BLOCKS[char] || BLOCKS[' '];
    const isLast = index === chars.length - 1;

    for (let i = 0; i < 4; i++) {
      let blockSegment = art[i] || '    ';
      while (blockSegment.length < 4) blockSegment += ' ';

      if (i === 2 && enableShading) {
        blockSegment = applyShading(blockSegment, char);
      }

      lines[i] += blockSegment + (isLast ? '' : spacingStr);
    }
  });

  let startRow = 0;
  if (trimEmptyTop && lines[0].trim() === '') {
    startRow = 1;
  }

  let htmlOutput = '';
  const ansiColors = getAnsiColorsArray();
  const boldFlag = ansiBoldToggle.checked;
  const resetFlag = ansiResetToggle.checked;

  if (mode === 'monochrome') {
    for (let i = startRow; i < 4; i++) {
      htmlOutput += escapeHtml(lines[i]).trimEnd() + '\n';
    }
  }
  else if (mode === 'dual-tone') {
    for (let i = startRow; i < 4; i++) {
      let lineHtml = '';
      chars.forEach((char, charIdx) => {
        const art = BLOCKS[char] || BLOCKS[' '];
        let blockSegment = art[i] || '    ';
        while (blockSegment.length < 4) blockSegment += ' ';

        if (i === 2 && enableShading) {
          blockSegment = applyShading(blockSegment, char);
        }

        const colorClass = (charIdx % 2 === 0) ? 'ansi-primary' : 'ansi-accent';
        lineHtml += `<span class="${colorClass}">${escapeHtml(blockSegment)}</span>`;
        if (charIdx < chars.length - 1) lineHtml += spacingStr;
      });
      htmlOutput += lineHtml.trimEnd() + '\n';
    }
  }
  else if (mode === 'ansi') {
    for (let i = startRow; i < 4; i++) {
      let lineHtml = '';
      let currentCharIndex = 0;

      while (currentCharIndex < chars.length) {
        const colorKey = ansiColors[currentCharIndex % ansiColors.length] || 'S';
        let groupContent = '';

        let lookAheadIdx = currentCharIndex;
        while (lookAheadIdx < chars.length) {
          const nextColorKey = ansiColors[lookAheadIdx % ansiColors.length] || 'S';
          if (nextColorKey !== colorKey) break;

          const art = BLOCKS[chars[lookAheadIdx]] || BLOCKS[' '];
          let blockSegment = art[i] || '    ';
          while (blockSegment.length < 4) blockSegment += ' ';

          if (i === 2 && enableShading) {
            blockSegment = applyShading(blockSegment, char);
          }

          const gap = (i === 2 && enableShading) ? '░░'.repeat(spacing) : spacingStr;
          groupContent += blockSegment + (lookAheadIdx === chars.length - 1 ? '' : gap);
          lookAheadIdx++;
        }

        const boldClass = boldFlag ? ' ansi-B' : '';
        lineHtml += `<span class="ansi-${colorKey}${boldClass}">${escapeHtml(groupContent)}</span>`;
        currentCharIndex = lookAheadIdx;
      }

      htmlOutput += lineHtml.trimEnd() + '\n';
    }
  }

  outputRendered.innerHTML = htmlOutput || '<i>[Empty Output]</i>';

  let codeOutput = 'const LOGO = [\n';

  for (let i = startRow; i < 4; i++) {
    let lineCode = '  `';

    if (mode === 'ansi') {
      let currentCharIndex = 0;
      while (currentCharIndex < chars.length) {
        const colorKey = ansiColors[currentCharIndex % ansiColors.length] || 'S';
        let groupContent = '';

        let lookAheadIdx = currentCharIndex;
        while (lookAheadIdx < chars.length) {
          const nextColorKey = ansiColors[lookAheadIdx % ansiColors.length] || 'S';
          if (nextColorKey !== colorKey) break;

          const art = BLOCKS[chars[lookAheadIdx]] || BLOCKS[' '];
          let blockSegment = art[i] || '    ';
          while (blockSegment.length < 4) blockSegment += ' ';

          if (i === 2 && enableShading) {
            blockSegment = applyShading(blockSegment, char);
          }

          const gap = (i === 2 && enableShading) ? '░░'.repeat(spacing) : spacingStr;
          groupContent += blockSegment + (lookAheadIdx === chars.length - 1 ? '' : gap);
          lookAheadIdx++;
        }

        const boldCode = boldFlag ? '${B}' : '';
        lineCode += `\${${colorKey}}${boldCode}${groupContent}`;
        currentCharIndex = lookAheadIdx;
      }
      if (resetFlag) lineCode += '${R}';
    } else {
      lineCode += lines[i].trimEnd();
    }

    lineCode += '`,\n';
    codeOutput += lineCode;
  }

  codeOutput += '];';
  outputCodeSyntax.textContent = codeOutput;
}

/* ==========================================================================
   FONT-BOOK GRID (GLYPH PREVIEWS)
   ========================================================================== */
function renderFontBook() {
  fontBookGrid.innerHTML = '';

  const keys = Object.keys(BLOCKS).sort((a, b) => {
    const aIsAl = /[a-z]/.test(a);
    const bIsAl = /[a-z]/.test(b);
    const aIsNum = /[0-9]/.test(a);
    const bIsNum = /[0-9]/.test(b);

    if (aIsAl && !bIsAl) return -1;
    if (!aIsAl && bIsAl) return 1;
    if (aIsNum && !bIsNum) return -1;
    if (!aIsNum && bIsNum) return 1;
    return a.localeCompare(b);
  });

  keys.forEach(char => {
    const card = document.createElement('div');
    card.className = 'char-card';
    card.dataset.char = char;

    const label = document.createElement('span');
    label.className = 'char-card-label';
    label.textContent = char === ' ' ? 'Space ( )' : char.toUpperCase();

    const visual = document.createElement('pre');
    visual.className = 'char-card-visual';
    visual.textContent = BLOCKS[char].join('\n');

    card.appendChild(label);
    card.appendChild(visual);

    card.addEventListener('click', () => {
      openGlyphEditor(char);
    });

    fontBookGrid.appendChild(card);
  });
}

/* ==========================================================================
   GLYPH DRAWING/PAINTING MODAL
   ========================================================================== */
function openGlyphEditor(char) {
  activeEditingChar = char;
  editingCharLabel.textContent = char === ' ' ? 'Space' : char.toUpperCase();
  renderMatrixGrid();
  editorModal.classList.remove('hidden');
}

function renderMatrixGrid() {
  matrixGrid.innerHTML = '';
  const rows = BLOCKS[activeEditingChar];

  for (let r = 0; r < 4; r++) {
    const rowStr = rows[r] || '    ';
    for (let c = 0; c < 4; c++) {
      const cellChar = rowStr[c] || ' ';
      const cell = document.createElement('div');
      cell.className = 'matrix-cell';
      if (cellChar !== ' ') {
        cell.classList.add('filled');
      }
      cell.textContent = cellChar;
      cell.dataset.row = r;
      cell.dataset.col = c;

      cell.addEventListener('mousedown', (e) => {
        paintCell(cell, r, c);
      });

      matrixGrid.appendChild(cell);
    }
  }
}

function paintCell(cellElement, r, c) {
  if (activeSelectedTool === ' ') {
    cellElement.textContent = ' ';
    cellElement.classList.remove('filled');
  } else {
    cellElement.textContent = activeSelectedTool;
    cellElement.classList.add('filled');
  }
}

paletteTools.addEventListener('click', (e) => {
  const toolBtn = e.target.closest('.palette-tool');
  if (!toolBtn) return;

  document.querySelectorAll('.palette-tool').forEach(t => t.classList.remove('active'));
  toolBtn.classList.add('active');
  activeSelectedTool = toolBtn.dataset.block;
});

btnApplyGlyph.addEventListener('click', () => {
  const updatedRows = ['', '', '', ''];
  const cells = matrixGrid.querySelectorAll('.matrix-cell');

  cells.forEach(cell => {
    const r = parseInt(cell.dataset.row);
    const char = cell.textContent || ' ';
    updatedRows[r] += char;
  });

  BLOCKS[activeEditingChar] = updatedRows;

  localStorage.setItem('unicode_blocks_custom_v6', JSON.stringify(BLOCKS));

  editorModal.classList.add('hidden');
  renderFontBook();
  renderLogo();
});

btnClearGlyph.addEventListener('click', () => {
  matrixGrid.querySelectorAll('.matrix-cell').forEach(cell => {
    cell.textContent = ' ';
    cell.classList.remove('filled');
  });
});

btnCloseModal.addEventListener('click', () => {
  editorModal.classList.add('hidden');
});

editorModal.addEventListener('click', (e) => {
  if (e.target === editorModal) {
    editorModal.classList.add('hidden');
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !editorModal.classList.contains('hidden')) {
    editorModal.classList.add('hidden');
  }
});

/* ==========================================================================
   RESET GLYPHS TO DEFAULT
   ========================================================================== */
btnResetFont.addEventListener('click', () => {
  if (confirm("Are you sure you want to reset all glyph modifications?")) {
    BLOCKS = JSON.parse(JSON.stringify(DEFAULT_BLOCKS));
    localStorage.removeItem('unicode_blocks_custom_v6');
    renderFontBook();
    renderLogo();
  }
});

/* ==========================================================================
   EXPORTERS AND CLIPBOARD
   ========================================================================== */
function copyToClipboard(text, successMessage) {
  navigator.clipboard.writeText(text).then(() => {
    alert(successMessage || "Copied to clipboard!");
  }).catch(err => {
    console.error("Clipboard copy failed: ", err);
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      alert(successMessage || "Copied to clipboard!");
    } catch (e) {
      alert("Failed to copy automatically.");
    }
    document.body.removeChild(textArea);
  });
}

btnCopyRaw.addEventListener('click', () => {
  const text = textInput.value || '';
  const spacing = parseInt(charSpacingInput.value);
  const trimEmptyTop = trimRowsToggle.checked;

  const chars = text.toLowerCase().split('');
  const lines = ['', '', '', ''];
  const spacingStr = ' '.repeat(spacing);

  chars.forEach((char, index) => {
    const art = BLOCKS[char] || BLOCKS[' '];
    const isLast = index === chars.length - 1;
    for (let i = 0; i < 4; i++) {
      let blockSegment = art[i] || '    ';
      while (blockSegment.length < 4) blockSegment += ' ';
      if (i === 2 && enableShading) {
        blockSegment = applyShading(blockSegment, char);
      }
      lines[i] += blockSegment + (isLast ? '' : spacingStr);
    }
  });

  let startRow = 0;
  if (trimEmptyTop && lines[0].trim() === '') {
    startRow = 1;
  }

  let rawContent = '';
  for (let i = startRow; i < 4; i++) {
    rawContent += lines[i].trimEnd() + '\n';
  }

  copyToClipboard(rawContent, "Raw Unicode Art copied successfully!");
});

function copyJsArray() {
  const code = outputCodeSyntax.textContent;
  copyToClipboard(code, "JS Target LOGO Array copied successfully!");
}
btnCopyJs.addEventListener('click', copyJsArray);
btnInlineCopyJs.addEventListener('click', copyJsArray);

/* ==========================================================================
   HIGH-QUALITY SVG VECTOR GENERATOR EXPORTER
   ========================================================================== */
btnExportSvg.addEventListener('click', () => {
  const text = textInput.value || 'opencode';
  const chars = text.toLowerCase().split('');
  const trimEmptyTop = trimRowsToggle.checked;
  const isDualTone = (colorModeSelect.value === 'dual-tone');

  const spacing = parseInt(charSpacingInput.value);
  const cellDimension = 8;
  const horizontalPadding = 12;
  const verticalPadding = 12;

  const lines = ['', '', '', ''];
  chars.forEach((char) => {
    const art = BLOCKS[char] || BLOCKS[' '];
    for (let i = 0; i < 4; i++) {
      let segment = art[i] || '    ';
      while (segment.length < 4) segment += ' ';
      lines[i] += segment;
    }
  });

  let startRow = 0;
  if (trimEmptyTop && lines[0].trim() === '') {
    startRow = 1;
  }

  const activeRowsCount = 4 - startRow;
  const totalLetters = chars.length;

  const totalCols = (totalLetters * 4) + ((totalLetters - 1) * spacing);
  const svgWidth = (totalCols * cellDimension) + (horizontalPadding * 2);
  const svgHeight = (activeRowsCount * cellDimension) + (verticalPadding * 2);

  const computedStyle = getComputedStyle(document.body);
  const primaryColor = computedStyle.getPropertyValue('--primary-color').trim() || '#00f0ff';
  const accentColor = isDualTone
    ? (computedStyle.getPropertyValue('--accent-color').trim() || '#3b82f6')
    : primaryColor;
  const svgBgColor = computedStyle.getPropertyValue('--terminal-bg').trim() || '#090a0f';

  let svgPaths = '';

  chars.forEach((char, charIdx) => {
    const art = BLOCKS[char] || BLOCKS[' '];

    const colOffset = charIdx * (4 + spacing);
    const xBase = horizontalPadding + (colOffset * cellDimension);

    const isPrimaryChar = (charIdx % 2 === 0);
    const fillHex = isPrimaryChar ? primaryColor : accentColor;

    for (let r = startRow; r < 4; r++) {
      const rowStr = art[r] || '    ';
      const yBase = verticalPadding + ((r - startRow) * cellDimension);

      for (let c = 0; c < 4; c++) {
        const block = rowStr[c] || ' ';
        if (block === ' ') continue;

        const cellX = xBase + (c * cellDimension);
        const cellY = yBase;
        const size = cellDimension;

        if (block === '█') {
          svgPaths += `  <rect x="${cellX}" y="${cellY}" width="${size}" height="${size}" fill="${fillHex}" />\n`;
        }
        else if (block === '▀') {
          svgPaths += `  <rect x="${cellX}" y="${cellY}" width="${size}" height="${size / 2}" fill="${fillHex}" />\n`;
        }
        else if (block === '▄') {
          svgPaths += `  <rect x="${cellX}" y="${cellY + size / 2}" width="${size}" height="${size / 2}" fill="${fillHex}" />\n`;
        }
        else if (block === '▌') {
          svgPaths += `  <rect x="${cellX}" y="${cellY}" width="${size / 2}" height="${size}" fill="${fillHex}" />\n`;
        }
        else if (block === '▐') {
          svgPaths += `  <rect x="${cellX + size / 2}" y="${cellY}" width="${size / 2}" height="${size}" fill="${fillHex}" />\n`;
        }
        else if (block === '░') {
          svgPaths += `  <rect x="${cellX}" y="${cellY}" width="${size}" height="${size}" fill="${fillHex}" opacity="0.3" />\n`;
        }
      }
    }
  });

  const svgString = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">
  <rect width="100%" height="100%" fill="${svgBgColor}" rx="10" />
  ${svgPaths}</svg>`;

  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `${text.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_block_logo.svg`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
});

/* ==========================================================================
   EVENT LISTENERS & BINDINGS
   ========================================================================== */
textInput.addEventListener('input', renderLogo);

charSpacingInput.addEventListener('input', (e) => {
  const val = e.target.value;
  spacingValBadge.textContent = val;
  renderLogo();
});

trimRowsToggle.addEventListener('change', renderLogo);
charShadingToggle.addEventListener('change', renderLogo);
crtOverlayToggle.addEventListener('change', (e) => {
  if (e.target.checked) {
    terminalCard.classList.remove('no-crt');
  } else {
    terminalCard.classList.add('no-crt');
  }
});

colorModeSelect.addEventListener('change', (e) => {
  const val = e.target.value;
  if (val === 'ansi') {
    ansiOptionsGroup.classList.remove('hidden');
  } else {
    ansiOptionsGroup.classList.add('hidden');
  }
  renderLogo();
});

ansiColorsInput.addEventListener('input', renderLogo);
ansiBoldToggle.addEventListener('change', renderLogo);
ansiResetToggle.addEventListener('change', renderLogo);

// INITIALIZATION
initializeTheme();
renderFontBook();
renderLogo();
console.log("=== Unicode Block Font Studio Initialized ===");