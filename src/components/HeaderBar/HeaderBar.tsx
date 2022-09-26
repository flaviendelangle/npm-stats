import React from "react";
import { Dayjs } from "dayjs";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { Unstable_SingleInputDateRangeField as SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DateRange } from "@mui/x-date-pickers-pro";
import { UsePackagesDownloadsParams } from "../../hooks/usePackagesDownloads";
import { AutocompleteValue } from "@mui/base/AutocompleteUnstyled/useAutocomplete";
import {
  Precision,
  PackageOption,
  PackagePreset,
  PRESETS,
  getPackageNameFromOption,
} from "../../models";

interface HeaderBarProps {
  value: UsePackagesDownloadsParams;
  onChange: React.Dispatch<React.SetStateAction<UsePackagesDownloadsParams>>;
}

const PACKAGES: PackageOption[] = [
  // MUI Core
  {
    name: "@mui/material",
    category: "MUI Core",
    presets: ["MUI packages", "MUI free packages"],
    oldPackageNames: ["@material-ui/core"],
  },
  {
    name: "@mui/base",
    category: "MUI Core",
    presets: ["MUI packages", "MUI free packages"],
  },
  {
    name: "@mui/joy",
    category: "MUI Core",
    presets: ["MUI packages", "MUI free packages"],
  },
  {
    name: "@mui/lab",
    category: "MUI Core",
    presets: ["MUI packages", "MUI free packages"],
    oldPackageNames: ["@material-ui/lab"],
  },

  // MUI XGrid
  {
    name: "@mui/x-data-grid",
    category: "MUI XGrid",
    presets: [
      "MUI X packages",
      "Free data grids",
      "MUI packages",
      "MUI free packages",
    ],
    oldPackageNames: ["@material-ui/data-grid"],
  },
  {
    name: "@mui/x-data-grid-pro",
    category: "MUI XGrid",
    presets: [
      "MUI X packages",
      "Paying data grids",
      "MUI packages",
      "MUI paying packages",
    ],
    oldPackageNames: ["@material-ui/x-grid"],
  },
  {
    name: "@mui/x-data-grid-premium",
    category: "MUI XGrid",
    presets: [
      "MUI X packages",
      "Paying data grids",
      "MUI packages",
      "MUI paying packages",
    ],
  },

  // MUI eXplore
  {
    name: "@mui/x-date-pickers",
    category: "MUI eXplore",
    presets: [
      "MUI X packages",
      "Free pickers",
      "MUI packages",
      "MUI free packages",
    ],
  },
  {
    name: "@mui/x-date-pickers-pro",
    category: "MUI eXplore",
    presets: [
      "MUI X packages",
      "Paying pickers",
      "MUI packages",
      "MUI paying packages",
    ],
  },

  // XGrid competitors
  {
    name: "react-table",
    category: "XGrid competitors",
    presets: ["Free data grids"],
  },
  {
    name: "material-table",
    category: "XGrid competitors",
    presets: ["Free data grids"],
  },
  {
    name: "ag-grid-community",
    category: "XGrid competitors",
    presets: ["Free data grids"],
  },
  {
    name: "ag-grid-enterprise",
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
    name: "@syncfusion/ej2-calendars",
    category: "eXplore competitors",
    presets: ["Paying pickers"],
  },
  {
    name: "react-dates",
    category: "eXplore competitors",
    presets: ["Free pickers"],
  },
  {
    name: "@progress/kendo-react-dateinputs",
    category: "eXplore competitors",
    presets: ["Paying pickers"],
  },
  {
    name: "@react-spectrum/datepicker",
    category: "eXplore competitors",
    presets: ["Free pickers"],
  },

  // Others
  { name: "react-dom", category: "Others" },
];

export const applyPreset = (
  value: Omit<UsePackagesDownloadsParams, "packages" | "referencePackage">,
  preset: PackagePreset
): UsePackagesDownloadsParams => ({
  ...value,
  packages: PACKAGES.filter((item) => item?.presets?.includes(preset)),
  referencePackage: "react-dom",
});

export const HeaderBar = ({ value, onChange }: HeaderBarProps) => {
  const [presetMenuAnchorEl, setPresetMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const isPresetMenuOpen = !!presetMenuAnchorEl;

  const handleDateRangeChange = (dateRange: DateRange<Dayjs>) =>
    onChange((prev) => ({ ...prev, dateRange }));

  const handlePackageNamesChange = (
    event: React.SyntheticEvent,
    packages: AutocompleteValue<PackageOption, true, false, true>
  ) =>
    onChange((prev) => ({
      ...prev,
      packages,
    }));

  const handleReferencePackageNameChange = (
    event: React.SyntheticEvent,
    referencePackage: AutocompleteValue<PackageOption, false, false, true>
  ) =>
    onChange((prev) => ({
      ...prev,
      referencePackage,
    }));

  const handlePrecisionChange = (
    event: React.MouseEvent,
    precision: Precision
  ) => {
    if (!precision) {
      return;
    }

    onChange((prev) => ({
      ...prev,
      precision,
    }));
  };

  const handleSetPreset = (preset: PackagePreset) => {
    setPresetMenuAnchorEl(null);
    onChange((prev) => applyPreset(prev, preset));
  };

  return (
    <Stack
      sx={{ borderBottom: 1, borderColor: "divider", p: 2 }}
      direction="row"
      spacing={2}
      alignItems="flex-start"
    >
      <SingleInputDateRangeField
        label="Date range"
        size="small"
        sx={{ width: 300 }}
        value={value.dateRange}
        onChange={handleDateRangeChange}
      />
      <Autocomplete<PackageOption, true, false, true>
        freeSolo
        multiple
        size="small"
        value={value.packages}
        onChange={handlePackageNamesChange}
        options={PACKAGES}
        getOptionLabel={getPackageNameFromOption}
        groupBy={(option) => option.category}
        sx={{ width: 600 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Add a package"
            InputProps={{
              ...params.InputProps,
              type: "search",
            }}
          />
        )}
        renderTags={(value, getTagProps) => {
          const numTags = value.length;
          const limitTags = 3;

          return (
            <React.Fragment>
              {value.slice(0, limitTags).map((option, index) => {
                return (
                  <Chip
                    size="small"
                    label={getPackageNameFromOption(option)}
                    // @ts-ignore
                    {...getTagProps({ index })}
                  />
                );
              })}
              {numTags > limitTags && ` +${numTags - limitTags}`}
            </React.Fragment>
          );
        }}
      />
      <Autocomplete<PackageOption, false, false, true>
        freeSolo
        size="small"
        value={value.referencePackage}
        onChange={handleReferencePackageNameChange}
        options={PACKAGES}
        getOptionLabel={getPackageNameFromOption}
        groupBy={(option) => option.category}
        sx={{ width: 250 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Reference"
            InputProps={{
              ...params.InputProps,
              type: "search",
            }}
          />
        )}
      />
      <ToggleButtonGroup
        exclusive
        size="small"
        value={value.precision}
        onChange={handlePrecisionChange}
      >
        <ToggleButton value="day">Daily</ToggleButton>
        <ToggleButton value="week">Weekly</ToggleButton>
        <ToggleButton value="month">Monthly</ToggleButton>
      </ToggleButtonGroup>
      <Button
        id="preset-button"
        aria-controls={isPresetMenuOpen ? "preset-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={isPresetMenuOpen ? "true" : undefined}
        onClick={(event) => setPresetMenuAnchorEl(event.currentTarget)}
      >
        Presets
      </Button>
      <Menu
        id="preset-menu"
        anchorEl={presetMenuAnchorEl}
        open={isPresetMenuOpen}
        onClose={() => setPresetMenuAnchorEl(null)}
        MenuListProps={{
          "aria-labelledby": "preset-button",
        }}
      >
        {PRESETS.map((preset) => (
          <MenuItem key={preset} onClick={() => handleSetPreset(preset)}>
            {preset}
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  );
};
