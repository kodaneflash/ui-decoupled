
Key Props Flow:
portfolio: Portfolio - Balance data down to GraphCard
assets: Asset[] - Asset list down to AssetRow
discreetMode: boolean - Passed via context to hide values
hideEmptyTokenAccount: boolean - Filtering control

STYLE SOURCES
Primary UI Kit Imports:
import { Box, Flex, Text, Button, IconsLegacy } from "@ledgerhq/native-ui";
import { TabSelector } from "@ledgerhq/native-ui";

import { Box, Flex, Text, Button, IconsLegacy } from "@ledgerhq/native-ui";
import { TabSelector } from "@ledgerhq/native-ui";
import { useTheme } from "styled-components/native";
// Access: colors.background.main, colors.text, etc.

Design Tokens Used:
colors.background.main - Main background (#131214 dark)
colors.card - Card backgrounds (#1C1D1F)
colors.text - Primary text (#FFFFFF)
colors.primary - Accent color (purple)
Spacing: px={6}, mt={7}, mb={24} (4px base unit)
Typography: variant="h4", variant="body", fontWeight="semiBold"

LAYOUT & POSITIONING
Header Section:
WalletTabSafeAreaView with edges={["left", "right"]}
Title: Inter font, semibold, center-aligned
Eye icon: 24px, positioned top-right

Segmented Control:
TabSelector component, height 40px, margin bottom 16px
Pills: rounded corners, purple active state
Labels: "Assets", "Accounts" (translatable)

Balance Display:
Large currency text: CurrencyUnitValue component
Font size: ~48px, white color, center-aligned
Delta component: green/red based on change direction

Chart Section:
Container: GraphCard with portfolio data
SVG-based line chart using react-native-svg
Height: ~200px, responsive width

Asset List:
FlatList with AssetRow items
Row height: ~72px with 16px vertical padding
Icon: 40px circular with currency color
Layout: Flex row with justifyContent="space-between"
Separators: 1px gray lines between rows

Chart Section:
Container: GraphCard with portfolio data
SVG-based line chart using react-native-svg
Height: ~200px, responsive width

Asset List:
FlatList with AssetRow items
Row height: ~72px with 16px vertical padding
Icon: 40px circular with currency color
Layout: Flex row with justifyContent="space-between"
Separators: 1px gray lines between rows
Bottom Navigation:
Safe area aware, 80px height
FAB button: 56px diameter, centered, purple background
Tab icons: 24px, gray inactive, white active

Bottom Navigation:
Safe area aware, 80px height
FAB button: 56px diameter, centered, purple background
Tab icons: 24px, gray inactive, white active

NATIVE-UI USAGE NOTES
Component Preferences:
Use LText instead of React Native Text (custom font handling)
CurrencyUnitValue for all monetary displays (formatting & localization)
Delta component for percentage changes (automatic color coding)
CollapsibleHeaderFlatList for performance with large lists


@ledgerhq/native-ui: This is the main component library. Layout and spacing are achieved using props on components like Flex and Box (e.g., px={6}, mt={7}, flexDirection="row"). This is the preferred method for structure and layout.

styled-components: Used for more specific or one-off styling needs that go beyond the props-based system of @ledgerhq/native-ui.

styled-components: Used for more specific or one-off styling needs that go beyond the props-based system of @ledgerhq/native-ui.
All components work within a ThemeProvider that provides a theme object (e.g., darkTheme) with colors, fonts, etc., accessible via the useTheme hook.

All components work within a ThemeProvider that provides a theme object (e.g., darkTheme) with colors, fonts, etc., accessible via the useTheme hook. 

STYLE SOURCES
Primary UI Kit Imports:
import { Box, Flex, Text, Button, IconsLegacy } from "@ledgerhq/native-ui";
import { TabSelector } from "@ledgerhq/native-ui";

Theme & Styling:
import { useTheme } from "styled-components/native";
// Access: colors.background.main, colors.text, etc.

Design Tokens Used:
colors.background.main - Main background (#131214 dark)
colors.card - Card backgrounds (#1C1D1F)
colors.text - Primary text (#FFFFFF)
colors.primary - Accent color (purple)
Spacing: px={6}, mt={7}, mb={24} (4px base unit)
Typography: variant="h4", variant="body", fontWeight="semiBold"

LAYOUT & POSITIONING
Header Section:
WalletTabSafeAreaView with edges={["left", "right"]}
Title: Inter font, semibold, center-aligned
Eye icon: 24px, positioned top-right
Segmented Control:
TabSelector component, height 40px, margin bottom 16px
Pills: rounded corners, purple active state
Labels: "Assets", "Accounts" (translatable)
Balance Display:
Large currency text: CurrencyUnitValue component
Font size: ~48px, white color, center-aligned
Delta component: green/red based on change direction

Chart Section:
Container: GraphCard with portfolio data
SVG-based line chart using react-native-svg
Height: ~200px, responsive width
Asset List:
FlatList with AssetRow items
Row height: ~72px with 16px vertical padding
Icon: 40px circular with currency color
Layout: Flex row with justifyContent="space-between"
Separators: 1px gray lines between rows
Bottom Navigation:
Safe area aware, 80px height
FAB button: 56px diameter, centered, purple background
Tab icons: 24px, gray inactive, white active


NATIVE-UI USAGE NOTES
Component Preferences:
Use LText instead of React Native Text (custom font handling)
CurrencyUnitValue for all monetary displays (formatting & localization)
Delta component for percentage changes (automatic color coding)
CollapsibleHeaderFlatList for performance with large lists

Layout Props Pattern:
<Box background={colors.background.main} px={6} mt={7}>
<Flex flex={1} flexDirection="row" justifyContent="space-between">

Key Wrappers:
withDiscreetMode(Component) - HOC for balance hiding
globalSyncRefreshControl() - Pull-to-refresh functionality
ReactNavigationPerformanceView - Performance monitoring wrapper

 PortfolioScreen (screens/Portfolio/index.tsx)
This is the top-level component that orchestrates the entire screen.
Role: Screen Assembler & High-Level Layout.
Styling Responsibility:
It uses RefreshableCollapsibleHeaderFlatList, a key component that manages the overall scrolling behavior and the collapsing header effect.
It assembles the screen by creating a data array of JSX elements. This pattern allows it to build the screen section by section.
It uses Flex and Box components with spacing props like px={6} to establish the main horizontal padding for all sections, ensuring consistent alignment.
It arranges the major screen sections in the correct order: the graph card area, the assets list, the allocations section, and the operations history.

PortfolioGraphCard (Implemented via GraphCardContainer.tsx and GraphCard.tsx)
This is the section at the top of the screen that displays the total balance and the historical graph. It's a classic container/presenter pattern.
GraphCardContainer.tsx: 
Role: Data Provider (Container).
Styling Responsibility: Minimal. Its main job is to fetch data and pass it to the presentational component. It doesn't contribute significantly to the layout.
GraphCard.tsx:
Role: Visual Presentation (Presenter).
Styling Responsibility: This component is crucial for the styling of the portfolio graph section.
It uses Flex and Box from @ledgerhq/native-ui to structure the card's content.
It positions the total balance (CurrencyUnitValue), the period change (Delta), the graph tabs, and the chart itself.
It defines the card's background, padding, and internal spacing.

 PortfolioAssets (screens/Portfolio/PortfolioAssets.tsx)
This component manages the "Assets" and "Accounts" tabs and the lists below them.
Role: Assets Section Container.
Styling Responsibility:
It arranges the PortfolioQuickActionsBar and the TabSection.
It uses Box with vertical spacing props (my={24}) to position these elements correctly within the screen flow.
It orchestrates which list (Assets or Accounts) is visible based on the selected tab.

 TabSection (screens/Portfolio/TabSection.tsx)
This component renders the tab switcher ("Assets" / "Accounts") and handles the animated transition between the two lists.
Role: Tabbed List Manager.
Styling Responsibility:
Uses TabSelector from @ledgerhq/native-ui to create the tab interface.
Uses a horizontal Flex container (flexDirection="row", width="200%") to place the assets and accounts lists side-by-side.
The Animated.View components control the sliding animation by manipulating translateX, effectively creating a carousel-like view controlled by the tabs.
5. Assets (screens/Portfolio/Assets.tsx)
This component is responsible for rendering the list of crypto assets.
Role: List Renderer.
Styling Responsibility: Minimal.
Its primary job is to render a FlatList.
It passes the list data to the FlatList and delegates the rendering and styling of each individual row to the AssetRow component.
The contentContainerStyle={{ flex: 1 }} ensures the list expands to fill available space if needed.

 AssetRow / AccountRow (Referenced from screens/WalletCentricAsset/AssetRow.tsx)
This is the purely presentational component for a single item in the assets list. My analysis is based on the replica at src/components/AccountRowLayout.tsx.
Role: List Item Presenter.
Styling Responsibility: This is where the fine-grained styling of each list item happens.
It uses a root Flex component with flexDirection="row" and alignItems="center" to structure the row horizontally.
It defines the row's padding (py={6}, px={4}).
It handles the alignment and spacing between the currency icon, the currency name/ticker, the balance in fiat, and the crypto amount.


ARCHITECTURE MAP
apps/ledger-live-mobile/src/
├── screens/Portfolio/
│   ├── index.tsx                    # Main Portfolio screen container
│   ├── PortfolioAssets.tsx         # Assets list container (Redux-connected)
│   ├── Assets.tsx                  # FlatList renderer for asset rows
│   ├── PortfolioGraphCard.tsx      # Balance & chart section container
│   ├── GraphCardContainer.tsx      # Graph card with currency status
│   └── TabSection.tsx              # Assets/Accounts tab switcher
├── components/
│   ├── GraphCard.tsx               # Balance display & chart component
│   ├── WalletTab/
│   │   ├── CollapsibleHeaderFlatList.tsx  # Main scrollable container
│   │   └── WalletTabSafeAreaView.tsx      # Safe area wrapper
│   └── LText/index.tsx             # Custom text component
└── screens/WalletCentricAsset/
    └── AssetRow.tsx                # Individual crypto asset row

    Data Sources to Mock:
usePortfolioAllAccounts() - Portfolio balance & history
flattenAccountsSelector - Asset list from Redux
discreetModeSelector - Hide/show balance toggle
selectedTabPortfolioAssetsSelector - Tab state
useDistribution() - Asset allocation calculation

COMPONENT FLOW
PortfolioScreen
├── RefreshableCollapsibleHeaderFlatList
│   ├── WalletTabSafeAreaView
│   │   ├── FirmwareUpdateBanner
│   │   ├── PortfolioGraphCard → GraphCardContainer → GraphCard
│   │   └── ContentCardsLocation
│   ├── AnimatedContainer
│   │   └── PortfolioAssets
│   │       ├── TabSection (Assets/Accounts tabs)
│   │       │   ├── TabSelector
│   │       │   ├── AssetsListView → Assets → AssetRow
│   │       │   └── AccountsListView
│   │       └── Assets → FlatList<AssetRow>
│   └── SectionContainer[]
│       ├── AllocationsSection
│       └── PortfolioOperationsHistorySection













Comprehensive Data Flow: Wallet Screen
This screen is the Portfolio, located at apps/ledger-live-mobile/src/screens/Portfolio/index.tsx. It's a complex screen that aggregates data from the Redux store, which holds the entire app's state, including your accounts, settings, and market data.
Here is a diagram illustrating the data flow:


Data Source: The Redux Store
The single source of truth for the app is the Redux store. For this screen, three main parts (or "reducers") of the store are crucial:
accounts: Holds a list of all your accounts, their sub-accounts, balances, and transaction histories.
settings: Contains user preferences, including the selected time range for the graph (e.g., 24h, week, month) and which accounts to hide.
countervalues: Stores the market price data needed to convert your crypto balances into your chosen fiat currency (e.g., USD).

2. Data Processing: Live Common Hooks
To transform the raw data from the store into something displayable, the app uses hooks from the @ledgerhq/live-common library.
usePortfolioAllAccounts: This is the most important hook for the top part of the screen. It takes all your accounts and the countervalues data to calculate:
Total Portfolio Balance: The $0.00 value you see.
Historical Data: A series of data points for the balance over time, which is used to draw the graph.

UI Component Breakdown & Data Flow
The Portfolio screen is built from several key components, each with a specific role.
A. Total Balance and Graph
Portfolio/index.tsx: The main screen file. It includes a PortfolioGraphCard component.
PortfolioGraphCard: This component calls the usePortfolioAllAccounts hook to get the calculated portfolio data.
GraphCard.tsx: This is the presentational component that receives the portfolio data as props. It uses the total balance to display the $0.00 value and the historical data to render the line chart. It also gets the time range (e.g., "24H") from the settings state to know which set of historical data to display.

 List of Crypto Assets (Bitcoin, Ethereum, etc.)
Portfolio/index.tsx: The main screen includes the PortfolioAssets component.
PortfolioAssets.tsx:
It uses the accountsSelector to pull the raw list of accounts directly from the Redux store.
It then passes these accounts to a custom hook, useFlattenSortAccounts, which sorts them according to your preferences and prepares them for display.
Assets.tsx: This component receives the final, sorted list of accounts. It uses a React Native FlatList to efficiently render the list.
AccountRow.tsx: This is the component for each individual row in the list (e.g., the "Bitcoin" row). It receives the data for a single account (name, balance in crypto, balance in fiat) and displays it. The fiat value is pre-calculated and stored within the account object, powered by the countervalues state.

Summary of the Flow
Data originates in the Redux store (accounts, settings, prices).
Hooks and selectors read this data, with usePortfolioAllAccounts being key for calculating the total balance and graph data.
The main Portfolio screen assembles different components.
GraphCard displays the total balance and chart.
Assets and AccountRow work together to display the list of individual crypto assets and their balances.