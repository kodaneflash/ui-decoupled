import React, { useCallback, useMemo } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useTheme } from "styled-components/native";
import { 
  BottomTabBarProps, 
  createBottomTabNavigator,
  BottomTabNavigationProp 
} from "@react-navigation/bottom-tabs";
import { 
  ParamListBase,
  NavigationProp,
  RouteProp,
  useNavigation 
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Import our screens and components
import PortfolioScreen from "../screens/Portfolio";
import Settings from "../screens/Settings";
import GeneralSettings from "../screens/Settings/GeneralSettings";
import HelpButton from "../components/HelpButton";
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

interface RootStackParamList extends ParamListBase {
  Main: undefined;
  Settings: undefined;
  GeneralSettings: undefined;
}

const Tab = createBottomTabNavigator<MainNavigatorParamList>();
const Stack = createStackNavigator<RootStackParamList>();

// Screen names (matching official structure)
const NavigatorName = {
  Wallet: "Wallet" as const,
  Earn: "Earn" as const,
  Discover: "Discover" as const,
  MyLedger: "MyLedger" as const,
};

const ScreenName = {
  Transfer: "Transfer" as const,
  Settings: "Settings" as const,
  GeneralSettings: "GeneralSettings" as const,
};

// Mock components for non-Portfolio screens
const EarnScreen = () => <></>;
const TransferScreen = () => <></>;
const DiscoverScreen = () => <></>;
// Exact replication of getStackNavigatorConfig from Ledger Live Mobile
const getStackNavigatorConfig = (colors: any) => ({
  headerShown: true,
  cardStyle: {
    backgroundColor: colors.background?.main || colors.background,
  },
  headerStyle: {
    backgroundColor: colors.background?.main || colors.background,
    borderBottomColor: colors.neutral?.c40 || colors.white,
    elevation: 0, // remove shadow on Android
    shadowOpacity: 0, // remove shadow on iOS
  },
  headerTitleAlign: "center" as const,
  headerTitleStyle: {
    color: colors.neutral?.c100 || colors.darkBlue,
    fontWeight: "600" as const,
  },
  headerBackTitleVisible: false,
});

// Settings Stack Navigator with exact Ledger Live Mobile styling
const SettingsStackNavigator = () => {
  const { colors } = useTheme();
  const stackNavConfig = useMemo(() => getStackNavigatorConfig(colors), [colors]);
  
  return (
    <Stack.Navigator screenOptions={stackNavConfig}>
      <Stack.Screen 
        name="SettingsMain" 
        component={Settings} 
        options={{ 
          title: "Settings",
          headerRight: () => <HelpButton />
        }}
      />
      <Stack.Screen 
        name="GeneralSettings" 
        component={GeneralSettings} 
        options={{ title: "General" }}
      />
    </Stack.Navigator>
  );
};

// MyLedger Screen - Device Manager (not settings)
const MyLedgerScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>My Ledger</Text>
      <Text style={{ marginTop: 10, textAlign: "center" }}>Device Manager</Text>
    </View>
  );
};

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
 * Tab Navigator - EXACT REPLICATION of official Ledger Live Mobile Tab Navigator
 * 
 * Key features matching official implementation:
 * - Uses createBottomTabNavigator from React Navigation
 * - Custom tabBar prop with our CustomTabBar component
 * - tabBarStyle with height: 300 for space reservation
 * - Proper safe area insets handling
 * - Official color and styling configuration
 * - 5-screen structure: Wallet, Earn, Transfer, Discover, MyLedger
 */
function TabNavigator() {
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
          headerShown: false,
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <ManagerTabIcon 
              color={color} 
              focused={focused}
              hasAvailableUpdate={true} // Show update badge for demo
            />
          ),
          tabBarTestID: "TabBarManager",
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * Main Navigator - Root Stack Navigator with Tab Navigator and Settings
 * 
 * Follows official Ledger Live Mobile structure:
 * - Main tab navigator for primary navigation
 * - Settings stack navigator accessible from Portfolio header
 * - Proper navigation hierarchy matching official app
 */
export default function MainNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background?.main || "#131214" },
      }}
    >
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsStackNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
} 