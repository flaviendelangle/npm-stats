import * as React from "react";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import { AutocompleteValue } from "@mui/base/AutocompleteUnstyled";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { getPackageNameFromOption, PackageOption, PACKAGES } from "../data";
import { DateRangePicker } from "./DateRangePicker";
import { PrecisionPicker } from "./PrecisionPicker";
import { UsePackagesDownloadsParams } from "../hooks/usePackagesDownloads";

export interface ParamsModalProps {
  value: UsePackagesDownloadsParams;
  onChange: React.Dispatch<React.SetStateAction<UsePackagesDownloadsParams>>;
}

export const ParamsModal = (props: ParamsModalProps) => {
  const { onChange, value } = props;

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const handleBase100Change = (event: React.SyntheticEvent, base100: boolean) =>
    onChange((prev) => ({ ...prev, base100 }));

  return (
    <React.Fragment>
      <Tooltip title="More parameters">
        <IconButton onClick={handleOpen}>
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        components={{
          Backdrop,
        }}
        componentsProps={{
          backdrop: {
            timeout: 500,
          } as any,
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 800,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
              height: "calc(100vh - 200px)",
            }}
          >
            <Typography variant="h5" component="h2" sx={{ mb: 4 }}>
              Parameters
            </Typography>
            <Stack spacing={4} sx={{ position: "relative" }}>
              <DateRangePicker
                value={value.dateRange}
                onChange={(newValue) =>
                  onChange((prev) => ({ ...prev, dateRange: newValue }))
                }
              />
              <PrecisionPicker {...props} fullWidth />
              <Autocomplete<PackageOption, true, false, true>
                freeSolo
                multiple
                value={value.packages}
                onChange={handlePackageNamesChange}
                options={PACKAGES}
                getOptionLabel={getPackageNameFromOption}
                groupBy={(option) => option.category}
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
              <Autocomplete<PackageOption, false, false, true>
                freeSolo
                value={value.referencePackage}
                onChange={handleReferencePackageNameChange}
                options={PACKAGES}
                getOptionLabel={getPackageNameFromOption}
                groupBy={(option) => option.category}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Reference package"
                    InputProps={{
                      ...params.InputProps,
                      type: "search",
                    }}
                  />
                )}
              />
              <FormControlLabel
                control={
                  <Switch
                    value={value.base100}
                    onChange={handleBase100Change}
                  />
                }
                label="Base 100"
              />
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </React.Fragment>
  );
};
