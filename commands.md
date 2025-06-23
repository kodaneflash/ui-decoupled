 npx tsc --noEmit

 npx react-native run-ios

open ios/UIReplicationLedger.xcworkspace

## Hot Reloading Setup for Physical iPhone Device

### Prerequisites:
1. Turn ON iPhone Personal Hotspot: Settings → Personal Hotspot → ON
2. Connect Mac to iPhone's hotspot Wi-Fi network

### Terminal Commands (run in 2 separate terminals):

Terminal #1 - Metro Bundler:
```bash
pnpm start -- --host 0.0.0.0 --port 8081 --reset-cache
```

Terminal #2 - Build & Run on iPhone:
```bash
pnpm ios --udid 00008140-00122894010A801C
```

### iPhone Configuration:
1. Get Mac's IP address: `ifconfig | grep "inet " | grep -v 127.0.0.1`
2. Shake iPhone → Developer Menu → "Configure Bundler"
3. Enter:
   - Host: [Mac's IP from step 1] (e.g., 172.20.10.6)
   - Port: 8081
   - Entry Point: index
4. Apply → Reload

### Test Connection:
- Safari on iPhone: http://[MAC_IP]:8081/status
- Should show: "packager-status:running"

### Troubleshooting:
- If timeout errors: Ensure both devices on same network (iPhone hotspot)
- Fast Refresh: ON, Remote JS Debugging: OFF