// Import default patterns
importScripts('defaults.js');

// Initialize defaults on extension install
chrome.runtime.onInstalled.addListener(async () => {
  const result = await chrome.storage.sync.get(['initialized']);
  
  if (!result.initialized) {
    await chrome.storage.sync.set({
      blacklist: DEFAULT_BLACKLIST,
      whitelist: DEFAULT_WHITELIST,
      initialized: true
    });
  }
});

// Listen for navigation events
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId !== 0) return; // Only handle main frame
  
  const url = details.url;
  const result = await checkURL(url);
  
  if (result.action === 'block') {
    // Redirect to warning page
    chrome.tabs.update(details.tabId, {
      url: chrome.runtime.getURL('warning.html') + '?blocked=' + encodeURIComponent(url)
    });
  }
});

async function checkURL(url) {
  const settings = await chrome.storage.sync.get(['blacklist', 'whitelist']);
  
  const blacklistPatterns = parsePatterns(settings.blacklist || '');
  const whitelistPatterns = parsePatterns(settings.whitelist || '');
  
  const isBlacklisted = matchesAnyPattern(url, blacklistPatterns);
  const isWhitelisted = matchesAnyPattern(url, whitelistPatterns);
  
  if (isBlacklisted && !isWhitelisted) {
    return { action: 'block', reason: 'Blocked by blacklist' };
  } else if (isBlacklisted && isWhitelisted) {
    return { action: 'warn', reason: 'Blacklisted but whitelisted' };
  } else {
    return { action: 'allow', reason: 'Not in blacklist' };
  }
}

function parsePatterns(text) {
  return text.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

function matchesAnyPattern(url, patterns) {
  return patterns.some(pattern => {
    // Check if this looks like a domain pattern (no wildcards, contains dot)
    if (!pattern.includes('*') && pattern.includes('.')) {
      return matchesDomainPattern(url, pattern);
    } else {
      // Wildcard pattern matching
      let regexPattern = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
      regexPattern = regexPattern.replace(/\*/g, '.*');
      
      const regex = new RegExp(regexPattern, 'i');
      return regex.test(url);
    }
  });
}

function matchesDomainPattern(url, domainPattern) {
  try {
    // Extract domain from URL
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();
    const pattern = domainPattern.toLowerCase();
    
    // Exact match
    if (domain === pattern) {
      return true;
    }
    
    // Subdomain match - domain should end with .pattern
    if (domain.endsWith('.' + pattern)) {
      return true;
    }
    
    return false;
  } catch (error) {
    // If URL parsing fails, fall back to simple string matching
    return url.toLowerCase().includes(domainPattern.toLowerCase());
  }
}

// Handle messages from content script and warning page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkURL') {
    checkURL(request.url).then(sendResponse);
    return true; // Keep message channel open for async response
  } else if (request.action === 'navigateBack') {
    // Navigate back or to new tab
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) {
        // Try to inject script to go back, fallback to new tab if it fails
        chrome.scripting.executeScript({
          target: {tabId: tabs[0].id},
          func: () => {
            if (window.history.length > 1) {
              window.history.back();
            } else {
              // If no history, signal to go to new tab
              return false;
            }
            return true;
          }
        }).then((results) => {
          // If the script returned false or failed, navigate to new tab
          if (!results || !results[0] || !results[0].result) {
            chrome.tabs.update(tabs[0].id, {url: 'chrome://newtab/'});
          }
        }).catch(() => {
          // If script injection fails, navigate to new tab
          chrome.tabs.update(tabs[0].id, {url: 'chrome://newtab/'});
        });
      }
    });
  } else if (request.action === 'openSettings') {
    // Open extension options page
    chrome.runtime.openOptionsPage();
  } else if (request.action === 'proceedToURL') {
    // Navigate to the original blocked URL
    if (request.url) {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.update(tabs[0].id, {url: request.url});
        }
      });
    }
  }
});