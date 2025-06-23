import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import { IconsLegacy } from '@ledgerhq/native-ui';

interface Props {
  size?: number; 
  discreetMode?: boolean; // For static replica, we can control this manually
}

const DiscreetModeButton = ({size = 20, discreetMode = true}: Props) => {
  // Static implementation - no Redux or dynamic state needed
  // Based on reference image, discreet mode is ON (showing $***)

  return (
    <TouchableOpacity style={styles.root}>
      {discreetMode ? (
        <IconsLegacy.EyeNoneMedium size={size} color={"neutral.c100"} />
      ) : (
        <IconsLegacy.EyeMedium size={size} color={"neutral.c100"} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: -10,
    padding: 10,
  },
});

export default React.memo(DiscreetModeButton);
