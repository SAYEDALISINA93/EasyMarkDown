import { useState, useEffect, useCallback } from "react";
import { renderMarkdown, decodeMarkdown } from "../shared/markdown";
import Toolbar from "./Toolbar";

export default function Viewer() {
  const [rawSource, setRawSource] = useState("");
  const [filename, setFilename] = useState("document.md");
  const [renderedHtml, setRenderedHtml] = useState("");
  const [showRaw, setShowRaw] = useState(false);
  const [copyLabel, setCopyLabel] = useState("Copy");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("src");
    const name = params.get("name") || "document.md";

    if (encoded) {
      const decoded = decodeMarkdown(encoded);
      setRawSource(decoded);
      setFilename(name);
      document.title = `${name} — EasyMarkDown`;
      setRenderedHtml(renderMarkdown(decoded));
    }
  }, []);

  // Open external links in new tab after HTML renders
  useEffect(() => {
    document
      .querySelectorAll<HTMLAnchorElement>("#emd-content a[href]")
      .forEach((a) => {
        if (a.href.startsWith("http")) a.setAttribute("target", "_blank");
      });
  }, [renderedHtml]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(rawSource).then(() => {
      setCopyLabel("Copied!");
      setTimeout(() => setCopyLabel("Copy"), 2000);
    });
  }, [rawSource]);

  const handlePrint = useCallback(() => window.print(), []);

  return (
    <>
      <Toolbar
        filename={filename}
        showRaw={showRaw}
        copyLabel={copyLabel}
        onToggleRaw={() => setShowRaw((v) => !v)}
        onCopy={handleCopy}
        onPrint={handlePrint}
      />

      <div id="emd-container" style={{ display: showRaw ? "none" : undefined }}>
        <article
          id="emd-content"
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      </div>

      {showRaw && (
        <div id="emd-raw-view">
          <pre id="emd-raw-pre">{rawSource}</pre>
        </div>
      )}
    </>
  );
}
