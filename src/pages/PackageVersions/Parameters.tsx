import React from "react";
import Stack from "@mui/material/Stack";
import { DateRangePicker } from "../../components/DateRangePicker";
import { UsePackageVersionsParams } from "../../hooks/usePackageVersions";

export interface ParametersProps {
  value: UsePackageVersionsParams;
  onChange: React.Dispatch<React.SetStateAction<UsePackageVersionsParams>>;
}

export const Parameters = ({ value, onChange }: ParametersProps) => {
  return (
    <Stack spacing={2} direction="row">
      <DateRangePicker
        value={value.dateRange}
        onChange={(newValue) =>
          onChange((prev) => ({ ...prev, dateRange: newValue }))
        }
        size="small"
        sx={{ minWidth: 300 }}
        format="MM/YYYY"
      />
    </Stack>
  );
};
