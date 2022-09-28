import React from "react";
import { UsePackagesDownloadsParams } from "../../hooks/usePackagesDownloads";

export interface HeaderBarProps {
  value: UsePackagesDownloadsParams;
  onChange: React.Dispatch<React.SetStateAction<UsePackagesDownloadsParams>>;
}
