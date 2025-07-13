import React, { useEffect, useCallback, createContext, useContext } from "react";
import { StyleSheet, View, AppState } from "react-native";
import AuthScreen from "../components/AuthScreen";
import RequestBiometricAuth from "../components/RequestBiometricAuth";
import { 
  useAuthState, 
  useAppStateHandler, 
  usePrivacyInitialization,
  Privacy 
} from "../hooks/auth.hooks";

// Skip Lock Context for components that need to skip authentication
export const SkipLockContext = createContext<(enabled: boolean) => void>(() => {});

interface Props {
  children: React.ReactNode;
  privacy: Privacy | null | undefined;
  setPrivacy: (privacy: Privacy) => void;
  isPasswordLockBlocked?: boolean;
  closeAllDrawers?: () => void;
}

const AuthPass: React.FC<Props> = ({
  privacy,
  setPrivacy,
  isPasswordLockBlocked = false,
  closeAllDrawers = () => {},
  children,
}) => {
  const {
    isLocked,
    biometricsError,
    authModalOpen,
    mounted,
    setIsLocked,
    setBiometricsError,
    setAuthModalOpen,
    setSkipLockCount,
    lock,
    unlock,
  } = useAuthState({ privacy, closeAllDrawers });

  const { handleAppStateChange } = useAppStateHandler({ isPasswordLockBlocked, lock });

  const initializePrivacy = usePrivacyInitialization({ privacy, setPrivacy });

  // Initialize privacy settings on mount
  useEffect(() => {
    initializePrivacy();
  }, [initializePrivacy]);

  const setEnabled = useCallback(
    (enabled: boolean) => {
      if (mounted.current) {
        setSkipLockCount(prevCount => prevCount + (enabled ? 1 : -1));
      }
    },
    [mounted, setSkipLockCount],
  );

  // Try to auth with biometrics and fallback on password
  const auth = useCallback(() => {
    if (isLocked && privacy?.biometricsEnabled && !authModalOpen && mounted.current) {
      setAuthModalOpen(true);
    }
  }, [isLocked, privacy, authModalOpen, mounted, setAuthModalOpen]);

  const setupComponent = useCallback(() => {
    mounted.current = true;
    auth();

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    initializePrivacy();

    return () => {
      mounted.current = false;
      subscription.remove();
    };
  }, [auth, handleAppStateChange, initializePrivacy, mounted]);

  const handlePasswordStateChange = useCallback(() => {
    if (isLocked && !privacy?.hasPassword) {
      setIsLocked(false);
    }
  }, [isLocked, privacy?.hasPassword, setIsLocked]);

  useEffect(setupComponent, [setupComponent]);
  useEffect(handlePasswordStateChange, [handlePasswordStateChange]);

  const onSuccess = useCallback(() => {
    if (mounted.current) {
      setAuthModalOpen(false);
    }
    unlock();
  }, [unlock, mounted, setAuthModalOpen]);

  const onError = useCallback(
    (error: Error) => {
      if (mounted.current) {
        setAuthModalOpen(false);
        setBiometricsError(error);
      }
    },
    [mounted, setAuthModalOpen, setBiometricsError],
  );

  let lockScreen = null;

  if (isLocked && privacy?.hasPassword) {
    lockScreen = (
      <View style={styles.container}>
        <AuthScreen
          biometricsError={biometricsError}
          privacy={privacy}
          lock={lock}
          unlock={unlock}
        />
        <RequestBiometricAuth 
          disabled={!authModalOpen} 
          onSuccess={onSuccess} 
          onError={onError} 
        />
      </View>
    );
  }

  return (
    <SkipLockContext.Provider value={setEnabled}>
      {children}
      {lockScreen}
    </SkipLockContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 10,
  },
});

// Hook to use the SkipLockContext
export const useSkipLock = () => {
  return useContext(SkipLockContext);
};

export default AuthPass; 