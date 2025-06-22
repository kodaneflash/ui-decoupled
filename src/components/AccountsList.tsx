import React from "react";
import { Box, Flex, Text } from "@ledgerhq/native-ui";
import { View } from "react-native";
import { useTheme } from "styled-components/native";

interface Account {
  id: string;
  name: string;
  currency: string;
  balance: string;
  balanceFormatted: string;
  color: string;
  symbol: string;
}

const staticAccounts: Account[] = [
  {
    id: "bitcoin-1",
    name: "Bitcoin 1",
    currency: "BTC",
    balance: "$***",
    balanceFormatted: "*** BTC",
    color: "#F7931A",
    symbol: "₿",
  },
  {
    id: "xrp-1",
    name: "XRP 1", 
    currency: "XRP",
    balance: "$***",
    balanceFormatted: "*** XRP",
    color: "#0085C3",
    symbol: "✕",
  },
];

interface AccountRowProps {
  account: Account;
}

const AccountRow: React.FC<AccountRowProps> = ({ account }) => {
  const { colors } = useTheme();
  
  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      py={3}
      height={72}
    >
      {/* Currency Icon */}
      <Flex flexDirection="row" alignItems="center" flex={1}>
        <Box
          width={40}
          height={40}
          borderRadius={20}
          backgroundColor={account.color}
          alignItems="center"
          justifyContent="center"
          mr={3}
        >
          <Text color="white" fontSize={18} fontWeight="bold">
            {account.symbol}
          </Text>
        </Box>
        
        {/* Account Info */}
        <Flex flex={1}>
          <Text color="neutral.c100" variant="large" fontWeight="semiBold">
            {account.name}
          </Text>
          <Text color="neutral.c70" variant="small">
            {account.balanceFormatted}
          </Text>
        </Flex>
      </Flex>

      {/* Balance */}
      <Flex alignItems="flex-end">
        <Text color="neutral.c100" variant="large" fontWeight="semiBold">
          {account.balance}
        </Text>
      </Flex>
    </Flex>
  );
};

interface AccountsListProps {
  onContentChange?: (width: number, height: number) => void;
}

const AccountsList: React.FC<AccountsListProps> = ({ onContentChange }) => {
  const handleLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    onContentChange?.(width, height);
  };

  return (
    <View onLayout={handleLayout}>
      {staticAccounts.map((account) => (
        <AccountRow key={account.id} account={account} />
      ))}
    </View>
  );
};

export default React.memo(AccountsList); 