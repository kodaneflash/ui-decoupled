import React from "react";
import { Box } from "@ledgerhq/native-ui";
import QuickActionCards from "./QuickActionCards";
import TabSection from "./TabSection";
import useListsAnimation, { TAB_OPTIONS } from "../hooks/useListsAnimation";

interface PortfolioAssetsContainerProps {
  initialTab?: "Assets" | "Accounts";
}

const PortfolioAssetsContainer: React.FC<PortfolioAssetsContainerProps> = ({
  initialTab = "Assets",
}) => {
  const {
    handleToggle,
    handleLayout,
    handleAssetsContentSizeChange,
    handleAccountsContentSizeChange,
    selectedTab,
    assetsAnimatedStyle,
    accountsAnimatedStyle,
    containerHeight,
  } = useListsAnimation(initialTab);

  const showAssets = selectedTab === TAB_OPTIONS.Assets;
  const showAccounts = selectedTab === TAB_OPTIONS.Accounts;

  return (
    <>
      {/* Quick Actions Bar with exact Ledger Live spacing - full width */}
      <Box my={24}>
        <QuickActionCards />
      </Box>

      {/* Assets/Accounts Tab Section - with horizontal padding */}
      <Box px={6}>
        <TabSection
          handleToggle={handleToggle}
          handleLayout={handleLayout}
          handleAssetsContentSizeChange={handleAssetsContentSizeChange}
          handleAccountsContentSizeChange={handleAccountsContentSizeChange}
          initialTab={initialTab}
          showAssets={showAssets}
          showAccounts={showAccounts}
          assetsAnimatedStyle={assetsAnimatedStyle}
          accountsAnimatedStyle={accountsAnimatedStyle}
          containerHeight={containerHeight}
        />
      </Box>
    </>
  );
};

export default React.memo(PortfolioAssetsContainer); 