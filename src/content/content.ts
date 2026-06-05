import { marked } from "marked";
import { isMarkdownFile } from "../shared/markdown";

(function () {
  const url = window.location.href;
  const filename = decodeURIComponent(url.split("/").pop() ?? "");

  if (!isMarkdownFile(filename)) return;

  const raw = document.body.innerText || document.documentElement.innerText;
  if (!raw) return;

  marked.setOptions({ gfm: true, breaks: false });
  const html = marked.parse(raw) as string;

  document.documentElement.innerHTML = buildPage(filename, html);

  const rawSource = raw;
  let showingRaw = false;

  document.getElementById("emd-raw-btn")?.addEventListener("click", () => {
    showingRaw = !showingRaw;
    const container = document.getElementById("emd-container");
    const rawView = document.getElementById("emd-raw-view");
    const rawPre = document.getElementById("emd-raw-pre");
    const btn = document.getElementById("emd-raw-btn");
    if (!container || !rawView || !rawPre || !btn) return;

    container.style.display = showingRaw ? "none" : "";
    rawView.style.display = showingRaw ? "block" : "none";
    btn.textContent = showingRaw ? "Rendered" : "Raw";
    if (showingRaw) rawPre.textContent = rawSource;
  });

  document.getElementById("emd-copy-btn")?.addEventListener("click", () => {
    navigator.clipboard.writeText(rawSource).then(() => {
      const btn = document.getElementById("emd-copy-btn")!;
      btn.textContent = "Copied!";
      setTimeout(() => (btn.textContent = "Copy"), 2000);
    });
  });

  document.getElementById("emd-print-btn")?.addEventListener("click", () => window.print());

  document
    .querySelectorAll<HTMLAnchorElement>("#emd-content a[href]")
    .forEach((a) => {
      if (a.href.startsWith("http")) a.setAttribute("target", "_blank");
    });

  function esc(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function buildPage(name: string, bodyHtml: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(name)}</title>
  <style>${pageCSS()}</style>
</head>
<body>
  <div id="emd-toolbar">
    <span id="emd-logo">&#9634; EasyMarkDown</span>
    <span id="emd-filename">${esc(name)}</span>
    <button id="emd-raw-btn">Raw</button>
    <button id="emd-copy-btn">Copy</button>
    <button id="emd-print-btn">Print</button>
  </div>
  <div id="emd-container">
    <article id="emd-content" class="markdown-body">${bodyHtml}</article>
  </div>
  <div id="emd-raw-view" style="display:none">
    <pre id="emd-raw-pre"></pre>
  </div>
</body>
</html>`;
  }

  function pageCSS(): string {
    return `
      @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Plus+Jakarta+Sans:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap");
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      :root {
        --font-ui:"Inter",sans-serif; --font-prose:"Lora",Georgia,serif;
        --font-heading:"Plus Jakarta Sans","Inter",sans-serif; --font-mono:"JetBrains Mono",Consolas,monospace;
        --bg:#ffffff; --surface:#f6f8fa; --surface-inset:#eaeef2; --border:#d0d7de;
        --text:#1f2328; --text-muted:#636c76; --accent:#0969da; --accent-hover:#0550ae;
        --code-bg:#f6f8fa; --link:#0969da; --blockquote-border:#0969da; --blockquote-bg:#f0f6ff;
        --toolbar-bg:#24292f; --toolbar-text:#f0f6fc;
      }
      body { background: var(--bg); color: var(--text); font-family: var(--font-ui); font-size: 16px; line-height: 1.6; -webkit-font-smoothing: antialiased; }
      #emd-toolbar { position: sticky; top: 0; z-index: 100; display: flex; align-items: center; gap: 12px; padding: 10px 24px; background: var(--toolbar-bg); color: var(--toolbar-text); border-bottom: 1px solid rgba(255,255,255,.08); font-family: var(--font-ui); font-size: 13px; -webkit-font-smoothing: antialiased; }
      #emd-logo { font-family: var(--font-heading); font-weight: 800; font-size: 14px; letter-spacing: -0.03em; color: #79b8ff; white-space: nowrap; }
      #emd-filename { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #9ba8b5; font-family: var(--font-mono); font-size: 11.5px; }
      #emd-toolbar button { padding: 4px 12px; border: 1px solid rgba(255,255,255,.2); border-radius: 6px; background: transparent; color: var(--toolbar-text); cursor: pointer; font-family: var(--font-ui); font-size: 12px; font-weight: 500; transition: background .15s; }
      #emd-toolbar button:hover { background: rgba(255,255,255,.12); }
      #emd-container { max-width: 860px; margin: 0 auto; padding: 40px 24px 80px; }
      #emd-raw-view { max-width: 860px; margin: 0 auto; padding: 40px 24px 80px; }
      #emd-raw-pre { white-space: pre-wrap; word-break: break-word; font-family: var(--font-mono); font-size: 13.5px; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 22px; line-height: 1.65; }
      .markdown-body { font-family: var(--font-prose); font-size: 17px; line-height: 1.8; }
      .markdown-body h1,.markdown-body h2,.markdown-body h3,.markdown-body h4 { font-family: var(--font-heading); margin: 1.6em 0 .5em; letter-spacing: -0.02em; line-height: 1.25; color: var(--text); }
      .markdown-body h1 { font-size: 2.2em; font-weight: 800; padding-bottom: .3em; border-bottom: 1px solid var(--border); }
      .markdown-body h2 { font-size: 1.65em; font-weight: 700; padding-bottom: .3em; border-bottom: 1px solid var(--border); }
      .markdown-body h3 { font-size: 1.35em; font-weight: 700; }
      .markdown-body p { margin: .9em 0; }
      .markdown-body a { color: var(--link); text-decoration: none; font-style: italic; }
      .markdown-body a:hover { text-decoration: underline; text-underline-offset: 3px; }
      .markdown-body ul,.markdown-body ol { font-family: var(--font-prose); padding-left: 2em; margin: .9em 0; }
      .markdown-body li { margin: .4em 0; }
      .markdown-body blockquote { font-family: var(--font-prose); font-style: italic; font-size: 1.05em; margin: 1.2em 0; padding: .5em 1.2em; border-left: 4px solid var(--blockquote-border); background: var(--blockquote-bg); border-radius: 0 6px 6px 0; color: var(--text-muted); }
      .markdown-body code { font-family: var(--font-mono); font-size: .84em; font-weight: 500; background: var(--code-bg); border: 1px solid var(--border); border-radius: 4px; padding: .15em .45em; }
      .markdown-body pre { font-family: var(--font-mono); background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 18px 20px; overflow-x: auto; margin: 1.2em 0; }
      .markdown-body pre code { background: none; border: none; padding: 0; font-size: 13.5px; font-weight: 400; }
      .markdown-body table { font-family: var(--font-ui); width: 100%; border-collapse: collapse; margin: 1.2em 0; font-size: .93em; }
      .markdown-body th,.markdown-body td { border: 1px solid var(--border); padding: 9px 14px; }
      .markdown-body th { font-family: var(--font-heading); font-weight: 700; background: var(--surface); }
      .markdown-body tr:nth-child(even) { background: var(--surface-inset); }
      .markdown-body img { max-width: 100%; border-radius: 8px; }
      .markdown-body hr { border: none; border-top: 1px solid var(--border); margin: 2.2em 0; }
      @media print { #emd-toolbar { display: none; } body { background:#fff; color:#1f2328; } }
    `;
  }
})();
