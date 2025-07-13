import { useCallback, useEffect, useRef } from "react";
import ReactNativeBiometrics from "react-native-biometrics";
import { AUTH_STRINGS } from "../constants/authStrings";

const rnBiometrics = new ReactNativeBiometrics();

interface Props {
  disabled: boolean;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

export function useBiometricAuth({ disabled, onSuccess, onError }: Props) {
  const pending = useRef(false);
  
  const auth = useCallback(async () => {
    if (pending.current) {
      return;
    }

    pending.current = true;

    try {
      const result = await rnBiometrics.simplePrompt({ 
        promptMessage: AUTH_STRINGS.unlock.biometricsTitle
      });
      
      if (result.success) {
        onSuccess();
      }
      pending.current = false;
    } catch (error) {
      pending.current = false;
      onError(error as Error);
    }
  }, [onError, onSuccess]);

  useEffect(() => {
    if (disabled) {
      return;
    }

    auth();
  }, [disabled, auth]);
}

const RequestBiometricAuth: React.FC<Props> = (props) => {
  useBiometricAuth(props);
  return null;
};

export default RequestBiometricAuth; 