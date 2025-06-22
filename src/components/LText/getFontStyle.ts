import {Platform} from 'react-native';

export type FontStyleProps = {
  bold?: boolean;
  semiBold?: boolean;
  monospace?: boolean;
};

export type FontStyle = {
  fontFamily: string;
  fontWeight:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
};

export default function getFontStyle({
  bold,
  semiBold,
  monospace,
}: FontStyleProps = {}): FontStyle {
  if (monospace) {
    return {
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      fontWeight: 'normal',
    };
  }

  if (Platform.OS === 'ios') {
    // iOS: Use Inter family with numeric weights
    return {
      fontFamily: 'Inter',
      fontWeight: bold ? '700' : semiBold ? '600' : '400',
    };
  } else {
    // Android: Use specific font file names
    const weight = bold ? 'Bold' : semiBold ? 'SemiBold' : 'Regular';
    return {
      fontFamily: `Inter-${weight}`,
      fontWeight: 'normal',
    };
  }
}
