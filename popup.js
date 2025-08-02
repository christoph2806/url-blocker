// Default blacklist patterns (common phishing/malicious patterns)
const DEFAULT_BLACKLIST = `*zoom*
*z00m*
*zo0m*
*zooom*
*zоom*
*zoom-*
*zoom∕*
*amazon*
*amaz0n*
*amazzon*
*amazоn*
*amzon*
*amazon∕*
*google*
*g00gle*
*goog1e*
*gоogle*
*googl*
*google∕*
*microsoft*
*micr0soft*
*rnicrosoft*
*micrоsoft*
*microsft*
*microsoft∕*
*bankof*
*paypa1*
*@*
*//*
*httpss*
*tinyurl*
*bit.ly*`;

// Default whitelist patterns (legitimate domains)
const DEFAULT_WHITELIST = `zoom.us
zoom.com
amazon.com
amazon.co.uk
amazon.de
amazon.fr
amazon.ca
amazon.in
amazon.com.au
google.com
google.co.uk
google.de
google.fr
google.ca
google.com.au
microsoft.com
outlook.com
bankofamerica.com
paypal.com
tinyurl.com
bit.ly`;

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