import darkPalette from './dark';
import lightPalette from './light';

export type ThemePalette = typeof lightPalette | typeof darkPalette;
export type ThemeScheme = Record<'light' | 'dark', ThemePalette>;

export const palettes: ThemeScheme = {
  light: lightPalette,
  dark: darkPalette,
};
