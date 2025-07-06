#!/bin/bash

# React Native Development Setup Script
# This script ensures proper environment setup for Metro Bundler

echo "🚀 Setting up React Native development environment..."

# Kill any existing Metro processes
echo "📱 Killing existing Metro processes..."
pkill -f "react-native start" || true
pkill -f "metro" || true

# Clear React Native cache
echo "🧹 Clearing React Native cache..."
npx react-native start --reset-cache --stop || true

# Clear Metro cache
echo "🧹 Clearing Metro cache..."
rm -rf /tmp/metro-* || true
rm -rf /tmp/react-* || true

# Clear Node modules cache
echo "🧹 Clearing Node modules cache..."
rm -rf node_modules/.cache || true

# Verify iOS setup
echo "📱 Verifying iOS setup..."
if [ -d "ios" ]; then
    cd ios
    if [ -f "Podfile.lock" ]; then
        echo "✅ iOS Pods already installed"
    else
        echo "⚠️  Installing iOS Pods..."
        pod install
    fi
    cd ..
else
    echo "❌ iOS directory not found"
fi

# Check for common issues
echo "🔍 Checking for common issues..."

# Check React Native Reanimated
if grep -q "react-native-reanimated" package.json; then
    echo "✅ React Native Reanimated found in package.json"
else
    echo "⚠️  React Native Reanimated not found"
fi

# Check Babel configuration
if [ -f "babel.config.js" ]; then
    if grep -q "react-native-reanimated/plugin" babel.config.js; then
        echo "✅ React Native Reanimated plugin configured in Babel"
    else
        echo "⚠️  React Native Reanimated plugin not found in Babel config"
    fi
fi

echo "✅ Development environment setup complete!"
echo ""
echo "🎯 To start development with hot reloading:"
echo "1. Terminal #1: pnpm start -- --host 0.0.0.0 --port 8081 --reset-cache"
echo "2. Terminal #2: pnpm ios"
echo ""
echo "🔧 For physical device debugging:"
echo "1. Connect iPhone to Mac's hotspot"
echo "2. Get Mac IP: ifconfig | grep 'inet ' | grep -v 127.0.0.1"
echo "3. In app: Shake → Configure Bundler → Enter Mac IP:8081"
echo "" 