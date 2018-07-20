$(document).ready(function(){
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
		
		// update the regular price element
		$('[data-compare-price]').html(comparePrice);
		if( comparePrice == '' ){
			$('[data-compare-price]').hide();
		}else{
			$('[data-compare-price]').fadeIn();
		}

		// current price
		var price = slate.Currency.formatMoney(selectedVariant.price, theme.moneyFormat);
		$('[data-product-price]').html(price.replace('.00',''));
	};

	var updateCta = function(){
		var selectedVariantID = $('[data-product-select]').val();
		var $addToCartBtn = $('[data-add-to-cart]');
		var $addToWaitlistBtn = $('[data-add-to-waitlist]');
		var siblingId = $('.swatch.active').data('sibling');
		var newVariants = siblingsJson[siblingId].variants;
		for (var i = 0; i < newVariants.length; i++) {
			if( newVariants[i].id == selectedVariantID ){
				if( newVariants[i].available ){
					$addToCartBtn.show();
					$addToWaitlistBtn.hide();
				}else{
					$addToWaitlistBtn.data('variant-id', selectedVariantID).show();
					$addToCartBtn.hide();
					$('#wl-variant').val(selectedVariantID);
				}
			}
		};
	};

	var updateWaitlistMeta = function(){
		var wlMeta = [$('#current-option span').text(), $('#variant-buttons .selected').text()];
		$('[data-wl-meta]').text(wlMeta.join(' - '));
	};

	var updateDataLayer = function(){
		var dataLayer = window.dataLayer || [];
		var selectedSibling = $('.swatch.active').data('sibling');
		var selectedVariantID = $('[data-product-select]').val();
		for (var i = 0; i < siblingsJson[selectedSibling].variants.length; i++) {
			if( siblingsJson[selectedSibling].variants[i].id == selectedVariantID ){
				dataLayer.push({
					'event' : 'swatchClick',
					'productData.price' : siblingsJson[selectedSibling].variants[i].price * 0.01,
					'productData.comparePrice' : siblingsJson[selectedSibling].variants[i].compare_at_price * 0.01,
					'productData.sku' : siblingsJson[selectedSibling].variants[i].sku,
					'productData.name' : siblingsJson[selectedSibling].title,
					'productData.variant' : siblingsJson[selectedSibling].variants[i].title,
					'productData.url' : siblingsSupplimentalJson[selectedSibling].url,
					'productData.imageUrl' : siblingsSupplimentalJson[selectedSibling].featuredImage,
					'productData.collections' : siblingsSupplimentalJson[selectedSibling].collections
				});
			}
		};
	};

	var updateLowStockWarning = function(){
		var inventoryLevel = $('.variant-option.selected').data('inventory');
		var $warning = $('.low-stock-warning');
		if( inventoryLevel > 0 && inventoryLevel <= 20 ){
			$warning.addClass('shown');
		}else{
			$warning.removeClass('shown')
		}
	}

	// on page load
	updateWaitlistMeta();
	updateLowStockWarning();

	$('.swatch').on('click', function(e){
		e.preventDefault();
	    var siblingId = $(this).data('sibling');
	    var currentSize = $('#variant-buttons .selected').text();

	    // update active swatch
	    $('.swatch').removeClass('active');
	    $(this).addClass('active');

	    // replace chosen color
	    $('#current-option span').text( $(this).find('img').data('color-label') );

	    // replace options in our Size selector. hard coded for single option variants
	    var newVariants = siblingsJson[siblingId].variants;
	    $('#variant-buttons').html('');
	    $('[data-product-select]').html('');
	    for (var i = 0; i <= newVariants.length - 1; i++) {
	    	if( hiddenVariants.indexOf(newVariants[i].id) == -1 ){
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

	    // toggle Add to cart / Join waitlist visibility
	    updateCta(); 

	    // update dataLayer values
	    updateDataLayer();

	    // update waitlist 
	    $('#wl-image').attr('src', siblingsJson[siblingId].featured_image);
	    $('#wl-product').val(siblingId);
	    updateWaitlistMeta();

	    // replace galleries
	    $('.product-gallery').removeClass('active');
	    $('.product-gallery').each(function(){
	    	if( $(this).data('sibling') == siblingId ){
	    		$(this).addClass('active');
	    		var $active_slide = $(this).find('.film_roll_pager a.active');
	    		var active_slide_position = $(this).find('.film_roll_pager a').index( $active_slide ) + 1; // using the pager here because film role adjusts the index of slides with each animation
    			dataLayer.push({
    				'event' : 'galleryNavigation',
    				'productImage' : active_slide_position
    			});
	    	}
	    });

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
	      sessionStorage.setItem('lo-back-to', newurl); // for use in the cart
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
	    $('#wl-variant').val($('[data-product-select]').val());
	    updateCta();
	    updateDataLayer();
	    updateWaitlistMeta();
	    updateLowStockWarning();
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
});