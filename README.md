# Auto-Checkbox

## Getting Started

### Installation

1. Install a user script manager extension for your browser such as Tampermonkey:
  * Chrome: [Tampermonkey][chrome_tampermonkey]
  * Firefox: [Tampermonkey][firefox_tampermonkey]
2. Install Auto-Checkbox directly by importing from the scripts download [url][acb_downloadURL]
  * Go to `Extensions > Dashboard > Utilities`
  * In the `Import from URL` Text box, paste this download [url][acb_downloadURL], then click **install**

### Usage

The script works by applying a regex search against the inner text of every row found on the current page.
If it finds a match, it'll then look for a checkbox element within that row.
If a checkbox is found, click it.  

<!-- Extensions -->
  [chrome_violentmonkey]: https://chrome.google.com/webstore/detail/violent-monkey/jinjaccalgkegednnccohejagnlnfdag
  [chrome_tampermonkey]: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
  [firefox_greasemonkey]: https://addons.mozilla.org/firefox/addon/greasemonkey/
  [firefox_tampermonkey]: https://addons.mozilla.org/firefox/addon/tampermonkey/
  [firefox_violentmonkey]: https://addons.mozilla.org/firefox/addon/violentmonkey/

<!-- Auto-Checkbox -->
  [acb_downloadURL]: https://raw.githubusercontent.com/COD-Province/Auto-Checkbox/main/auto-checkbox.user.js
