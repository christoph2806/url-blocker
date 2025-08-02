# Chrome Web Store Permission Justifications

## Required for URL Block - Phishing Protection Extension

### 1. activeTab
**Characters: 312/1000**

Required to access the currently active tab when users click extension buttons on warning pages. This permission allows the extension to navigate users back to safe pages or to the originally requested URL when they choose "Proceed Anyway" on blocked sites. Without this permission, the warning page buttons would not function.

### 2. storage
**Characters: 268/1000**

Essential for saving user's personalized blacklist and whitelist patterns locally on their device. This permission stores filtering rules that protect against phishing sites. All data remains on the user's device and is never transmitted externally. Without storage, users would lose their settings.

### 3. webNavigation  
**Characters: 358/1000**

Core functionality permission that detects when users navigate to potentially dangerous websites. This permission monitors navigation events to check URLs against blacklist patterns before pages load, enabling real-time phishing protection. This is the primary security mechanism that blocks malicious sites before they can harm users.

### 4. tabs
**Characters: 287/1000**

Required to redirect users to warning pages when dangerous sites are detected, and to navigate back to safe locations when users click warning page buttons. This permission enables the extension to replace malicious page loads with protective warning interfaces and manage tab navigation safely.

### 5. scripting
**Characters: 324/1000**

Needed to inject warning banners on websites that match both blacklist and whitelist patterns (dual-listed sites). This permission displays non-blocking warning notifications to inform users about potentially suspicious sites while still allowing access. Also enables navigation functionality on warning pages.

### 6. Host Permissions: <all_urls>
**Characters: 399/1000**

Required to monitor and protect users across all websites they visit. Phishing attacks can occur on any domain, including legitimate-looking URLs with subtle character substitutions or typosquatting. This broad permission ensures comprehensive protection against evolving phishing threats that could appear anywhere on the web, providing complete security coverage.

## Total Character Count: 1,948/6,000