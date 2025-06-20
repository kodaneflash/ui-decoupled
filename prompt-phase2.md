# AI Coding Assistant Prompt - Ledger Live Portfolio UI Replica

## Project Context
You are building a **static UI replica** of the Ledger Live Mobile Portfolio screen. This is **Phase 2** of a 4-phase project.

## What's Already Implemented (Phase 1 ✅)
- **StyleProvider** - Theme system with `@ledgerhq/native-ui` + custom dark colors
- **LText** - Text component with Inter fonts (Regular, SemiBold, Bold) + all native-ui props
- **Color utilities** - `rgba()`, `darken()`, `lighten()`, `ensureContrast()`
- **Font linking** - Inter fonts properly linked via `react-native-asset`
- **Babel config** - Module resolver for `~` path aliases

## Current Task: Phase 2 - Core Shared Components

**Objective:** Replicate the fundamental UI components used throughout the Portfolio screen.

**Components to Build:**
1. **CurrencyUnitValue** - Formats and displays currency values (e.g., "$1,234.56")
2. **Delta** - Shows +/- change with colored indicators (green/red)
3. **CounterValue** - Displays fiat countervalues
4. **CircleCurrencyIcon** - Crypto currency icons with colored backgrounds

**Key Requirements:**
- **Static data only** - No business logic, calculations, or live data
- **Presentational components** - Receive pre-formatted data via props
- **Match original styling** - Use `@ledgerhq/native-ui` components and our theme
- **LText for all text** - Never use React Native's `<Text>` directly

**Reference Original Components:**
- `ledger-live/apps/ledger-live-mobile/src/components/CurrencyUnitValue.tsx`
- `ledger-live/apps/ledger-live-mobile/src/components/Delta.tsx`
- `ledger-live/apps/ledger-live-mobile/src/components/CounterValue.tsx`
- `ledger-live/apps/ledger-live-mobile/src/components/CircleCurrencyIcon.tsx`

**Architecture Pattern:**
Strip all Redux, live-common, and business logic. Keep only the presentational UI that accepts simple props like `value`, `currency`, `change`, etc.

**Next:** After Phase 2, we'll build the Portfolio graph section (Phase 3) and assets list (Phase 4). 