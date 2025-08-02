// Check current URL when page loads
(async function() {
  const currentURL = window.location.href;
  
  // Skip chrome:// and extension pages
  if (currentURL.startsWith('chrome://') || currentURL.startsWith('chrome-extension://')) {
    return;
  }
  
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'checkURL',
      url: currentURL
    });
    
    if (response.action === 'warn') {
      showWarningBanner(response.reason);
    }
  } catch (error) {
    console.log('URL Filter extension: ', error);
  }
})();

function showWarningBanner(reason) {
  // Create warning banner
  const banner = document.createElement('div');
  banner.id = 'url-filter-warning';
  banner.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #ff9800;
      color: white;
      padding: 10px;
      text-align: center;
      font-family: Arial, sans-serif;
      font-size: 14px;
      z-index: 999999;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    ">
      ⚠️ Warning: This site matches your blacklist (${reason})
      <button onclick="this.parentElement.parentElement.remove()" style="
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        padding: 5px 10px;
        margin-left: 15px;
        border-radius: 3px;
        cursor: pointer;
      ">Dismiss</button>
    </div>
  `;
  
  document.body.insertBefore(banner, document.body.firstChild);
  
  // Auto-dismiss after 10 seconds
  setTimeout(() => {
    const warningElement = document.getElementById('url-filter-warning');
    if (warningElement) {
      warningElement.remove();
    }
  }, 10000);
}