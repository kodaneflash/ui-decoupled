import color from "color";


// Color utilities for Portfolio screen replica
export const rgba = (c: string, a: number) => color(c).alpha(a).rgb().toString();

export const lightTheme = {
  dark: false,
  colors: {
    primary: "hsla(247, 56%, 68%, 1)",
    background: "#FFFFFF",
    card: "#FFFFFF",
    text: "rgb(28, 28, 30)",
    border: "rgb(199, 199, 204)",
    notification: "rgb(255, 69, 58)",
    
    // Main colors needed for Portfolio
    live: "#bdb3ff",
    alert: "#ea2e49",
    success: "#66BE54",
    fog: "#D8D8D8",
    white: "#ffffff",
    green: "rgb(102, 190, 84)",
    black: "#000000",
    orange: "#ff7701",
    grey: "#999999",
    
    // Derivatives needed for Portfolio
    lightLive: "#bdb3ff19",
    lightGrey: "#F9F9F9",
  },
};

export const darkTheme = {
  dark: true,
  colors: {
    primary: "hsla(247, 56%, 68%, 1)",
    card: "#1C1D1F",
    background: "#131214",
    text: "#FFFFFF",
    border: "rgba(255, 255, 255, 0.1)",
    notification: "rgb(255, 69, 58)",
    
    // Main colors needed for Portfolio
    live: "#bdb3ff",
    alert: "#ea2e49",
    success: "#66BE54",
    fog: "#A8A8A8",
    white: "#000000",
    green: "rgb(102, 190, 84)",
    black: "#FFFFFF",
    orange: "#ff7701",
    grey: "#aaa",
    
    // Crypto asset colors from screenshot
    cyan: "#41D9D9", // Ethereum/Tether icons
    blue: "#1570EF", // XRP icon  
    yellow: "#F7CA00", // Binance Smart Chain icon
    
    // Derivatives needed for Portfolio
    lightLive: "#bdb3ff19",
    lightGrey: "rgba(255,255,255, 0.05)",
  },
};

export type Theme = typeof lightTheme; 