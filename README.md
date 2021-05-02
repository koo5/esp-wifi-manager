# what

Browser frontend for an ESP32/Arduino sketch that scans for available wifi APs and let's you connect to one. Purely websocket, and a self-contained SPA, so will work straight from the demo site, just open it in your browser, connect your computer to the AP, and enter the IP.

# where
https://nifty-brahmagupta-ce9402.netlify.app/
, or served from your ESP32. The build is about 300kb.

# how
bootstrapped with Create Snowpack App (CSA) / powered by Svelte

## notes
### static build
```
npm run build; bash -c "cd build; python3 -m http.server 3003"
```
### dev mode
```npm run start```

Runs the app in the development mode.
Open http://localhost:3003 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

HRM is enabled - things can get a bit crazy, just do a full reload if needed.
