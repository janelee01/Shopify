/*================ Slate ================*/
import './../slate/a11y'
import './../slate/cart'
import './../slate/utils'
import './../slate/rte'
import './../slate/sections'
import './../slate/currency'
import './../slate/images'

/* removed to avoid conflicts with default behavior
 slate/variants.js
*/

/*================ Templates ================*/
import './../templates/customers-addresses'
import './../templates/customers-login'

import './../lo/lo-and-sons'
import './../lo/header'
import './../lo/page-nav'
import './../lo/videos'
import './../lo/collection'
import './../lo/waitlist'
import './../lo/product-reviews'
import './../lo/customers'
import './../lo/more-window'
import './../lo/comparison'
import './../lo/pdp'
import './../lo/gift-card'


$(document).ready(function() {

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

	let $target = $(selector);
	if ($target.length === 0) {
	  $target = $('body');
	}

	$('html,body').animate({scrollTop: LS.getScrollTo($target,trigger)});

  });

  

	// swipable bs carousels
	$(".carousel").swipe({
		allowPageScroll:"auto",
		threshold: 40,
		excludedElements: "label, button, input, select, textarea, .noSwipe",
		swipeLeft: function(event, direction, distance, duration, fingerCount, fingerData) {
					$(this).carousel('next');
				},
		swipeRight: function(event, direction, distance, duration, fingerCount, fingerData) {
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
		autoplaySpeed : 3500,
		speed : 750
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
	Discover Catalina Deluxe
	 */
	$('#dimensions-trigger').on('click', function(e){
	    e.preventDefault();
	    $($(this).attr('href')).addClass('shown');
	});
	$('#dimensions-overlay .panel-close').on('click', function(e){
	    e.preventDefault();
	    $(this).parent().removeClass('shown');
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


	$("#newsletter-signup").on('submit', function(e) {
        e.preventDefault();
		$('#newsletter-signup .form-group .validation-error').remove();
		$('#newsletter-signup').removeClass("has-errors");
        var email = $('#signup-email').val();
        if( !email ){
			$('#newsletter-signup .form-group').append('<small class="validation-error">Please enter your email.</small>');
			$('#newsletter-signup').addClass("has-errors");
        	return;
        }
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://manage.kmail-lists.com/ajax/subscriptions/subscribe",
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
				$('#newsletter-signup').addClass("has-errors");
        	})
        	.done(function (response) {
	            if( response.success ){
	            	$("#newsletter-signup .form-group, #newsletter-signup label").hide();
	            	$("#newsletter-signup .newsletter-alert").fadeIn();
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
			$(this).addClass('shown');
		});
	}

	$('#cart-continue').on('click', function(e){
	    e.preventDefault();
	    var previousPage = sessionStorage.getItem('lo-back-to');
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

	if( $('body').hasClass('template-page') ) {
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
		
		$('.pdp-expandable button').on('click', function(e){
			e.preventDefault();
			$(this).toggleClass('active');
			$(this).next('.content').slideToggle();
		});

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

	$('#zodiac-select').on('change', function(e){
	    e.preventDefault();
	    $('#zodiac-signs div').hide();
	    $('.y-' + $(this).val()).fadeIn();
	});

	$('#laptops-select').on('change', function(e){
		e.preventDefault();
		$('#laptops div').hide();
		$('.brand-' + $(this).val()).fadeIn();
	});

	/*
	Continuous scroll
	*/
	$('.continuous-carousel').slick({
		autoplay: true,
		autoplaySpeed: 0,
		speed: 10000,
		arrows: false,
		draggable: false,
		pauseOnHover: false,
		pauseOnFocus: false, 
		swipe: false,  
		cssEase: 'linear',
		slidesToShow: 1,
		centerMode: true,
		variableWidth: true
	});

	/*
	Fit / Model Toggles
	*/
	$('.toggle .controls button').on('click', function(e){
		e.preventDefault();
		var $parent = $(this).closest('.toggle');
		var $alternate = $parent.find('.alternate');
		$parent.find('button').removeClass('active');
		$(this).addClass('active');
		if( $parent.find('.active').hasClass('show-alternate') ){
			$alternate.addClass('shown');
		}else{
			$alternate.removeClass('shown');
		}
	});

	$('#waverley2-comparison-slider').slick({
		centerMode: true,
		dots: true,
		initialSlide: 1,
		variableWidth: true,
		mobileFirst: true,
		infinite: false,
		responsive: [
			{
				breakpoint: LS.tabletBreakpoint,
				settings: {
					dots: false
				}
			}
		]
	});

	$('#neutrals-sand-slider .slides, #neutrals-rose-slider .slides').slick({
		centerMode: true,
		initialSlide: 1,
		variableWidth: true,
		mobileFirst: true,
		infinite: false
	});

	$('#leather-wallet-slider').slick({
		dots: true,
		arrows: false,
		mobileFirst: true,
		responsive: [
			{
				breakpoint: LS.tabletBreakpoint,
				settings: "unslick"
			}
		]
	});

	$('.expanding-panels .toggle').on('click', function(e){
		e.preventDefault();
		$(this).toggleClass('collapsed');
		$(this).next('.content').slideToggle()
	});

	$(window).scroll(function() {
		var scrolled = $(window).scrollTop()
		$('.parallax').each(function(index, element) {
			var initY = $(this).offset().top
			var height = $(this).outerHeight()
			var endY  = initY + $(this).outerHeight()
			var visible = LS.isElementInViewport(this);
			if(visible) {
				var diff = scrolled - initY;
				var ratio = Math.round((diff / height) * 100);
				$(this).css('background-position','center ' + parseInt((ratio * 0.8)) + 'px');
			}
		})
	});

	$('.col-slider').slick({
		centerMode: true,
		centerPadding: '15px',
		dots: true,
		arrows: false,
		variableWidth: true,
		mobileFirst: true,
		infinite: false,
		responsive: [
			{
				breakpoint: LS.tabletBreakpoint - 1,
				settings: "unslick"
			}
		]
	});

	$('.row-slider').slick({
		dots: true,
		arrows: false,
		fade: true
	});

});
