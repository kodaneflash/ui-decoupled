# Roadmap: Replicating the Ledger Live Portfolio Screen

This document outlines the strategic roadmap for building a high-fidelity, static UI replica of the Ledger Live Mobile Portfolio screen. The core principle is to **simulate data, never business logic**. At every step, the goal is to extract and adapt presentational components, replacing any Redux or `live-common` dependency with simple, hardcoded mock data. 

---

### **Visual Target: The `Portfolio` Screen**

**Our one and only objective is to replicate the `Portfolio` screen, whose primary source file is located at `apps/ledger-live-mobile/src/screens/Portfolio/index.tsx`.** This screen, which functions as the main "Wallet" tab, is the definitive blueprint for the project. All development work—from component styling and layout to data representation—must be aimed at producing a high-fidelity replica of this specific screen and its constituent components. No other screens or features are in scope. Simplify the structure as much as possible whilst retaining 100% fidelity. All data will be static. 

t Hierarchy

The screen is assembled from the following key components. The task is to replicate the *presenters* and create simplified *containers*.

*   **Screen Entry:** `PortfolioScreen` (`.../screens/Portfolio/index.tsx`)
    *   **Role:** The top-level component that calls mock hooks and assembles the main sections.
*   **Graph Section:**
    *   **Container:** `PortfolioGraphCard` (`.../screens/Portfolio/PortfolioGraphCard.tsx`)
    *   **Presenter:** `GraphCard` (`.../components/GraphCard.tsx`)
*   **Assets List Section:**
    *   **Container:** `PortfolioAssets` (`.../screens/Portfolio/PortfolioAssets.tsx`)
    *   **List Renderer:** `Assets` (`.../screens/Portfolio/Assets.tsx`)
    *   **Row Presenter:** `AssetRow` (`.../screens/WalletCentricAsset/AssetRow.tsx`)

---

### **Architectural Pattern: Container vs. Presentational**

**Core Concept:** The `dataflows.md` analysis reveals a critical architectural pattern used in the original app: the separation of **Container** components from **Presentational** components.
*   **Containers** (e.g., `PortfolioGraphCard`) are responsible for data fetching and logic. They call hooks like `usePortfolioAllAccounts` but render very little UI themselves.
*   **Presentational Components** (e.g., `GraphCard`, `AssetRow`) are responsible for the UI. They receive all their data via props and are unaware of where it came from.

**Our Task:** For a 100% fidelity static replica, our goal is to:
1.  **Recreate the Presentational components** as closely as possible.
2.  **Replace the Container components** with simplified wrappers that call our mock hooks and pass the static data down as props.

---

### **Phase 1: Project Foundation & Theming**

**Goal:** Establish a solid foundation for the application, including dependencies, directory structure, fonts, and the core styling and theming system. A correct foundation prevents refactoring later.

**Context & Pointers:**

* 
*   **Directory Structure:** The replica should mirror the original monorepo's separation of concerns. A recommended structure is outlined in `prompt.md`, separating `components`, `screens`, `mock`, `styles`, and `types`.
*   **Fonts:** The visual identity of Ledger Live relies on the "Inter" font family. These font files are located in `ledger-live/apps/ledger-live-mobile/assets/fonts/`. They must be correctly added and linked in the native iOS project (`UIReplicationLedger.xcworkspace`).
*   **Theming System:** The application's styling is driven by a theme object provided via `styled-components`.
    *   The theme definition, including the crucial `darkTheme` object and color manipulation helpers (`rgba`, `darken`), can be found in `ledger-live/apps/ledger-live-mobile/src/colors.tsx`.
    *   The replica must implement a `StyleProvider` that wraps the entire application and provides this `darkTheme` through `styled-components`' `ThemeProvider`.

---

### **Phase 2: Essential Components & Folder Structure**

**Goal:** Create the core components and folder structure needed to replicate the Portfolio screen shown in the reference image.

**Priority Components (from `dataflows.md`):**

**A. Screen Structure Components:**
*   **`src/screens/Portfolio/index.tsx`** - Main Portfolio screen container
*   **`src/screens/Portfolio/PortfolioGraphCard.tsx`** - Container for balance and graph section
*   **`src/screens/Portfolio/PortfolioAssets.tsx`** - Container for crypto assets list
*   **`src/screens/Portfolio/Assets.tsx`** - Asset list renderer with FlatList

**B. Presentational Components:**
*   **`src/components/GraphCard.tsx`** - Balance display and chart component
*   **`src/components/AccountRow.tsx`** - Individual crypto asset row (Bitcoin, Ethereum, etc.)
*   **`src/components/CurrencyUnitValue.tsx`** - Formats currency values ("$0.00", "0 BTC")
*   **`src/components/Delta.tsx`** - Change indicators with colors

**C. Mock Data Hooks:**
*   **`src/mock/usePortfolio.ts`** - Replaces `usePortfolioAllAccounts`
*   **`src/mock/useAccounts.ts`** - Returns hardcoded crypto asset list

---

### **Phase 3: Portfolio Graph Section**

**Goal:** Build the top section showing "$0.00" balance and line chart.

**Context & Pointers:**


**Implementation Order:**
1. **PortfolioGraphCard** - Container calling `usePortfolio()` mock hook
2. **GraphCard** - Displays balance using `CurrencyUnitValue` component
3. **Simple Chart** - Basic line chart using `react-native-svg` (static for now)
4. **Integration** - Connect components in main Portfolio screen

*   **Mock Data:** The original screen uses the `usePortfolioAllAccounts` hook to calculate graph data. The replica must replace this with a mock hook (`usePortfolio`) that returns a static `DisplayPortfolio` object. This object is the single source of truth for this section and should contain a `balanceHistory` array of data points for the chart.
*   **Component Composition:** Following the Container/Presentational pattern:
    *   **Container (`PortfolioGraphCard.tsx`):** This component's sole responsibility is to call the `usePortfolio` mock hook and pass the resulting data to its child.
    *   **Presenter (`GraphCard.tsx`):** This is the pure UI component to replicate. It receives the `portfolio` object as a prop and arranges the `Graph`, `Delta`, and `CurrencyUnitValue` children.
    *   **Graph Engine (`Graph/`):** The `Graph` directory contains the complex low-level charting component that relies on `d3-shape` and `react-native-svg`.

---

### **Phase 4: Assets List Section**

**Goal:** Build the crypto assets list (Bitcoin, Ethereum, Tether USD, XRP, Binance Smart Chain).


**Implementation Order:**
1. **useAccounts mock** - Returns hardcoded array of crypto assets
2. **AccountRow** - Individual asset row with icon, name, balance
3. **Assets** - FlatList renderer for asset rows
4. **PortfolioAssets** - Container calling `useAccounts()` hook
5. **Final Integration** - Complete Portfolio screen assembly
*   **Mock Data:** The original screen uses Redux selectors (`flattenAccountsSelector`) and distribution hooks to manage the list of accounts. The replica will replace this with a mock hook (`useAccounts`) that returns a hardcoded array of `DisplayAccount` objects.
*   **Component Composition:** This section also follows a clear hierarchy:
    *   **Entry Point (`PortfolioAssets.tsx`):** This is the top-level component for this section, included in the main `Portfolio` screen. In the replica, its main job is to call the `useAccounts` mock hook and pass the data down.
    *   **List Renderer (`Assets.tsx`):** This component receives the array of mock accounts via props from `PortfolioAssets` and is responsible for rendering the `FlatList`.
    *   **Row Presenter (`AssetRow.tsx`):** This is the purely presentational component for a single item in the list. Its source is in `.../screens/WalletCentricAsset/AssetRow.tsx`, and it receives one account object as a prop to display its name and balance.