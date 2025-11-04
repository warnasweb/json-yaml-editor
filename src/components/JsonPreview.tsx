"use client";

import EditorPane, { type EditorPaneProps } from "./EditorPane";

export interface JsonPreviewProps
  extends Omit<EditorPaneProps, "language" | "title"> {
  language?: "yaml" | "json";
  title?: string;
}

/**
 * Editor pane wrapper with configurable title/language defaults to JSON.
 */
export default function JsonPreview({
  language = "json",
  title = "JSON",
  ...props
}: JsonPreviewProps) {
  return <EditorPane {...props} language={language} title={title} />;
}

