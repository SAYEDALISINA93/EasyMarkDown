import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { encodeMarkdown, isMarkdownFile } from "../shared/markdown";

type StatusState = { message: string; isError: boolean };

export default function Popup() {
  const [pasteValue, setPasteValue] = useState("");
  const [status, setStatus] = useState<StatusState>({ message: "", isError: false });
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function showStatus(message: string, isError = false) {
    setStatus({ message, isError });
  }

  function openViewer(markdown: string, filename: string) {
    const encoded = encodeMarkdown(markdown);
    const viewerURL =
      chrome.runtime.getURL("viewer.html") +
      "?src=" +
      encoded +
      "&name=" +
      encodeURIComponent(filename);
    chrome.tabs.create({ url: viewerURL });
    window.close();
  }

  function loadFile(file: File) {
    if (!isMarkdownFile(file.name)) {
      showStatus("Please drop a .md / .markdown file.", true);
      return;
    }
    showStatus("Reading file…");
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setPasteValue(text);
      showStatus(`Loaded: ${file.name}`);
      openViewer(text, file.name);
    };
    reader.onerror = () => showStatus("Failed to read file.", true);
    reader.readAsText(file);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
  }

  function handleRender() {
    const text = pasteValue.trim();
    if (!text) {
      showStatus("Paste some markdown first.", true);
      return;
    }
    openViewer(text, "pasted.md");
  }

  return (
    <div className="popup">
      <header className="popup-header">
        <div className="logo-icon">M↓</div>
        <div>
          <h1 className="popup-title">EasyMarkDown</h1>
          <span className="popup-sub">Markdown viewer</span>
        </div>
      </header>

      <main className="popup-main">
        <div
          className={`drop-zone ${isDragOver ? "drag-over" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
        >
          <span className="drop-icon">📄</span>
          <span className="drop-title">Drop a Markdown file here</span>
          <span className="drop-sub">.md, .markdown, .mdown, .mkd</span>
          <button
            className="browse-link"
            onClick={() => fileInputRef.current?.click()}
          >
            or click to browse
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown,.mdown,.mkd,text/markdown,text/plain"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <div className="divider">or paste markdown</div>

        <textarea
          className="paste-area"
          placeholder={"# Hello World\nPaste your markdown here..."}
          spellCheck={false}
          value={pasteValue}
          onChange={(e) => {
            setPasteValue(e.target.value);
            showStatus("");
          }}
        />

        <button className="render-btn" onClick={handleRender}>
          Render
        </button>

        {status.message && (
          <p className={`status ${status.isError ? "error" : ""}`}>
            {status.message}
          </p>
        )}
      </main>
    </div>
  );
}
