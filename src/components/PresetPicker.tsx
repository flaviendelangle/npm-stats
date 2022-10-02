import React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import { PackagePreset, PACKAGES, PRESETS } from "../data";
import MenuItem from "@mui/material/MenuItem";
import { UsePackagesDownloadsParams } from "../hooks/usePackagesDownloads";

interface PresetPickerProps {
  onChange: React.Dispatch<React.SetStateAction<UsePackagesDownloadsParams>>;
}

export const applyPreset = (
  value: Omit<UsePackagesDownloadsParams, "packages" | "referencePackage">,
  preset: PackagePreset
): UsePackagesDownloadsParams => ({
  ...value,
  packages: PACKAGES.filter((item) => item?.presets?.includes(preset)),
  referencePackage: "react-dom",
});

export const PresetPicker = ({ onChange }: PresetPickerProps) => {
  const [presetMenuAnchorEl, setPresetMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const isPresetMenuOpen = !!presetMenuAnchorEl;

  const handleSetPreset = (preset: PackagePreset) => {
    setPresetMenuAnchorEl(null);
    onChange((prev) => applyPreset(prev, preset));
  };

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};
