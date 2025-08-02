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