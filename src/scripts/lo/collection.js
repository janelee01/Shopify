$(document).ready(function(){

	var productRowInit = function(isResize){
		if( !$('.product-row').length ){
			return
		}
		$('.product-row-bar').remove();// clear out on re-init
		$('.product-row').each(function(){
			var $items = $(this).find('.item');
			var $sampleItem = $items.first();
			var gutter = $sampleItem.css('padding-right').replace('px','');
			var naturalWidth = $sampleItem.outerWidth() * $items.length; 
			var availableWidth = $(this).outerWidth();
			if( naturalWidth - gutter > availableWidth ){ // take off one gutter value to handle last item
				$('<div class="product-row-bar"><div class="handle" style="width: ' + availableWidth/naturalWidth*100 + '%"></div></div>').insertAfter($(this));
				var $handle = $(this).next('.product-row-bar').find('.handle');
				if( $(window).outerWidth() < LS.tabletBreakpoint ){
					var mobileGutter = Number($sampleItem.css('padding-left').replace('px',''));
					availableWidth = availableWidth - mobileGutter; // reduce the actual scrolling amount by the gutters
				}
				// how many pixels are we hanging off the side
				var amountToScroll = naturalWidth - availableWidth;
				// how far does the handle need to move
				var handleAmountToScroll = availableWidth - $handle.outerWidth(); 
				$(this).on('scroll', function(){
					// of the distance we need to scroll, how far have we gone?
					var percentScrolled = $(this).scrollLeft()/amountToScroll;
					// apply this progress how far the handle should move
					var translateAmt = percentScrolled * handleAmountToScroll;
					$handle.css('transform', 'translate3d(' + translateAmt + 'px, 0, 0)');
				});
			}else{ 
				$(this).addClass('without-scroll');
			}

			// set up row heading text (when not resizing)
			if( !isResize ){
				var $optionsEl = $(this).closest('.container').find('.configuration-options');
				var options = [];
				var materials = [];
				var sizes = 1;
				$items.each(function(){
					var materialName = $(this).find('.material').text();
					var variantCount = $(this).find('.product-link').data('variant-count');
					if($.inArray(materialName, materials) === -1){
						materials.push(materialName);
					}
					if( variantCount > sizes) {
						sizes = variantCount;
					}
				});
				if( materials.length > 1 ){
					options.push(materials.length + ' materials')
				}
				if( sizes > 1 ){
					options.push(sizes + ' sizes')
				}
				options.push($items.length + ' colors available');
				$optionsEl.html('<a href="' + $sampleItem.find('.product-link').attr('href') + '">' + options.join(' / ') + '</a>');
			}
		});
	};

	productRowInit(false); 
	$(window).resize(function(){
		productRowInit(true); 
	});

	if( $('body').hasClass('template-collection') ){
	
		var sessionKey = 'lo'+$('.page-header').data('collection');
		var savedState = sessionStorage.getItem(sessionKey);
		if( savedState ){
			$('#MainContent').html(savedState);
		}

		var setFilterOptions = function(){
			// show/hide filter options
			$('.filter-option').each(function(){
				var $parentEl = $(this).closest('li');
				// might need to show after an AJAX update, so reset to shown as default
				$parentEl.attr('style', '').removeClass('not-shown');
				// hide if no products use this filter
				if( $( '.' + $(this).data('hook') ).length < 1 ){
					$parentEl.hide().addClass('not-shown');
				}
			});

			// reset before hiding things
			$('.filter-options').removeClass('not-shown');
			$('.filter-toggle').closest('li').attr('style', '').removeClass('not-shown');

			// hide filter groups if only one option is present
			$('.filter-options').each(function(){
				if( $(this).find('li').length - $(this).find('.not-shown').length < 2 ){
					$('[href="#' + $(this).attr('id') + '"]').closest('li').hide().addClass('not-shown');
					$(this).hide().addClass('not-shown');
				}
			});

			// nothing to filter with, hide the whole thing
			if( $('#filters').find('li').length == $('#filters').find('.not-shown').length ){
				$('[data-filters-wrap]').hide();
			}else{
				$('[data-filters-wrap]').show();
			}
		};

		// setup content IDs for GTM
		var contentIds = $('#content-ids').text();
		var allContentCategories = [];

		var reportCollection = function(ids, categories){
			var dataLayer = window.dataLayer || [];
			dataLayer.push({
			  'event' : 'View Collection',
			  'contentIds' : ids,
			  'contentCategories' : categories.join(',')
			});
		}

		// go get other pages so we can filter everything at once 
		if( $('.ajax-pagination').length ){
			$('.ajax-pagination a').each(function(){
				$.ajax({
					async : false, // make sure we get the products back in the correct order
					url : $(this).attr('href'),
					success : function( data, textStatus, jqXHR ){
						// insert the product families from the requested page
						var $productFamilies = $(data).find('#MainContent .product-family');
						$productFamilies.insertBefore('#filter-alert');
						contentIds += $(data).find('#content-ids').text();
					},
					complete : function(){
						/*
							clean up families in case a family is split between pages
						 */
						
						// grab all of the names
						var allFamilyNames = [];
						$('.product-family').each(function(){
							allFamilyNames.push($(this).data('family-name'));
							allContentCategories.push($(this).data('content-category'));
						});

						// find duplicates, this indicates a split
						var duplicates = [];
						allFamilyNames.forEach(function(element, index) {
							// Find if there is a duplicate or not
							if (allFamilyNames.indexOf(element, index + 1) > -1) {
								// Find if the element is already in the result array or not
								if (duplicates.indexOf(element) === -1) {
									duplicates.push(element);
								}
							}
						});

						// move the second set into the first
						if( duplicates.length ){
							for (var i = 0; i < duplicates.length; i++) {
								var $firstSet = $('[data-family-name="' + duplicates[i] + '"]').eq(0);
								var $secondSet = $('[data-family-name="' + duplicates[i] + '"]').eq(1);
								var $productsToMove = $secondSet.find('.f-hook');
								$productsToMove.detach().appendTo($firstSet.find('.product-row'));
								$secondSet.remove();
							};
						}

						// update our filter options
						setFilterOptions();

						// update side scrolling rows
						productRowInit(false);
					}
				});
			});
			// report the final list to GTM
			var contentCategories = [];
			allContentCategories.forEach(function(element, index) {
				if (contentCategories.indexOf(element) === -1) {
					contentCategories.push(element);
				}
			});
			contentIds = contentIds.replace(/,\s*$/, ""); // remove the last comma
			reportCollection(contentIds,contentCategories);
		}else{
			// no pagination, so send the list right away
			$('.product-family').each(function(){
				allContentCategories.push($(this).data('content-category'));
			});
			contentIds = contentIds.replace(/,\s*$/, ""); // remove the last comma
			reportCollection(contentIds,allContentCategories);
		}
	

		// setup filter options
		setFilterOptions();

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
		    	sessionStorage.removeItem(sessionKey);
		    }else{
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
		});

		/*
		Sticky filters
		 
		var $pageHeader = $('.page-header');
		var $filters = $('[data-filters-wrap]');
		var siteHeaderHeight = $('#site-header').outerHeight();
		var headerOffset = $pageHeader.offset().top;
		var filtersOffset = $filters.offset().top; 		
		var stickPosition = filtersOffset - siteHeaderHeight - 31; // 35px for the title's margin - 4px for the blue bar that eats into the margin a little

		// set the position for when the header goes fixed.
		$pageHeader.css('top', headerOffset - stickPosition);

		// marquee can change where we want to trigger the stick
		$('body').on('marquee-shown', function(){
			window.marqueeHeight = $('.marquee').outerHeight();
			stickPosition = stickPosition + marqueeHeight;
		});
		$('body').on('marquee-hidden', function(){
			stickPosition = stickPosition - window.marqueeHeight;
		});

		$(window).scroll(function(){
			var scrollAmount = $(window).scrollTop();
			if( scrollAmount >= stickPosition ){ 
				if( !$('body').hasClass('fixed-filters') ){ // only do this once
					$('body').addClass('fixed-filters');
					$('#MainContent').css('padding-top', parseFloat($pageHeader.outerHeight()) + parseFloat($pageHeader.css('marginBottom').replace(/[^-\d\.]/g, '')) ); 
				}
			}else{
				$('body').removeClass('fixed-filters');
				$('#MainContent').css('padding-top', 0);
			}
		});
		*/
	
	} // endif is collection page 
	
});