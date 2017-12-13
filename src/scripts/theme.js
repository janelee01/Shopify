window.slate = window.slate || {};
window.theme = window.theme || {};

/*================ Slate ================*/
// =require slate/a11y.js
// =require slate/cart.js
// =require slate/utils.js
// =require slate/rte.js
// =require slate/sections.js
// =require slate/currency.js
// =require slate/images.js
// =require slate/variants.js

/*================ Sections ================*/
// =require sections/product.js

/*================ Templates ================*/
// =require templates/customers-addresses.js
// =require templates/customers-login.js

/*================ Lo & Sons ================*/
// =require vendor/bootstrap.min.js
// =require vendor/lo-and-sons.js

$(document).ready(function() {
  var sections = new slate.Sections();
  sections.register('product', theme.Product);

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  // Target tables to make them scrollable
  var tableSelectors = '.rte table';

  slate.rte.wrapTable({
    $tables: $(tableSelectors),
    tableWrapperClass: 'rte__table-wrapper',
  });

  // Target iframes to make them responsive
  var iframeSelectors =
    '.rte iframe[src*="youtube.com/embed"],' +
    '.rte iframe[src*="player.vimeo"]';

  slate.rte.wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: 'rte__video-wrapper'
  });

  // Apply a specific class to the html element for browser support of cookies.
  if (slate.cart.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }

  // off canvas nav
  $('body').on('click', '.navbar-toggle', function(e){
    e.preventDefault();
    $('body').toggleClass('menu-open');
    LS.overlay.open();
  });
  $('body').on('click', '#nav-window-close', function(e){
    e.preventDefault();
    $('body').removeClass('menu-open');
    LS.overlay.close();
  });
  $('.site-content').on('click', function(e){
      if( $('body').hasClass('menu-open') ){
        e.stopPropagation();
        $('body').removeClass('menu-open');
        LS.overlay.close();
      }
  });
  $('body').on('click', '.menu-toggle', function(e){
    e.preventDefault();
    $(this).closest('li').toggleClass('open');
  });

  // sticky sidebar
  var has_sticky_element = $('.sticky').length > 0;

  if( has_sticky_element ){
    var el_starting_pos = $('.sticky').offset().top;
    if( $(window).width() > LS.desktopBreakpoint ){
      LS.filters.setStickyColumnHeight($('.main'));
    }
  }

  $(window).load( function() { // do this after the load so we have our images
    if( $(window).width() > LS.desktopBreakpoint && has_sticky_element ){
      LS.doStickyColumn(el_starting_pos);
    }
  });

  $(window).scroll(function(){
    if( $(window).width() > LS.desktopBreakpoint && has_sticky_element ){
      LS.doStickyColumn(el_starting_pos);
    }
  });

  // Smooth scrolling
  $('body').on('click', '.smoothscroll, .nav-local a, .page-nav-item, .scroll-down-indicator', function(e){
    e.preventDefault();

    var $btn = $(this),
      selector = $btn.attr('href'),
      pos = 0;

    // If the target isn't an on-page anchor, treat it like a normal link
    if (!selector.match(/^#/)) {
      window.location = selector;
      return;
    }

    $target = $(selector);
    if ($target.length === 0) {
      $target = $('body');
    }

    pos = $target.offset().top;
    $('html,body').animate({scrollTop: pos+'px'});

  });

});
