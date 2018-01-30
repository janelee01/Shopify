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
	    $('.product-gallery').removeClass('active');
	    $('.product-gallery').each(function(){
	    	if( $(this).data('sibling') == siblingId ){
	    		$(this).addClass('active');
	    	}
	    });

	    // replace chosen color
	    $('#current-option span').text( $(this).find('img').data('color-label') );

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
});