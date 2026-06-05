(function () {
  const dropZone = document.getElementById("drop-zone");
  const fileInput = document.getElementById("file-input");
  const browseLink = document.getElementById("browse-link");
  const pasteArea = document.getElementById("paste-area");
  const renderBtn = document.getElementById("render-btn");
  const status = document.getElementById("status");

  // ── File drag-and-drop ──────────────────────────────────────────────────────

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("drag-over");
  });

  dropZone.addEventListener("dragleave", () => dropZone.classList.remove("drag-over"));

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  });

  browseLink.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => {
    if (fileInput.files[0]) loadFile(fileInput.files[0]);
  });

  // ── Render button (for pasted content) ─────────────────────────────────────

  renderBtn.addEventListener("click", () => {
    const text = pasteArea.value.trim();
    if (!text) {
      showStatus("Paste some markdown first.", true);
      return;
    }
    openViewer(text, "pasted.md");
  });

  pasteArea.addEventListener("input", () => {
    showStatus("");
  });

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function loadFile(file) {
    if (!isMarkdownFile(file)) {
      showStatus("Please drop a .md / .markdown file.", true);
      return;
    }
    showStatus("Reading file…");
    const reader = new FileReader();
    reader.onload = (e) => {
      pasteArea.value = e.target.result;
      showStatus(`Loaded: ${file.name}`);
      openViewer(e.target.result, file.name);
    };
    reader.onerror = () => showStatus("Failed to read file.", true);
    reader.readAsText(file);
  }

  function openViewer(markdown, filename) {
    // Encode markdown as base64 to pass via URL query param
    const encoded = btoa(encodeURIComponent(markdown));
    const viewerURL =
      chrome.runtime.getURL("viewer.html") +
      "?src=" + encoded +
      "&name=" + encodeURIComponent(filename);
    chrome.tabs.create({ url: viewerURL });
    window.close();
  }

  function isMarkdownFile(file) {
    const name = file.name.toLowerCase();
    return (
      name.endsWith(".md") ||
      name.endsWith(".markdown") ||
      name.endsWith(".mdown") ||
      name.endsWith(".mkd") ||
      file.type === "text/markdown" ||
      file.type === "text/plain"
    );
  }

  function showStatus(msg, isError = false) {
    status.textContent = msg;
    status.className = isError ? "error" : "";
  }
})();
