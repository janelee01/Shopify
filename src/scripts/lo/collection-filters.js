$(document).ready(function(){
	var $activeFilters = $('#active-filters');
	var $activeFiltersList = $('[data-active-filters]');
	$('.filter-toggle').on('click', function(e){
	    e.preventDefault();
	    $('.filter-options').hide();
	    if( $(this).hasClass('active') ){
	    	$(this).removeClass('active');
	    	$('#filters-panel').hide();
	    }else{
	    	$('.filter-toggle').removeClass('active');
	    	$(this).addClass('active');
	    	$('#filters-panel').show();
	    	$($(this).attr('href')).fadeIn();
	    }
	});
	$('.filter-option').on('click', function(e){
	    e.preventDefault();
	    $(this).toggleClass('selected');

	    // assume nothing matches
	    $('.f-hook').addClass('hidden');
	    $('#filters-collapse').remove();

	    // rebuild arrays of selections
	    var activeTextArr = [];
	    var activeMatchAllArr = [];
	    var activeMatchAnyArr = [];
	    $('.filter-option.selected').each(function(){
	    	activeTextArr.push($(this).text());
	    	if( $(this).hasClass('is-price-range') ){
	    		activeMatchAnyArr.push($(this).data('hook'));
	    	}else{
	    		activeMatchAllArr.push($(this).data('hook'));
	    	}
	    });

	    // update active filter list
	    $activeFiltersList.text(activeTextArr.join(', '));
	    
	    if( activeTextArr.length < 1 ){
	    	// no active filters, so show everything
	    	$('.page-header').removeClass('has-active-filters');
	    	$('.f-hook').removeClass('hidden');
	    	$('.pagination').show();
	    }else{
	    	// hide pagination while filtering for now
	    	$('.pagination').hide();

	    	// show results
	    	var matchAllSelector = activeMatchAllArr.join('');
	    	if( activeMatchAnyArr.length ){
	    		// combine our Match All selector with each of our Match Any (price) selectors
	    		// "Weekend bags that will hold tablets and are priced between 0 and 200" ...
	    		// .f-weekender.f-tablet.p-0-100
	    		// .f-weekender.f-tablet.p-100-200
	    		for (var i = 0; i < activeMatchAnyArr.length; i++) {
	    			$( matchAllSelector + activeMatchAnyArr[i] ).removeClass('hidden');
	    		};
	    	}else{
	    		// no price filters in play, so just the Match All selector
	    		// .f-weekender.f-tablet
	    		$(matchAllSelector).removeClass('hidden');
	    	}
	    	
	    	// show our active filters element
	    	$('.page-header').addClass('has-active-filters');

	    	// mobile button to get the filters out of the way
	    	if( $(window).width() < LS.desktopBreakpoint ){
	    		var shown = $('.f-hook').length - $('.f-hook.hidden').length;
	    		var btnText = shown > 1 ? 'Show ' + shown + ' items' : 'Show 1 item';
	    		$('<button id="filters-collapse" class="btn">' + btnText + '</button>').insertBefore('#active-filters');
	    	}
	    }

	    // maybe hide the product group
	    $('.product-family').each(function(){
	    	if( $(this).find('.f-hook').length == $(this).find('.f-hook.hidden').length ){
	    		$(this).hide();
	    	}else{
	    		$(this).fadeIn();
	    	}
	    });
	});
	$('#reset-filters').on('click', function(e){
	    e.preventDefault();
	    $('.filter-option').removeClass('selected');
	    $('.page-header').removeClass('has-active-filters');
	    $('.f-hook').removeClass('hidden');
	    $('.product-family').fadeIn();
	    $('.pagination').show();
	    $('#filters-collapse').hide();
	});
	$('body').on('click', '#filters-collapse', function(e){
	    e.preventDefault();
	    $('.filter-toggle').removeClass('active');
	    $('#filters-panel').hide();
	});
});