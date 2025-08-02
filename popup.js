// Load saved settings
document.addEventListener('DOMContentLoaded', async () => {
  const result = await chrome.storage.sync.get(['blacklist', 'whitelist', 'initialized']);
  
  // Initialize with defaults if this is the first time
  if (!result.initialized) {
    document.getElementById('blacklist').value = DEFAULT_BLACKLIST;
    document.getElementById('whitelist').value = DEFAULT_WHITELIST;
    
    // Save the defaults
    await chrome.storage.sync.set({
      blacklist: DEFAULT_BLACKLIST,
      whitelist: DEFAULT_WHITELIST,
      initialized: true
    });
  } else {
    document.getElementById('blacklist').value = result.blacklist || DEFAULT_BLACKLIST;
    document.getElementById('whitelist').value = result.whitelist || DEFAULT_WHITELIST;
  }
  
  // Load and display temporary whitelist
  await loadTemporaryWhitelist();
  
  // Update timers every second
  setInterval(updateTemporaryWhitelistTimers, 1000);
});

// Save settings
document.getElementById('save').addEventListener('click', async () => {
  const blacklist = document.getElementById('blacklist').value;
  const whitelist = document.getElementById('whitelist').value;
  
  await chrome.storage.sync.set({
    blacklist: blacklist,
    whitelist: whitelist
  });
  
  // Show success message
  const status = document.getElementById('status');
  status.textContent = 'Settings saved successfully!';
  status.className = 'status success';
  status.style.display = 'block';
  
  setTimeout(() => {
    status.style.display = 'none';
  }, 2000);
});

// Close button functionality
document.getElementById('close').addEventListener('click', () => {
  window.close();
});

// ESC key functionality
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    window.close();
  }
});

// Temporary whitelist management
let tempWhitelistData = {};

async function loadTemporaryWhitelist() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getTemporaryWhitelist' });
    tempWhitelistData = response || {};
    displayTemporaryWhitelist();
  } catch (error) {
    console.error('Failed to load temporary whitelist:', error);
  }
}

function displayTemporaryWhitelist() {
  const container = document.getElementById('temp-whitelist-list');
  const emptyState = document.getElementById('temp-whitelist-empty');
  
  const entries = Object.keys(tempWhitelistData);
  
  if (entries.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }
  
  emptyState.style.display = 'none';
  
  container.innerHTML = entries.map(url => {
    const data = tempWhitelistData[url];
    const minutes = Math.max(0, data.remainingMinutes);
    const seconds = Math.max(0, Math.floor((data.remainingMs % 60000) / 1000));
    
    return `
      <div class="temp-entry" data-url="${encodeURIComponent(url)}">
        <div class="temp-url">${url}</div>
        <div class="temp-timer" data-expiration="${data.expiration}">
          Expires in: ${minutes}m ${seconds}s
        </div>
      </div>
    `;
  }).join('');
}

function updateTemporaryWhitelistTimers() {
  const timers = document.querySelectorAll('.temp-timer[data-expiration]');
  const now = Date.now();
  let needsRefresh = false;
  
  timers.forEach(timer => {
    const expiration = parseInt(timer.dataset.expiration);
    const remaining = expiration - now;
    
    if (remaining <= 0) {
      needsRefresh = true;
      return;
    }
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    timer.textContent = `Expires in: ${minutes}m ${seconds}s`;
  });
  
  // Refresh the list if any entries expired
  if (needsRefresh) {
    loadTemporaryWhitelist();
  }
}