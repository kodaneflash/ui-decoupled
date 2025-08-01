Identify and modify the code responsible for the positioning and height of the components, quick actions, assets/accounts menu/tabs, and time range selector on the apps portfolio screen. The objective is to adjust the positioning of these elements to match the layout of the real Ledger Live Mobile app,  the objective is to slightly adjust the positioning / reduce margins (or whatever change) to shift  the assets/ accounts tab, quickactionstabs, andthe time range selector slightly down without affecting anything else.   The modification should be made using code only from related Ledger Live Mobile components to maintain complete fidelity to the original design. Dont push the individual assets  and asset rows. down any further they are perfect. 

Please note that the size and styling of the components should not be altered, and the adjustments should be focused solely on positioning to align with the real Ledger Live Mobile app's layout as seen in the image provided.  Read @portfolioscreenbottomhalf.md  for context of which components are crucial to analyze.  Read components in @apps/ledger-live-mobile/src/screens/Portfolio  Compare the layout and structure of the components in the apps/ledger-live-mobile/src/screens/Portfolio directory with the components you are replicating. Ensure that your components use the exact margins, padding, layout, structure, and positioning to achieve pixel-perfect accuracy and 100% fidelity. Avoid fine-tuning the components yourself and instead analyze the related components for the necessary adjustments.  Ensure that the exact vertical spacing from the real Ledger Live Mobile app is implemented.



Replicate the quick action cards (buy, swap, receive, earn) and their respective icons (buy: plusmedium, swap: buycryptomedium, send: arrowtopmedium, receive: arrowbottommedium, earn: coinsmedium)  in the portfolio screen to be identical to the ledger live components. 

1. Review the file @assetlist.md for context and a detailed analysis of the ledger-live-mobile components we are replicating.

4. Recreate the bottom navigation menu (for static implementation) to use the exact same styling that creates the bottom nav menu from the ledger-live-mobile directory.  Focus on the styling  used for the custom tab bar design, the specific icons used for the five tab configuration, the  64px pirple circle FAB Button, ensure you pay attention to the sizes used for the icons, the colors used (only active state), and all of the the text, text size and weight, and the exact styling used to create the 64px purple circular button with Lottie animations. for example,  in the custom tab bar design: SVG-based curved cutout for the center FAB button
Precise dimensions: 56px height, 64px FAB, 16px bottom offset . Ensure you only use the exact styling from the official components from the promptsforai.md
apps
apps/ledger-live-mobile directory.  Use the exact The distinctive curved SVG shape with the floating action button creates Ledger Live's signature bottom navigation design. Use the same imports like  import { BottomTabBarProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";  import customTabBar from "../TabBar/CustomTabBar"; 


 and the individual assets' layout, styling, and components when 'asset' is selected.  Pay close attention to the components that create the precise layout, structure, styling, sizing, and weight of the text and images of the assets. Provide a comprehensive description of each component utilized, the component flow, and any other relevant details then either recreate our components for this or revise our current ones to use the EXACT same  code that controls the styling, icons used, text and text size, layout, structure, props to pass,     Please refer to the provided image of the bottom half of the Ledger Live for specific reference.

Please conduct a detailed analysis of the user interface (UI) elements in the bottom half of the Ledger Live portfolio screen. Focus on the assets list and the individual assets' layout, styling, and components when 'asset' is selected. Pay close attention to the components that create the precise layout, structure, styling, sizing, and weight of the text and images of the assets. Provide a comprehensive description of each component utilized, the component flow, and any other relevant details. Please refer to the provided image of the bottom half of the Ledger Live for specific reference.

5. Analyze @PortfolioQuickActionsBar.tsx to understand the code that creates the styling, spacing between it and the Time Range Selector, layout, text, positioning, and recreate it in our portfolioscreen to be underneath exactly how it appears in the image.

6. Use only code from the ledger live components for 100% fidelity.

Make sure to replicate the styling, layout, and positioning accurately, and ensure that the components appear as per the image provided.


Please conduct a comprehensive analysis of the bottom half of the real Ledger Live portfolio screen.

 Describe the components that create the UI appearance of the the bottom navigation menu that has a wallet, earn, (blue circle button with 2 arrows), discover and my ledger.  Analyze the specific icons used, the size of the icons, text, text size weight, the exact styling used to create the  blue circle button with the 2 arrows and everything else  that creates the precise layout, structure, styling of the bottom nav menu and individual icons. Provide a detailed description of each component utilized, the component flow, etc, imports used. and revise the file bottomnavmenu.md to be more informative, detaild, precise and how to exactly replicate this setup for 100% fidelity and pixel perfect accuracy. 

Provide a detailed and precise description of the components that constitute the UI appearance of the bottom navigation menu. This includes analyzing the specific icons used, their sizes, the text, text size, weight, and the exact styling employed to create the blue circle button with the 2 arrows, as well as any other elements contributing to the layout, structure, and styling of the bottom navigation menu and individual icons. Please ensure that the description is comprehensive and informative, allowing for 100% fidelity and pixel-perfect accuracy in replicating this setup.





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