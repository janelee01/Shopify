var LS = LS || window.LS || {};

LS.tabletBreakpoint = 769;
LS.desktopBreakpoint = 1030;
LS.galleries = [];

LS.checkoutFieldsInit = function(){
	var $ = jQuery;

	/* Checkout Fields */
	var $checkoutForms = $('.checkout-section').find('form');

	$checkoutForms.find('.dropdown-menu a').on('click', function() {
		ga('send', 'event', 'checkout_field', 'select', $(this).closest('.pretty-select').find('select').attr('id') );
	});

	$checkoutForms.find('input.radio').on('change', function() {
		ga('send', 'event', 'checkout_field', 'select', $(this).attr('id') );
	});

	$checkoutForms.find('.checkbox').on('click', function() {
		ga('send', 'event', 'checkout_field', 'select', $(this).find('input').attr('id') );
	});

	$checkoutForms.find(':input').on('focus', function () {
		if( $(this).is('button') ){
			return;
		}
		if( $(this).hasClass('completed') || $(this).hasClass('skipped') ){
			return;
		}
		if( $(this).attr('type') == 'checkbox' || $(this).attr('type') == 'radio' ){
			return;
		}
		ga('send', 'event', 'checkout_field', 'start', $(this).attr('id') );
	});

	$checkoutForms.find(':input').on('blur', function () {
		if( $(this).is('button') ){
			return;
		}
		if( $(this).attr('type') == 'checkbox' || $(this).attr('type') == 'radio' ){
			return;
		}
		// for conditional logic, see: http://www.lunametrics.com/blog/2014/11/10/form-tracking-google-tag-manager/#sr=g&m=o&cp=or&ct=-tmc&st=(opu%20qspwjefe)&ts=1423008281
		if( $(this).val().length > 0 && !($(this).hasClass('completed')) ){
			ga('send', 'event', 'checkout_field', 'complete', $(this).attr('id') );
			$(this).addClass('completed');
		}
		else if( !($(this).hasClass('completed')) && !($(this).hasClass('skipped')) ){
			ga('send', 'event', 'checkout_field', 'skip', $(this).attr('id') );
			$(this).addClass('skipped');
		}
	});
};

LS.isDevSite = function(){
	var host = window.location.hostname;
	if( host.indexOf('.dev') !== -1 || host.indexOf('electric') !== -1 ){
		return true;
	}

	return false;
}

LS.haveAnalytics = function(){
	return typeof ga !== 'undefined';
};

LS.haveFbTracking = function(){
	return typeof fbq !== 'undefined';
};

LS.havePinterestTracking = function(){
	return typeof pintrk !== 'undefined';
};

LS.haveSegment = function(){
	return typeof analytics !== 'undefined';
};
LS.segmentTrack = function(eventName, data){
	if( LS.isDevSite() ){
		console.log('SEGMENT DEBUG :: ' + eventName, data); 
	}else{
		analytics.track(eventName, data); 
	}
};

LS.getProductName = function(){
	var $ = jQuery;
	return $('#product-title').text();
};

LS.getProductPrice = function(){
	var $ = jQuery;

	// selectors here are pretty gross but we want to get the price as shown when added to cart
	var price_str = $('.product-view-price .regular-price .price').text(),
		$special_price = $('.product-view-price .special-price .price');

	if( $special_price.length > 0 ){
		price_str = $special_price.text();
	}

	return price_str.replace('$', '');
};

LS.getProductVariant = function(){
	var $ = jQuery;
	return $('.product-view-selected-color').text();
};

LS.getProductCategories = function(){
	var $ = jQuery;
	if( $('#product-categories').length < 1 ){
		return '';
	}
	return $('#product-categories').val();
};


LS.getWaitlistProduct = function(){
	var $ = jQuery;
	return $('#wait-list-form .name').text();
};

LS.toggleGalleryControls = function($gallery){
	var $ = jQuery;
	var $parent = $gallery.parent('.product-gallery');
	var itemsWidth = 0;
	$gallery.find('.item').each(function(){
		itemsWidth = itemsWidth + $(this).width();
	});
	if( itemsWidth < $(window).width() ){
		$parent.addClass('is-singular');
	}else{
		$parent.removeClass('is-singular');
	}
};

// in case we want to tweak these settings
LS.toggleLoading = function(visibility, el){
	if( visibility == 'show')
		el.fadeIn(300);
	if( visibility == 'hide')
		el.fadeOut(500);
};

LS.equalHeights = function(parentSelector, childSelector, targetEl){
	var $ = jQuery,
		$parents = $(parentSelector);

	if( $parents.length === 0 ) return;

	$(targetEl).attr('style', ''); // clear out any previous heights

	if( $(window).width() < 768 ) return; // one column

	$parents.each(function(){
		var $children = $(this).find(childSelector);
		if( $children.length ){
			var height = 0;
			$children.each(function(){
				if( $(this).find(targetEl).outerHeight() > height ){
					height = $(this).find(targetEl).outerHeight();
				}
			});
			$children.find(targetEl).outerHeight(height);
		}
	});
};

LS.setupPdpElements = function(){
	var $ = jQuery;
	var $w = $(window);

	if( !$('body').hasClass('catalog-product-view') ) return;

	if( $w.width() < 768 ){
		$('.product-title-group .product-title').detach().appendTo('#product-title-group-xs');
		$('.product-title-group .product-short-description').detach().appendTo('#product-title-group-xs');

		$('.product-title-group .mini-divider').detach().appendTo('#product-description-xs');
		$('.product-title-group .product-description').detach().appendTo('#product-description-xs');
	}else{
		$('#product-title-group-xs .product-title').detach().appendTo('.product-title-group');
		$('#product-title-group-xs .product-short-description').detach().appendTo('.product-title-group');

		$('#product-description-xs .mini-divider').detach().appendTo('.product-title-group');
		$('#product-description-xs .product-description').detach().appendTo('.product-title-group');
	}

};

LS.doStickyColumn = function ( el_starting_pos ){

	var $ = jQuery,
		$el = $('.sticky'),
		$el_parent = $('.sticky-parent'),
		bd_height = $('body').height(),
		scroll_pos = $(window).scrollTop(),
		pin_start = $('#site-header').outerHeight(),
		el_window_offset = $el.offset().top - scroll_pos,
		el_bottom = bd_height - ( $el.offset().top + $el.outerHeight() ),
		column_bottom = bd_height - ( $el_parent.offset().top + $el_parent.outerHeight() );

		// pin the sidebar when it hits the navbar
		if( el_window_offset <= pin_start ){
			$el.addClass('pinned');
		}
		// if the bottom of the sidebar hits the bottom of the columnm, unpin from the top and pin to the bottom
		if( el_bottom <= column_bottom ){
			$el.addClass('pinned-bottom');
		}
		// we have room again when scrolling back up, repin to the top
		if( el_window_offset > pin_start ){
			$el.removeClass('pinned-bottom');
		}
		// we've scrolled passed our initial starting point, unpin
		if( el_starting_pos - scroll_pos > pin_start ){
			$el.removeClass('pinned');
		}
};

LS.filters = {

	moveFilters: function(){
		var $ = jQuery,
			window_w = $(window).width(),
			$filters_home = $('#filters-column-home'),
			$filters = $('#filters-column'),
			$main_col_el = $('.main .feature');

		if( $main_col_el.length > 0 ) {
			if( window_w < LS.desktopBreakpoint ){
				$filters.insertAfter( $main_col_el );
			}else{
				$filters_home.prepend( $filters );
			}
		}
	},

	countActiveFilters: function(){
		var $ = jQuery,
			total_active_count = 0;

		$('.filter-options').each(function(){
			var $this = $(this),
				active_count = $this.find('input[type="checkbox"]:checked').length;

			if( active_count > 0 ){
				total_active_count = total_active_count + active_count;
			}
		});
		if( total_active_count > 0 ){
			$('.all-filters-toggle .badge').text(total_active_count).removeClass('hidden');
		}else{
			$('.all-filters-toggle .badge').addClass('hidden');
		}
	},

	setStickyColumnHeight: function(target){
		var $ = jQuery;
		$('.sticky-parent').height( target.outerHeight() );
	},

	refreshFilters: function(url, clear){
		var $ = jQuery,
			$loading = $('#filters-column .loading'),
			$filters = $('#category-filters'),
			$open_filters = $('.m-filter-item-list.in'),
			filters_h = $filters.height();
			window_h = $(window).height();

		LS.toggleLoading('show', $loading );

		if (clear) {
			$('.main .product-grid').fadeTo('.25', '.1');
		}

		var open_filter_ids = [];
		$open_filters.each(function(){
			open_filter_ids.push($(this).attr('id'));
		});

		// adjust our loading indicator to be as tall as the filters, but not taller than the window so the spinner is always visible
		if( filters_h > window_h ){
			$loading.css('bottom', filters_h - window_h );
		}else{
			$loading.css('bottom', '0' );
		}

		$.get(url, function (data) {
			var newgrid = $(data).find('.main .product-grid').html(),
				newfilters = $(data).find('#filters-column .block-layered-nav').html(),
				scroll_pos = $(window).scrollTop();

			$('.main .product-grid').html(newgrid);
			// disable lazy loading, client request
			// $('img.lazy').lazyLoadXT({
			// 	edgeY : 500
			// });
			$('#filters-column .block-layered-nav').html(newfilters);

			if (clear) {
				$('.main .product-grid').fadeTo('.25', 1);
				$('#all-filters').removeClass('in');
				$('.all-filters-toggle').removeClass('open');
			}else{
				$('#all-filters').addClass('in');
				$('.all-filters-toggle').addClass('open');

				// reopen filters that may not have had something selected
				for (var i = open_filter_ids.length - 1; i >= 0; i--) {
					$('#'+open_filter_ids[i]).addClass('in');
					$('#'+open_filter_ids[i]).prev('.filter-toggle').removeClass('collapsed');
				}
			}

			if( $(window).width() > LS.desktopBreakpoint ){
				if( $('#category-filters').outerHeight() > $('.main').outerHeight() ){
					LS.filters.setStickyColumnHeight( $('#category-filters') );
				}else{
					LS.filters.setStickyColumnHeight( $('.main') );
				}
			}

			LS.filters.countActiveFilters();
			LS.toggleLoading('hide', $('#filters-column .loading') );
		});

	}

};

LS.overlay = {
	open: function(){
		var $ = jQuery;
		$('#overlay').fadeIn(300);
	},
	close: function(){
		var $ = jQuery;
		$('#overlay').fadeOut(300);
	}

};

LS.cart = {

	toggle: function (open) {
		var $ = jQuery;

		if (open) {
			if( open == 'add'){
				$('#add-to-cart-success').show();
			}
			$('body').addClass('cart-open');
		}
		else {
			$('#add-to-cart-success').hide(); // 
			$('body').toggleClass('cart-open');
		}

		if ($('body').hasClass('cart-open')) {
			$('#overlay').fadeIn(300, function(){
				var hideShippingForm = false;
				if (!$('.shipping .shipping-form').is(':visible')) {
					$('.shipping .shipping-form').show();
					hideShippingForm = true;
				}
				// $('.pretty-select select').selectpicker();
				if (hideShippingForm) {
					$('.shipping .shipping-form').hide();
				}
			});
			if( LS.haveSegment() ){
				var $cartItems = $('.cart-items .remove-item'); // the remove button has values attached, so use that
				var products = [];
				$cartItems.each(function(){
					products.push({product_id:$(this).data('product-id')});
				});
				LS.segmentTrack('Cart Viewed', {
				    products: products
				});
			}
		} else {
			LS.overlay.close();
		}
	},

	// updateCartCount: function (new_qty){
	// 	var $ = jQuery;

	// 	var $el = $('#cart-count-sm, #cart-count-md');
	// 	if( new_qty > 0 ){
	// 		$el.text(new_qty).removeClass('no-items');
	// 	}else{
	// 		$el.addClass('no-items');
	// 	}

	// },

	updateCartActions: function (new_qty){
		var $ = jQuery,
			$cartActions = $('.cart-window-actions');

		if(new_qty > 0){
			$cartActions.removeClass('no-checkout');
		}else{
			$cartActions.addClass('no-checkout');
		}
	},

	updateCounts: function(count){
		var $ = jQuery;
		var $cartCountBadge = $('#cart-count-sm');

		// cart title
		var cartSummary = count + ' Item';
		if( count > 1 ){
			cartSummary = cartSummary + 's';
		}
		if( count == 0 ){
			cartSummary = '';
		}
		$('.cart-title .subtitle').text(cartSummary);

		// cart button
		$cartCountBadge.text(count);
		if( count > 0 ){
			$cartCountBadge.removeClass('no-items'); // display: none on .no-items
		}else{
			$cartCountBadge.addClass('no-items');
		}
	},

	get: function(productAdded){
		var $ = jQuery;

		$('#side-cart .cart-inner').html('<div class="loading"></div>');
		var $loading = $('#side-cart .loading');
		LS.toggleLoading('show', $loading);
		
		$.ajax({
			url : '/checkout/cart',
			success : function(data, textStatus, jqXHR){
				var $items = $(data).find('#shopping-cart-table');
				var $totals = $(data).find('#shopping-cart-totals-table');
				var $proceedBtn = $(data).find('#cart-items .checkout-types .btn');

				if( $items.length ){
					// add items and totals
					$('#side-cart .cart-inner').append($items, $totals);
					LS.cart.calculateTotalDiscount();

					var $buttons = $('#cart-summary .btn').clone();
					$('#side-cart .cart-inner').append($buttons);

					// count elements
					LS.cart.updateCounts($items.data('count'));

					if( typeof productAdded !== 'undefined' ){
						var $cartItem = $('.remove-item[data-simple-sku="'+productAdded +'"]');
						var productPrice = $cartItem.data('product-price');

						$('#added-product-name').text($cartItem.data('product-name'));
						$('#added-product-image').attr('src', $cartItem.closest('tr').find('.cart-item-thumb img').attr('src'));
						$('#added-product-color').text($cartItem.data('product-variant'));
						$('#added-product-qty').text($cartItem.data('product-qty'));
						$('#added-product-price').text('$' + productPrice.replace('.00',''));
						$('#added-cart-count').text($items.data('count'));
						$('#added-cart-subtotal').text($('#subtotal-row .item-total').text());

						LS.toggleLoading('hide', $('.add-to-cart-wrapper .loading'));
						$('.add-to-cart-input').removeAttr('disabled');

						LS.cart.toggle('add'); // show cart panel after add action
					}
				}else{
					$('#side-cart .cart-inner').prepend($(data).find('.cart-empty'));
					$('#side-cart .cart-inner .btn').closest('p').remove(); // continue shopping
				}

				LS.toggleLoading('hide', $loading);
				
			}
		});
	},
	
	calculateTotalDiscount: function(){
		var $ = jQuery;

		$('#coupon-row').data('discount-value', $('#discount-row').data('discount-value'));  // our discount row stashes the value of the coupon applied 
		$('#coupon-total').text($('#discount-total').text());  // move the outputted value to this row 
		$('#discount-row').remove();  // remove the original discount row
		
		var totalDiscount = 0;  // gather discounts add add them to the custom totals row 
		$('#shopping-cart-totals-table tbody tr, #checkout-review-totals-table tbody tr').each(function(){
		    if( $(this).data('discount-value') ){
		        totalDiscount = totalDiscount + Number($(this).data('discount-value'));
		    }
		});
		if( !totalDiscount ){
		    $('#discount-total-row').remove();
		}else{
		    $('#discount-total').text('-$' + totalDiscount.toFixed(2));
		}
	}

};

LS.fireEvent = function(el, ev) {
	$(el).simulate(ev);
};

LS.handlePrettySelects = function() {
	var $ = jQuery;

    // Make sure the checkout dropdowns fire their events
    $('select').on('change', function(e){
      if (!e.originalEvent) {
        // Only fire this for the original jQuery change event
        if (typeof LS != 'undefined') {
          LS.fireEvent($(this)[0], 'change');
        }
      }
    });
};

LS.linkImagesToVideos = function(){
	var $ = jQuery;
	$('.has-video').on('click', function(e){
	    e.preventDefault();
	    LS.productVideoOpen($(this).data('video-id'));
	});
};

LS.productVideoOpen = function(videoId){
	var $ = jQuery;
	var $container = $('#product-video-container');
	var dataLayer = window.dataLayer || [];

	// video{n}Embed variables are defined in /app/design/frontend/lo-rwd/default/template/catalog/product/view.phtml
	switch(videoId){
		case 2:
			embedCode = video2Embed;
		break;
		case 3:
			embedCode = video3Embed;
		break;
		case 4:
			embedCode = video4Embed;
		break;
		case 5:
			embedCode = video5Embed;
		break;
		case 6:
			embedCode = video6Embed;
		break;
		default:
			embedCode = video1Embed; 
		break;
	}

	// embed it
	$container.prepend(embedCode);
	var $iframe = $container.find('iframe');

	// set the width to a value that makes the height of the embed 80% of the window height,
	// then convert that width to a percentage of the window width so it scales,
	// but only when that size isn't wider than the current window
	var iframeEmbedWidth = $iframe.attr('width');
	var ratio = ( $(window).height() * 0.8 ) / $iframe.attr('height');
	if( iframeEmbedWidth * ratio > $(window).width() ){
		$container.css('width', '100%');
	}else{
		$container.css('width', ((iframeEmbedWidth * ratio) / $(window).width()) * 100 +'%' );
	}

	// responsify it now that we have its size defined
	$container.fitVids();

	// show it
	$('#product-video').fadeIn();

	// center it in the window, do this after the fade in so the height is available. The user shouldn't see the shift.
	$container.css('margin-top', '-'+($container.outerHeight()/2)+'px' );

	// use the vimeo API to auto-play
	// NOTE: iOS doesn't allow js to auto-play media, so the user will still have to click play.
	player = new Vimeo.Player($iframe[0]);
	
	// only attempt the auto play for desktop. Vimeo changed something so autoplay attempts will leave the video in a paused state.
	if( $(window).width() >= LS.desktopBreakpoint ){
		player.play();	
	}

	player.on('play', function(data){
    	player.getVideoTitle().then(function(title) {
    		dataLayer.push({
    			'event' : 'videoStart',
    			'videoName' : title
    		});    
    	}).catch(function(error) {
    		console.log(error);
    	});
	});
	player.on('ended', function(data){
    	player.getVideoTitle().then(function(title) {
	        dataLayer.push({
	        	'event' : 'videoEnd',
	        	'videoName' : title
	        });
    	}).catch(function(error) {
    		console.log(error);
    	});
	});
};

LS.productVideoClose = function(){
	var $ = jQuery;
	$('#product-video').fadeOut();
    $('#product-video .fluid-width-video-wrapper').remove(); // have to destroy the video for iOS
};

LS.product_detail_zoom_init = function(){
	var $ = jQuery,
		isMobile = ($(window).width() < LS.desktopBreakpoint);

	if (!isMobile) {
		$('.product-images .item.active').zoom({
				on:'click',
				onZoomIn: function() {
					$('.product-images .carousel-control').hide();
					$('.product-images .item.active').addClass('zoomed');
				},
				onZoomOut: function() {
					$('.product-images .carousel-control').show();
					$('.product-images .item.active').removeClass('zoomed');
				},
				onDestroy: function() {
					$('.product-images .carousel-control').show();
					$('.product-images .item.active').removeClass('zoomed').attr('style','');
				}
		});
	}
};

LS.scrollToFirstError = function(form){
	var $ = jQuery;

	// Find first validation error in form element and scroll to it, if it's not visible in the viewport
	var $firstFailure = $(form).find('.validation-failed').first().closest('.form-group');
	if ($firstFailure.length === 0) {
		return;
	}

	var isElementInViewport = function (el) {

	    //special bonus for those using jQuery
	    if (typeof jQuery === "function" && el instanceof jQuery) {
	        el = el[0];
	    }

	    var rect = el.getBoundingClientRect();

	    return (
	        rect.top >= $('#header').outerHeight() &&
	        rect.top <= $(window).height()
	    );
	};

	if (!isElementInViewport($firstFailure)) {
		var pos = $firstFailure.offset().top - $('#header').outerHeight();
		$('html,body').animate({scrollTop: pos+'px'}, 250);
	}
};

LS.beforeValidateSelectPickers = function(form){
    var prettys = $(form).select('.pretty-select');

    prettys.each(function(el){
        var select = $(el).down('select');
        if( select.hasClassName('validate-select') ) select.addClassName('pretty-hide-me').show();
    });
};

LS.afterValidateSelectPickers = function(form){
    var prettys = $(form).select('.pretty-select');

    prettys.each(function(el){

        $(el).select('.pretty-hide-me').each(function(pel){
            $(pel).removeClassName('pretty-hide-me').hide();
        });

        var field = $(el).down('select.validate-select');

        if( field ){

            var fieldpicker = field.next('.validate-select').down('.selectpicker'),
                advice = field.next('.validation-advice');

            if (field.hasClassName('validation-failed')) {
                fieldpicker.addClassName('validation-failed');
            }
            else {
                fieldpicker.removeClassName('validation-failed');
            }
            if (field.hasClassName('validation-passed')) {
                fieldpicker.addClassName('validation-passed');
            }
            else {
                fieldpicker.removeClassName('validation-passed');
            }

	        $(el).insert(advice);

        }

    });
};

LS.setupPdpDetailPanels = function(){
	var $ = jQuery;
	if( $(window).width() < LS.desktopBreakpoint ){
		$('.product-details-panel [role="button"]').addClass('collapsed');
		$('.product-details-panel .collapse').removeClass('in');
	}else{
		$('.product-details-panel [role="button"]').removeClass('collapsed');
		$('.product-details-panel .collapse').addClass('in').attr('style', '');
	}
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Hijack Footer Subscription Action
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
LS.handleFooterNewsletterForm = function(form) {
	var $ = jQuery,
		$form = $(form);

    var validator = new Validation(form);
    // 	useSpecialPickerHandling = !$('#newsletter .pretty-select select').is(':visible');
    // if (useSpecialPickerHandling) {

    // 	// Hide the non-pretty dropdowns in the newsletter form to allow the validation to work
    // 	$form.find('.pretty-select select').css({
    // 		'position':'absolute',
    // 		'left':'-1000px'
    // 	});

	   //  LS.beforeValidateSelectPickers(form);
    // }

    validator.validate();

 //    if (useSpecialPickerHandling) {

	//     // Wait just a touch to keep the validation library from reversing its validation detection for the pretty dropdowns
	//     setTimeout(function(){
	// 	    LS.afterValidateSelectPickers(form);
	//     }, 10);

	// }

	if ($form.find('.validation-failed').length > 0) {
		return false;
	}

	// HTML for the form is in a static block, so let's add this here
	$form.find('.modal-footer #footer-newsletter-message').remove();
	$form.find('.modal-footer').prepend('<div id="footer-newsletter-message" class="message text-center"></div>');

	var $message = $('#footer-newsletter-message'),
		$btn = $form.find('button');

	$message.hide().removeClass('success error'); // in case it was shown after the ajax
	$btn.prop("disabled",true);

	$.ajax({
		type: $form.attr('method'),
		url: $form.attr('action'),
		data: $form.serialize()
	})
	.done(function(response){
		if( response.success ){
			$form.find('.modal-body,.modal-footer button,.modal-header p').slideUp();
			$message.addClass('success').html(response.message).fadeIn();

			// klaviyo 
			var _learnq = window._learnq || [];
			var _learnqParams = {
				'$email' : $('#footer-newsletter-email').val(),
				'Birth Year' : $('#footer-newsletter-birthyear').val(),
				'Mens Products' : $('#product-interests-men').is(':checked'),
				'Womens Products' : $('#product-interests-women').is(':checked'),
				'Welcome Code' :  response.data.coupon,
				'Sign Up Source' : 'footer'
			};

			_learnq.push(['identify', _learnqParams]);

		}else{
			$message.addClass('error').html(response.message).fadeIn();
		}
		$btn.prop("disabled",false);
	});

	return false;
};

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Load Dynamic Elements that bypass cache
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
LS.getDynamicElements = function(){
	var $ = jQuery;
	var data = {};

	// PDP needs the ID sent for the review form
	if( $('#product-id').length ){
		data = {
			id : $('#product-id').val()
		}
	}
	
	$.ajax({
		url : '/ls-elements/index/data',
		data : data,
		success : function(data, textStatus, jqXHR){

			// add in the current account links (might be the same as what was there before)
			$('#site-menu > ul').append(data.accountHtml); 

			$(data.marquee).insertAfter('#site-header');

			// review form
			if( $('#reviews-list').length ){
				$(data.reviewsFormHtml).insertAfter('#reviews-list');
				$('#add-review-form').show();	
			}

			// maybe fire off segment/fullstory identification
			if( ! LS.isDevSite() && LS.haveSegment() && data.segmentUser ){
			    analytics.ready(function() {
			        FS.identify(data.segmentUser.id, data.segmentUser);
			    });
			    analytics.identify(data.segmentUser.id, data.segmentUser);
			}
		}
	});
};
LS.setRefererUrls = function(){
	var $ = jQuery;

	// make sure referer URLs are the current page for cart actions
	var separator = '?';
	var bypassStr = 'cf-bypass=true';
	
	if( window.location.search !== '' ){
	    separator = '&';
	}
	var url = window.location.href + separator + bypassStr;

	jQuery('input[name="referer_url"]').val(url);
};


LS.isElementInViewport = function(el) {

    var rect = el.getBoundingClientRect();

    return (
        // rect.top >= 0 &&
        // rect.left >= 0 &&
        // rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        // rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */

        // we only care about the top edge
        rect.top <= (window.innerHeight || document.documentElement.clientHeight)
    );
};
