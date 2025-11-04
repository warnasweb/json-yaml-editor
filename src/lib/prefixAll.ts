import { prefix } from "inline-style-prefixer";

export type StyleObject = Record<string, unknown>;

/**
 * Mirrors the legacy `inline-style-prefixer/static` export expected by
 * `react-split-pane-next`. We clone the provided style object and run the
 * package's dynamic prefixer on it to produce vendor-prefixed styles.
 */
export default function prefixAll(style: StyleObject): StyleObject {
  return prefix(cloneStyle(style));
}

function cloneStyle(style: StyleObject): StyleObject {
  return Object.entries(style).reduce<StyleObject>((acc, [key, value]) => {
    if (Array.isArray(value)) {
      acc[key] = value.map((item) =>
        isStyleObject(item) ? cloneStyle(item) : item,
      );
    } else if (isStyleObject(value)) {
      acc[key] = cloneStyle(value);
    } else {
      acc[key] = value;
    }

    return acc;
  }, {});
}

function isStyleObject(value: unknown): value is StyleObject {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}
