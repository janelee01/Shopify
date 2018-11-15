# loandsons.com Shopify theme

## Assets


The local directory includes the SCSS for the site. It is outside of the main directory because bootstrap's SASS version was not compatible with Shopify's. So, running `gulp watch` in `local` will generate lo-checkout.css and lo.css inside of `/src/styles/vendor` for use on the site. 

Javascript is located in `src/scripts`. The primary files are `theme.js` and `lo/*.js`. Slate handles the concatenation of these along with the rest of the built-in scripts. 

## Templates
There are *a lot* of templates in this theme. The reason: most of the pages have unique design requirements so trying to implement these in the Shopify editor and page builder apps wasn't possible. Instead, the layout/content was hard-coded into a page template then the page was assigned to the template.

The exceptions to this rule are `page.category-*.liquid` and `index.liquid`. These templates have sectioned approaches. 

## Product Structure
Lo has a unique product structure which lead to a pretty complicated product template, but it suits their needs. For a given bag there is an associated product type and an automatic collection for that type. This is our "parent" collection. All of the products within the collection are referred to as "siblings" in the theme.

A parent collection groups all of the products together for the PDP to emulate a more standard PDP where color is a variation. In our case, though, varations only occur with size. Otherwise, all colors are separate products. 

To add to the complication, PDPs are collection URL-aware so if the user arrives via a men's-specific collection, for example, only the sibling products from that referring collection are shown. 

## Menu
Menu states are saved with sessionStorage. Changes to nav items in the admin won't be reflected on the front side until a new tab is opened. 