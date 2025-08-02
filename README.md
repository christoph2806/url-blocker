# URL Block Extension

A Chrome extension that helps protect users from phishing and malicious websites by maintaining customizable blacklists and whitelists.

## Features

- **Smart Pattern Matching**: Supports both wildcard patterns and domain-specific matching
- **Dual-Mode Protection**: 
  - Blocks access to blacklisted URLs not in whitelist
  - Shows warnings for URLs that appear in both lists
- **Default Security Patterns**: Pre-configured protection against common phishing attempts
- **User Customizable**: Fully editable blacklists and whitelists
- **Professional UI**: Clean warning pages with options to proceed or go back

## How It Works

The extension operates on three simple rules:

1. **Block**: If a URL matches the blacklist but not the whitelist → Site is blocked
2. **Warn**: If a URL matches both blacklist and whitelist → Warning is displayed
3. **Allow**: If a URL matches neither list → Normal browsing continues

## Pattern Matching

### Domain Patterns
Domain patterns (without wildcards) use intelligent subdomain matching:
- `zoom.us` matches `zoom.us`, `www.zoom.us`, `subdomain.zoom.us`
- `zoom.us` does NOT match `fakezoom.us` or `zoom.us.evil.com`

### Wildcard Patterns
Patterns with `*` use flexible text matching:
- `*zoom*` matches any URL containing "zoom"
- `*amazon*` matches any URL containing "amazon"

## Default Protection

The extension comes pre-configured with protection against common phishing patterns:

### Blacklisted Patterns
- Character substitution: `z00m`, `g00gle`, `amaz0n`, `micr0soft`
- Typosquatting: `zooom`, `amazzon`, `googl`
- Unicode attacks: `zоom` (Cyrillic), `gоogle`, `amazоn`
- Suspicious indicators: URLs with `@`, `//`, `httpss`

### Whitelisted Domains
- `zoom.us`, `zoom.com`
- `google.com` and regional variants
- `amazon.com` and regional variants
- `microsoft.com`, `outlook.com`
- `paypal.com`, `bankofamerica.com`

## Installation

### From Source
1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. The extension will be installed and ready to use

### Configuration
1. Click the extension icon in the Chrome toolbar
2. Modify the blacklist and whitelist as needed
3. Click "Save Settings"
4. Press ESC or click "Close" to exit

## File Structure

```
urlblock/
├── manifest.json          # Extension configuration
├── background.js          # Core blocking logic and message handling
├── content.js            # Content script for warning banners
├── warning.html          # Blocked site warning page
├── warning.js            # Warning page functionality
├── popup.html            # Settings interface
└── popup.js              # Settings functionality
```

## Technical Details

### Permissions
- `activeTab`: Access to current tab for navigation control
- `storage`: Persistent storage for user settings
- `webNavigation`: Monitor and intercept navigation events
- `tabs`: Tab management for redirects and navigation
- `scripting`: Execute scripts for navigation handling

### Architecture
- **Background Script**: Monitors navigation events and applies filtering rules
- **Content Script**: Injects warning banners for dual-listed sites
- **Warning Page**: Displays blocking interface with user options
- **Settings Interface**: Manages blacklist and whitelist configuration

## Browser Support

- Chrome (Manifest V3)
- Chromium-based browsers with Manifest V3 support

## Contributing

This extension follows standard Chrome extension development practices. The codebase is intentionally straightforward to facilitate easy understanding and modification.

## License

This project is provided as-is for educational and security purposes.