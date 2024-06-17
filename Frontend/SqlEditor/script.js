function saveSelection(containerEl) {
  let range = window.getSelection().getRangeAt(0);
  let preRange = range.cloneRange();
  preRange.selectNodeContents(containerEl);
  preRange.setEnd(range.startContainer, range.startOffset);
  let start = preRange.toString().length;

  return {
    start: start,
    end: start + range.toString().length,
  };
}

function restoreSelection(containerEl, savedSel) {
  let range = document.createRange();
  let sel = window.getSelection();
  range.setStart(containerEl, 0);
  range.collapse(true);

  let charIndex = 0,
    nodeStack = [containerEl],
    node,
    foundStart = false,
    stop = false;

  while (!stop && (node = nodeStack.pop())) {
    if (node.nodeType == 3) {
      let nextCharIndex = charIndex + node.length;
      if (
        !foundStart &&
        savedSel.start >= charIndex &&
        savedSel.start <= nextCharIndex
      ) {
        range.setStart(node, savedSel.start - charIndex);
        foundStart = true;
      }
      if (
        foundStart &&
        savedSel.end >= charIndex &&
        savedSel.end <= nextCharIndex
      ) {
        range.setEnd(node, savedSel.end - charIndex);
        stop = true;
      }
      charIndex = nextCharIndex;
    } else {
      for (let i = node.childNodes.length - 1; i >= 0; i--) {
        nodeStack.push(node.childNodes[i]);
      }
    }
  }

  sel.removeAllRanges();
  sel.addRange(range);
}

function escapeHtml(text) {
  var map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
}

function writeOnSqlEditor(e) {
  var sqlEditor = document.getElementById("sql-editor");

    sqlEditor.removeAttribute("data-highlighted");
    
    var savedSel = saveSelection(sqlEditor);

    var code = sqlEditor.textContent;
    var escapedCode = escapeHtml(code);

    sqlEditor.innerHTML = escapedCode;

    hljs.highlightElement(sqlEditor);

    restoreSelection(sqlEditor, savedSel);
}
