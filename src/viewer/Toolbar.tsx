interface ToolbarProps {
  filename: string;
  showRaw: boolean;
  copyLabel: string;
  onToggleRaw: () => void;
  onCopy: () => void;
  onPrint: () => void;
}

export default function Toolbar({
  filename,
  showRaw,
  copyLabel,
  onToggleRaw,
  onCopy,
  onPrint,
}: ToolbarProps) {
  return (
    <div id="emd-toolbar">
      <span id="emd-logo">&#9634; EasyMarkDown</span>
      <span id="emd-filename">{filename}</span>
      <button onClick={onToggleRaw} title="Toggle raw source">
        {showRaw ? "Rendered" : "Raw"}
      </button>
      <button onClick={onCopy} title="Copy raw markdown">
        {copyLabel}
      </button>
      <button onClick={onPrint} title="Print">
        Print
      </button>
    </div>
  );
}
