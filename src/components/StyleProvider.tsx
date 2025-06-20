import React, { useMemo } from "react";
import { ThemeProvider } from "styled-components/native";
import { lightTheme as light, darkTheme as dark } from "../styles/colors";

const themes = { light, dark };

type Props = {
  children: React.ReactNode;
  selectedPalette: "light" | "dark";
};

export default function StyleProvider({ children, selectedPalette }: Props): React.ReactElement {
  const selectedTheme = themes[selectedPalette];
  const theme = useMemo(
    () => ({
      colors: selectedTheme.colors,
      theme: selectedPalette,
    }),
    [selectedTheme.colors, selectedPalette],
  );

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
} 