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