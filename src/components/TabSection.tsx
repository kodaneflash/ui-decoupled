import React, { memo } from "react";
import { Box, Flex } from "@ledgerhq/native-ui";
import Animated from "react-native-reanimated";
import { LayoutChangeEvent } from "react-native";
import TabSelector from "./TabSelector";
import AssetsListView from "./AssetsListView";
import AccountsList from "./AccountsList";
import { type TabListType, TAB_OPTIONS } from "../hooks/useListsAnimation";

interface AnimatedStyle {
  transform: { translateX: number }[];
  opacity: number;
}

interface TabSectionProps {
  handleToggle: (value: TabListType) => void;
  handleLayout: (event: LayoutChangeEvent) => void;
  handleAssetsContentSizeChange: (width: number, height: number) => void;
  handleAccountsContentSizeChange: (width: number, height: number) => void;
  initialTab: TabListType;
  showAssets: boolean;
  showAccounts: boolean;
  assetsAnimatedStyle: AnimatedStyle;
  accountsAnimatedStyle: AnimatedStyle;
  containerHeight: number;
}

const TabSection: React.FC<TabSectionProps> = ({
  handleToggle,
  handleLayout,
  handleAssetsContentSizeChange,
  handleAccountsContentSizeChange,
  initialTab,
  showAssets,
  showAccounts,
  assetsAnimatedStyle,
  accountsAnimatedStyle,
  containerHeight,
}) => {
  const tabLabels = [
    { id: TAB_OPTIONS.Assets, value: "Assets" },
    { id: TAB_OPTIONS.Accounts, value: "Accounts" },
  ];

  return (
    <>
      {/* TabSelector with exact Ledger Live specifications */}
      <Box height={40} mb={16} mt={3}>
        <TabSelector
          labels={tabLabels}
          onToggle={handleToggle}
          initialTab={initialTab}
        />
      </Box>

      {/* Container with 200% width for side-by-side lists */}
      <Flex
        flexDirection="row"
        overflow="hidden"
        onLayout={handleLayout}
        width="200%"
        height={containerHeight}
        maxHeight={containerHeight}
        testID="portfolio-assets-layout"
      >
        {/* Assets List View */}
        <Animated.View style={[{ width: "50%" }, assetsAnimatedStyle]}>
          <AssetsListView 
            onContentChange={handleAssetsContentSizeChange}
            limitNumberOfAssets={5}
          />
        </Animated.View>

        {/* Accounts List View */}
        <Animated.View style={[{ width: "50%" }, accountsAnimatedStyle]}>
          <AccountsList onContentChange={handleAccountsContentSizeChange} />
        </Animated.View>
      </Flex>
    </>
  );
};

export default memo(TabSection); 