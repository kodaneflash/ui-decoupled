import React, { useCallback } from "react";
import { useTheme } from "styled-components/native";
import { 
  BottomTabBarProps, 
  createBottomTabNavigator,
  BottomTabNavigationProp 
} from "@react-navigation/bottom-tabs";
import { 
  ParamListBase,
  NavigationProp,
  RouteProp 
} from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Import our screens and components
import PortfolioScreen from "../screens/Portfolio";
import { 
  TransferTabIcon, 
  PortfolioTabIcon, 
  EarnTabIcon, 
  DiscoverTabIcon, 
  ManagerTabIcon 
} from "../components/BottomNavigation/TabIcons";
import CustomTabBar from "../components/BottomNavigation/CustomTabBar";

// Navigation types with proper ParamListBase constraint
interface MainNavigatorParamList extends ParamListBase {
  Wallet: undefined;
  Earn: undefined;
  Transfer: undefined;
  Discover: undefined;
  MyLedger: undefined;
}

const Tab = createBottomTabNavigator<MainNavigatorParamList>();

// Screen names (matching official structure)
const NavigatorName = {
  Wallet: "Wallet" as const,
  Earn: "Earn" as const,
  Discover: "Discover" as const,
  MyLedger: "MyLedger" as const,
};

const ScreenName = {
  Transfer: "Transfer" as const,
};

// Mock components for non-Portfolio screens
const EarnScreen = () => <></>;
const TransferScreen = () => <></>;
const DiscoverScreen = () => <></>;
const MyLedgerScreen = () => <></>;

/**
 * Custom Tab Bar Wrapper
 * Adapts our CustomTabBar to work with React Navigation's BottomTabBarProps
 */
function CustomTabBarWrapper(props: BottomTabBarProps) {
  return (
    <CustomTabBar
      state={{
        activeIndex: props.state.index,
        routes: props.state.routes.map((route) => ({
          name: route.name,
          key: route.key,
        })),
      }}
      onTabPress={(index: number) => {
        const route = props.state.routes[index];
        const event = props.navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });

        if (!event.defaultPrevented) {
          props.navigation.navigate(route.name);
        }
      }}
      hideTabBar={false}
    />
  );
}

/**
 * Main Navigator - EXACT REPLICATION of official Ledger Live Mobile MainNavigator
 * 
 * Key features matching official implementation:
 * - Uses createBottomTabNavigator from React Navigation
 * - Custom tabBar prop with our CustomTabBar component
 * - tabBarStyle with height: 300 for space reservation
 * - Proper safe area insets handling
 * - Official color and styling configuration
 * - 5-screen structure: Wallet, Earn, Transfer, Discover, MyLedger
 */
export default function MainNavigator() {
  const { colors } = useTheme();

  // Tab press handler (simplified for demo)
  const handleTabPress = useCallback((screenName: string) => {
    console.log(`Tab pressed: ${screenName}`);
  }, []);

  return (
    <Tab.Navigator
      tabBar={CustomTabBarWrapper}
      screenOptions={{
        // EXACT OFFICIAL CONFIGURATION from Ledger Live Mobile
        tabBarStyle: [
          {
            height: 300, // Official space reservation
            borderTopColor: colors.neutral?.c30 || "#333",
            borderTopWidth: 1,
            elevation: 5,
            shadowColor: colors.neutral?.c30 || "#333",
            backgroundColor: colors.opacityDefault?.c10 || "transparent",
          },
        ],
        unmountOnBlur: true, // Official setting - prevents ghost device interactions
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.palette?.primary?.c80 || "#7C3AED",
        tabBarInactiveTintColor: colors.palette?.neutral?.c70 || "#999999",
        headerShown: false,
      }}
      sceneContainerStyle={[{ backgroundColor: colors.background?.main || "#131214" }]}
    >
      {/* Wallet Tab */}
      <Tab.Screen
        name={NavigatorName.Wallet}
        component={PortfolioScreen}
        options={{
          headerShown: false,
          unmountOnBlur: true,
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <PortfolioTabIcon color={color} focused={focused} />
          ),
        }}
        listeners={({ navigation }: { navigation: NavigationProp<MainNavigatorParamList> }) => ({
          tabPress: (e: any) => {
            e.preventDefault();
            handleTabPress("Wallet");
            navigation.navigate(NavigatorName.Wallet);
          },
        })}
      />

      {/* Earn Tab */}
      <Tab.Screen
        name={NavigatorName.Earn}
        component={EarnScreen}
        options={{
          headerShown: false,
          unmountOnBlur: true,
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <EarnTabIcon color={color} focused={focused} />
          ),
        }}
        listeners={({ navigation }: { navigation: NavigationProp<MainNavigatorParamList> }) => ({
          tabPress: (e: any) => {
            e.preventDefault();
            handleTabPress("Earn");
            navigation.navigate(NavigatorName.Earn);
          },
        })}
      />

      {/* Transfer Tab (Center FAB) */}
      <Tab.Screen
        name={ScreenName.Transfer}
        component={TransferScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <TransferTabIcon color={color} focused={focused} />
          ),
        }}
      />

      {/* Discover Tab */}
      <Tab.Screen
        name={NavigatorName.Discover}
        component={DiscoverScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <DiscoverTabIcon color={color} focused={focused} />
          ),
        }}
        listeners={({ navigation }: { navigation: NavigationProp<MainNavigatorParamList> }) => ({
          tabPress: (e: any) => {
            e.preventDefault();
            handleTabPress("Discover");
            navigation.navigate(NavigatorName.Discover);
          },
        })}
      />

      {/* My Ledger Tab */}
      <Tab.Screen
        name={NavigatorName.MyLedger}
        component={MyLedgerScreen}
        options={{
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <ManagerTabIcon 
              color={color} 
              focused={focused}
              hasAvailableUpdate={true} // Show update badge for demo
            />
          ),
          tabBarTestID: "TabBarManager",
        }}
        listeners={({ navigation }: { navigation: NavigationProp<MainNavigatorParamList> }) => ({
          tabPress: (e: any) => {
            e.preventDefault();
            handleTabPress("MyLedger");
            navigation.navigate(NavigatorName.MyLedger);
          },
        })}
      />
    </Tab.Navigator>
  );
} 