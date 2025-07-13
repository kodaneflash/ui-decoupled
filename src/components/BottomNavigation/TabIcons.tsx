import React from "react";
import { Flex } from "@ledgerhq/native-ui";
import { IconsLegacy } from "@ledgerhq/native-ui";
import TabIcon from "./TabIcon";
import TransferFAB from "./TransferFAB";
import { TabIconProps } from "../../types/navigation";

/**
 * Official Ledger Live Mobile Icons
 * Using exact icons from @ledgerhq/native-ui/assets/icons
 * All icons are 24px size with exact color matching
 */

/**
 * Device Icon with Update Badge
 * Represents NanoXFoldedMedium with optional update notification
 */
const DeviceIconWithBadge = ({ 
  size, 
  color, 
  hasUpdate = false 
}: { 
  size: number; 
  color: string; 
  hasUpdate?: boolean;
}) => (
  <Flex position="relative">
    <IconsLegacy.NanoXFoldedMedium size={size} color={color} />
    
    {/* Update Badge - 14px purple circle */}
    {hasUpdate && (
      <Flex
        position="absolute"
        top={-1}
        right={-1}
        width={14}
        height={14}
        borderRadius={7}
        borderWidth={3}
        borderColor="background.main"
        backgroundColor="constant.purple"
      />
    )}
  </Flex>
);

// Individual Tab Icon Components using official Ledger Live Mobile icons

export function PortfolioTabIcon({ color, focused, onPress }: TabIconProps) {
  return (
    <TabIcon
      Icon={IconsLegacy.WalletMedium}
      label="Wallet"
      color={color}
      onPress={onPress}
    />
  );
}

export function EarnTabIcon({ color, focused, onPress }: TabIconProps) {
  return (
    <TabIcon
      Icon={IconsLegacy.LendMedium}
      label="Earn"
      color={color}
      testID="tab-bar-earn"
      onPress={onPress}
    />
  );
}

/**
 * Transfer Tab Icon - Center FAB Button
 * This is the special floating action button in the center of the tab bar
 * Uses TransferFAB component for the purple circle with transfer icon
 */
export function TransferTabIcon({ color, focused }: TabIconProps) {
  return <TransferFAB focused={focused} />;
}

export function DiscoverTabIcon({ color, focused, onPress }: TabIconProps) {
  return (
    <TabIcon
      Icon={IconsLegacy.PlanetMedium}
      label="Discover"
      color={color}
      onPress={onPress}
    />
  );
}

interface ManagerTabIconProps extends TabIconProps {
  hasAvailableUpdate?: boolean;
}

export function ManagerTabIcon({ 
  color, 
  focused, 
  hasAvailableUpdate = false,
  onPress 
}: ManagerTabIconProps) {
  const DeviceIconWithUpdate = (props: { size?: number; color?: string }) => (
    <DeviceIconWithBadge 
      size={props.size || 24} 
      color={props.color || color} 
      hasUpdate={hasAvailableUpdate} 
    />
  );

  return (
    <TabIcon
      Icon={DeviceIconWithUpdate}
      label="My Ledger"
      color={color}
      testID="TabBarManager"
      onPress={onPress}
    />
  );
} 