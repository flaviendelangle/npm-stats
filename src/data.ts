export type Precision = "day" | "week" | "month";

export type PrecisionModel = "sum" | "movingAverage";

export type DateRange =
  | "last-five-years"
  | "last-two-years"
  | "last-year"
  | "last-six-months"
  | "last-month";

export const PRESETS = [
  "Company packages",
  "Company free packages",
  "Company commercial packages",
  "MUI packages",
  "Base UI packages",
  "MUI X packages",
  "MUI pro packages",
  "MUI premium packages",
  "Free data grids",
  "Paying data grids",
  "Free pickers",
] as const;

export type PackagePreset = (typeof PRESETS)[number];

export type PackageCategory =
  | "MUI Core"
  | "MUI XGrid"
  | "MUI eXplore"
  | "Base UI Core"
  | "XGrid competitors"
  | "eXplore competitors"
  | "Others";

export interface PackageOption {
  name: string;
  category: PackageCategory;
  presets?: PackagePreset[];
  /**
   * @default [name]
   */
  packageNames?: string[];
}

export const getPackageNameFromOption = (option: PackageOption | string) =>
  typeof option === "string" ? option : option.name;

export const PACKAGES: PackageOption[] = [
  // MUI Core
  {
    name: "@mui/material",
    category: "MUI Core",
    presets: ["Company packages", "MUI packages", "Company free packages"],
    packageNames: ["@mui/material", "@material-ui/core"],
  },
  {
    name: "@mui/joy",
    category: "MUI Core",
    presets: ["Company packages", "MUI packages", "Company free packages"],
  },
  {
    name: "@mui/lab",
    category: "MUI Core",
    presets: ["MUI packages", "Company free packages"],
    packageNames: ["Company packages", "@mui/lab", "@material-ui/lab"],
  },

  // Base UI
  {
    name: "@base-ui/react",
    category: "Base UI Core",
    presets: ["Company packages", "Base UI packages"],
    packageNames: ["@base-ui/react", "@base-ui-components/react"],
  },

  // Pigment CSS
  {
    name: "@pigment-css/react",
    category: "MUI Core",
    presets: ["Company packages", "MUI packages", "Company free packages"],
  },

  // MUI XGrid
  {
    name: "@mui/x-data-grid",
    category: "MUI XGrid",
    presets: [
      "Company packages",
      "MUI X packages",
      "Free data grids",
      "MUI packages",
      "Company free packages",
    ],
    packageNames: ["@mui/x-data-grid", "@material-ui/data-grid"],
  },
  {
    name: "@mui/x-data-grid-pro",
    category: "MUI XGrid",
    presets: [
      "Company packages",
      "MUI X packages",
      "Paying data grids",
      "MUI packages",
      "Company commercial packages",
      "MUI pro packages",
    ],
    packageNames: ["@mui/x-data-grid-pro", "@material-ui/x-grid"],
  },
  {
    name: "@mui/x-data-grid-premium",
    category: "MUI XGrid",
    presets: [
      "Company packages",
      "MUI X packages",
      "Paying data grids",
      "MUI packages",
      "Company commercial packages",
      "MUI premium packages",
    ],
  },

  // MUI xCharts
  {
    name: "@mui/x-charts",
    category: "MUI eXplore",
    presets: [
      "Company packages",
      "MUI X packages",
      "MUI packages",
      "Company free packages",
    ],
  },
  {
    name: "@mui/x-charts-pro",
    category: "MUI eXplore",
    presets: [
      "Company packages",
      "MUI X packages",
      "MUI packages",
      "Company commercial packages",
      "MUI pro packages",
    ],
  },

  // MUI eXplore
  {
    name: "@mui/x-date-pickers",
    category: "MUI eXplore",
    presets: [
      "Company packages",
      "MUI X packages",
      "Free pickers",
      "MUI packages",
      "Company free packages",
    ],
  },
  {
    name: "@mui/x-date-pickers-pro",
    category: "MUI eXplore",
    presets: [
      "Company packages",
      "MUI X packages",
      "MUI packages",
      "Company commercial packages",
      "MUI pro packages",
    ],
  },
  {
    name: "@mui/x-tree-view",
    category: "MUI eXplore",
    presets: [
      "Company packages",
      "MUI X packages",
      "MUI packages",
      "Company free packages",
    ],
  },
  {
    name: "@mui/x-tree-view-pro",
    category: "MUI eXplore",
    presets: [
      "Company packages",
      "MUI X packages",
      "MUI packages",
      "Company commercial packages",
      "MUI pro packages",
    ],
  },

  // XGrid competitors
  {
    name: "TanStack Table",
    category: "XGrid competitors",
    presets: ["Free data grids"],
    packageNames: ["@tanstack/react-table", "react-table"],
  },
  {
    name: "material-table",
    category: "XGrid competitors",
    presets: ["Free data grids"],
  },
  {
    name: "react-data-table-component",
    category: "XGrid competitors",
    presets: ["Free data grids"],
  },
  {
    name: "ag-grid-community",
    category: "XGrid competitors",
    presets: ["Free data grids"],
  },
  {
    name: "datatables.net",
    category: "XGrid competitors",
    presets: ["Free data grids"],
  },
  {
    name: "ag-grid-enterprise",
    category: "XGrid competitors",
    presets: ["Paying data grids"],
  },
  {
    name: "handsontable",
    category: "XGrid competitors",
    presets: ["Paying data grids"],
  },
  {
    name: "@devexpress/dx-react-grid",
    category: "XGrid competitors",
    presets: ["Paying data grids"],
  },
  {
    name: "@progress/kendo-react-grid",
    category: "XGrid competitors",
    presets: ["Paying data grids"],
  },
  {
    name: "@syncfusion/ej2-grids",
    category: "XGrid competitors",
    presets: ["Paying data grids"],
  },
  {
    name: "@devexpress/dx-react-grid",
    category: "XGrid competitors",
    presets: ["Paying data grids"],
  },

  // eXplore competitors
  {
    name: "react-day-picker",
    category: "eXplore competitors",
    presets: ["Free pickers"],
  },
  {
    name: "react-date-picker",
    category: "eXplore competitors",
    presets: ["Free pickers"],
  },
  {
    name: "react-calendar",
    category: "eXplore competitors",
    presets: ["Free pickers"],
  },
  {
    name: "react-datetime",
    category: "eXplore competitors",
    presets: ["Free pickers"],
  },
  {
    name: "flatpickr",
    category: "eXplore competitors",
    presets: ["Free pickers"],
  },
  {
    name: "react-dates",
    category: "eXplore competitors",
    presets: ["Free pickers"],
  },
  {
    name: "@react-spectrum/datepicker",
    category: "eXplore competitors",
    presets: ["Free pickers"],
  },
  {
    name: "@material-ui/pickers",
    category: "eXplore competitors",
    presets: ["Free pickers"],
  },
  {
    name: "react-datepicker",
    category: "eXplore competitors",
    presets: ["Free pickers"],
  },

  // Others
  { name: "react-dom", category: "Others" },

  // Summed packages
  {
    name: "MUI-based pickers",
    category: "Others",
    packageNames: ["@mui/x-date-pickers", "@material-ui/pickers"],
  },
];
