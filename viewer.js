(function () {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("src");

  let rawSource = "";

  if (encoded) {
    try {
      rawSource = decodeURIComponent(atob(encoded));
    } catch (_) {
      rawSource = decodeURIComponent(encoded);
    }
    const filename = params.get("name") || "document.md";
    render(rawSource, filename);
  }

  function render(markdown, filename) {
    document.title = filename + " — EasyMarkDown";
    document.getElementById("emd-filename").textContent = filename;

    const html = marked.parse(markdown);
    document.getElementById("emd-content").innerHTML = html;

    // Open external links in new tab
    document.querySelectorAll("#emd-content a[href]").forEach((a) => {
      if (a.href.startsWith("http")) a.setAttribute("target", "_blank");
    });
  }

  // Toolbar: Raw toggle
  let showingRaw = false;
  document.getElementById("emd-raw-btn").addEventListener("click", () => {
    showingRaw = !showingRaw;
    document.getElementById("emd-container").style.display = showingRaw ? "none" : "";
    document.getElementById("emd-raw-view").style.display = showingRaw ? "block" : "none";
    document.getElementById("emd-raw-btn").textContent = showingRaw ? "Rendered" : "Raw";
    if (showingRaw) {
      document.getElementById("emd-raw-pre").textContent = rawSource;
    }
  });

  // Toolbar: Copy
  document.getElementById("emd-copy-btn").addEventListener("click", () => {
    navigator.clipboard.writeText(rawSource).then(() => {
      const btn = document.getElementById("emd-copy-btn");
      btn.textContent = "Copied!";
      setTimeout(() => (btn.textContent = "Copy"), 2000);
    });
  });

  // Toolbar: Print
  document.getElementById("emd-print-btn").addEventListener("click", () => window.print());
})();
