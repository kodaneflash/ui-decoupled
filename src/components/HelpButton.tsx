import React from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { IconsLegacy, Box } from "@ledgerhq/native-ui";

const HelpButton = () => {
  const navigation = useNavigation();
  
  const onPress = () => {
    // For now, just log - in real Ledger Live this navigates to Resources screen
    console.log("Help button pressed - would navigate to Resources screen");
  };
  
  return (
    <Box mr={6}>
      <TouchableOpacity onPress={onPress}>
        <IconsLegacy.HelpMedium size={24} color={"neutral.c100"} />
      </TouchableOpacity>
    </Box>
  );
};

export default HelpButton; 