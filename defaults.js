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

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment
  module.exports = { DEFAULT_BLACKLIST, DEFAULT_WHITELIST };
} else {
  // Browser environment - make available globally
  window.DEFAULT_BLACKLIST = DEFAULT_BLACKLIST;
  window.DEFAULT_WHITELIST = DEFAULT_WHITELIST;
}