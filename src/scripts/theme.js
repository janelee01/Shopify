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
// =require vendor/jquery-ui.min.js
// =require vendor/moment.min.js
// =require vendor/jquery.fitvids.js
// =require vendor/jquery.cookie.js
// =require vendor/jquery.touchSwipe.min.js
// =require vendor/jquery.film_roll.js
// =require vendor/slick.min.js
// =require lo/lo-and-sons.js
// =require vendor/scrolla.js
// =require lo/navigation.js
// =require lo/videos.js  
// =require lo/collection-filters.js 
// =require lo/swatches.js  
// =require lo/waitlist.js  
// =require lo/product-reviews.js  
// =require lo/product-gallery.js  
// =require lo/customers.js
// =require lo/toggle-menu.js
// =require lo/header.js

$(document).ready(function() {

	var $pageNav = LS.getPageNav();
	var $header = LS.getHeader();

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

  // Autocomplete search
  $.widget( "custom.catcomplete", $.ui.autocomplete, {
    _create: function() {
      this._super();
      this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
    },
    _renderMenu: function( ul, items ) {
      var that = this,
        currentCategory = "";
      $.each( items, function( index, item ) {
        var li;
        if ( item.category != currentCategory ) {
          ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
          currentCategory = item.category;
        }
        li = that._renderItemData( ul, item );
        if ( item.category ) {
          li.attr( "aria-label", item.category + " : " + item.label );
        }
      });
    }
  });
   
  $(".js-autocomplete").catcomplete({
  delay: 0,
	source: window.autocompletedata,
	open: function ( event, ui ) {
		if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
			$('.ui-autocomplete').off('menufocus hover mouseover');
		}
	},
	focus: function( event, ui ){
		event.preventDefault(); // default is to show the value of the item, which will be the page path
	},
    select: function( event, ui ) {
    	event.preventDefault();
    	window.location = window.location.protocol + '//' + window.location.hostname + ui.item.value;
    }
  });

  $('#article-body').fitVids();

  // give GA something to hook onto
  $('.pagination .page a').addClass('pagination-link');

	// mobile collapsed panels
	$('[data-collapse-toggle]').on('click', function(e){
	    $(this).toggleClass('collapsed');
	    if( !$(this).hasClass('collapsed') ){
	    	$(this).next('[data-collapse-panel]').fadeIn().addClass('is-shown');
	    }else{
	    	$(this).next('[data-collapse-panel]').fadeOut().removeClass('is-shown');
	    }
	});

	if( $(window).width() >= LS.desktopBreakpoint ){
	  $('[data-collapse-toggle]').removeClass('collapsed');
	  $('[data-collapse-panel]').addClass('is-shown');
	}

  // Smooth scrolling
  $('body').on('click', '.smoothscroll, .nav-local a, .page-nav-item, .scroll-down-indicator', function(e){
	e.preventDefault();

	var $btn = $(this);
	var trigger = $('#site-header').outerHeight();
	var selector = $btn.attr('href');
	var pos = 0;

	// If the target isn't an on-page anchor, treat it like a normal link
	if (!selector.match(/^#/)) {
	  window.location = selector;
	  return;
	}

	$target = $(selector);
	if ($target.length === 0) {
	  $target = $('body');
	}

	$('html,body').animate({scrollTop: LS.getScrollTo($target,trigger)});

  });

  /*
  Marquees
   */
  $('body').on('click', '.marquee .panel-close', function(e){
	e.preventDefault();
	$('#shopify-section-marquee').fadeOut('fast', function(){
		$('.site-content').removeAttr('style');
		$('.mega-menu__layout').removeAttr('style');
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

  // slide the marquee out of the way on scroll
  var $marquee = $('#shopify-section-marquee');
  var trigger = 1;
  var lastScrollPos = 0;

  if( $marquee.is(':visible') ){
	  $('.site-content').css('padding-top', $header.outerHeight() - $pageNav.outerHeight());
	  $('.mega-menu__layout').css('top', $header.outerHeight() - $pageNav.outerHeight());
  }

  // remove menu-open class on window resize
  $(window).resize(function () {
	var viewportWidth = $(window).width();
	var megaMenuBreakpoint = 1024;
	if (viewportWidth > megaMenuBreakpoint) {
		$('body').removeClass('menu-open');
		$('.navbar-toggle').removeClass('mega-menu-active');
	}
  });

  // adjust on scroll
  $(window).scroll(function(){
  	if( $(window).scrollTop() < trigger ){
  		$header.removeAttr('style');
  		if( !$pageNav.hasClass('persistent') ){
  			$pageNav.removeClass('is-shown');
  		}
  	}else{
  		if( $(window).scrollTop() > lastScrollPos ){
  			// going down
  			if( $marquee.is(':visible') && $pageNav.length ){ 
  				$header.css({
  					'top' : ($marquee.outerHeight() + $('#site-header-items').outerHeight()) * -1,
  				});
  			}else if( !$marquee.is(':visible') && $pageNav.length ){
  				$header.css({
  					'top' : $('#site-header-items').outerHeight() * -1,
				});
				$('.mega-menu__layout').css('top', $header.outerHeight());  
  			}else if( $marquee.is(':visible') ){
  				$header.css({
  					'top' : $marquee.outerHeight() * -1,
				  });
				$('.mega-menu__layout').css('top', $header.outerHeight() - $pageNav.outerHeight() - $marquee.outerHeight());
  			}
  			window.setTimeout(function(){ // add a delay so the header position change can finish before we animate the fade in (fixes weird flickering)
  				$pageNav.addClass('is-shown');	
  			}, 250);
  		}else{
  			// going up, show the navbar again, but not the marquee
  			$header.css({
				'top' : 0 - $marquee.outerHeight(),  
			});
			$('.mega-menu__layout').css('top', $header.outerHeight() - $pageNav.outerHeight());  
  		}
  		lastScrollPos = $(window).scrollTop();
  		
  	}
  });

  // untransparentize header
  if( LS.isTransparentHeader() ){

  	// don't use the entire header height when it's overlayed
  	if( $marquee.is(':visible') ){
		$('.site-content').css('padding-top', $marquee.outerHeight());
	}
  }

  	// header shadow
	if( $('.page-nav').length ){
		$('body').addClass('has-page-nav');
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
		$('.discover .hero').addClass('in');
	}

	/*
	Home page: hero slider
	*/
	var $hero = $('.hero.has-slides');
	var setHeaderUiColor = function(color){
		var isAlternateHeader = $header.hasClass('showing-alternate');
		if( color == 'white' ){
			$hero.removeClass('ui-black');
			if (isAlternateHeader) {
				$('body').addClass('has-tw-header');
				$('body').removeClass('has-tb-header');
			}
		}else{
			$hero.addClass('ui-black');
			if (isAlternateHeader) {
				$('body').addClass('has-tb-header');
				$('body').removeClass('has-tw-header');
			}
		}
	};
	var updateHeaderUi = function(){
		var $slideContent = $hero.find('.slick-active .hero-content');
		
		if ($slideContent.hasClass('default') ){
			// use white UI on mobile when an explicit color isn't chosen
			if ($(window).width() < LS.desktopBreakpoint) {
				setHeaderUiColor('white');
			}else{
				setHeaderUiColor('black');
			}
		} else if ($slideContent.hasClass('black')) {
			setHeaderUiColor('black');
		} else {
			setHeaderUiColor('white');
		}
	};
	$hero
		.on('init', function (event, slick) {
			updateHeaderUi();
		})
		.on('afterChange', function (event, slick, currentSlide) {
			updateHeaderUi();
			// pause when we return to the first slide
			if( currentSlide === 0 ){
				$hero.slick('slickPause');
			}
		});

	$hero.slick({
		arrows : false,
		dots : true,
		autoplay : true,
		autoplaySpeed : 2000,
		speed : 600
	});

	/*
	 mega-menu featured pages
	*/

	$('.mega-menu__featured__carousel--slick-carousel').each(function(){
		const $carousel = $(this)
		const $rightArrow = $(this).find('.mega-menu-carousel-next');
		const $leftArrow = $(this).find('.mega-menu-carousel-prev');

		$carousel.slick ({
			arrows : true,
			dots: false,
			infinite: false,
			slidesToShow: 3,
			slidesToScroll: 1,
			prevArrow: $leftArrow,
			nextArrow: $rightArrow,
			slide: '.mega-menu__subnav__item__child',
			responsive: [
				{
				  breakpoint: 768,
				  settings: {
					slidesToShow: 2.5,
					slidesToScroll: 1,
				  }
				},
				{
					breakpoint: 480,
					settings: {
					  slidesToShow: 1.5,
					  slidesToScroll: 1,
					}
				  }
			]
		});
	

	});


	

	/*
	 Home page reviews
	*/
	$('.press-slider .row').slick({
		arrows : false,
		dots: true,
		slidesToShow: 2,
		slidesToScroll: 2,
		responsive: [
	    {
	      breakpoint: 769,
	      settings: {
	        slidesToShow: 1,
	        slidesToScroll: 1
	      }
	    }
	  ]
	});

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
		$(window).load(function(){
			equalizePr();
		});
		$(window).resize(function(){
			equalizePr();
		});
	}

	/*
	Discover Pearl: images need to swap positions in the DOM between tablet and desktop
	 */
	var pearlAnywhereLayout = function(){
		if( $(window).width() < LS.desktopBreakpoint ){
			if( ! $('#pearl-anywhere-col-1 #pearl-anywhere-4').length ){
				$('#pearl-anywhere-4').detach().appendTo('#pearl-anywhere-col-1');
				$('#pearl-anywhere-5').detach().prependTo('#pearl-anywhere-col-2');
			}
		}else if( ! $('#pearl-anywhere-col-2 #pearl-anywhere-4').length ){
			$('#pearl-anywhere-4').detach().prependTo('#pearl-anywhere-col-2');
			$('#pearl-anywhere-5').detach().appendTo('#pearl-anywhere-col-1');
		}
	}
	if( $('#pearl-anywhere-col-1').length ){
		pearlAnywhereLayout();
		$(window).resize(function(){
			pearlAnywhereLayout();
		});
	}
	/*
	Discover category pages
	 */
	$('.category-product .image-grid').slick({
		arrows : false,
		slidesToShow: 4,
		slidesToScroll: 1,
		responsive: [
	    {
	      breakpoint: 376,
	      settings: {
	        slidesToShow: 1,
	        slidesToScroll: 1,
	        dots : true
	      }
	    }
	  ]
	});

	/*
		Home page reviews
	*/
	$('.products-slider').slick({
		arrows: false,
		dots: true,
		slidesToShow: 1,
		slidesToScroll: 1
	});
	

	/*
	Side scrolling areas
	 */
	if ($('.overflow-row').length) {

		// map the element scrolling to handle drags
		$(".product-group .overflow-handle").draggable({
			containment: "parent",
			drag: function (event, ui) {
				var $bar = ui.helper.closest('.overflow-bar');
				var $content = ui.helper.closest('.products').find('.overflow-row');
				var percentScrolled = ui.position.left / $bar.outerWidth();
				// the amount of content scrolling maps to the amount the handle moves since they're sized proportionately below
				$content.scrollLeft(percentScrolled * $content.find('.overflow-content').width());
			}
		}); 

		// map the handle position to element scrolling
		$(".product-group .overflow-row").scroll(function(){
			var percentScrolled = $(this).scrollLeft() / $(this).find('.overflow-content').width();
			var $handle = $(this).closest('.products').find('.overflow-handle');
			// same as above, we scroll proportionately
			$handle.css('left', percentScrolled * 100 + '%');
		});

		var setHandleWidth = function(){
			$('.product-group').each(function () {

				var $products = $(this).find('.products .product');
				var $track = $(this).find('.overflow-content');
				var trackWidth = $products.first().outerWidth() * $products.length;
				$track.width(trackWidth);

				var $handle = $(this).find('.overflow-handle');
				var $bar = $(this).find('.overflow-bar');
				var handleWidth = $(this).outerWidth() / trackWidth * 100;
				if (handleWidth >= 100) {
					$bar.hide();
				} else {
					$handle.width(handleWidth + '%');
					$bar.show();
				}
			});
		};
	
		$(window).load(function(){ // make sure we have images

			// size the handle based on how much scrolling will be necessary like normal scrollbars
			setHandleWidth();
			
			$('.overflow-row').each(function(){
				var $scrollEl = $(this);
				var $indicators = $( $scrollEl.data('indicators') ).children();
				var $prev = $(this).closest('.overflow-window').find('.overflow-control.prev');
				var $next = $(this).closest('.overflow-window').find('.overflow-control.next');
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
					// if we have controls, maybe enable/disable them when appropriate
					if( $prev.length && $next.length ){
						if( scrollCompletion < 10 ){
							$prev.addClass('disabled').attr('disabled', true);
						}else if( scrollCompletion > 90) {
							$next.addClass('disabled').attr('disabled', true);
						}else{
							$prev.removeClass('disabled').attr('disabled', false);
							$next.removeClass('disabled').attr('disabled', false);
						}
					}
				});
			});
		});
		$('.overflow-control').on('click', function(e){ 
		    e.preventDefault();
		    var $scrollEl = $(this).closest('.overflow-window').find('.overflow-row');
		    var $prev = $(this).closest('.overflow-window').find('.overflow-control.prev');
		    var $next = $(this).closest('.overflow-window').find('.overflow-control.next');
		    var $indicators = $($scrollEl.data('indicators'));
		    var numItems = $scrollEl.find('.overflow-content').children().length;
		    var stepWidth =  $scrollEl.find('.overflow-content').width() / numItems;
		    var currentIndex = $indicators.children().index( $indicators.find('.active') );

		    // determine where we should scroll to
		    if( $(this).hasClass('next') ){
		    	var nextIndex = currentIndex + 1; 
		    }else{
		    	var nextIndex = currentIndex - 1; 
		    }

		    // do it
		    $scrollEl.animate({
		    	scrollLeft : nextIndex * stepWidth 
		    }, 500, 'swing', function(){
		    	// maybe enable/disable buttons when animation completed
		    	if( nextIndex - 1 == -1 ){ // at first element
		    		$prev.addClass('disabled').attr('disabled', true);
		    	}else if( nextIndex + 1 == numItems ){ // at last element
		    		$next.addClass('disabled').attr('disabled', true);
		    	}else{
		    		$prev.removeClass('disabled').attr('disabled', false);
		    		$next.removeClass('disabled').attr('disabled', false);
		    	}
		    });
		});
		$(window).resize(function(){
			setHandleWidth();
		});
	}

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
				"g": kListId, // set in theme.liquid
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
			$('#m-variation [data-image-container]').css( 'height', $(window).outerHeight() - $header.outerHeight() + 2 ); // the +2 fixes a white line at the bottom
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

		$('.final-sale-warning').each(function(){
			if( discontinued.includes( String($(this).data('variant-id')) ) ){
				$(this).addClass('shown');
			}
		});
	}

	$('#cart-continue').on('click', function(e){
	    e.preventDefault();
	    var previousPage = sessionStorage.getItem('lo-back-to');
	    // console.log(previousPage);
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
    	var srollaEnabled = false;
        if($(window).width() >= LS.desktopBreakpoint) {
            $('.animate').scrolla({
                once: true
            });
            srollaEnabled = true;
		}
		// images will stay missing if you start small and resize large
		$(window).resize(function(){
	        if($(window).width() >= LS.desktopBreakpoint && !srollaEnabled) {
	            $('.animate').scrolla({
	                once: true
	            });
	            srollaEnabled = true;
			}
		});
    }

    /*
    Simple Sharing
     */
    $('.share-btn').on('click', function(e){
        if( !$(this).hasClass('email') ){
            e.preventDefault(); 
            window.open($(this).attr('href'), 'shareWindow', 'height=450, width=550, top=' + ($(window).height() / 2 - 275) + ', left=' + ($(window).width() / 2 - 225) + ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
        }
    });

    /*
    Credo LP
     */
    $('[href="#credo-tc"]').on('click', function(e){
        e.preventDefault();
        $('#credo-tc').fadeIn();
    });
    $('#credo-tc .panel-close').on('click', function(e){
        e.preventDefault();
        $('#credo-tc').fadeOut();
    });
	$("#credo-subscribe").on('submit', function(e) {
        e.preventDefault();
        var $form = $(this);
        var numErrors = 0;
        $form.find('.validation-error').remove();
        $form.find('.form-control.required').each(function(){
        	if( !$(this).val() ){
        		numErrors++;
        		$('<small class="validation-error">This field is required.</small>')
        			.insertAfter($(this))
        			.fadeIn()
        			.css('display','block');
        	}
        });

        if( numErrors > 0 ) return; 
        
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
                "g": "Kh3kFv", // KUBRaR main list
                "$fields": "Sign Up Source, Country",
                "email": $('#credo-email').val(),
                "first_name": $('#credo-fname').val(),
                "last_name": $('#credo-lname').val(),
                "Sign Up Source": "Credo Giveaway May 2018"
            }
        };
        $.ajax(settings) 
        	.fail(function(jqXHR, textStatus, errorThrown){
        		$('<small class="validation-error">Something went wrong. Perhaps you\'ve already subscribed to our list? <a href="/pages/support#contact">Contact us</a> for further assistance.</small>')
        			.appendTo($form)
        			.fadeIn()
        			.css('display','block');
        	})
        	.done(function (response) {
	            if( response.success ){
	            	$form.hide();
	            	$("#credo-subscribe-success").fadeIn();
	            }
	        });
    });

	/*
	Skimm LP
	 */
	
	// things are flexed so we need a width on the disclaimer to left-align it with the code box
	var syncSkimmDisclaimer = function(){
		if( $(window).width() >= LS.desktopBreakpoint ){
			$('#skimm-code-disclaimer').width($('#skimm-code').width());
		}else{
			$('#skimm-code-disclaimer').removeAttr('style');
		}
	}
	if( $('#skimm-code').length ){
		syncSkimmDisclaimer();
		$(window).resize( syncSkimmDisclaimer );
	}
	
});
