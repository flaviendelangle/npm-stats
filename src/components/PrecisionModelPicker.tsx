import React from "react";
import ToggleButtonGroup, {
  ToggleButtonGroupProps,
} from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import { PrecisionModel } from "../data";
import { UsePackagesDownloadsParams } from "../hooks/usePackagesDownloads";

interface PrecisionModelPickerProps
  extends Pick<ToggleButtonGroupProps, "size" | "fullWidth"> {
  value: UsePackagesDownloadsParams;
  onChange: React.Dispatch<React.SetStateAction<UsePackagesDownloadsParams>>;
}

export const PrecisionModelPicker = (props: PrecisionModelPickerProps) => {
  const { onChange, value, size, fullWidth } = props;

  const handlePrecisionModelChange = (
    event: React.MouseEvent,
    precisionModel: PrecisionModel
  ) => {
    if (!precisionModel) {
      return;
    }

    onChange((prev) => ({
      ...prev,
      precisionModel,
    }));
  };

  return (
    <ToggleButtonGroup
      exclusive
      size={size}
      fullWidth={fullWidth}
      value={value.precisionModel}
      onChange={handlePrecisionModelChange}
    >
      <ToggleButton value="sum">Sum</ToggleButton>
      <ToggleButton value="movingAverage">Moving average</ToggleButton>
    </ToggleButtonGroup>
  );
};
