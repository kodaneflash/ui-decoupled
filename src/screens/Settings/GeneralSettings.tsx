import React, { useState, useCallback, ReactNode } from "react";
import { Text, Switch, Flex } from "@ledgerhq/native-ui";
import SettingsNavigationScrollView from "../../components/SettingsNavigationScrollView";
import SettingsRow from "../../components/SettingsRow";
import AuthSecurityToggle from "../../components/AuthSecurityToggle";
import styled from "styled-components/native";

const StyledText = styled(Text).attrs(() => ({
  color: "neutral.c70",
}))`
  text-decoration: underline;
  text-decoration-color: ${({ theme }) => theme.colors.neutral.c70};
`;

export default function GeneralSettings() {
  // State for toggles (demo purposes - no actual functionality)
  const [mevProtection, setMevProtection] = useState(true);
  const [bugReports, setBugReports] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [personalizedExperience, setPersonalizedExperience] = useState(true);

  const handlePlaceholderPress = useCallback(() => {
    console.log("Feature not implemented in demo");
  }, []);

  const onPressPrivacyLink = useCallback(() => {
    console.log("Privacy notice pressed");
  }, []);

  // MEV Protection description with Privacy notice link
  const mevDescription: ReactNode = (
    <Flex>
      <Text variant="body" fontWeight="medium" color="neutral.c70">
        Enable MEV Protection for more reliable transactions on Ethereum.
      </Text>
      <StyledText
        onPress={onPressPrivacyLink}
        variant="body"
        fontWeight="medium"
      >
        Privacy notice
      </StyledText>
    </Flex>
  );

  return (
    <SettingsNavigationScrollView>
      {/* Preferred currency */}
      <SettingsRow
        event="CountervalueSettingsRow"
        title="Preferred currency"
        desc="Choose the currency for balances and operations."
        arrowRight
        onPress={handlePlaceholderPress}
      >
        <Text variant={"body"} fontWeight={"semiBold"} color="primary.c80">
          USD
        </Text>
      </SettingsRow>

      {/* Display language */}
      <SettingsRow
        event="LanguageSettingsRow"
        title="Display language"
        desc="Set the language displayed in Ledger Live."
        arrowRight
        onPress={handlePlaceholderPress}
        testID="language-button"
      >
        <Text variant={"body"} fontWeight={"semiBold"} color="primary.c80">
          English
        </Text>
      </SettingsRow>

      {/* Date format */}
      <SettingsRow
        title="Date format"
        desc="Set the date format for Ledger Live"
        arrowRight
        onPress={handlePlaceholderPress}
        testID="data-format-button"
      >
        <Text variant={"body"} fontWeight={"semiBold"} color="primary.c80">
          Default
        </Text>
      </SettingsRow>

      {/* Ledger Sync */}
      <SettingsRow
        event="WalletSyncSettingsRow"
        title="Ledger Sync"
        desc="Sync your Ledger Live crypto accounts across different phones and computers."
        arrowRight
        onPress={handlePlaceholderPress}
        testID="wallet-sync-button"
      />

      {/* Theme */}
      <SettingsRow
        title="Theme"
        desc="Set the app UI theme"
        arrowRight
        onPress={handlePlaceholderPress}
      >
        <Text variant={"body"} fontWeight={"semiBold"} color="primary.c80">
          Dark
        </Text>
      </SettingsRow>

      {/* App lock + FaceID (from AuthSecurityToggle) */}
      <AuthSecurityToggle />

      {/* MEV Protection */}
      <SettingsRow
        event="MevProtectionRow"
        title="MEV Protection"
        noTextDesc
        desc={mevDescription}
      >
        <Switch 
          checked={mevProtection} 
          onChange={() => setMevProtection(!mevProtection)} 
        />
      </SettingsRow>

      {/* Bug reports */}
      <SettingsRow
        event="ReportErrorsRow"
        title="Bug reports"
        desc="Automatically send reports to help Ledger improve its products."
      >
        <Switch
          checked={bugReports}
          onChange={setBugReports}
        />
      </SettingsRow>

      {/* Analytics */}
      <SettingsRow
        event="AnalyticsRow"
        title="Analytics"
        desc="Enable Ledger to collect app usage data to help measure Ledger Live's performance and enhance both the app and your experience."
      >
        <Switch checked={analytics} onChange={setAnalytics} />
      </SettingsRow>

      {/* Personalized experience */}
      <SettingsRow
        event="PersonalizedRecommendationsRow"
        title="Personalized experience"
        desc="Enable Ledger to collect app usage data to provide personalized recommendations and content that match your preferences and to help measure the performance of our marketing campaigns."
      >
        <Switch
          checked={personalizedExperience}
          onChange={setPersonalizedExperience}
        />
      </SettingsRow>
    </SettingsNavigationScrollView>
  );
} 