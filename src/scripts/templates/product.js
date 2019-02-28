import '../../styles/templates/product.scss'

import pdpGallery from '../sections/pdp-gallery'
import '../sections/pdp-form'
import '../sections/pdp-callout-galleries'
import '../sections/pdp-material'
import pdpStories from '../sections/pdp-stories'
import pdpCrossSell from '../sections/pdp-cross-sell'
import '../sections/pdp-size-fit-modal'

import pdpModal from '../sections/pdp-modal'

// import '../sections/pdp-swatches'

var viewers = [];

$(document).ready(function(){

	// New PDP functions ~ 2/2019
	pdpStories(document.querySelector('.pdp-stories'));
	pdpCrossSell(document.querySelector('.pdp-cross-sell'));
	document.querySelectorAll('.pdp-gallery').forEach(el => { pdpGallery(el, viewers); });
	document.querySelectorAll('.pdp-modal-link').forEach(el => { pdpModal(el); });
	//



	// Below is jQuery grabbed from previous version of Lo & Sons
	// it handles everything when clicking on swatches, which basically means refreshing all product info

	var $variants = $('[data-product-select]');

	var updatePricing = function(siblingId){
		var selectedVariant;
		var comparePrice;
		for (var i = siblingsJson[siblingId].variants.length - 1; i >= 0; i--) {
			if( siblingsJson[siblingId].variants[i].id == $variants.val() ){
				selectedVariant = siblingsJson[siblingId].variants[i];
			}
		};

		// sale pricing
		if( selectedVariant.compare_at_price && selectedVariant.compare_at_price > 0 ){
			comparePrice = slate.Currency.formatMoney(selectedVariant.compare_at_price, theme.moneyFormat);
			$('[data-discount-amount]').text( Math.round( 100*(selectedVariant.compare_at_price - selectedVariant.price) / selectedVariant.compare_at_price ) );
			$('.discount-badge, .discount-label').removeClass('is-hidden');
		}else{
			comparePrice = '';
			$('.discount-badge, .discount-label').addClass('is-hidden');
		}

		// update the regular price element
		if( comparePrice == '' ){
			$('[data-compare-price]').addClass('is-hidden');
		}else{
			$('[data-compare-price]').html(comparePrice);
			$('[data-compare-price]').removeClass('is-hidden');
		}

		// current price
		var price = slate.Currency.formatMoney(selectedVariant.price, theme.moneyFormat);
		$('[data-product-price]').html(price.replace('.00',''));
	};

	var updateCta = function(){
		var selectedVariantID = $variants.val();
		var $soldOutMsg = $('#sold-out-message');
		var $addToCartRow = $('#add-to-cart');
		var $addToCartBtn = $('[data-add-to-cart]');
		var $addToWaitlistBtn = $('[data-add-to-waitlist]');
		var siblingId = $('.pdp-swatch.active').data('sibling');
		var newVariants = siblingsJson[siblingId].variants;
		// reset to purchase or waitlist
		$addToCartRow.show();
		$soldOutMsg.hide();
		for (var i = 0; i < newVariants.length; i++) {
			if( newVariants[i].id == selectedVariantID ){
				if( newVariants[i].available ){
					// can buy
					$addToCartBtn.show();
					$addToWaitlistBtn.hide();
				}else{
					if( variantStockData[selectedVariantID].oosPolicy == 'soldout'){
						// can't buy
						$addToCartRow.hide();
						$soldOutMsg.show();
					}else{
						// can buy later
						$addToWaitlistBtn.data('variant-id', selectedVariantID).show();
						$addToCartBtn.hide();
						$('#wl-variant').val(selectedVariantID);
					}
				}
			}
		};
	};

	var updateWaitlistMeta = function(){
		var wlMeta = [$('#current-option span').text()];
		if( $('#variant-buttons ').length ){
			wlMeta.push($('#variant-buttons .selected').text());
		}
		$('[data-wl-meta]').text(wlMeta.join(' - '));

		var variant = $variants.val();
		var wlExpected = variantStockData[variant].restockMessage;
		if( wlExpected != '' ){
			$('[data-wl-expected]').text('Expected in stock: ' + wlExpected);
		}else{
			$('[data-wl-expected]').text('');
		}

	};

	var updateDataLayer = function(){
		var dataLayer = window.dataLayer || [];
		var selectedSibling = $('.pdp-swatch.active').data('sibling');
		var selectedVariantID = $variants.val();
		for (var i = 0; i < siblingsJson[selectedSibling].variants.length; i++) {
			if( siblingsJson[selectedSibling].variants[i].id == selectedVariantID ){
				dataLayer.push({
					'event' : 'swatchClick',
					'productData.price' : siblingsJson[selectedSibling].variants[i].price * 0.01,
					'productData.comparePrice' : siblingsJson[selectedSibling].variants[i].compare_at_price * 0.01,
					'productData.sku' : siblingsJson[selectedSibling].variants[i].sku,
					'productData.name' : siblingsJson[selectedSibling].title,
					'productData.variant' : siblingsJson[selectedSibling].variants[i].title,
					'productData.variantId' : selectedVariantID,
					'productData.url' : siblingsSupplimentalJson[selectedSibling].url,
					'productData.imageUrl' : siblingsSupplimentalJson[selectedSibling].featuredImage,
					'productData.collections' : siblingsSupplimentalJson[selectedSibling].collections,
					'pinterestPage' : siblingsJson[selectedSibling].title
				});
			}
		};
	};

	var updateLowStockWarning = function(){
		var variant = $variants.val();
		var inventoryLevel = variantStockData[variant].stockLevel;
		var $warning = $('.low-stock-warning');
		if( inventoryLevel > 0 && inventoryLevel <= 20 ){
			$warning.addClass('shown');
		}else{
			$warning.removeClass('shown')
		}
	};

	var updateFinalSaleMessage = function(){
		var variant = $variants.val();
		var $warning = $('.final-sale-warning');
		if( discontinued.includes(variant) ){
			$warning.addClass('shown');
		}else{
			$warning.removeClass('shown')
		}
	};

	var getSelectedString = function(){
		var selectedText = [];
		$('.variant-option').each(function(){
			if( $(this).hasClass('selected') ){ // selected status get set in swatches.js
				selectedText.push($(this).text().trim());
			}
		});
		return selectedText.join(' / ');
	}

	if( $('[data-product-json]').length ){
		var productJson = JSON.parse($('[data-product-json]').text().trim());
	}

	// on page load
	if( $('body').hasClass('template-product') ){
		updateWaitlistMeta();
		updateLowStockWarning();
		updateFinalSaleMessage();
	}

	$('.pdp-swatch').on('click', function(e){
		e.preventDefault();
	    var siblingId = $(this).data('sibling');
	    var currentSize = $('#variant-buttons .selected').text();

	    // update active swatch
	    $('.pdp-swatch').removeClass('active');
	    $(this).addClass('active');

	    // replace chosen color
	    $('#current-option span').text( $(this).find('img').data('color-label') );

	    // replace options in our Size selector. hard coded for single option variants
	    var newVariants = siblingsJson[siblingId].variants;
	    $('#variant-buttons').html('');
	    $variants.html('');
	    for (var i = 0; i <= newVariants.length - 1; i++) {
	    	// build our hidden select
	    	$variants.append('<option value="'+newVariants[i].id+'">'+newVariants[i].title+'</option>');

	    	// build our buttons, hiding some based on their out-of-stock-policy metafield
	    	if( hiddenVariants.indexOf(newVariants[i].id) == -1 ){
	    		$('#variant-buttons').append('<a href="#" data-id="'+newVariants[i].id+'" class="btn btn-secondary variant-option">'+newVariants[i].title+'</a>');
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
	    $('.pdp-gallery').removeClass('active');
	    $('.pdp-gallery').each(function(){
	    	if( $(this).data('sibling') == siblingId ){
	    		$(this).addClass('active');
	    		var $active_slide = $(this).find('.film_roll_pager a.active');
	    		var active_slide_position = $(this).find('.film_roll_pager a').index( $active_slide ) + 1; // using the pager here because film role adjusts the index of slides with each animation
	    		if( active_slide_position > 1 ){ // we only care about navigation to secondary images
	    			dataLayer.push({
	    				'event' : 'galleryNavigation',
	    				'productImage' : active_slide_position
	    			});
	    		}


	    		// refresh imageViewer for current siblingId
	    		if(viewers[siblingId]) viewers[siblingId].refresh();


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

	      dataLayer.push({
	      	'event' : 'afterUrlUpdate'
	      });
	    }

	    // maybe show warnings
	    updateLowStockWarning();
	    updateFinalSaleMessage();

	});


	$('body').on('click', '.variant-option', function(e){
	    e.preventDefault();
	    var $btn = $(this);
	    $('.variant-buttons .validation-error').remove();
	    $btn.closest('.variant-buttons').find('.variant-option').removeClass('selected');
	    $btn.addClass('selected');
	   	if( !$(this).hasClass('gc-option') ){ // size attributes
		    $variants.find('option').each(function(){
		    	if( $(this).text().trim() == $btn.text() ){
		    		$variants.val($(this).attr('value'));
		    		$variants.trigger('change');
		    	}
		    });
	    	$('#wl-variant').val($variants.val());
	    	updateCta();
	    	updateDataLayer();
	    	updateWaitlistMeta();
	    	updateLowStockWarning();
	    	updateFinalSaleMessage();
	    }else{ // gift card options
    	    var selectedString = getSelectedString();
    		$variants.find('option').each(function(){
    			if( $(this).text().trim() == selectedString ){
    				$variants.val($(this).attr('value'));
    			}
    		});
    		// update the featured image and hidden image field
    		for (var i = 0; i < productJson.variants.length; i++) {
    			if( productJson.variants[i].id == $variants.val() ){
    				var variantImage = productJson.variants[i].featured_image.src;
    				$('[data-product-featured-image]').attr('src', variantImage);
    				$('[data-variant-image]').val(variantImage);
    			}
    		};
	    }
	});

	$variants.on('change', function(){
		updatePricing($('.pdp-swatch.active').data('sibling'));
	});

	$('[data-add-to-cart]').on('click', function(e){
	    if( !$variants.val() ){
	    	$('#variant-buttons').append('<div class="validation-error">Please select a size</div>');
	    	return false;
	    }
	});
});

