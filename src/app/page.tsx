"use client";

import { useCallback, useMemo, useState } from "react";
import SplitPane from "react-split-pane-next";
import yaml from "js-yaml";

import EditorPane from "@/components/EditorPane";
import JsonPreview from "@/components/JsonPreview";
import Toolbar from "@/components/Toolbar";

const INITIAL_YAML = `name: Json-Yaml Editor
version: 1.0.0
description: A synchronized editor for JSON and YAML content.
features:
  - Two-way editing
  - Real-time validation
`;

type DataFormat = "yaml" | "json";

/**
 * Home page renders the split-pane editor and orchestrates conversions.
 */
export default function Home() {
  const initialJson = useMemo(() => {
    try {
      const parsed = yaml.load(INITIAL_YAML) ?? {};
      return JSON.stringify(parsed, null, 2);
    } catch {
      return "";
    }
  }, []);

  const [sourceFormat, setSourceFormat] = useState<DataFormat>("yaml");
  const [targetFormat, setTargetFormat] = useState<DataFormat>("json");
  const [sourceText, setSourceText] = useState<string>(INITIAL_YAML);
  const [targetText, setTargetText] = useState<string>(initialJson);
  const [sourceError, setSourceError] = useState<string | null>(null);
  const [targetError, setTargetError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"success" | "error" | null>(null);

  // Helper to trigger client-side downloads for the toolbar actions.
  const downloadFile = useCallback((filename: string, contents: string) => {
    const blob = new Blob([contents], { type: "text/plain;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(href);
  }, []);

  const resetTarget = useCallback(
    (format: DataFormat) => {
      setTargetFormat(format);
      setTargetText("");
      setTargetError(null);
    },
    [setTargetFormat],
  );

  const validateSource = useCallback(
    (text: string, format: DataFormat) => {
      if (!text.trim()) {
        setSourceError("No content to validate.");
        return false;
      }

      try {
        if (format === "yaml") {
          yaml.load(text);
        } else {
          JSON.parse(text);
        }
        setSourceError(null);
        return true;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setSourceError(message);
        return false;
      }
    },
    [],
  );

  const validateTarget = useCallback(
    (text: string, format: DataFormat) => {
      if (!text.trim()) {
        setTargetError(null);
        return true;
      }

      try {
        if (format === "yaml") {
          yaml.load(text);
        } else {
          JSON.parse(text);
        }
        setTargetError(null);
        return true;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setTargetError(message);
        return false;
      }
    },
    [],
  );

  const handleSourceChange = useCallback(
    (nextValue: string) => {
      setSourceText(nextValue);
      setStatusMessage(null);
      setStatusTone(null);
      validateSource(nextValue, sourceFormat);
    },
    [sourceFormat, validateSource],
  );

  const handleTargetChange = useCallback(
    (nextValue: string) => {
      setTargetText(nextValue);
      setStatusMessage(null);
      setStatusTone(null);
      validateTarget(nextValue, targetFormat);
    },
    [targetFormat, validateTarget],
  );

  const handleManualValidate = useCallback(() => {
    const sourceValid = validateSource(sourceText, sourceFormat);
    const targetValid = validateTarget(targetText, targetFormat);

    if (sourceValid && targetValid) {
      setStatusMessage("Validation succeeded");
      setStatusTone("success");
    } else {
      setStatusMessage("Validation failed – check errors below");
      setStatusTone("error");
    }
  }, [
    sourceFormat,
    sourceText,
    targetFormat,
    targetText,
    validateSource,
    validateTarget,
  ]);

  const handleManualConvert = useCallback(() => {
    const sourceValid = validateSource(sourceText, sourceFormat);
    if (!sourceValid) {
      setStatusMessage("Resolve source errors before converting.");
      setStatusTone("error");
      return;
    }

    try {
      if (sourceFormat === "yaml") {
        const parsed = yaml.load(sourceText) ?? {};
        const nextJson = JSON.stringify(parsed, null, 2);
        setTargetFormat("json");
        setTargetText(nextJson);
        setTargetError(null);
        setStatusMessage("Converted YAML to JSON");
        setStatusTone("success");
      } else {
        const parsed = JSON.parse(sourceText);
        const nextYaml = yaml
          .dump(parsed, {
            lineWidth: 80,
            noRefs: true,
          })
          .trimEnd();
        setTargetFormat("yaml");
        setTargetText(nextYaml.length ? `${nextYaml}\n` : nextYaml);
        setTargetError(null);
        setStatusMessage("Converted JSON to YAML");
        setStatusTone("success");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setStatusMessage(message);
      setStatusTone("error");
    }
  }, [sourceFormat, sourceText, validateSource]);

  const deduceFormat = useCallback((name: string, contents: string) => {
    const extension = name.split(".").pop()?.toLowerCase();
    if (extension === "json") return "json";
    if (extension === "yaml" || extension === "yml") return "yaml";

    try {
      JSON.parse(contents);
      return "json";
    } catch {
      try {
        yaml.load(contents);
        return "yaml";
      } catch {
        return null;
      }
    }
  }, []);

  const handleFileUpload = useCallback(
    async (file: File) => {
      try {
        const text = await file.text();
        const detectedFormat = deduceFormat(file.name, text);

        if (!detectedFormat) {
          setStatusMessage("Unsupported file type. Please upload YAML or JSON.");
          setStatusTone("error");
          return;
        }

        if (detectedFormat === "yaml") {
          const normalized = text.endsWith("\n") ? text : `${text}\n`;
          try {
            yaml.load(normalized);
            setSourceError(null);
            setStatusMessage(`Loaded YAML file "${file.name}"`);
            setStatusTone("success");
          } catch (error) {
            const message =
              error instanceof Error ? error.message : String(error);
            setSourceError(message);
            setStatusMessage(`YAML parse error: ${message}`);
            setStatusTone("error");
          }
          setSourceFormat("yaml");
          setSourceText(normalized);
          resetTarget("json");
        } else {
          try {
            const parsed = JSON.parse(text);
            const formattedJson = JSON.stringify(parsed, null, 2);
            setSourceFormat("json");
            setSourceText(formattedJson);
            setSourceError(null);
            resetTarget("yaml");
            setStatusMessage(`Loaded JSON file "${file.name}"`);
            setStatusTone("success");
          } catch (error) {
            const message =
              error instanceof Error ? error.message : String(error);
            setSourceFormat("json");
            setSourceText(text);
            setSourceError(message);
            resetTarget("yaml");
            setStatusMessage(`JSON parse error: ${message}`);
            setStatusTone("error");
          }
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setStatusMessage(`Failed to read file: ${message}`);
        setStatusTone("error");
      }
    },
    [deduceFormat, resetTarget],
  );

  const handleDownloadRight = useCallback(() => {
    if (!targetText.trim()) {
      setStatusMessage("Nothing to download yet.");
      setStatusTone("error");
      return;
    }

    if (targetError) {
      setStatusMessage("Resolve target errors before downloading.");
      setStatusTone("error");
      return;
    }

    const filename =
      targetFormat === "json" ? "document.json" : "document.yaml";
    downloadFile(filename, targetText);
    setStatusMessage(`Downloaded ${filename}`);
    setStatusTone("success");
  }, [downloadFile, targetError, targetFormat, targetText]);

  const isConvertDisabled = sourceText.trim().length === 0;
  const isDownloadDisabled =
    targetError !== null || targetText.trim().length === 0;

  return (
    <div className="flex h-screen min-h-screen flex-col bg-slate-950 text-slate-100">
      <Toolbar
        onUploadFile={handleFileUpload}
        onValidate={handleManualValidate}
        onConvert={handleManualConvert}
        onDownloadRight={handleDownloadRight}
        isConvertDisabled={isConvertDisabled}
        isDownloadDisabled={isDownloadDisabled}
        statusMessage={statusMessage}
        statusTone={statusTone}
      />

      <main className="flex flex-1 min-h-0 overflow-hidden px-6 pb-6">
        <SplitPane
          split="vertical"
          minSize={200}
          defaultSize="50%"
          className="split-pane-container"
          paneClassName="pane-content"
          resizerClassName="pane-resizer"
        >
          <EditorPane
            title={sourceFormat === "yaml" ? "YAML" : "JSON"}
            language={sourceFormat}
            value={sourceText}
            onChange={handleSourceChange}
            error={sourceError}
          />
          <JsonPreview
            title={targetFormat === "yaml" ? "YAML" : "JSON"}
            language={targetFormat}
            value={targetText}
            onChange={handleTargetChange}
            error={targetError}
          />
        </SplitPane>
      </main>

      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-4 text-center text-xs text-slate-400">
        © 2025 R5W Tech - Interactive Infographics.
      </footer>
    </div>
  );
}
