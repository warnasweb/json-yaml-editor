"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";

const MonacoEditor = dynamic(
  async () => {
    const mod = await import("@monaco-editor/react");
    return mod.default;
  },
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm text-slate-400">
        Loading editor…
      </div>
    ),
  },
) as unknown as typeof import("@monaco-editor/react").default;

export interface EditorPaneProps {
  title: string;
  language: "yaml" | "json";
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
}

/**
 * Renders a Monaco editor pane with a header and optional error footer.
 */
export default function EditorPane({
  title,
  language,
  value,
  onChange,
  error,
}: EditorPaneProps) {
  const handleEditorChange = useCallback(
    (nextValue: string | undefined) => {
      onChange(nextValue ?? "");
    },
    [onChange],
  );

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-slate-900/80 backdrop-blur">
      <header className="flex flex-shrink-0 items-center justify-between border-b border-slate-700 bg-slate-900 px-4 py-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-300">
          {title}
        </h2>
      </header>

      <div className="flex-1 min-h-0 overflow-hidden">
        <MonacoEditor
          height="100%"
          language={language}
          theme="vs-dark"
          value={value}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
          }}
        />
      </div>

      {error ? (
        <footer className="flex-shrink-0 border-t border-slate-700 bg-slate-950 px-4 py-2 text-xs text-rose-400">
          {error}
        </footer>
      ) : (
        <footer className="flex-shrink-0 border-t border-slate-800 bg-slate-950 px-4 py-2 text-xs text-slate-500">
          No syntax issues detected.
        </footer>
      )}
    </div>
  );
}
