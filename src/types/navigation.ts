// Tab Icon Props Interface
export interface TabIconProps {
  color: string;
  focused?: boolean;
  onPress?: () => void;
}

// Tab State Interface for React Navigation compatibility
export interface TabState {
  activeIndex: number;
  routes: Array<{
    name: string;
    key: string;
  }>;
}

// Tab Configuration Interface
export interface TabConfig {
  name: string;
  component: React.ComponentType<any>;
  iconComponent: React.ComponentType<TabIconProps>;
}

// Tab Configurations - matching MainNavigator structure
export const TAB_CONFIGS: TabConfig[] = [
  {
    name: "Portfolio",
    component: () => null, // Placeholder
    iconComponent: ({ color, focused }) => null, // Placeholder
  },
  {
    name: "Earn", 
    component: () => null,
    iconComponent: ({ color, focused }) => null,
  },
  {
    name: "Transfer",
    component: () => null,
    iconComponent: ({ color, focused }) => null,
  },
  {
    name: "Discover",
    component: () => null,
    iconComponent: ({ color, focused }) => null,
  },
  {
    name: "MyLedger",
    component: () => null,
    iconComponent: ({ color, focused }) => null,
  },
];

// Main Navigator Param List
export interface MainNavigatorParamList {
  Portfolio: undefined;
  Earn: undefined; 
  Transfer: undefined;
  Discover: undefined;
  MyLedger: undefined;
} 