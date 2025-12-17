export const PRESETS = [
  {
    group: 'Base UI products',
    presets: ['Base UI packages'],
  },
  {
    group: 'Material UI products',
    presets: ['MUI packages', 'MUI X packages', 'MUI pro packages', 'MUI premium packages'],
  },
  {
    group: 'MUI Company',
    presets: ['Company packages', 'Company free packages', 'Company commercial packages'],
  },
  {
    group: 'Competitors',
    presets: [
      'Free data grids',
      'Paying data grids',
      'Free pickers',
      'Headless libraries',
      'Free Charts libraries',
      'Paying Charts libraries',
    ],
  },
  {
    group: 'Others',
    presets: ['Date libraries', 'React'],
  },
] as const;

export type PackagePreset = (typeof PRESETS)[number]['presets'][number];

export interface PackageOption {
  name: string;
  presets?: PackagePreset[];
  /**
   * @default [name]
   */
  packageNames?: string[];
}

export const getPackageNameFromOption = (option: PackageOption | string) =>
  typeof option === 'string' ? option : option.name;

export const PACKAGES: PackageOption[] = [
  // MUI Core
  {
    name: '@mui/material',
    presets: ['Company packages', 'MUI packages', 'Company free packages'],
    packageNames: ['@mui/material', '@material-ui/core'],
  },
  {
    name: '@mui/joy',
    presets: ['Company packages', 'MUI packages', 'Company free packages'],
  },
  {
    name: '@mui/lab',
    presets: ['MUI packages', 'Company free packages'],
    packageNames: ['Company packages', '@mui/lab', '@material-ui/lab'],
  },

  // Base UI
  {
    name: '@base-ui/react',
    presets: ['Company packages', 'Base UI packages', 'Headless libraries'],
    packageNames: ['@base-ui/react', '@base-ui-components/react'],
  },
  {
    name: '@base-ui/utils',
    presets: ['Company packages', 'Base UI packages'],
    packageNames: ['@base-ui/utils', '@base-ui-components/utils'],
  },

  // Pigment CSS
  {
    name: '@pigment-css/react',
    presets: ['Company packages', 'MUI packages', 'Company free packages'],
  },

  // MUI XGrid
  {
    name: '@mui/x-data-grid',
    presets: [
      'Company packages',
      'MUI X packages',
      'Free data grids',
      'MUI packages',
      'Company free packages',
    ],
    packageNames: ['@mui/x-data-grid', '@material-ui/data-grid'],
  },
  {
    name: '@mui/x-data-grid-pro',
    presets: [
      'Company packages',
      'MUI X packages',
      'Paying data grids',
      'MUI packages',
      'Company commercial packages',
      'MUI pro packages',
    ],
    packageNames: ['@mui/x-data-grid-pro', '@material-ui/x-grid'],
  },
  {
    name: '@mui/x-data-grid-premium',
    presets: [
      'Company packages',
      'MUI X packages',
      'Paying data grids',
      'MUI packages',
      'Company commercial packages',
      'MUI premium packages',
    ],
  },

  // MUI xCharts
  {
    name: '@mui/x-charts',
    presets: [
      'Company packages',
      'MUI X packages',
      'MUI packages',
      'Company free packages',
      'Free Charts libraries',
    ],
  },
  {
    name: '@mui/x-charts-pro',
    presets: [
      'Company packages',
      'MUI X packages',
      'MUI packages',
      'Company commercial packages',
      'MUI pro packages',
      'Paying Charts libraries',
    ],
  },
  {
    name: '@mui/x-charts-premium',
    presets: [
      'Company packages',
      'MUI X packages',
      'MUI packages',
      'Company commercial packages',
      'MUI premium packages',
      'Paying Charts libraries',
    ],
  },

  // MUI eXplore
  {
    name: '@mui/x-date-pickers',
    presets: [
      'Company packages',
      'MUI X packages',
      'Free pickers',
      'MUI packages',
      'Company free packages',
    ],
  },
  {
    name: '@mui/x-date-pickers-pro',
    presets: [
      'Company packages',
      'MUI X packages',
      'MUI packages',
      'Company commercial packages',
      'MUI pro packages',
    ],
  },
  {
    name: '@mui/x-tree-view',
    presets: ['Company packages', 'MUI X packages', 'MUI packages', 'Company free packages'],
  },
  {
    name: '@mui/x-tree-view-pro',
    presets: [
      'Company packages',
      'MUI X packages',
      'MUI packages',
      'Company commercial packages',
      'MUI pro packages',
    ],
  },

  // XGrid competitors
  {
    name: 'TanStack Table',
    presets: ['Free data grids'],
    packageNames: ['@tanstack/react-table', 'react-table'],
  },
  {
    name: 'material-table',
    presets: ['Free data grids'],
  },
  {
    name: 'react-data-table-component',
    presets: ['Free data grids'],
  },
  {
    name: 'ag-grid-community',
    presets: ['Free data grids'],
  },
  {
    name: 'datatables.net',
    presets: ['Free data grids'],
  },
  {
    name: 'ag-grid-enterprise',
    presets: ['Paying data grids'],
  },
  {
    name: 'handsontable',
    presets: ['Paying data grids'],
  },
  {
    name: '@devexpress/dx-react-grid',
    presets: ['Paying data grids'],
  },
  {
    name: '@progress/kendo-react-grid',
    presets: ['Paying data grids'],
  },
  {
    name: '@syncfusion/ej2-grids',
    presets: ['Paying data grids'],
  },
  {
    name: '@devexpress/dx-react-grid',
    presets: ['Paying data grids'],
  },

  // eXplore competitors
  {
    name: 'react-day-picker',
    presets: ['Free pickers'],
  },
  {
    name: 'react-date-picker',
    presets: ['Free pickers'],
  },
  {
    name: 'react-calendar',
    presets: ['Free pickers'],
  },
  {
    name: 'react-datetime',
    presets: ['Free pickers'],
  },
  {
    name: 'flatpickr',
    presets: ['Free pickers'],
  },
  {
    name: 'react-dates',
    presets: ['Free pickers'],
  },
  {
    name: '@react-spectrum/datepicker',
    presets: ['Free pickers'],
  },
  {
    name: '@material-ui/pickers',
    presets: ['Free pickers'],
  },
  {
    name: 'react-datepicker',
    presets: ['Free pickers'],
  },

  // Base UI competitors
  { name: '@radix-ui/primitive', presets: ['Headless libraries'] },
  { name: '@headlessui/react', presets: ['Headless libraries'] },
  { name: 'react-aria-components', presets: ['Headless libraries'] },
  { name: '@ark-ui/react', presets: ['Headless libraries'] },

  // xCharts competitors
  { name: 'recharts', presets: ['Free Charts libraries'] },
  { name: 'charts.js', presets: ['Free Charts libraries'] },
  { name: 'highcharts', presets: ['Free Charts libraries'] },
  { name: 'echarts', presets: ['Free Charts libraries'] },
  { name: 'apexcharts', presets: ['Free Charts libraries'] },
  { name: '@nivo/core', presets: ['Free Charts libraries'] },
  { name: 'ag-charts-community', presets: ['Free Charts libraries'] },
  { name: 'ag-charts-enterprise', presets: ['Paying Charts libraries'] },

  // Date libraries
  { name: 'date-fns', presets: ['Date libraries'] },
  { name: 'moment', presets: ['Date libraries'] },
  { name: 'dayjs', presets: ['Date libraries'] },
  { name: 'luxon', presets: ['Date libraries'] },

  // Others
  { name: 'react-dom', presets: ['React'] },

  // Summed packages
  {
    name: 'MUI-based pickers',
    packageNames: ['@mui/x-date-pickers', '@material-ui/pickers'],
  },
];
