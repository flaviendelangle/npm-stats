import React from "react";
import { Dayjs } from "dayjs";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { Unstable_SingleInputDateRangeField as SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DateRange } from "@mui/x-date-pickers-pro";
import { UsePackagesDownloadsParams } from "../../hooks/usePackagesDownloads";
import { AutocompleteValue } from "@mui/base/AutocompleteUnstyled/useAutocomplete";
import { Precision } from "../../models";

interface HeaderBarProps {
  value: UsePackagesDownloadsParams;
  onChange: React.Dispatch<React.SetStateAction<UsePackagesDownloadsParams>>;
}

export const HeaderBar = ({ value, onChange }: HeaderBarProps) => {
  const handleDateRangeChange = (dateRange: DateRange<Dayjs>) =>
    onChange((prev) => ({ ...prev, dateRange }));

  const handlePackageNamesChange = (
    event: React.SyntheticEvent,
    packageNames: AutocompleteValue<string, true, true, true>
  ) => onChange((prev) => ({ ...prev, packageNames }));

  const handleReferencePackageNameChange = (
    event: React.SyntheticEvent,
    referencePackageName: AutocompleteValue<string, false, false, true>
  ) => onChange((prev) => ({ ...prev, referencePackageName }));

  const handlePrecisionChange = (
    event: React.MouseEvent,
    precision: Precision
  ) =>
    onChange((prev) => ({
      ...prev,
      precision,
    }));

  return (
    <Stack
      sx={{ borderBottom: 1, borderColor: "divider", p: 2 }}
      direction="row"
      spacing={2}
    >
      <SingleInputDateRangeField
        label="Date range"
        size="small"
        sx={{ width: 300 }}
        value={value.dateRange}
        onChange={handleDateRangeChange}
      />
      <Autocomplete<string, true, true, true>
        freeSolo
        disableClearable
        multiple
        size="small"
        value={value.packageNames}
        onChange={handlePackageNamesChange}
        options={[]}
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
      />
      <Autocomplete<string, false, false, true>
        freeSolo
        size="small"
        value={value.referencePackageName}
        onChange={handleReferencePackageNameChange}
        options={[]}
        sx={{ width: 200 }}
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
    </Stack>
  );
};
