$(document).ready(function(){
	var $activeFilters = $('#active-filters');
	var $activeFiltersList = $('[data-active-filters]');
	$('.filter-toggle').on('click', function(e){
	    e.preventDefault();
	    $('.filter-options').hide();
	    if( $(this).hasClass('active') ){
	    	$(this).removeClass('active');
	    }else{
	    	$('.filter-toggle').removeClass('active');
	    	$(this).addClass('active');
	    	$($(this).attr('href')).fadeIn();
	    }
	});
	$('.filter-option').on('click', function(e){
	    e.preventDefault();
	    $(this).toggleClass('selected');
	    $('.f-hook').addClass('hidden');

	    var activeFiltersArr = [];
	    $('.filter-option.selected').each(function(){
	    	activeFiltersArr.push($(this).text());
	    	$($(this).data('hook')).removeClass('hidden');
	    });

	    $activeFiltersList.text(activeFiltersArr.join(', '));
	    if( activeFiltersArr.length < 1 ){
	    	$activeFilters.removeClass('is-shown');
	    	$('.f-hook').removeClass('hidden');
	    }else{
	    	$activeFilters.addClass('is-shown');
	    }

	    // maybe hide the product group
	    $('.product-family').each(function(){
	    	if( $(this).find('.f-hook').length == $(this).find('.f-hook.hidden').length ){
	    		$(this).fadeOut();
	    	}else{
	    		$(this).fadeIn();
	    	}
	    });
	});
	$('#reset-filters').on('click', function(e){
	    e.preventDefault();
	    $('.filter-option').removeClass('selected');
	    $activeFilters.removeClass('is-shown');
	    $activeFiltersList.text('');
	    $('.f-hook').removeClass('hidden');
	    $('.product-family').fadeIn();
	});
});