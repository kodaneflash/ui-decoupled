import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DiscreetModeContextType {
  discreetMode: boolean;
  setDiscreetMode: (enabled: boolean) => void;
  shouldApplyDiscreetMode: boolean;
}

const DiscreetModeContext = createContext<DiscreetModeContextType>({
  discreetMode: true, // Default to true to show *** initially
  setDiscreetMode: () => {},
  shouldApplyDiscreetMode: false,
});

interface DiscreetModeProviderProps {
  shouldApplyDiscreetMode?: boolean;
  children: ReactNode;
}

export function DiscreetModeProvider({ 
  shouldApplyDiscreetMode = false, 
  children 
}: DiscreetModeProviderProps) {
  const [discreetMode, setDiscreetMode] = useState(true); // Start with discreet mode ON

  return (
    <DiscreetModeContext.Provider 
      value={{ 
        discreetMode, 
        setDiscreetMode, 
        shouldApplyDiscreetMode 
      }}
    >
      {children}
    </DiscreetModeContext.Provider>
  );
}

export const useDiscreetMode = () => {
  const context = useContext(DiscreetModeContext);
  if (!context) {
    throw new Error('useDiscreetMode must be used within a DiscreetModeProvider');
  }
  return context;
};

// HOC similar to ledger-live-mobile's withDiscreetMode
export function withDiscreetMode<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  shouldApplyDiscreetMode = true,
) {
  return (props: T) => (
    <DiscreetModeProvider shouldApplyDiscreetMode={shouldApplyDiscreetMode}>
      <Component {...props} />
    </DiscreetModeProvider>
  );
}

export default DiscreetModeContext; 