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
// =require vendor/picturefill.min.js
// =require vendor/bootstrap.min.js
// =require vendor/jquery-ui-1.10.4.custom.min.js
// =require vendor/moment.min.js
// =require vendor/jquery.fitvids.js
// =require vendor/jquery.cookie.js
// =require vendor/jquery.touchSwipe.min.js
// =require vendor/jquery.film_roll.js
// =require vendor/lo-and-sons.js
// =require vendor/scrolla.js
// =require lo/navigation.js
// =require lo/videos.js  
// =require lo/collection-filters.js 
// =require lo/swatches.js  
// =require lo/waitlist.js  
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

  $('#article-body').fitVids();

  // give GA something to hook onto
  $('.pagination .page a').addClass('pagination-link');

	// mobile collapsed panels
	$('[data-collapse-toggle]').on('click', function(e){
	    $(this).toggleClass('collapsed');
	    if( !$(this).hasClass('collapsed') ){
	    	$(this).next('[data-collapse-panel]').slideDown().addClass('is-shown');
	    }else{
	    	$(this).next('[data-collapse-panel]').slideUp().removeClass('is-shown');
	    }
	});

	if( $(window).width() > LS.desktopBreakpoint ){
	  $('[data-collapse-toggle]').removeClass('collapsed');
	  $('[data-collapse-panel]').addClass('is-shown');
	}

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

  /*
  Marquees
   */
  $('body').on('click', '.marquee .panel-close', function(e){
	e.preventDefault();
	$('#shopify-section-marquee').fadeOut('fast', function(){
		$('body').trigger('marquee-hidden');
	});
	sessionStorage.setItem("lo-marquee-dismissed", "1");
  });

  // marquees are hidden by default, so show if they haven't been closed
  if ( 'lo-marquee-dismissed' in sessionStorage) {
	// no nothing
  }else{
	$('#shopify-section-marquee .marquee').removeClass('hidden');
	$('body').trigger('marquee-shown');
  }

  // hide marquees on pages with local navs
  if( $('nav.local').length ){
  	$('#shopify-section-marquee').hide();
  }



  	// swipable bs carousels
  	$(".carousel").swipe({
  		allowPageScroll:"auto",
  		threshold: 40,
  		excludedElements: "label, button, input, select, textarea, .noSwipe",
  		swipeLeft: function(event, direction, distance, duration, fingerCount, fingerData) {
          	// $(this).find('.item a').on('click', function(){ return false; }); interfering with custom layout blocks, doesn't seem to be applicable anywhere else
          	$(this).carousel('next');
          },
  		swipeRight: function(event, direction, distance, duration, fingerCount, fingerData) {
  			// $(this).find('.item a').on('click', function(){ return false; }); interfering with custom layout blocks, doesn't seem to be applicable anywhere else
          	$(this).carousel('prev');
          }
  	});

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

	if( $('.discover .hero').length ){
		$('.discover .hero picture').addClass('in');
	}

	/*
	Discover pages: Title & Price in CTA can't stack naturally
	 */
	var $ctaTitles = $('[data-cta-titles]');
	var positionCtaTitles = function(){
		if( $(window).width() < 1025 && $('.discover-cta .section-content').find('[data-cta-titles]').length ){
			$ctaTitles.detach().prependTo('.discover-cta');
		}else if( $(window).width() >= 1025 && $('.discover-cta .section-content').find('[data-cta-titles]').length < 1 ){
			$ctaTitles.detach().prependTo('.discover-cta .section-content');
		}
	};

	if( $ctaTitles.length ){
		positionCtaTitles();
		$(window).resize(function(){
			positionCtaTitles();
		});
	}

	/*
	Discover pages: match heights for Press elements
	 */
	var getEqualizedHeight = function($elements){
		var height = 0;
		$elements.each(function(){
			if( $(this).outerHeight() > height ){
				height = $(this).outerHeight();
			}
		});
		return height;
	}
	var equalizePr = function(){
		if( $(window).width() >= 1025 ){
			$('.pr-logo').height( getEqualizedHeight($('.pr-logo')) );
		}else{
			$('.pr-logo').removeAttr('style');
		}
	}
	if( $('.pr-items').length ){
		equalizePr();
		$(window).resize(function(){
			equalizePr();
		});
	}

	/*
	Side scrolling indicators
	 */
	if( $('.overflow-row').length ){
		$('.overflow-row').each(function(){
			var $scrollEl = $(this);
			var $indicators = $( $scrollEl.data('indicators') ).children();

			// scrop out the scrollbar
			var elHeight = $(this).closest('.overflow-window').height();
			$(this).closest('.overflow-window').height(elHeight - 20);
			
			// easier to work with
			var amountToScroll = $scrollEl.find('.overflow-content').width() - $scrollEl.width();
			var indicatorValue = 100 / $indicators.length;

			$scrollEl.on('scroll', function(){
				var scrollCompletion = $scrollEl.scrollLeft() / amountToScroll * 100;
				$indicators.each(function(index){ 
					// index * indicatorValue creates percentage benchmarks for the scrollCompletion to cross
					// example: 4 items will create 0/25/50/75
					if( scrollCompletion >= index * indicatorValue  ){ 
						$indicators.removeClass('active');
						$(this).addClass('active');
					}
				});
			});
		});
		
	}
	

	/* Newsletter Prompt - disabled */
	// $('#newsletter-prompt .panel-close, #newsletter-prompt .btn').on('click', function(){
	// 	$('#newsletter-prompt').addClass('closed');
	// 	$.cookie('lo-nl-prompt-dismissed', '1', { path: '/' });
	// });

	// var displayNewsletterPrompt = function() {

	// 	// Not on the /sale page
	// 	if (window.location.pathname.match(/^\/sale/)) {
	// 		return;
	// 	}

	// 	// Not on the cart or checkout pages
	// 	if (window.location.pathname.match(/^\/checkout/)) {
	// 		return;
	// 	}

	// 	if ( ! $.cookie('lo-nl-prompt-dismissed') ) {
	// 		$('#newsletter-prompt').removeClass('closed');
	// 	}

	// };
	// var newletterTimeout = setTimeout(displayNewsletterPrompt, 30000);

	$("#newsletter-signup").on('submit', function(e) {
        e.preventDefault();
        $('#newsletter-signup .form-group .validation-error').remove();
        var email = $('#signup-email').val();
        if( !email ){
        	$('#newsletter-signup .form-group').append('<small class="validation-error">Please enter your email.</small>');
        	return;
        }
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://manage.kmail-lists.com/subscriptions/external/subscribe",
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded",
                "cache-control": "no-cache"
            },
            "data": {
                "g": "KUBRaR",
                "$fields": "Sign Up Source",
                "email": email,
                "Sign Up Source": "footer"
            }
        };
        $.ajax(settings)
        	.fail(function(jqXHR, textStatus, errorThrown){
        		$('#newsletter-signup .form-group').append('<small class="validation-error">Something went wrong. Perhaps you\'ve already subscribed to our list? <a href="/pages/support#contact">Contact us</a> for further assistance.</small>');
        	})
        	.done(function (response) {
	            if( response.success ){
	            	$("#newsletter-signup .form-group, #newsletter-signup label").hide();
	            	$("#newsletter-signup .alert").fadeIn();
	            }
	        });
    });

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
	  //   if ( window_pos > $('body').height() * 0.7 ) {
			// displayNewsletterPrompt();
	  //   }

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
		if( $(window).width() < 768 && $('#m-variation h1').length < 1 ){
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
		if( $(window).width() < 768 ){
			$('#m-variation [data-image-container]').css( 'height', $(window).outerHeight() - $('#site-header').outerHeight() + 2 ); // the +2 fixes a white line at the bottom
		}
	}
	if( $('body').hasClass('template-article') ){
		rebuildArticleHeader();
		$(window).resize(function(){
			rebuildArticleHeader();
		});
	}

	/*
	Cart
	 */

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
			if( $(window).width() < 768 && $(this).find('.item-info .number-control').length < 1 ){
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

	$('#cart-continue').on('click', function(e){
	    e.preventDefault();
	    var previousPage = sessionStorage.getItem('lo-back-to');
	    console.log(previousPage);
	    if( previousPage ){
	    	window.location = previousPage;
	    }else{
	    	window.location = window.location.protocol + '//' + window.location.hostname;
	    }
	});

	/*
	Tables
	 */

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
	if( $('body').hasClass('template-product') ){
		sessionStorage.setItem('lo-back-to', window.location.href); // for use in the cart
	}

    if( $('article.edgemont').length || $('article.discover').length ) {
        if($(window).width() > 1024) {
            $('.animate').scrolla({
                once: true
            });
		}
    }
	
});
