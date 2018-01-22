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
// =require vendor/moment.min.js
// =require vendor/jquery.fitvids.js
// =require vendor/jquery.cookie.js
// =require vendor/jquery.touchSwipe.min.js
// =require vendor/lo-and-sons.js
// =require vendor/product.js  

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
	Videos
   */
	var $videos = $('.embed-container');
	$videos.each(function(){
		var $embed = $(this);
		var videoId = $(this).find('video').attr('id');
		var video = document.getElementById(videoId);
		var autoPlay = $(this).data('autoplay');
		var loops = $(this).data('loops');
		var videoUrl = $embed.data('desktop-url');
		var mobileVideoUrl = $embed.data('mobile-url');

		if ( $(window).width() < LS.desktopBreakpoint && mobileVideoUrl ) {
	        $('#'+videoId).append('<source src="' + mobileVideoUrl + '" type="video/mp4" />');
	    } else {
	        $('#'+videoId).append('<source src="' + videoUrl + '" type="video/mp4" />');
	    }

		video.oncanplay = function() {
			$embed.find('.loading').fadeOut();
			// play it if we can see it 
			if( LS.isElementInViewport(video) && $embed.data('autoplay') ){
				var playPromise = video.play();
				if (playPromise !== undefined) {
					playPromise.then(function() {
						// Automatic playback started, nothing to do
					}).catch(function(error) {
						console.log('Playback did not start. Reason: ' + error)
					});
				}
			}
		};

		// play/pause based on visibility
		$(window).scroll(function(){
			if( LS.isElementInViewport(video) ){
				if( !$embed.hasClass('ended') && $embed.data('autoplay') ){
					var playPromise = video.play();
					if (playPromise !== undefined) {
						playPromise.then(function() {
							// Automatic playback started, nothing to do
						}).catch(function(error) {
							console.log('Playback did not start. Reason: ' + error)
						});
					}
				}
			}else{
				var pausePromise = video.pause();
				if (pausePromise !== undefined) {
					pausePromise.then(function() {
						// Paused, nothing to do
					}).catch(function(error) {
						console.log('Pause error. Reason: ' + error)
					});
				}
			}
		});

		// limit number of plays and maybe hide overlay text
		var playCount= 0;
		var lastTime = 0;
		video.addEventListener("timeupdate", function() {
			if( playCount === loops ){
				video.pause();
				$embed.addClass('ended');
				$embed.find('.video-trigger').fadeIn('slow');
			}

			// catching the start of the video is tricky with the loop, so see if the current time is the last time we saved ?>
			if( video.currentTime < lastTime ){
				playCount++;
				lastTime = 0;
			}else{
				lastTime = video.currentTime;
			}
		}, true);

		// that was cool, play it again ?>
		$embed.find('.video-trigger').on('click', function(e){
			e.preventDefault();
			$(this).fadeOut('fast');
			$embed.removeClass('ended');
			playCount = 0;
			video.play();
		});
	});

	// Product video
	$('body').on('click', '.product-video-trigger', function(e){
		e.preventDefault();
		LS.productVideoOpen(1); // button always shows the first video
	});
	$('body').on('click', '.has-video', function(e){
	    e.preventDefault();
	    LS.productVideoOpen($(this).data('video-id'));
	});
	$('body').on('click', '.overview-video-trigger', function(e){
	    e.preventDefault();
	    LS.productVideoOpen($(this).data('video-id'));
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

	var updatePricing = function(siblingId){
		var selectedVariant;
		var comparePrice;
		for (var i = siblingsJson[siblingId].variants.length - 1; i >= 0; i--) {
			if( siblingsJson[siblingId].variants[i].id == $('[data-product-select]').val() ){
				selectedVariant = siblingsJson[siblingId].variants[i];
			}
		};
		// sale pricing
		if( selectedVariant.compare_at_price && selectedVariant.compare_at_price > 0 ){
			comparePrice = slate.Currency.formatMoney(selectedVariant.compare_at_price, theme.moneyFormat);
			$('[data-discount-amount]').text( Math.round( 100*(selectedVariant.compare_at_price - selectedVariant.price) / selectedVariant.compare_at_price ) );
			$('.discount-badge').removeClass('is-hidden');
		}else{
			comparePrice = '';
			$('.discount-badge').addClass('is-hidden');
		}
		$('[data-compare-price]').html(comparePrice);

		// current price
		var price = slate.Currency.formatMoney(selectedVariant.price, theme.moneyFormat);
		$('[data-product-price]').html(price.replace('.00',''));
	}

	$('.swatch').on('click', function(e){
		e.preventDefault();
	    var siblingId = $(this).data('sibling');
	    var currentSize = $('#variant-buttons .selected').text();

	    // update active swatch
	    $('.swatch').removeClass('active');
	    $(this).addClass('active');

	    // replace galleries
	    $('#product-galleries .sibling-content').each(function(){
	    	$(this).addClass('hide');
	    	if( $(this).data('sibling') == siblingId ){
	    		$(this).removeClass('hide');
	    	}
	    });

	    // replace chosen color
	    $('#current-option span').text( $(this).find('img').attr('alt') );

	    // replace options in our Size selector. hard coded for single option variants
	    var newVariants = siblingsJson[siblingId].variants;
	    $('#variant-buttons').html('');
	    $('[data-product-select]').html('<option value=""></option>'); // make sure we don't auto-select a variant behind the scenes
	    for (var i = 0; i <= newVariants.length - 1; i++) {
	    	if( newVariants[i].available ){
	    		// build our hidden select
	    		$('[data-product-select]').append('<option value="'+newVariants[i].id+'">'+newVariants[i].title+'</option>');
	    		// build our buttons
	    		$('#variant-buttons').append('<a href="#" class="btn btn-secondary variant-option">'+newVariants[i].title+'</a>');
	    	}
	    };

	    // reselect the size, or use the first option
	    var sizeFound = false;
	    $('#variant-buttons .btn').each(function(){
	    	if( $(this).text() == currentSize ){
	    		sizeFound = true;
	    		$(this).click();
	    	}
	    });
	    if( !sizeFound ){
	    	$('#variant-buttons .btn').first().click();
	    }

	    // update pricing
	    updatePricing(siblingId);

	    // replace content
	    $('.product-detail-panel').each(function(){
	    	var $overrideContent = $(this).find('[data-sibling="'+siblingId+'"]');
	    	if( $overrideContent.length ){
	    		$(this).find('.default-content, .sibling-content').addClass('hide');
	    		$overrideContent.removeClass('hide');
	    	}else{
	    		$(this).find('.sibling-content').addClass('hide');
	    		$(this).find('.default-content').removeClass('hide');
	    	}
	    });

	    // update window URL
	    if ( history.replaceState ) {
	      var newurl = window.location.protocol + '//' + window.location.host + $(this).data('url');
	      window.history.replaceState({path: newurl}, '', newurl);
	    }

	});

	$('body').on('click', '.variant-option', function(e){
	    e.preventDefault();
	    var $btn = $(this);
	    $('#variant-buttons .validation-error').remove();
	    $('.variant-option').removeClass('selected');
	    $btn.addClass('selected');
	    $('[data-product-select] option').each(function(){
	    	if( $(this).text().trim() == $btn.text() ){
	    		$('[data-product-select]').val($(this).attr('value'));
	    		$('[data-product-select]').trigger('change');
	    	}
	    });
	});

	$('[data-product-select]').on('change', function(){
		updatePricing($('.swatch.active').data('sibling'));
	});

	$('[data-add-to-cart]').on('click', function(e){
	    if( !$('[data-product-select]').val() ){
	    	$('#variant-buttons').append('<div class="validation-error">Please select a size</div>');
	    	return false;
	    }
	});

	// reviews-received is fired once all reviews have been returned from yatpo's API
	$('body').on('reviews-received', function(){
		//  the relevant info we need is sort of buried, and we're going to need to sort these, so start a new object
		var finalReviewsData = [];
		
		// rawReviewsData is a global variable set in product.liquid 
		for (var i = rawReviewsData.length - 1; i >= 0; i--) {
			var siblingReviews = rawReviewsData[i].response.reviews;
			if( siblingReviews.length ){
				for (var r = siblingReviews.length - 1; r >= 0; r--) {
					var m = moment(siblingReviews[r].created_at);
					finalReviewsData[m.format('x')] = {
						"content" : siblingReviews[r].content,
						"author" : 	siblingReviews[r].user.display_name,
						"date" : m.format('M/D/YYYY'),
						"score" : siblingReviews[r].score
					}
				};
			}
		};

		// sort on the unix timestamp
		var keys = Object.keys(finalReviewsData);
		keys.sort();
		keys.reverse();

		var reviewsCount = keys.length;
		var currentPage = 1;
		var perPage = 5;

		var reviewsHtml = '<dl class="page" id="reviews-page-1">';
		for (var i = 0; i < keys.length; i++) {

			if( i > 0 && i % perPage == 0 ){
				currentPage++;
				reviewsHtml += '</dl><dl class="page" style="display: none" id="reviews-page-'+currentPage+'">';
			}

			reviewsHtml += '<dt>'+finalReviewsData[keys[i]].date;
			reviewsHtml += '<span class="stars">';
			for (var c = 1; c <= 5; c++) {
				reviewsHtml += '<i class="star';
				if( c <= finalReviewsData[keys[i]].score ) reviewsHtml += ' filled';
				reviewsHtml += '"></i>';
			};
			reviewsHtml += '<span class="sr-only">rated '+finalReviewsData[keys[i]].score+' out of 5</span></span></dt>';
			reviewsHtml += '<dd><h3>'+finalReviewsData[keys[i]].author+'</h3>';
			reviewsHtml += '<p>'+finalReviewsData[keys[i]].content+'</p></dd>';
		};
		reviewsHtml += '</dl>';
		$('#reviews').html(reviewsHtml);

		if( currentPage > 1 ){
			var pagination = '<ul class="pages" id="reviews-navigation">';
			for (var i = 1; i <= currentPage; i++) {
				pagination += '<li><a href="#reviews-page-'+i+'">'+i+'</a></li>';
			};
			pagination += '</ul>';
			$('#reviews').append(pagination);
			$('#reviews-navigation li').first().find('a').addClass('current');
		}

	});

	$('body').on('click', '#reviews-navigation a', function(e){
	    e.preventDefault();
	    $('#reviews .page').hide();
	    $($(this).attr('href')).fadeIn();
	    $('#reviews-navigation a').removeClass('current');
	    $(this).addClass('current');
	});

	$('body').on('click', '.write-review-button', function(e){
		$('.write-form .yotpo-header-title').text('Write your review');
		$('.write-form .yotpo-submit').val('Submit review');
	    $(this).addClass('is-hidden');
	});

	/*
		Account Area
	 */
	var addressHeight = 0;
	var $addresses = $('#address-list .address');
	if( $(window).width() > LS.desktopBreakpoint ){
		$addresses.each(function(){
			if( $(this).outerHeight() > addressHeight ){
				addressHeight = $(this).outerHeight();
			}
		});
		$addresses.css('min-height', addressHeight);
	}

	// add address
	$('#address-new-open').on('click', function(e){
	    $('#address-list').hide();
	    $('.page-header h1').text($(this).data('title-text'));
	    $('#AddressNewForm').fadeIn();
	});
	$('#address-new-close').on('click', function(e){
	    $('#AddressNewForm').hide();
	    $('.page-header h1').text($(this).data('title-text'));
	    $('#address-list').fadeIn();
	});
	// edit address
	$('.address-edit-open').on('click', function(e){
	    $('#address-list').hide();
	    $('.page-header h1').text($(this).data('title-text'));
	    $('#EditAddress_'+$(this).data('form-id')).fadeIn();
	});
	$('.address-edit-close').on('click', function(e){
	    $('#EditAddress_'+$(this).data('form-id')).hide();
	    $('.page-header h1').text($(this).data('title-text'));
	    $('#address-list').fadeIn();
	});

});
