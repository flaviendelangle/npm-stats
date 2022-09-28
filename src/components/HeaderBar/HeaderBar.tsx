import React from "react";
import Stack from "@mui/material/Stack";
import { UsePackagesDownloadsParams } from "../../hooks/usePackagesDownloads";
import { PackagePreset, PACKAGES } from "../../data";
import { HeaderBarProps } from "./HeaderBar.types";
import { PresetPicker } from "./PresetPicker";
import { ParamsModal } from "./ParamsModal";
import { DateRangePicker } from "./DateRangePicker";
import { PrecisionPicker } from "./PrecisionPicker";

export const applyPreset = (
  value: Omit<UsePackagesDownloadsParams, "packages" | "referencePackage">,
  preset: PackagePreset
): UsePackagesDownloadsParams => ({
  ...value,
  packages: PACKAGES.filter((item) => item?.presets?.includes(preset)),
  referencePackage: "react-dom",
});

export const HeaderBar = (props: HeaderBarProps) => {
  return (
    <Stack
      spacing={2}
      direction="row"
      sx={{ borderBottom: 1, borderColor: "divider", p: 2 }}
    >
      <DateRangePicker {...props} size="small" sx={{ minWidth: 300 }} />
      <PrecisionPicker {...props} size="small" />
      <PresetPicker {...props} />
      <ParamsModal {...props} />
    </Stack>
  );
};
