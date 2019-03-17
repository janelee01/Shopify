const syncTools = require('@shopify/slate-sync');
const slateEnv = require('@shopify/slate-env');

slateEnv.assign();

syncTools.sync([
  'snippets/style-tags.liquid',
  'snippets/script-tags.liquid'
]);
