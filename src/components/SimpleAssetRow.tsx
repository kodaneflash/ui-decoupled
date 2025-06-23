import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  name: string;
  ticker: string;
  balance: string;
  fiatValue: string;
  iconColor: string;
  iconSymbol: string;
}

const SimpleAssetRow = ({ 
  name, 
  ticker, 
  balance, 
  fiatValue, 
  iconColor, 
  iconSymbol 
}: Props) => {
  return (
    <View style={styles.container}>
      {/* Currency Icon */}
      <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
        <Text style={styles.iconText}>{iconSymbol}</Text>
      </View>

      {/* Currency Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.nameText}>{name}</Text>
        <Text style={styles.tickerText}>{ticker}</Text>
      </View>

      {/* Balance Info */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>{balance}</Text>
        <Text style={styles.fiatText}>{fiatValue}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 24,        // pt={6} = 24px
    paddingBottom: 24,     // pb={6} = 24px
    // Remove fixed height - let content determine size
    // Remove horizontal padding - handled by parent container
  },
  iconContainer: {
    width: 32,             // Official Ledger Live icon size
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,       // ml={4} = 16px
  },
  iconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  tickerText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#999999',
    fontFamily: 'Inter-Regular',
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balanceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    textAlign: 'right',
  },
  fiatText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#999999',
    fontFamily: 'Inter-Regular',
    textAlign: 'right',
    marginTop: 2,
  },
});

export default SimpleAssetRow; 