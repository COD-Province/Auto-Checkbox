// ==UserScript==
// @name         Auto-Checkbox
// @description  Automatically clicks checkboxes in table rows based on a regex match. Designed for utlog.net 'Bank Reference Claim' menu.
// @version      1.0.0
// @match        https://oc.utlog.net/*
// @grant        GM_registerMenuCommand
// @author       The COD Department
// ==/UserScript==

/**
* Parses the innertext of table rows and returns an array of relevant rows
* based on a regex search match
* @param {Array<string>} texts - An array of strings to match against the 
* table rows
* @returns {Array<HTMLTableRowElement>} - An array of relevant rows that match the provided
* texts
*/
function findRelevantRows(texts) {
  const relevantRows = [];

  document.querySelectorAll('tr').forEach(tr => {
    if (tr.classList.contains('acb-row')) return; // Skip rows that are already processed
    const text = tr.innerText;
    // Use word boundaries to ensure exact matches
    if (texts.some(t => new RegExp('\\b' + t + '\\b').test(text))) {
      relevantRows.push(tr);
    }
  });

  return relevantRows;
}

/**
 * Clicks checkboxes in the relevant rows based on the provided codes.
 * @param {Array<string>} codes - An array of strings to match against the table rows.
 * @returns {int} - The number of checkboxes clicked.
 */
function clickCheckboxes(codes) {
  const relevantRows = findRelevantRows(codes);
  let clickCount = 0;
  relevantRows.forEach(tr => {
    const cb = tr.querySelector('input[type="checkbox"]');
    if (cb && !cb.checked) {
      cb.click();
      clickCount++;
    }
  });
  return clickCount;
}

/**
* Escapes HTML special characters in a string.
* @param {string} text - The raw text input from the user.
* @returns {string} - The escaped string safe for HTML rendering.
*/
function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
* Splits a provided long string of text into a 1D array of strings.
* @param {string} text - The raw text input from the user.
* @returns {Array<string>} - A flat 1D array of strings.
*/
function parseSingleColumnText(text) {
  return text
    .split(/\r?\n/) // Split by newlines (handles both Windows and Unix line endings)
    .map(item => item.trim())
    .filter(item => item !== "");
}

(function () {
  'use strict';

  function main() {
    const modal = document.createElement('div');
    modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.6); display: flex; align-items: center;
            justify-content: center; z-index: 999999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
            background: #fff; padding: 20px; border-radius: 8px;
            width: 90%; max-width: 550px; max-height: 85vh; box-shadow: 0 6px 16px rgba(0,0,0,0.3);
            display: flex; flex-direction: column; gap: 12px; box-sizing: border-box;
        `;

    const title = document.createElement('h3');
    title.innerText = 'Paste Single Column Cells (Excel / Sheets)';
    title.style.margin = '0';
    title.style.color = '#333';

    const textarea = document.createElement('textarea');
    textarea.rows = 4;
    textarea.placeholder = 'Click here and paste your copied column (Ctrl+V)...';
    textarea.style.cssText = `
            width: 100%; padding: 10px; box-sizing: border-box;
            border: 1px solid #ccc; border-radius: 4px; font-family: monospace; resize: vertical;
        `;

    const gridContainer = document.createElement('div');
    gridContainer.style.cssText = `
            max-height: 250px; overflow-y: auto; border: 1px solid #b0b0b0;
            background: #fff; border-radius: 4px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
        `;
    gridContainer.innerHTML = '<div style="padding: 15px; color: #888; text-align: center;">Pasted cells will appear here as a spreadsheet column...</div>';

    // This will strictly be a 1D array of strings: ['item1', 'item2', ...]
    let parsedColumn = [];
    let foundRows = [];

    const infoText = document.createElement('p');
    infoText.style.cssText = 'margin: 0; font-size: 12px; color: #555;';
    infoText.innerText = 'Found: ' + 0 + ' rows';

    textarea.addEventListener('blur', () => {
      const rawText = textarea.value;
      if (!rawText.trim()) {
        gridContainer.innerHTML = '<div style="padding: 15px; color: #888; text-align: center;">Pasted cells will appear here as a spreadsheet column...</div>';
        parsedColumn = [];
        foundRows = [];
        infoText.innerText = 'Found: ' + 0 + ' rows';
        return;
      }

      parsedColumn = parseSingleColumnText(rawText);
      foundRows = findRelevantRows(parsedColumn);

      // Build spreadsheet visual grid preview
      let html = `
                <table style="border-collapse: collapse; width: 100%; font-size: 13px; text-align: left;">
                    <thead>
                        <tr style="background: #f1f3f4; color: #444; border-bottom: 2px solid #ccc;">
                            <th style="width: 50px; padding: 6px; border-right: 1px solid #ddd; text-align: center; font-weight: 600;">#</th>
                            <th style="padding: 6px; font-weight: 600;">Column Data (1D Array - ${parsedColumn.length} rows)</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

      parsedColumn.forEach((val, index) => {
        const rowBg = index % 2 === 0 ? '#ffffff' : '#f9fbfd';
        html += `
                    <tr class="acb-row" style="background: ${rowBg}; border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 6px; border-right: 1px solid #e0e0e0; text-align: center; background: #f8f9fa; color: #666; font-size: 11px; font-weight: bold;">${index + 1}</td>
                        <td style="padding: 6px; font-family: monospace; color: #111; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 350px;">${escapeHtml(val)}</td>
                    </tr>
                `;
      });

      html += '</tbody></table>';
      gridContainer.innerHTML = html;
      infoText.innerText = 'Found: ' + foundRows.length + ' rows';
    });

    const footerGroup = document.createElement('div');
    footerGroup.style.cssText = 'display: flex; justify-content: space-between; gap: 10px; margin-top: 5px;';

    const infoTextGroup = document.createElement('div');
    infoTextGroup.style.cssText = 'color: #555; font-size: 12px; display: flex; align-items: center;';

    const buttonGroup = document.createElement('div');
    buttonGroup.style.cssText = 'display: flex; justify-content: flex-end; gap: 10px;';


    const runBtn = document.createElement('button');
    runBtn.innerText = 'Run Action on Column';
    runBtn.style.cssText = 'padding: 8px 16px; background: #1a73e8; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;';
    runBtn.onclick = () => {
      if (parsedColumn.length === 0) {
        alert("Please paste a valid column of text first.");
        return;
      }

      console.log("Strict 1D Array Output:", parsedColumn);
      const clickCount = clickCheckboxes(parsedColumn);
      document.body.removeChild(modal);
      alert(`Clicked ${clickCount} checkboxes`);
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.innerText = 'Cancel';
    cancelBtn.style.cssText = 'padding: 8px 16px; background: #f1f3f4; color: #333; border: 1px solid #dadce0; border-radius: 4px; cursor: pointer;';
    cancelBtn.onclick = () => document.body.removeChild(modal);

    infoTextGroup.appendChild(infoText);

    buttonGroup.appendChild(cancelBtn);
    buttonGroup.appendChild(runBtn);


    footerGroup.appendChild(infoTextGroup);
    footerGroup.appendChild(buttonGroup);

    dialog.appendChild(title);
    dialog.appendChild(textarea);
    dialog.appendChild(gridContainer);
    dialog.appendChild(footerGroup);
    modal.appendChild(dialog);
    document.body.appendChild(modal);
  }

  if (typeof GM_info !== 'undefined') {
    GM_registerMenuCommand("Import Codes", main);
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { parseSingleColumnText };
  }
})();
