import React, { useRef, useCallback } from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import { IconsLegacy, Flex } from "@ledgerhq/native-ui";
import SettingsCard from "../../components/SettingsCard";
import SettingsNavigationScrollView from "../../components/SettingsNavigationScrollView";
import PoweredByLedger from "./PoweredByLedger";

interface SettingsProps {
  navigation: any;
}

export default function Settings({ navigation }: SettingsProps) {
  const count = useRef(0);

  const onDebugHiddenPress = useCallback(() => {
    count.current++;
    if (count.current > 6) {
      count.current = 0;
      console.log("Debug menu would open");
    }
  }, []);

  const handlePlaceholderPress = useCallback(() => {
    console.log("Feature not implemented in demo");
  }, []);

  return (
    <SettingsNavigationScrollView>
      {/* General Settings - Only working navigation */}
      <SettingsCard
        title="General"
        desc="Configure general Ledger Live settings."
        Icon={IconsLegacy.MobileMedium}
        onClick={() => navigation.navigate("GeneralSettings")}
        arrowRight
        settingsCardTestId="general-settings-card"
      />
      
      {/* About */}
      <SettingsCard
        title="About"
        desc="App information, terms and conditions, and privacy policy."
        Icon={IconsLegacy.BracketsMedium}
        onClick={handlePlaceholderPress}
        arrowRight
      />
      
      {/* Notifications */}
      <SettingsCard
        title="Notifications"
        desc="Manage your notifications"
        Icon={IconsLegacy.NotificationsMedium}
        onClick={handlePlaceholderPress}
        arrowRight
      />
      
      {/* Help */}
      <SettingsCard
        title="Help"
        desc="Learn more about Ledger Live or how to get help."
        Icon={IconsLegacy.LifeRingMedium}
        onClick={handlePlaceholderPress}
        arrowRight
      />
      
      {/* Experimental features */}
      <SettingsCard
        title="Experimental features"
        desc="Try out the Experimental features and let us know what you think."
        Icon={IconsLegacy.ChartNetworkMedium}
        onClick={handlePlaceholderPress}
        arrowRight
      />
      
      {/* Feedback */}
      <SettingsCard
        title="Feedback"
        desc="Give us your feedback on the app"
        Icon={IconsLegacy.StarMedium}
        onClick={handlePlaceholderPress}
      />
      
      {/* Developer */}
      <SettingsCard
        title="Developer"
        desc="Try out the Developer features and let us know what you think."
        Icon={IconsLegacy.ToolMedium}
        onClick={handlePlaceholderPress}
      />
      
      {/* Powered by Ledger - Hidden debug trigger */}
      <TouchableWithoutFeedback onPress={onDebugHiddenPress}>
        <View>
          <PoweredByLedger />
        </View>
      </TouchableWithoutFeedback>
    </SettingsNavigationScrollView>
  );
} 