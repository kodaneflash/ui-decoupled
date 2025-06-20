import React, { useMemo, memo } from "react";
import { Text } from "@ledgerhq/native-ui";
import getFontStyle from "./getFontStyle";

export type LTextProps = React.ComponentProps<typeof Text> & {
  bold?: boolean;
  semiBold?: boolean;
  secondary?: boolean;
  monospace?: boolean;
};

/**
 * This component is a proxy to the Text component from @ledgerhq/native-ui.
 * It applies the same font styling as the original Ledger Live Mobile app.
 */
function LText({ children, semiBold, bold, monospace, style, ...props }: LTextProps) {
  const fontStyle = useMemo(() => {
    return getFontStyle({ bold, semiBold, monospace });
  }, [bold, semiBold, monospace]);

  return (
    <Text 
      {...props} 
      style={[fontStyle, style]}
    >
      {children}
    </Text>
  );
}

export default memo<LTextProps>(LText); 