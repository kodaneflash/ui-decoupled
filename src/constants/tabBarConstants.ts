// Tab Bar Constants - Exact dimensions from Ledger Live Mobile
export const TAB_BAR_HEIGHT = 56;
export const MAIN_BUTTON_SIZE = 64;

// MAIN_BUTTON_BOTTOM adjustment for our implementation:
// Official Ledger Live Mobile uses 16px, but our architecture creates a double offset
// because TransferFAB is positioned inside MiddleIconContainer (which already positions content)
// Adjust this value to achieve perfect visual match:
// - Try 8: Half offset (recommended starting point)
// - Try 0: Rely entirely on MiddleIconContainer positioning  
// - Try -4: Slight negative offset to counteract double positioning
export const MAIN_BUTTON_BOTTOM = -18; // Adjusted from official 16px

export const GRADIENT_HEIGHT = 103;
export const SAFE_HEIGHT = 103;

// Tab Configuration
export const TAB_ICON_SIZE = 24;
export const TAB_TEXT_VARIANT = "tiny";
export const TAB_TEXT_WEIGHT = "semiBold";

// Colors (semantic tokens)
export const ACTIVE_COLOR = "primary.c80"; // Purple #7C3AED
export const INACTIVE_COLOR = "neutral.c70"; // Gray
export const BACKGROUND_MAIN = "background.main"; // #131214
export const BACKGROUND_CARD = "card"; // #1C1D1F

// Crypto Currency Colors
export const CRYPTO_COLORS = {
  bitcoin: "#F7931A",
  ethereum: "#627EEA", 
  tether: "#26A17B",
  xrp: "#0085C3",
  bnb: "#F3BA2F",
} as const; 