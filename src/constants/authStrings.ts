// Exact strings from Ledger Live's English translation files
// ledger-live/apps/ledger-live-mobile/src/locales/en/common.json

export const AUTH_STRINGS = {
  failed: {
    biometrics: {
      title: "Face ID unlock failed",
      touchid: "TouchID",
      faceid: "FaceID", 
      fingerprint: "Fingerprint",
      description: "Enter your password to continue",
      authenticate: "Please authenticate with the Ledger Live app"
    },
    denied: "Auth Security was not enabled because your phone failed to authenticate.",
    title: "Authentication failed",
    buttons: {
      tryAgain: "Try again",
      reset: "Reset"
    }
  },
  unlock: {
    biometricsTitle: "Please authenticate with the Ledger Live app",
    title: "Welcome back",
    desc: "Enter your password to continue",
    inputPlaceholder: "Type your password",
    login: "Log in",
    forgotPassword: "I lost my password"
  },
  addPassword: {
    placeholder: "Choose your password",
    title: "Password Lock"
  },
  confirmPassword: {
    title: "Confirm Password",
    placeholder: "Confirm your password"
  },
  enableBiometrics: {
    title: "Face ID",
    desc: "To enable and set Face ID activate \"App lock\".",
    touchid: "TouchID",
    faceid: "FaceID",
    fingerprint: "Fingerprint"
  }
};

export const RESET_STRINGS = {
  title: "Uninstall then reinstall Ledger Live",
  description: "Please uninstall then reinstall the app on your phone to delete Ledger Live data, including accounts and settings.",
  button: "Reset",
  warning: "Resetting Ledger Live will erase your swap transaction history for all your accounts."
};

export const SETTINGS_STRINGS = {
  display: {
    password: "Password Lock",
    passwordDesc: "Secure your app with a password",
    passwordDescBioCompat: "Secure your app with a password and Face ID"
  }
}; 