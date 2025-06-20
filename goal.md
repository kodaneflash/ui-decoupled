You are an AI coding assistant working inside a repo called **`UIReplicationLedger/`**.  
Our goal is to build a high-fidelity, **static** React Native (TypeScript) replica of the **Portfolio** page from the **Ledger Live Mobile** monorepo.

open ios/UIReplicationLedger.xcworkspace

### What we're replicating
- **Screen**: `Portfolio` (Wallet tab) – total balance, Δ %, interactive mini-chart (24H / 1W / 1M / 1Y) and asset list (BTC, ETH, USDT, XRP, BNB, …).
- **Component Source**: Visual components must look identical to those in the original monorepo at `apps/ledger-live-mobile/src/...`.

### The Golden Rule: Simulate Data, NEVER Business Logic
- No Redux, no `live-common`, no device/bridge code, no analytics.
- Every remote or store call from the original must be replaced by a hard-coded object in `src/mock/`.

### Styling & Theming
- **UI Library**: We will exclusively use components from `@ledgerhq/native-ui`.
- **Custom Styling**: For any layout or custom styles not covered by `native-ui`, we will use `styled-components`.
- **Theme**: The application must use the `darkTheme` for its appearance. The colors should be sourced from a `src/styles/colors.ts` file, which will be a replica of the `darkTheme` object found in the original `apps/ledger-live-mobile/src/colors.tsx`.
- **Icons**: Icons will be sourced from `@ledgerhq/icons-ui/native`.

### Directory Layout
```
rntemp/
  └─ src/
     ├─ components/          # Reusable UI atoms (Graph, Delta, CurrencyUnitValue, LText, …)
     ├─ screens/Portfolio/   # PortfolioScreen wrapper and its direct sub-components
     ├─ mock/                # Static data + lightweight hooks (usePortfolio, useAccounts)
     ├─ types/               # Simplified "Display*" interfaces
     └─ styles/              # Global styles, colors.ts, and theme provider setup
```

### Data & Component Flow
```
src/mock/portfolio.ts, src/mock/accounts.ts
        ↓
src/mock/hooks.ts         (e.g. usePortfolio, useAccounts)
        ↓
src/screens/Portfolio/index.tsx
   ├─ PortfolioGraphCard.tsx
   │   └─ components/GraphCard.tsx
   │      ├─ components/Graph/index.tsx
   │      ├─ components/Delta.tsx
   │      └─ components/CurrencyUnitValue.tsx
   └─ PortfolioAssets.tsx
      └─ components/AssetsList.tsx
         └─ components/AssetRow.tsx
```

### Display Types (excerpt)
```ts
export interface DisplayCurrency { id:string; name:string; ticker:string; color:string; family:string; units:{code:string;magnitude:number;}[]; }
export interface DisplayAccount { id:string; name:string; balance:string; fiatBalance:string; currency:DisplayCurrency; spendableBalance:string; subAccounts?:DisplayTokenAccount[]; }
export interface DisplayPortfolio { totalFiatBalance:string; fiatChange:{percentage:number;value:string;}; balanceHistory:{date:Date;value:number;}[]; accounts:(DisplayAccount|DisplayTokenAccount)[]; }
```

### Environment & Dependencies
Use the exact versions from the original `ledger-live-mobile` app to ensure maximum fidelity.

- **Node**: `20.x (LTS)`
- **pnpm**: `9.12.3`
- **TypeScript**: `5.4.3`

**Package.json dependencies:**
```json
"dependencies": {
    "@ledgerhq/native-ui": "^0.35.0",
    "@react-navigation/native": "^6.1.7",
    "@react-navigation/stack": "^6.3.17",
    "babel-plugin-module-resolver": "^5.0.0",
    "d3-scale": "4.0.2",
    "d3-shape": "3.2.0",
    "lodash": "4.17.21",
    "react": "18.2.0",
    "react-native": "0.73.4",
    "react-native-gesture-handler": "2.12.0",
    "react-native-reanimated": "3.7.0",
    "react-native-safe-area-context": "^4.7.1",
    "react-native-screens": "^3.29.0",
    "react-native-svg": "14.1.0",
    "styled-components": "^6.1.19"
},
"devDependencies": {
    "@ledgerhq/icons-ui": "^0.10.0",
    "@react-native/metro-config": "0.77.2",
    "@react-native/typescript-config": "^0.73.1",
    "@types/react": "^18.2.0",
    "@types/react-native": "^0.73.0",
    "@types/lodash": "^4.17.0",
    "@types/d3-scale": "^4.0.0",
    "@types/d3-shape": "^3.1.0",
    "@types/styled-components-react-native": "^5.2.5",
    "typescript": "5.4.2"
}
```
> Note: React Native's "New Architecture" (Fabric) should be disabled in the `ios/Podfile` to ensure a stable build.

### Coding Conventions
1. Keep each component under 200 LoC; split when larger.
2. Use `LText` for all text, not the default `<Text>` component.
3. Adhere to the directory structure and use absolute imports via `babel-plugin-module-resolver` (e.g., `~/components/...`).