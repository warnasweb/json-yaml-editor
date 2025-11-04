declare module "react-split-pane-next" {
  import type { ComponentType, ReactNode } from "react";

  export interface SplitPaneProps {
    split?: "vertical" | "horizontal";
    minSize?: number;
    maxSize?: number;
    defaultSize?: number | string;
    size?: number | string;
    allowResize?: boolean;
    onChange?: (size: number) => void;
    className?: string;
    paneClassName?: string;
    pane1ClassName?: string;
    pane2ClassName?: string;
    resizerClassName?: string;
    style?: React.CSSProperties;
    children: ReactNode;
  }

  const SplitPane: ComponentType<SplitPaneProps>;

  export default SplitPane;
}

declare module "inline-style-prefixer" {
  export type PrefixableStyle = Record<string, unknown>;

  export function prefix<T extends PrefixableStyle>(style: T): T;
  export function createPrefixer(options: {
    prefixMap: Record<string, string[]>;
    plugins: Array<(property: string, value: unknown, style: PrefixableStyle) => unknown>;
  }): (style: PrefixableStyle) => PrefixableStyle;
}

declare module "inline-style-prefixer/static" {
  import type { PrefixableStyle } from "inline-style-prefixer";

  export default function prefixAll<T extends PrefixableStyle>(
    style: T,
  ): T;
}
