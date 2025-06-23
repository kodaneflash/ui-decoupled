import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import { IconsLegacy } from '@ledgerhq/native-ui';
import { useDiscreetMode } from '../context/DiscreetModeContext';

interface Props {
  size?: number; 
}

const DiscreetModeButton = ({size = 20}: Props) => {
  const { discreetMode, setDiscreetMode } = useDiscreetMode();

  const onPress = () => {
    setDiscreetMode(!discreetMode);
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.root}>
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
