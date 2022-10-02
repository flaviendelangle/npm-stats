import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import GlobalStyles from "@mui/material/GlobalStyles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme";
import { PackagesDownloads } from "./pages/PackagesDownloads";
import { PackageVersions } from "./pages/PackageVersions";
import { NPMContext } from "./components/NPMContext";

const customCssBaseline = (
  <GlobalStyles
    styles={{
      body: { width: "100vw", height: "100vh" },
      "& #root": { width: "100vw", height: "100vh" },
    }}
  />
);

export const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {customCssBaseline}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <NPMContext>
            <Routes>
              <Route
                path="/packages-downloads"
                element={<PackagesDownloads />}
              />
              <Route path="/package-versions" element={<PackageVersions />} />
              <Route
                path="*"
                element={<Navigate to="/packages-downloads" replace />}
              />
            </Routes>
          </NPMContext>
        </LocalizationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};
