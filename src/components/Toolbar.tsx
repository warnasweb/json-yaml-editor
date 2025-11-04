"use client";

import { type ChangeEvent, useRef } from "react";

interface ToolbarProps {
  onUploadFile: (file: File) => void;
  onValidate: () => void;
  onConvert: () => void;
  onDownloadRight: () => void;
  isConvertDisabled?: boolean;
  isDownloadDisabled?: boolean;
  statusMessage?: string | null;
  statusTone?: "success" | "error" | null;
}

/**
 * Top-level toolbar with the application title, file controls, and status.
 */
export default function Toolbar({
  onUploadFile,
  onValidate,
  onConvert,
  onDownloadRight,
  isConvertDisabled = false,
  isDownloadDisabled = false,
  statusMessage,
  statusTone = null,
}: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const [file] = event.target.files ?? [];
    if (file) {
      onUploadFile(file);
      event.target.value = "";
    }
  };

  const statusColors =
    statusTone === "success"
      ? "text-emerald-300"
      : statusTone === "error"
        ? "text-rose-300"
        : "text-slate-400";

  return (
    <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/95 px-6 py-4 backdrop-blur">
      <div className="flex items-center gap-4">
        <h1 className="text-base font-semibold text-slate-100">
          🧩 JSON–YAML Editor by RK
        </h1>
        <span className={`text-xs font-medium ${statusColors}`}>
          {statusMessage ?? "Ready"}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.yaml,.yml"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          className="rounded-md border border-slate-700 px-4 py-2 text-xs font-medium uppercase tracking-wide text-slate-200 transition hover:border-indigo-400 hover:text-indigo-300"
          onClick={triggerFilePicker}
        >
          Upload
        </button>
        <button
          type="button"
          className="rounded-md border border-slate-700 px-4 py-2 text-xs font-medium uppercase tracking-wide text-slate-200 transition hover:border-indigo-400 hover:text-indigo-300"
          onClick={onValidate}
        >
          Validate
        </button>
        <button
          type="button"
          className="rounded-md border border-slate-700 px-4 py-2 text-xs font-medium uppercase tracking-wide text-slate-200 transition hover:border-indigo-400 hover:text-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onConvert}
          disabled={isConvertDisabled}
        >
          Convert
        </button>
        <button
          type="button"
          className="rounded-md border border-slate-700 px-4 py-2 text-xs font-medium uppercase tracking-wide text-slate-200 transition hover:border-indigo-400 hover:text-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onDownloadRight}
          disabled={isDownloadDisabled}
        >
          Download
        </button>
      </div>
    </div>
  );
}
