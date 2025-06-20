import React, { useMemo } from "react";
import { ThemeProvider } from "styled-components/native";
import { defaultTheme } from "@ledgerhq/native-ui";
import { palettes } from "../styles/palettes";
import { lightTheme, darkTheme } from "../styles/colors";
import { space, Theme } from "../styles/theme";

const themes = {
  light: lightTheme,
  dark: darkTheme,
};

type Props = {
  children: React.ReactNode;
  selectedPalette: "light" | "dark";
};

export default function StyleProvider({
  children,
  selectedPalette,
}: Props): React.ReactElement {
  const theme = useMemo((): Theme => {
    const currentPalette = palettes[selectedPalette];
    const colorsTheme = themes[selectedPalette];

    return {
      ...defaultTheme,
      colors: {
        ...colorsTheme.colors,
        ...currentPalette,
        palette: currentPalette,
      },
      theme: selectedPalette,
      space,
    };
  }, [selectedPalette]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
} 