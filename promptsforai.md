Replicate the quick action cards (buy, swap, receive, earn) and their respective icons (buy: plusmedium, swap: buycryptomedium, send: arrowtopmedium, receive: arrowbottommedium, earn: coinsmedium)  in the portfolio screen to be identical to the ledger live components. 

1. Review the file @assetsaccounts.md for context and a detailed analysis of the ledger live components we are replicating.

2. Keep the Time Range Selector (1D, 1W, 1M, 1Y, ALL) as it is and  Quick Action Cards (Buy, Swap, Send, Receive, Earn) the same. Do not modify these parts.

3. Analyze the Assets/Accounts toggle bar  in @PortfolioQuickActionsBar.tsx, along with the corresponding icons used:
   - Buy: PlusMedium (+)
   - Swap: BuyCryptoMedium (exchange arrows)
   - Send: ArrowTopMedium (↑)
   - Receive: ArrowBottomMedium (↓)
   - Earn: CoinsMedium (stacked coins)

4. Recreate the Quick Action Cards and icons in our portfolio screen to be identical. The buttons do not need to function; they just need to appear exactly the same.

5. Analyze @PortfolioQuickActionsBar.tsx to understand the code that creates the styling, spacing between it and the Time Range Selector, layout, text, positioning, and recreate it in our portfolioscreen to be underneath exactly how it appears in the image.

6. Use only code from the ledger live components for 100% fidelity.

Make sure to replicate the styling, layout, and positioning accurately, and ensure that the components appear as per the image provided.


Please conduct a comprehensive analysis of the bottom half of the real Ledger Live portfolio screen. Describe the components that create the UI appearance of the assets list that shows the list of assets when selected. ensuring that the layout matches the *NAME** used in the real Ledger Live for 100% fidelity. Additionally, analyze the components in Ledger Live that creates the layout styling etc of the actual assets when 'asset' is selected, and identify the styling, sizing and weight of the text, image of asset, name of asset and everything else  that creates the precise layout, structure, styling of the asset list and individual assets. Provide a detailed description of each component utilized, the component flow, etc. The provided image is the bottom half of the ledger live for reference of the components I am precisely asking about.






Are all of those refactored components you made  involved in rendering the Wallet tab screen  replicating the one in  Ledger Live Mobile  include the static (mock) data while retaining the *EXACT* original component structure, props, and styling, ui libraries used? (libs/ui)  Confirm? Whats the most efficient, simplest but effective,  way of implementing the EXACT same styling for one static screen (the wallet view in image) without including unenssacary things? I dont  care about the data dstructures, I only cre about the corect styling and UI components looking the same. 

Exact visual match to the original
✅ Minimal code (probably under 100 lines total)
✅ Proper UI library usage
✅ Correct styling tokens
✅ Static data hardcoded inline
✅ No unnecessary abstractions

. Only Essential Dependencies
@ledgerhq/native-ui (for UI components)
styled-components/native (for theming)



As a senior TypeScript & React Native engineer, your task is to thoroughly analyze all the components mentioned in implementation.md and then provide a comprehensive explanation of each component's file and how they interoperate within the portfolio components, similar to the analysis of StyleProvider in  @implementation.md and write  the summaries for each component. Begin analyzing only one component at a time, in order to give a full in depth detail and explaination, beignnning with apps/ledger-live-mobile/src/screens/Portfolio/index.tsx  and apps/ledger-live-mobile/src/screens/Portfolio/Header.tsx 
Your analysis should delve into the functionality, structure, and interactions of each component, elucidating how they contribute to the overall portfolio components. Additionally, you should highlight any key dependencies, relationships, or patterns within the components' files and their integration with other components. Your explanation should aim to provide a deep understanding of the components' roles and interactions for the development and maintenance of the portfolio.



As a senior TypeScript & React Native engineer, your task is to implement a static UI replica of the Ledger Live Mobile Portfolio screen with 100% visual fidelity. This requires matching exact colors, typography, spacing, component dimensions, positioning, and visual states specified in the implementation.md file. Only create one component at a time, then ask for permission to move onto the next, identify the best order to create the components in to minimize risk of errors.  Begin with the theme configuration.  The technical requirements include using TypeScript with strict mode enabled, importing specific components from '@ledgerhq/native-ui', utilizing styled-components for custom styling, applying the theme via the '{ colors }' hook, using the LText component instead of React Native Text, and optimizing performance with React.memo. The styling approach should prioritize @ledgerhq/native-ui props-based styling, with styled-components used for custom styling needs, and theme access obtained through '{ colors }' for color references. 






Your code structure should follow the provided TypeScript template, utilizing the requirements in @implementation.md  identify the correct theme configuration file the components  inapps/ledger-live-mobile/src/screens/Portfolio  use, and incorporating the use of styled-components if needed, defining the component's props interface, and ensuring the usage of @ledgerhq/native-ui components. The validation checklist outlines the specific criteria that need to be met, including matching exact visual specifications, using correct imports and patterns, applying exact colors, typography, and spacing, implementing proper TypeScript interfaces, utilizing React.memo for optimization, and adhering to static/presentational requirements without dynamic logic. You should also reference the provided files for exact specifications and consider component-specific requirements, such as the color palette, darkTheme object for styled-components ThemeProvider, and header section specifications.

Your implementation must accurately replicate the visual specifications and technical requirements outlined in the provided documentation, ensuring 100% visual fidelity and adherence to the specified coding patterns and standards.  





 Reverse engineer the components related to the apps/ledger-live-mobile portfolio section to recreate the portfolio screen with identical 100% fidelity styling in the UIReplicationLedger project. Your focus should be on achieving optimal, efficient, and error-free replication that follows best practices. The recreated portfolio screen should have the same styling but no business logic or dynamic data, remaining entirely static. Refer to @dataflows.md for detailed information regarding component flows, style sources, key props flow, design tokens used, layout and positioning, chart section, asset list, etc. It is crucial to achieve an exact visual match to the original screen.


 You're a master in TypeScript, React Native, Expo, and Mobile UI development. Your task is to reverse engineer the components related to the apps/ledger-live-mobile portfolio section to recreate the portfolio screen in the provided image. Identify the most optimal, efficient strategy following best practices, avoiding errors and type errors. Your solution should focus solely on recreating the portfolio screen using components from the UIReplicationLedger project, ensuring 100% fidelity styling, but with no business logic or dynamic data—everything will be static. Please refer to @dataflows.md for detailed information and context explaining the component flows, style sources, key props flow, design tokens used, layout and positioning, chart section, asset list, etc.