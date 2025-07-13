import { ScrollListContainer } from "@ledgerhq/native-ui";
import React, { useRef } from "react";
import { ScrollViewProps } from "react-native";

// Simple version without the useScrollToTop hook for now
export default function NavigationScrollView({
  children,
  // Ignored to prevent type conflict
  horizontal,
  ...scrollViewProps
}: ScrollViewProps) {
  const ref = useRef<any>(null);

  return (
    <ScrollListContainer bg="background.main" ref={ref} {...scrollViewProps}>
      {children}
    </ScrollListContainer>
  );
} 