const concat = require('merge-files')
const path = require('path')
const base = path.join(__dirname, '../src/scripts/vendor')

concat([
  // `${base}/modernizr.min.js`,
  `${base}/jquery-2.2.3.min.js`,
  // `${base}/picturefill.min.js`,
  `${base}/bootstrap.min.js`,
  `${base}/jquery-ui-1.10.4.custom.min.js`,
  `${base}/jquery-ui.min.js`,
  `${base}/moment.min.js`,
  `${base}/jquery.fitvids.js`,
  `${base}/jquery.cookie.js`,
  `${base}/jquery.touchSwipe.min.js`,
  // `${base}/jquery.film_roll.js`,
  // `${base}/photoswipe.min.js`,
  `${base}/imagesloaded.pkgd.min.js`,
  `${base}/slick.min.js`,
  `${base}/bodyScrollLock.min.js`,
  `${base}/jquery.debounce.min.js`,
  `${base}/scrolla.js`
], './src/assets/vendors.min.js')