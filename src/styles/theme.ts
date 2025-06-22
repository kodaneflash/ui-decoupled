import 'styled-components/native';
import type {Theme as NativeUITheme} from '@ledgerhq/native-ui/styles/theme';
import type {Theme as AppTheme} from './colors';

// Omit conflicting keys from our AppTheme to allow NativeUITheme's definitions to take precedence.
type MergedColors = Omit<AppTheme['colors'], keyof NativeUITheme['colors']> &
  NativeUITheme['colors'];

export const space = [0, 2, 4, 8, 12, 14, 16, 24, 32, 40, 48, 64, 80, 96, 120];

export interface Theme extends Omit<NativeUITheme, 'colors'> {
  colors: MergedColors;
  space: number[];
}

declare module 'styled-components/native' {
  export interface DefaultTheme extends Theme {}
}
