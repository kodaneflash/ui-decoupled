import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Flex, Text, IconsLegacy} from '@ledgerhq/native-ui';

type Props = {
  name: string;
  ticker: string;
  balance: string; // Simple string like "0 BTC"
  iconBg: string;
  iconLetter: string;
  onPress?: () => void;
};

const AccountRowLayout = ({
  name,
  ticker,
  balance,
  iconBg,
  iconLetter,
  onPress,
}: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Flex flexDirection="row" alignItems="center" py={4} px={6}>
        {/* Crypto Icon */}
        <Flex
          width={40}
          height={40}
          borderRadius={20}
          backgroundColor={iconBg}
          alignItems="center"
          justifyContent="center"
          mr={3}>
          <Text color="white" fontWeight="bold" fontSize="16px">
            {iconLetter}
          </Text>
        </Flex>

        {/* Name and ticker */}
        <Flex flex={1}>
          <Text variant="large" fontWeight="semiBold" color="neutral.c100">
            {name}
          </Text>
          <Text variant="body" color="neutral.c70">
            {balance}
          </Text>
        </Flex>

        {/* Balance display */}
        <Flex alignItems="flex-end" mr={3}>
          <Text variant="large" fontWeight="semiBold" color="neutral.c100">
            —
          </Text>
        </Flex>

        {/* Chevron */}
        <IconsLegacy.ChevronRightMedium size={20} color="#666" />
      </Flex>
    </TouchableOpacity>
  );
};

export default React.memo(AccountRowLayout);
