// Get blocked URL from query parameter
const urlParams = new URLSearchParams(window.location.search);
const blockedURL = urlParams.get('blocked');

if (blockedURL) {
  document.getElementById('blocked-url').textContent = decodeURIComponent(blockedURL);
}

function goBack() {
  // Send message to background script to handle navigation
  chrome.runtime.sendMessage({
    action: 'navigateBack'
  });
}

function openSettings() {
  // Send message to background script to open options page
  chrome.runtime.sendMessage({
    action: 'openSettings'
  });
}

function proceedAnyway() {
  if (blockedURL && confirm('Are you sure you want to visit this blocked site?\n\nThis will temporarily whitelist the site for 10 minutes.')) {
    chrome.runtime.sendMessage({
      action: 'proceedToURL',
      url: decodeURIComponent(blockedURL)
    });
  }
}

// Add event listeners when page loads
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('go-back-btn').addEventListener('click', goBack);
  document.getElementById('open-settings-btn').addEventListener('click', openSettings);
  document.getElementById('proceed-anyway-btn').addEventListener('click', proceedAnyway);
});