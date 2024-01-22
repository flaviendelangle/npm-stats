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
  return (
    <Stack spacing={2} direction="row">
      <DateRangePicker {...props} size="small" />
      <PrecisionPicker {...props} size="small" />
      <PresetPicker {...props} />
      <ParamsModal {...props} />
    </Stack>
  );
};
