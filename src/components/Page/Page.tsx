import * as React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { Drawer } from "./Drawer";
import Divider from "@mui/material/Divider";

interface PageProps {
  children: React.ReactNode;
  actions: React.ReactNode;
}

const ParametersContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export const Page = ({ children, actions }: PageProps) => {
  return (
    <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
      <Drawer />
      <Box
        component="main"
        sx={{
          flex: "1 1 100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <ParametersContainer>{actions}</ParametersContainer>
        <Divider />
        <Box sx={{ p: 2, flex: "1 1 100%", overflow: "hidden" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
