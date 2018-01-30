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
/* removed to avoid conflicts with default behavior
 slate/variants.js
*/
/*================ Sections ================*/
/* removed to avoid conflicts with default behavior
 sections/product.js
*/
/*================ Templates ================*/
// =require templates/customers-addresses.js
// =require templates/customers-login.js

/*================ Lo & Sons ================*/
// =require vendor/bootstrap.min.js
// =require vendor/jquery-ui-1.10.4.custom.min.js
// =require vendor/moment.min.js
// =require vendor/jquery.fitvids.js
// =require vendor/jquery.cookie.js
// =require vendor/jquery.touchSwipe.min.js
// =require vendor/jquery.film_roll.js
// =require vendor/lo-and-sons.js
// =require lo/videos.js  
// =require lo/collection-filters.js  
// =require lo/swatches.js  
// =require lo/product-reviews.js  
// =require lo/product-gallery.js  
// =require lo/customers.js  

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
  $('body').on('click', '#nav-panel-close', function(e){
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

  // marquees
  $('body').on('click', '.marquee .panel-close', function(e){
	e.preventDefault();
	$('#shopify-section-marquee').fadeOut('fast');
	sessionStorage.setItem("lo-marquee-dismissed", "1");
  });

  // marquees are hidden by default, so show if they haven't been closed
  if ( 'lo-marquee-dismissed' in sessionStorage) {
	// no nothing
  }else{
	$('#shopify-section-marquee .marquee').removeClass('hidden');
  }

  

	/*
		Floating form labels
	 */
	$('.form-control').on('keyup', function(){
		if( $(this).val() != '' ){
			$(this).closest('.form-group').addClass('has-value');
		}else{
			$(this).closest('.form-group').removeClass('has-value');
		}
	});

	/*
	 Forgot Password title update
	 */
	var $loginTitle = $('#login-title');
	$('#RecoverPassword').on('click', function(e){
	    $loginTitle.text($loginTitle.data('reset-text')).addClass('has-divider');
	});
	$('#HideRecoverPasswordLink').on('click', function(e){
	    $loginTitle.text($loginTitle.data('default-text')).removeClass('has-divider');
	});
	if( $('body').attr('id') == 'account' && window.location.hash == '#recover') {
	  $loginTitle.text($loginTitle.data('reset-text')).addClass('has-divider');
	}


	/* Newsletter Prompt */
	$('#newsletter-prompt .panel-close, #newsletter-prompt .btn').on('click', function(){
		$('#newsletter-prompt').addClass('closed');
		$.cookie('lo-nl-prompt-dismissed', '1', { path: '/' });
	});

	var displayNewsletterPrompt = function() {

		// Not on the /sale page
		if (window.location.pathname.match(/^\/sale/)) {
			return;
		}

		// Not on the cart or checkout pages
		if (window.location.pathname.match(/^\/checkout/)) {
			return;
		}

		if ( ! $.cookie('lo-nl-prompt-dismissed') ) {
			$('#newsletter-prompt').removeClass('closed');
		}

	};
	var newletterTimeout = setTimeout(displayNewsletterPrompt, 30000);

	// page nav
	$('#page-nav-items-toggle').on('click', function(e){
	    e.preventDefault();
	    $('.page-nav').toggleClass('open');
	});
	$('.page-nav-item').on('click', function(e){
	    e.preventDefault();
	    $('.page-nav').removeClass('open');
	});

	var lastScrollTop = 0;
	var lowestScrollPos = 0;
	var $pageNav = $('.page-nav');
	var $header = $('#site-header');
	var headerOffset = $header.outerHeight();

	$(window).scroll(function(){

		var $ = jQuery;

		// sticky sidebars
		if( $(window).width() > LS.desktopBreakpoint && has_sticky_element ){
			LS.doStickyColumn(el_starting_pos);
		}

		var $el = $('.page-header-image, #overview-block-0');
		if( $el.length > 0 ){
			var container_bottom = $el.offset().top + $el.outerHeight() - $(window).scrollTop();
			var	indicator_bottom = $('.scroll-down-indicator').offset().top + $('.scroll-down-indicator').outerHeight() - $(window).scrollTop();
			var window_height = $(window).height();

			// deactivate the stick when the image is not below the window
			if( container_bottom < window_height ){
				$('.scroll-down-indicator').addClass('pinned');
			}
			// stick to the window when the indicator hits the bottom
			if( indicator_bottom > window_height ){
				$('.scroll-down-indicator').removeClass('pinned');
			}
		}

		// hide the back to top when at the top of the page
		var $totop = $('.back-to-top.persistent'),
			window_pos = $(window).scrollTop();

		if( window_pos > 240 ){
			$totop.addClass('active');
		}else{
			$totop.removeClass('active');
		}

		// trigger the newsletter prompt
	    if ( window_pos > $('body').height() * 0.7 ) {
			displayNewsletterPrompt();
	    }

		// shift main nav out of the way when we have a page nav
		if( $pageNav.length ){
			var currentScrollTop = $(this).scrollTop();
			if (currentScrollTop > lastScrollTop){
				// scrolling down
				if( currentScrollTop > headerOffset ){
					$header.css('top', -headerOffset);
					$pageNav.css('margin-top', -headerOffset); // "top" value set by css, so shift it with margin
					$pageNav.addClass('is-shown'); // on mobile this makes it visible
				}
				// set our furthest point down the page
				lowestScrollPos = currentScrollTop;
			} else {
				// scrolling up, with a buffer so the header isn't shown immediately
				if( currentScrollTop + headerOffset < lowestScrollPos ){
					$header.attr('style', '');
					$pageNav.attr('style', '');
				}
			}

			// hides the page nav on mobile when we're at the top of the page
			if( currentScrollTop < headerOffset ){
				$pageNav.removeClass('is-shown');
			}

			lastScrollTop = currentScrollTop;
		}
	});

	/*
	Rebuild article headers for mobile
	 */
	var rebuildArticleHeader = function(){
		var $postTitle = $('.entry-header h1').detach();
		var $postExcerpt = $('.entry-header .excerpt').detach();
		var $postSharing = $('.entry-header .social-sharing').detach();
		var $postImage = $('.entry-header .image picture').detach();
		if( $(window).width() < 769 && $('#m-variation h1').length < 1 ){
			$('#m-variation [data-image-container]')
				.append($postTitle)
				.append($postImage);
			$('#m-variation [data-content-container]')
				.append($postExcerpt)
				.append($postSharing);
		}else if( $('#d-variation h1').length < 1 ){
			$('#d-variation [data-image-container]')
				.append($postImage);
			$('#d-variation [data-content-container]')
				.append($postTitle)
				.append($postExcerpt)
				.append($postSharing);
		}
	}
	if( $('body').hasClass('template-article') ){
		rebuildArticleHeader();
		$(window).resize(function(){
			rebuildArticleHeader();
		});
	}

	$('.number-down').on('click', function(e){
	    e.preventDefault();
	    var $input = $(this).next('input');
	    var number = $input.val();
	    if( number > 0 ){
	    	number--;
	    	$input.val(number);
	    }
	});
	$('.number-up').on('click', function(e){
	    e.preventDefault();
	    var $input = $(this).prev('input');
	    var number = $input.val();
	    number++;
	    $input.val(number);
	});

	// move the qty control
	var setCartQtyInputLocation = function(){
		var $cartRows = $('#cart-items tr');
		$cartRows.each(function(){
			var $control = $(this).find('.number-control').detach();
			if( $(window).width() < 769 && $(this).find('.item-info .number-control').length < 1 ){
				$(this).find('.item-info').append($control);
			}else if( $(this).find('.item-qty .number-control').length < 1 ){
				$(this).find('.item-qty').append($control);
			}
		});
	}
	if( $('body').hasClass('template-cart') ){
		setCartQtyInputLocation();
		$(window).resize(function(){
			setCartQtyInputLocation();
		});
	}

	var addTableLabels = function(){
		if( $(window).width() < 768 ){
			$('td.has-label').each(function(){
				if( $(this).find('.key').length < 1 ){
					$(this).wrapInner('<span class="value" />');
					$(this).prepend('<span class="key">' + $(this).data('label') + '</span>');
				}
			});
		}else{
			$('td.has-label .key').remove();
		}
	}
	addTableLabels();
	$(window).resize(function(){
		addTableLabels();
	});

	/*
	 Tabs
	 */

	$('.tab-headings .active-bar').width($('.tab-headings a.active').width());
	$('.tab-headings a').on('click', function(e){
	    e.preventDefault();
	    if( !$(this).hasClass('active') ){
	    	$('.tab-headings a').removeClass('active');
	    	$('.tab-panel').hide().removeClass('active');
	    	$(this).addClass('active');
	    	$($(this).attr('href')).fadeIn();
	    	$('.tab-headings .active-bar').css({ 
	    		'left': $(this).position().left,
	    		'width': $('.tab-headings a.active').width()
	    	});
	    }
	});

	/*
	 Products
	 */
	var setProductTitleLocation = function(){
		if( $(window).width() < 768 ){
			if( $('#product-galleries').prev('#product-identity').length < 1 ){
				$('#product-identity').detach().insertBefore('#product-galleries');
			}
		}else if( $('#product-description').prev('#product-identity').length < 1 ){
			$('#product-identity').detach().insertBefore('#product-description');
		}
	}
	setProductTitleLocation();
	$(window).resize(function(){
		setProductTitleLocation();
	});
	
	$('.product-detail-panel h2').on('click', function(e){
		if( $(window).width() < LS.desktopBreakpoint ){
			$(this).toggleClass('collapsed');
			if( !$(this).hasClass('collapsed') ){
				$(this).next('.panel-content').slideDown().addClass('is-shown');
			}else{
				$(this).next('.panel-content').slideUp().removeClass('is-shown');
			}
		}
	});

	// Product video
	$('#product-video-trigger').detach().insertAfter('#product-description p:first-child');
	$('body').on('click', '#product-video-trigger', function(e){
		e.preventDefault();
		LS.productVideoOpen(1); // button always shows the first video
	});
	$('body').on('click', '#product-video .panel-close', function(e){
		e.preventDefault();
		LS.productVideoClose();
	});
	$(document).keyup(function(e) {
	    if (e.keyCode == 27) { // escape key maps to keycode `27`
	    	LS.productVideoClose();
	    }
	});
	
});
