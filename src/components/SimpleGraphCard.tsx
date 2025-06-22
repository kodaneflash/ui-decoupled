import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface Props {
  balance: number;
  changePercent: number;
}

const SimpleGraphCard = ({ balance = 0, changePercent = 0 }: Props) => {
  // Generate simple chart path
  const generatePath = (width: number, height: number) => {
    const points = [
      [0, height * 0.8],
      [width * 0.2, height * 0.7],
      [width * 0.4, height * 0.9],
      [width * 0.6, height * 0.4],
      [width * 0.8, height * 0.3],
      [width, height * 0.5],
    ];
    
    let path = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i][0]} ${points[i][1]}`;
    }
    return path;
  };

  const chartWidth = 300;
  const chartHeight = 110;

  return (
    <View style={styles.container}>
      {/* Balance Display */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>
          ${balance.toFixed(2)}
        </Text>
        <Text style={styles.changeText}>
          {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
        </Text>
      </View>

      {/* Simple Chart */}
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight}>
          <Defs>
            <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#7C3AED" stopOpacity={0.3} />
              <Stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Path 
            d={generatePath(chartWidth, chartHeight)} 
            stroke="#7C3AED" 
            strokeWidth={2}
            fill="none"
          />
        </Svg>
      </View>

      {/* Time Range Tabs - Fixed Width Implementation */}
      <View style={styles.tabContainer}>
        <View style={[styles.tab, styles.activeTab, styles.firstTab]}>
          <Text style={styles.activeTabText}>1D</Text>
        </View>
        <View style={styles.tab}>
          <Text style={styles.tabText}>1W</Text>
        </View>
        <View style={styles.tab}>
          <Text style={styles.tabText}>1M</Text>
        </View>
        <View style={styles.tab}>
          <Text style={styles.tabText}>1Y</Text>
        </View>
        <View style={styles.tab}>
          <Text style={styles.tabText}>ALL</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1D1F',
    marginHorizontal: 24,
    marginVertical: 16,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  balanceText: {
    fontSize: 42,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  changeText: {
    fontSize: 16,
    color: '#999999',
    fontFamily: 'Inter-Regular',
  },
  chartContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',          // Center the tab group instead of spreading
    alignItems: 'center',
    maxWidth: 266,                     // Total width = (5 tabs × 50px) + (4 gaps × 4px) = 266px
    alignSelf: 'center',               // Center the container within parent
  },
  tab: {
    width: 50,                         // CRITICAL: Fixed 50px width per tab
    height: 40,                        // Fixed height matching real implementation
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,                   // 4px border radius (theme.radii[1])
    marginLeft: 4,                     // 4px spacing between tabs
  },
  firstTab: {
    marginLeft: 0,                     // First tab has no left margin
  },
  activeTab: {
    backgroundColor: '#7C3AED',
  },
  tabText: {
    color: '#999999',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',               // Center text within fixed-width tab
    textTransform: 'uppercase',        // ALL CAPS like real implementation
  },
  activeTabText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',               // Center text within fixed-width tab
    textTransform: 'uppercase',        // ALL CAPS like real implementation
  },
});

export default SimpleGraphCard; 