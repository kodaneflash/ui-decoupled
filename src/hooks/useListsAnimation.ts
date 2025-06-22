import { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useState, useEffect, useCallback } from "react";
import { LayoutChangeEvent } from "react-native";

export const TAB_OPTIONS = {
  Assets: "Assets",
  Accounts: "Accounts",
} as const;

export type TabListType = (typeof TAB_OPTIONS)[keyof typeof TAB_OPTIONS];

const ANIMATION_DURATION = 250;

interface AnimatedStyle {
  transform: { translateX: number }[];
  opacity: number;
}

const useListsAnimation = (initialTab: TabListType) => {
  const [selectedTab, setSelectedTab] = useState<TabListType>(initialTab);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [assetsHeight, setAssetsHeight] = useState<number>(0);
  const [accountsHeight, setAccountsHeight] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [accountsButtonHeight, setAccountsButtonHeight] = useState<number>(0);
  const [assetsButtonHeight, setAssetsButtonHeight] = useState<number>(0);

  const assetsTranslateX = useSharedValue<number>(initialTab === TAB_OPTIONS.Assets ? 0 : -containerWidth);
  const assetsOpacity = useSharedValue<number>(1);
  const accountsTranslateX = useSharedValue<number>(initialTab === TAB_OPTIONS.Assets ? containerWidth : 0);
  const accountsOpacity = useSharedValue<number>(1);

  const handleToggle = useCallback((value: TabListType) => {
    setSelectedTab(value);

    if (value === TAB_OPTIONS.Assets) {
      setContainerHeight(assetsHeight + assetsButtonHeight);
    } else {
      setContainerHeight(accountsHeight + accountsButtonHeight);
    }
  }, [assetsHeight, accountsHeight, assetsButtonHeight, accountsButtonHeight]);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  }, []);

  const handleButtonLayout = useCallback((tab: TabListType, event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height === 0) return;
    if (tab === TAB_OPTIONS.Assets) {
      setAssetsButtonHeight(height);
    } else {
      setAccountsButtonHeight(height);
    }
  }, []);

  useEffect(() => {
    if (selectedTab === TAB_OPTIONS.Assets) {
      setContainerHeight(assetsHeight + assetsButtonHeight);
    } else {
      setContainerHeight(accountsHeight + accountsButtonHeight);
    }
  }, [selectedTab, assetsHeight, accountsHeight, assetsButtonHeight, accountsButtonHeight]);

  const handleAssetsContentSizeChange = useCallback((width: number, height: number) => {
    setAssetsHeight(height);
  }, []);

  const handleAccountsContentSizeChange = useCallback((width: number, height: number) => {
    setAccountsHeight(height);
  }, []);

  const assetsAnimatedStyle = useAnimatedStyle(
    (): AnimatedStyle => ({
      transform: [{ translateX: assetsTranslateX.value }],
      opacity: assetsOpacity.value,
    }),
    [assetsTranslateX, assetsOpacity],
  );

  const accountsAnimatedStyle = useAnimatedStyle(
    (): AnimatedStyle => ({
      transform: [{ translateX: accountsTranslateX.value }],
      opacity: accountsOpacity.value,
    }),
    [accountsTranslateX, accountsOpacity],
  );

  useEffect(() => {
    if (containerWidth === 0) return; // Wait for layout

    if (selectedTab === TAB_OPTIONS.Assets) {
      // Assets tab is selected - show assets (translateX: 0), hide accounts (translateX: containerWidth)
      assetsTranslateX.value = withTiming(0, { duration: ANIMATION_DURATION });
      assetsOpacity.value = withTiming(1, { duration: ANIMATION_DURATION });
      // Move accounts completely off-screen to the right
      accountsTranslateX.value = withTiming(containerWidth, { duration: ANIMATION_DURATION });
      accountsOpacity.value = withTiming(1, { duration: ANIMATION_DURATION }); // Keep opacity 1
    } else {
      // Accounts tab is selected - hide assets (translateX: -containerWidth), show accounts (translateX: 0)
      assetsTranslateX.value = withTiming(-containerWidth, { duration: ANIMATION_DURATION });
      assetsOpacity.value = withTiming(1, { duration: ANIMATION_DURATION }); // Keep opacity 1
      // Move accounts to center position
      accountsTranslateX.value = withTiming(0, { duration: ANIMATION_DURATION });
      accountsOpacity.value = withTiming(1, { duration: ANIMATION_DURATION });
    }
  }, [
    selectedTab,
    containerWidth,
    assetsTranslateX,
    accountsTranslateX,
    assetsOpacity,
    accountsOpacity,
  ]);

  return {
    handleToggle,
    handleLayout,
    handleButtonLayout,
    handleAssetsContentSizeChange,
    handleAccountsContentSizeChange,
    selectedTab,
    assetsAnimatedStyle,
    accountsAnimatedStyle,
    containerHeight,
  };
};

export default useListsAnimation; 