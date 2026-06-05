import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../shared/theme.css";
import "../shared/MarkdownBody.css";
import "./Viewer.css";
import Viewer from "./Viewer";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Viewer />
  </StrictMode>
);
