import React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import { PackagePreset, PRESETS } from "../../data";
import MenuItem from "@mui/material/MenuItem";
import { applyPreset } from "./HeaderBar";
import { HeaderBarProps } from "./HeaderBar.types";

export const PresetPicker = ({ onChange, value }: HeaderBarProps) => {
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
