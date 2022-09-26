export type Precision = "day" | "week" | "month";

export const PRESETS = [
  "MUI packages",
  "MUI X packages",
  "MUI free packages",
  "MUI paying packages",
  "Free data grids",
  "Paying data grids",
  "Free pickers",
  "Paying pickers",
] as const;

export type PackagePreset = typeof PRESETS[number];

export type PackageCategory =
  | "MUI Core"
  | "MUI XGrid"
  | "MUI eXplore"
  | "XGrid competitors"
  | "eXplore competitors"
  | "Others";

export interface PackageOption {
  name: string;
  category: PackageCategory;
  presets?: PackagePreset[];
  oldPackageNames?: string[];
}

export const getPackageNameFromOption = (option: PackageOption | string) =>
  typeof option === "string" ? option : option.name;
