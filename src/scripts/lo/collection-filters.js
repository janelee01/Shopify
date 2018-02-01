$(document).ready(function(){
	var sessionKey = 'lo'+$('.page-header').data('collection');
	var savedState = sessionStorage.getItem(sessionKey);
	if( savedState ){
		$('#MainContent').html(savedState);
	}

	var $activeFilters = $('#active-filters');
	// var $activeFiltersList = $('[data-active-filters]');
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
	    $('#filter-alert').hide();

	    // rebuild arrays of selections
	    var allActiveFilters = [];
	    $('.filter-options').each(function(){
	    	var $filterGroup = $(this);
	    	if( $filterGroup.find('.filter-option.selected').length > 0 ){
	    		var activeGroupFilters = [];
	    		$filterGroup.find('.filter-option.selected').each(function(){
	    			activeGroupFilters.push($(this).data('hook'));
	    		});
	    		allActiveFilters.push(activeGroupFilters);
	    	}
	    });

	    // update active filter list
	    // used to have a list of active filters but removed per Derek
	    // var activeTextArr = [];
	    // $('.filter-option.selected').each(function(){
	    // 	activeTextArr.push($(this).text()); 
	    // }
	    // $activeFiltersList.text(activeTextArr.join(', '));
	    
	    if( $('.filter-option.selected').length < 1 ){
	    	// no active filters, so show everything
	    	$('.page-header').removeClass('has-active-filters');
	    	$('.f-hook').removeClass('hidden');
	    	$('.pagination').show();
	    	sessionStorage.removeItem(sessionKey);
	    }else{
	    	// hide pagination while filtering
	    	$('.pagination').hide();

	    	// show results
	    	$('.f-hook').each(function(){
	    		var itemClasses = $(this).attr('class').split(' ');
	    		var groupMatches = 0;
	    		// loop over each filter group
	    		for (var f = 0; f < allActiveFilters.length; f++) {
	    			// loop over each option in the group
	    			for (var k = 0; k < allActiveFilters[f].length; k++) {
	    				// if this option appears somewhere in the product's classes, we've matched the group
	    				if( itemClasses.indexOf(allActiveFilters[f][k]) > -1 ){
	    					groupMatches++;
	    					break; // don't over count
	    				}
	    			}
	    		};
	    		// compare the number of matches we found to the number of groups with active filters
	    		// if they're equal then this item satisfies each group requirement somehow
 				if( groupMatches == allActiveFilters.length ){
	    			$(this).removeClass('hidden');
	    		}
	    	});
	    	
	    	// show our active filters element
	    	$('.page-header').addClass('has-active-filters');

	    	// no results
	    	if( $('.f-hook').length == $('.f-hook.hidden').length ){
	    		$('#filter-alert').fadeIn(); 
	    	}

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
	    $('#filter-alert').hide();
	    sessionStorage.removeItem(sessionKey);
	});
	$('body').on('click', '#filters-collapse', function(e){
	    e.preventDefault();
	    $('.filter-toggle').removeClass('active');
	    $('#filters-panel').hide();
	});

	// save the state on exit
	// doing this on filter clicks can catch product families at 0% opacity while they fade in
	// the animations should all be done at this point
	$(window).on('unload', function(){
		if( $('.page-header').hasClass('has-active-filters') ){
			sessionStorage.setItem(sessionKey, $('#MainContent').html());
		}
	})
});