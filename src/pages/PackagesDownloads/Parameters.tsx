import React from "react";
import Stack from "@mui/material/Stack";
import { DateRangePicker } from "../../components/DateRangePicker";
import { PrecisionPicker } from "../../components/PrecisionPicker";
import { PresetPicker } from "../../components/PresetPicker";
import { ParamsModal } from "../../components/ParamsModal";
import { UsePackagesDownloadsParams } from "../../hooks/usePackagesDownloads";

export interface ParametersProps {
  value: UsePackagesDownloadsParams;
  onChange: React.Dispatch<React.SetStateAction<UsePackagesDownloadsParams>>;
}

export const Parameters = (props: ParametersProps) => {
  const { value, onChange } = props;

  return (
    <Stack spacing={2} direction="row">
      <DateRangePicker
        value={value.dateRange}
        onChange={(newValue) =>
          onChange((prev) => ({ ...prev, dateRange: newValue }))
        }
        size="small"
        sx={{ minWidth: 300 }}
      />
      <PrecisionPicker {...props} size="small" />
      <PresetPicker {...props} />
      <ParamsModal {...props} />
    </Stack>
  );
};
